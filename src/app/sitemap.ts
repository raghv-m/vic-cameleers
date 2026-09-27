import type { MetadataRoute } from "next";

import { getEnabledServices } from "@/config/services";
import { absoluteUrl } from "@/config/site-url";
import { hasCrewProfiles } from "@/content/crew";
import { guides } from "@/content/guides";
import { publishedSuburbs } from "@/content/suburbs";

/**
 * Indexable public pages only: no admin, API, or noindexed routes. lastModified is the date the
 * page's content last actually changed, not the build time, so search engines can trust it.
 * Bump a date here when that page's copy changes. Guides carry their own date.
 */
const PAGES: { path: string; updated: string }[] = [
  { path: "/", updated: "2026-09-26" },
  { path: "/about", updated: "2026-09-26" },
  { path: "/how-it-works", updated: "2026-09-26" },
  { path: "/services", updated: "2026-09-26" },
  { path: "/pricing", updated: "2026-09-26" },
  { path: "/quote", updated: "2026-09-26" },
  { path: "/removalists", updated: "2026-09-26" },
  { path: "/reviews", updated: "2026-09-26" },
  { path: "/faq", updated: "2026-09-26" },
  { path: "/guides", updated: "2026-09-26" },
  { path: "/contact", updated: "2026-09-26" },
  { path: "/privacy", updated: "2026-09-26" },
  { path: "/terms", updated: "2026-09-26" },
  { path: "/cancellation-policy", updated: "2026-09-26" },
];

/** Service and suburb page copy last changed on these dates. Unpublished suburbs are left out. */
const SERVICES_UPDATED = "2026-09-26";
const SUBURBS_UPDATED = "2026-09-26";
const CREW_UPDATED = "2026-09-26";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...PAGES.map(({ path, updated }) => ({ url: absoluteUrl(path), lastModified: updated })),
    // /crew only exists once real crew profiles do (src/content/crew.ts).
    ...(hasCrewProfiles() ? [{ url: absoluteUrl("/crew"), lastModified: CREW_UPDATED }] : []),
    ...getEnabledServices().map((service) => ({
      url: absoluteUrl(`/services/${service.slug}`),
      lastModified: SERVICES_UPDATED,
    })),
    ...publishedSuburbs.map((suburb) => ({
      url: absoluteUrl(`/removalists/${suburb.slug}`),
      lastModified: SUBURBS_UPDATED,
    })),
    ...guides.map((guide) => ({
      url: absoluteUrl(`/guides/${guide.slug}`),
      lastModified: guide.publishedAt,
    })),
  ];
}
