/**
 * The public site origin, read once from NEXT_PUBLIC_SITE_URL. Every absolute URL on the site
 * (metadataBase, canonicals, sitemap, robots, JSON-LD, OG, llms.txt, security.txt, auth) comes
 * from here, so moving to the real domain is a one env var change.
 *
 * Kept free of path aliases and server-only imports because next.config.ts imports it too, to
 * fail the build before a bad value can ship.
 */

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

/**
 * Throws on Vercel production and preview builds if NEXT_PUBLIC_SITE_URL is missing or local.
 * Local and CI builds are left alone so `pnpm build` still works against localhost.
 */
export function assertDeploySiteUrl(env: Record<string, string | undefined> = process.env): void {
  if (env.VERCEL_ENV !== "production" && env.VERCEL_ENV !== "preview") return;

  const problem = siteUrlProblem(env.NEXT_PUBLIC_SITE_URL);
  if (problem) {
    throw new Error(
      `${problem}. Set it in the Vercel project (${env.VERCEL_ENV}) to the public origin, ` +
        "e.g. https://vic-cameleers.vercel.app, with no trailing slash.",
    );
  }
}

function normalise(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed.replace(/\/+$/, "") : null;
}

export const SITE_URL = normalise(process.env.NEXT_PUBLIC_SITE_URL) ?? LOCAL_DEV_URL;

/** Absolute URL for a site path, e.g. absoluteUrl("/pricing"). */
export function absoluteUrl(path: string): string {
  return path === "/" || path === "" ? SITE_URL : `${SITE_URL}${path}`;
}
