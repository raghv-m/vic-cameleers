import type { ComponentType } from "react";

export interface Guide {
  slug: string;
  title: string;
  description: string;
  /** ISO date the guide went live in its current form (never backdated). Used for the visible date, JSON-LD, and sitemap lastModified. */
  publishedAt: string;
  Body: ComponentType;
}
