import type { ComponentType } from "react";

import type { ServiceSlug } from "@/config/services";

export interface Guide {
  slug: string;
  title: string;
  description: string;
  /** ISO date the guide went live in its current form (never backdated). Used for the visible date, JSON-LD, and sitemap lastModified. */
  publishedAt: string;
  /** The one service this guide links to at the end (descriptive anchor, not "click here"). */
  relatedService: ServiceSlug;
  Body: ComponentType;
}
