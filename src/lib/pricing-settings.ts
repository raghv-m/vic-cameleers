import "server-only";

import { defaultPricingSettings } from "@/config/pricing-defaults";
import { db } from "@/lib/db";
import type { PricingSettings } from "@/types/pricing";

/**
 * Live PricingSettings from the DB (editable in /admin/settings), falling
 * back to the seeded defaults if the singleton row doesn't exist yet or
 * the DB isn't reachable. Shared by the quote API and the pricing page so
 * both always reflect the same numbers.
 */
export async function getPricingSettings(): Promise<PricingSettings> {
  try {
    const settings = await db.pricingSettings.findFirst();
    if (!settings) return defaultPricingSettings;

    return {
      hourlyRateCents: settings.hourlyRateCents,
      extraMoverHourlyRateCents: settings.extraMoverHourlyRateCents,
      minimumHours: settings.minimumHours,
      calloutMinutes: settings.calloutMinutes,
      gstInclusive: settings.gstInclusive,
      baseHoursBySize: settings.baseHoursBySize as PricingSettings["baseHoursBySize"],
      accessPenaltyPerFlightHours: settings.accessPenaltyPerFlightHours,
      accessPenaltyLongCarryHours: settings.accessPenaltyLongCarryHours,
      packingHourPerBedroom: settings.packingHourPerBedroom,
      unpackingHourPerBedroom: settings.unpackingHourPerBedroom,
      disassemblyHourPerItem: settings.disassemblyHourPerItem,
    };
  } catch (error) {
    console.warn("Could not load PricingSettings from the database, using defaults.", error);
    return defaultPricingSettings;
  }
}
