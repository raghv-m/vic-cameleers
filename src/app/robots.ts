import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/config/site-url";

/**
 * Deliberately never mentions the admin console: listing it here would advertise its path to
 * anyone who reads this file. The admin routes protect themselves instead (auth, 404 when
 * signed out, X-Robots-Tag noindex from src/proxy.ts).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
