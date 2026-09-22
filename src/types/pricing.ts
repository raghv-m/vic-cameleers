export type PropertySize = "studio" | "1bed" | "2bed" | "3bed" | "4plus" | "office" | "singleItem";

export interface AccessDetails {
  /** Flights of stairs to carry through when there's no lift. */
  flightsOfStairsNoLift: number;
  /** Long walk from the truck to the door. */
  longCarry: boolean;
}

export interface PricingExtras {
  /** Bedrooms needing a full pack. */
  packingBedrooms?: number;
  /** Bedrooms needing unpacking at the other end. */
  unpackingBedrooms?: number;
  /** Items needing disassembly/reassembly (beds, flat-pack furniture). */
  disassemblyItems?: number;
}

export interface PricingInput {
  propertySize: PropertySize;
  pickupAccess: AccessDetails;
  dropoffAccess: AccessDetails;
  /** One-way drive time between pickup and drop-off, from Distance Matrix / Routes API. */
  travelMinutes: number;
  extras?: PricingExtras;
  /** Piano, safe, pool table, or similar — bumps truck size and crew count. */
  hasHeavyItem?: boolean;
}

/**
 * Mirrors the PricingSettings Prisma model as a plain object, so this module
 * has no database dependency and stays trivially unit testable.
 */
export interface PricingSettings {
  hourlyRateCents: number;
  extraMoverHourlyRateCents: number;
  minimumHours: number;
  calloutMinutes: number;
  gstInclusive: boolean;
  baseHoursBySize: Record<PropertySize, [low: number, high: number]>;
  accessPenaltyPerFlightHours: number;
  accessPenaltyLongCarryHours: number;
  packingHourPerBedroom: number;
  unpackingHourPerBedroom: number;
  disassemblyHourPerItem: number;
}

export type TruckSize = "SIX_TONNE" | "TEN_TONNE";

export interface PricingResult {
  lowHours: number;
  highHours: number;
  priceLowCents: number;
  priceHighCents: number;
  recommendedTruck: TruckSize;
  recommendedCrewCount: number;
  /** Human-readable breakdown, for the "here's the maths" quote result screen. */
  assumptions: {
    baseHoursRange: [number, number];
    accessPenaltyHours: number;
    travelHours: number;
    extrasHours: number;
    calloutHours: number;
  };
}
