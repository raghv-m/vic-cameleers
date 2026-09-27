/**
 * The public site origin. Every absolute URL on the site (metadataBase, canonicals, sitemap,
 * robots, JSON-LD, OG, llms.txt, security.txt, auth) comes from here, so moving to the real
 * domain is a one env var change: NEXT_PUBLIC_SITE_URL.
 *
 * Resolution, done once at build time in next.config.ts and inlined everywhere:
 * - Vercel production: NEXT_PUBLIC_SITE_URL must be a real https origin, or the build fails.
 * - Vercel preview: NEXT_PUBLIC_SITE_URL if it's usable, otherwise the preview's own branch URL,
 *   so every pushed branch still builds and links to itself.
 * - Local and CI: NEXT_PUBLIC_SITE_URL, falling back to localhost.
 *
 * Kept free of path aliases and server-only imports because next.config.ts imports it too.
 */

type Env = Record<string, string | undefined>;

const LOCAL_DEV_URL = "http://localhost:3000";

/** Returns a problem description for an unusable deploy URL, or null if it's fine. */
export function siteUrlProblem(value: string | undefined): string | null {
  if (!value || value.trim() === "") return "NEXT_PUBLIC_SITE_URL is empty";

  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    return `NEXT_PUBLIC_SITE_URL is not a valid URL: "${value}"`;
  }

  if (url.protocol !== "https:") return `NEXT_PUBLIC_SITE_URL must use https: "${value}"`;
  if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
    return `NEXT_PUBLIC_SITE_URL points at ${url.hostname}: "${value}"`;
  }
  return null;
}

function normalise(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed.replace(/\/+$/, "") : null;
}

/** The origin this build should use. Throws on a Vercel production build with a bad value. */
export function resolveSiteUrl(env: Env = process.env): string {
  const configured = normalise(env.NEXT_PUBLIC_SITE_URL);
  const problem = siteUrlProblem(configured ?? undefined);

  if (env.VERCEL_ENV === "production" && problem) {
    throw new Error(
      `${problem}. Set it in the Vercel project (Production) to the public origin, ` +
        "e.g. https://vic-cameleers.vercel.app, with no trailing slash.",
    );
  }

  if (env.VERCEL_ENV === "preview" && problem) {
    // Vercel system env vars: the stable per-branch alias first, the per-commit URL second.
    const previewHost = env.VERCEL_BRANCH_URL ?? env.VERCEL_URL;
    if (previewHost) return `https://${previewHost}`;
    throw new Error(`${problem}, and no VERCEL_BRANCH_URL/VERCEL_URL to fall back to.`);
  }

  return configured ?? LOCAL_DEV_URL;
}

export const SITE_URL = normalise(process.env.NEXT_PUBLIC_SITE_URL) ?? LOCAL_DEV_URL;

/** Absolute URL for a site path, e.g. absoluteUrl("/pricing"). */
export function absoluteUrl(path: string): string {
  return path === "/" || path === "" ? SITE_URL : `${SITE_URL}${path}`;
}
