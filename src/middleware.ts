import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { serverEnv } from "@/env.server";

/**
 * Security headers applied to every response (CLAUDE.md section 11).
 * CSP uses a per-request nonce for scripts (no 'unsafe-inline') while
 * allowing 'unsafe-inline' for styles, which is the pragmatic baseline for
 * Tailwind + Base UI/Radix-style component libraries that set inline
 * `style` attributes for positioning. Tighten style-src later if every
 * inline style can be moved to a class.
 */
export function middleware(request: NextRequest) {
  // btoa/crypto are Web-standard globals available in the Edge runtime that
  // middleware executes in; Node's Buffer is not guaranteed there.
  const nonce = btoa(crypto.randomUUID());

  // React dev mode needs eval() for its debugging features; it never uses it
  // in production, so this only loosens the policy locally.
  const scriptSrc =
    serverEnv.NODE_ENV === "production"
      ? `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`
      : `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval'`;

  const csp = [
    "default-src 'self'",
    scriptSrc,
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

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), payment=(), geolocation=(self)",
  );
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");

  const adminPath = serverEnv.ADMIN_PATH;
  if (adminPath && request.nextUrl.pathname.startsWith(`/${adminPath}`)) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
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
