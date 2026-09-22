import type { MetadataRoute } from "next";

import { business } from "@/config/business";
import { serverEnv } from "@/env.server";

export default function robots(): MetadataRoute.Robots {
  const disallow = ["/api/"];
  if (serverEnv.ADMIN_PATH) disallow.push(`/${serverEnv.ADMIN_PATH}`);

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow,
    },
    sitemap: `${business.siteUrl}/sitemap.xml`,
  };
}
