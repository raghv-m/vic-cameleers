import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Security headers on every response (CLAUDE.md section 11), plus the ADMIN_PATH rewrite.
 *
 * Two CSP flavours, because a per-request nonce forces a page to render on every request:
 *
 * - Nonce CSP ('nonce-...' + 'strict-dynamic', no 'unsafe-inline' for scripts) on the routes
 *   that handle user input or staff sessions: the admin console, /quote and /contact (which
 *   also load Cloudflare Turnstile). Those pages render per request anyway.
 * - Static CSP everywhere else, so marketing pages can be prerendered and cached. Next's
 *   prerendered HTML carries inline bootstrap scripts whose contents change every build, so
 *   they can't be hashed in a fixed header; STATIC_SCRIPT_SRC below documents what's allowed.
 *   Every other directive matches the nonce policy.
 *
 * Styles allow 'unsafe-inline' in both, the pragmatic baseline for Tailwind + Base UI, which
 * set inline `style` attributes for positioning.
 */

// NODE_ENV is set by Next.js itself, not a secret, so it is read directly: no env validation at load.
const isProduction = process.env.NODE_ENV === "production";

/** Pages that must keep the nonce CSP. Keep this list short: each one renders per request. */
const NONCE_PAGE_PATHS = ["/quote", "/contact"];

const STATIC_SCRIPT_SRC = "script-src 'self' 'unsafe-inline'";

function buildCsp(scriptSrc: string): string {
  return [
    "default-src 'self'",
    isProduction ? scriptSrc : `${scriptSrc} 'unsafe-eval'`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://api.resend.com https://maps.googleapis.com https://challenges.cloudflare.com https://*.upstash.io",
    "frame-src https://challenges.cloudflare.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

function cspFor(nonce: string | null): string {
  return buildCsp(
    nonce ? `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'` : STATIC_SCRIPT_SRC,
  );
}

function withSecurityHeaders(
  response: NextResponse,
  { nonce, isAdmin }: { nonce: string | null; isAdmin: boolean },
): NextResponse {
  response.headers.set("Content-Security-Policy", cspFor(nonce));
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), payment=(), geolocation=(self)",
  );
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");

  if (isAdmin) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

function isNoncePage(pathname: string): boolean {
  return NONCE_PAGE_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

/**
 * The admin path, read straight from the environment. The proxy runs before every page, so it
 * must not depend on the full server env check (src/env.server.ts): that also requires
 * DATABASE_URL, and a missing database setting would otherwise turn every page, even the static
 * marketing ones, into a 500. Unset or blank means no admin rewrite, and /admin stays a 404.
 */
function adminPathFromEnv(): string | undefined {
  const value = process.env.ADMIN_PATH?.trim();
  return value ? value : undefined;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminPath = adminPathFromEnv();
  const isDirectAdminGuess = pathname === "/admin" || pathname.startsWith("/admin/");
  const adminRewriteMatch =
    adminPath && (pathname === `/${adminPath}` || pathname.startsWith(`/${adminPath}/`));
  const needsNonce = adminRewriteMatch || isDirectAdminGuess || isNoncePage(pathname);

  // btoa/crypto are Web-standard globals, available in every runtime proxy can execute in.
  const nonce = needsNonce ? btoa(crypto.randomUUID()) : null;
  const requestHeaders = new Headers(request.headers);
  if (nonce) {
    // Next reads the nonce from the request's CSP header and stamps it on its own scripts.
    requestHeaders.set("x-nonce", nonce);
    requestHeaders.set("Content-Security-Policy", cspFor(nonce));
  }

  // The real admin routes live at /admin/* in the codebase, but that literal
  // path must never resolve for a visitor. Only requests to the obscure
  // ADMIN_PATH prefix get rewritten there; a direct guess at /admin, or any
  // request at all while ADMIN_PATH isn't set, 404s via the nearest
  // not-found.tsx (the obscure path itself only filters noise, per CLAUDE.md
  // section 10, real security is the auth/RBAC layer in src/lib/rbac.ts).
  if (adminRewriteMatch) {
    const rewritten = request.nextUrl.clone();
    rewritten.pathname = `/admin${pathname.slice(`/${adminPath}`.length)}`;
    const response = NextResponse.rewrite(rewritten, { request: { headers: requestHeaders } });
    return withSecurityHeaders(response, { nonce, isAdmin: true });
  }

  if (isDirectAdminGuess) {
    const notFound = request.nextUrl.clone();
    notFound.pathname = "/admin/__not_found__";
    const response = NextResponse.rewrite(notFound, { request: { headers: requestHeaders } });
    return withSecurityHeaders(response, { nonce, isAdmin: true });
  }

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  return withSecurityHeaders(response, { nonce, isAdmin: false });
}

export const config = {
  matcher: [
    /*
     * Match all paths except Next.js internals and common static file
     * extensions, so headers still apply to pages, route handlers, and the
     * dynamically generated icon/og-image routes.
     */
    "/((?!_next/static|_next/image).*)",
  ],
};
