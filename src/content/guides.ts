import { apartmentMovingTips } from "./guides/apartment-moving-tips";
import { costGuide } from "./guides/cost-guide";
import { hourlyVsFixedPrice } from "./guides/hourly-vs-fixed-price";
import { movingChecklist } from "./guides/moving-checklist";
import { packingGuide } from "./guides/packing-guide";
import type { Guide } from "./guides/types";

export type { Guide };

/** The 5 starter articles from CLAUDE.md section 5, newest first. */
export const guides: Guide[] = [
  hourlyVsFixedPrice,
  packingGuide,
  apartmentMovingTips,
  movingChecklist,
  costGuide,
];

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}
