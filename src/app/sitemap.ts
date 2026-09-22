import type { MetadataRoute } from "next";

import { business } from "@/config/business";

// Only routes that actually exist go here. More are added as later
// milestones build them (services, pricing, suburb pages, guides, etc).
const staticRoutes = ["", "/quote", "/contact", "/privacy", "/terms", "/cancellation-policy"];

export default function sitemap(): MetadataRoute.Sitemap {
  return staticRoutes.map((path) => ({
    url: `${business.siteUrl}${path}`,
    lastModified: new Date(),
  }));
}
