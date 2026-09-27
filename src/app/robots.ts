import type { MetadataRoute } from "next";

import { business } from "@/config/business";

/**
 * The admin path is deliberately not listed here. robots.txt is public, so a Disallow line for it
 * advertised the "hidden" admin URL to anyone who looked. The admin console is kept out of search
 * by the X-Robots-Tag noindex header (src/middleware.ts) and by returning 404 when signed out.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${business.siteUrl}/sitemap.xml`,
  };
}
