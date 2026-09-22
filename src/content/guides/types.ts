import type { ComponentType } from "react";

export interface Guide {
  slug: string;
  title: string;
  description: string;
  /** ISO date the guide was published, used for JSON-LD and sitemap lastModified. */
  publishedAt: string;
  Body: ComponentType;
}
