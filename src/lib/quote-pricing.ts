import type { PricingInput, PropertySize } from "@/types/pricing";

/**
 * TODO(owner): replace with a real Distance Matrix / Routes API call once GOOGLE_MAPS_SERVER_KEY
 * is set (see TODO-OWNER.md). Every estimate assumes this typical Melbourne trip until then, and
 * the quote form says so next to the number.
 */
export const FALLBACK_TRAVEL_MINUTES = 20;

interface AccessLike {
  hasLift?: boolean;
  stairsCount?: unknown;
  longCarry?: boolean;
}

/** The subset of a quote submission the pricing engine needs, loose enough for live form state. */
export interface QuotePricingFields {
  propertySize?: PropertySize;
  pickupAccess?: AccessLike;
  dropoffAccess?: AccessLike;
  specialItems?: { piano?: boolean; safe?: boolean; poolTable?: boolean };
  extras?: {
    packing?: boolean;
    packingBedrooms?: unknown;
    unpacking?: boolean;
    unpackingBedrooms?: unknown;
    disassembly?: boolean;
    disassemblyItems?: unknown;
  };
}

function count(value: unknown, max: number): number {
  const n = Math.floor(Number(value ?? 0));
  return Number.isFinite(n) ? Math.min(Math.max(n, 0), max) : 0;
}

function flights(access: AccessLike | undefined): number {
  return access?.hasLift ? 0 : count(access?.stairsCount, 20);
}

/**
 * One mapping from quote form data to the pricing engine, shared by the live estimate in the
 * form and the /api/quote route, so the number a customer sees is the number we store.
 */
export function toPricingInput(
  data: QuotePricingFields,
  travelMinutes = FALLBACK_TRAVEL_MINUTES,
): PricingInput {
  const extras = data.extras ?? {};
  const special = data.specialItems ?? {};
  return {
    propertySize: data.propertySize ?? "2bed",
    pickupAccess: {
      flightsOfStairsNoLift: flights(data.pickupAccess),
      longCarry: Boolean(data.pickupAccess?.longCarry),
    },
    dropoffAccess: {
      flightsOfStairsNoLift: flights(data.dropoffAccess),
      longCarry: Boolean(data.dropoffAccess?.longCarry),
    },
    travelMinutes,
    extras: {
      packingBedrooms: extras.packing ? count(extras.packingBedrooms, 10) : 0,
      unpackingBedrooms: extras.unpacking ? count(extras.unpackingBedrooms, 10) : 0,
      disassemblyItems: extras.disassembly ? count(extras.disassemblyItems, 20) : 0,
    },
    hasHeavyItem: Boolean(special.piano || special.safe || special.poolTable),
  };
}

/** Floor level chip value to flights of stairs when there's no lift. */
export function floorToFlights(floorLevel: string): number {
  if (floorLevel === "ground") return 0;
  if (floorLevel === "4plus") return 4;
  const n = Number(floorLevel);
  return Number.isFinite(n) ? n : 0;
}
