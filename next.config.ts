import type { NextConfig } from "next";

import { assertDeploySiteUrl, SITE_URL } from "./src/config/site-url";

// Fails Vercel production/preview builds when NEXT_PUBLIC_SITE_URL is empty or local, so a
// sitemap, canonical, or JSON-LD pointing at localhost can never ship again.
assertDeploySiteUrl();

/**
 * TODO(owner): flip to true once a custom domain is live and NEXT_PUBLIC_SITE_URL points at it.
 * Then every host that isn't the canonical one (the vercel.app URL, and www vs apex, whichever
 * NEXT_PUBLIC_SITE_URL doesn't use) gets a permanent redirect to it. Left off while the
 * vercel.app URL is itself the canonical host, since redirecting it would loop.
 */
const CUSTOM_DOMAIN_REDIRECTS_ENABLED = false;

const VERCEL_APP_HOST = "vic-cameleers.vercel.app";

function nonCanonicalHosts(): string[] {
  const canonical = new URL(SITE_URL).hostname;
  const alternate = canonical.startsWith("www.") ? canonical.slice(4) : `www.${canonical}`;
  return [VERCEL_APP_HOST, alternate].filter((host) => host !== canonical);
}

const nextConfig: NextConfig = {
  async redirects() {
    if (!CUSTOM_DOMAIN_REDIRECTS_ENABLED) return [];

    return nonCanonicalHosts().map((host) => ({
      source: "/:path*",
      has: [{ type: "host" as const, value: host }],
      destination: `${SITE_URL}/:path*`,
      permanent: true,
    }));
  },
};

export default nextConfig;
