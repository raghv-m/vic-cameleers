import type { PricingSettings } from "@/types/pricing";

/**
 * Seeded PricingSettings values (CLAUDE.md section 1 and the pricing plan's
 * worked examples). Single source of truth for both `prisma/seed.ts` and
 * anywhere that needs a fallback before the admin-editable DB row exists.
 *
 * TODO(owner): gstInclusive and the exact rate structure are unconfirmed —
 * see TODO-OWNER.md. Update via admin settings once confirmed, never guess
 * in copy.
 */
export const defaultPricingSettings: PricingSettings = {
  hourlyRateCents: 12000,
  extraMoverHourlyRateCents: 3500,
  minimumHours: 2,
  calloutMinutes: 45,
  gstInclusive: false,
  baseHoursBySize: {
    studio: [1.5, 2],
    "1bed": [2, 3],
    "2bed": [3, 4.5],
    "3bed": [4, 6],
    "4plus": [5.5, 8],
    office: [2, 3],
    singleItem: [0.5, 1.5],
  },
  accessPenaltyPerFlightHours: 0.25,
  accessPenaltyLongCarryHours: 0.25,
  packingHourPerBedroom: 1,
  unpackingHourPerBedroom: 0.5,
  disassemblyHourPerItem: 0.5,
};
