import type { MetadataRoute } from "next";

import { business } from "@/config/business";
import { getEnabledServices } from "@/config/services";
import { suburbs } from "@/content/suburbs";
import { guides } from "@/content/guides";

// Only routes that actually exist go here. More are added as later
// milestones build them (customer portal, etc).
const staticRoutes = [
  "",
  "/about",
  "/how-it-works",
  "/services",
  "/pricing",
  "/quote",
  "/removalists",
  "/reviews",
  "/faq",
  "/guides",
  "/contact",
  "/privacy",
  "/terms",
  "/cancellation-policy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = staticRoutes.map((path) => ({
    url: `${business.siteUrl}${path}`,
    lastModified: new Date(),
  }));

  const serviceEntries = getEnabledServices().map((service) => ({
    url: `${business.siteUrl}/services/${service.slug}`,
    lastModified: new Date(),
  }));

  const suburbEntries = suburbs.map((suburb) => ({
    url: `${business.siteUrl}/removalists/${suburb.slug}`,
    lastModified: new Date(),
  }));

  const guideEntries = guides.map((guide) => ({
    url: `${business.siteUrl}/guides/${guide.slug}`,
    lastModified: new Date(),
  }));

  return [...staticEntries, ...serviceEntries, ...suburbEntries, ...guideEntries];
}
