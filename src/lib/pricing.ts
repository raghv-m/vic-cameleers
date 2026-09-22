import type { PricingInput, PricingResult, PricingSettings } from "@/types/pricing";

/**
 * Rounds cents to the nearest $10, per CLAUDE.md section 6: "Always a range,
 * rounded to the nearest $10, show a range, never a single exact number."
 */
function roundToNearest10Dollars(cents: number): number {
  const tenDollarsInCents = 1000;
  return Math.round(cents / tenDollarsInCents) * tenDollarsInCents;
}

function accessPenaltyHours(
  access: PricingInput["pickupAccess"],
  settings: PricingSettings,
): number {
  const stairsPenalty = access.flightsOfStairsNoLift * settings.accessPenaltyPerFlightHours;
  const carryPenalty = access.longCarry ? settings.accessPenaltyLongCarryHours : 0;
  return stairsPenalty + carryPenalty;
}

function extrasHours(input: PricingInput, settings: PricingSettings): number {
  const extras = input.extras;
  if (!extras) return 0;

  const packing = (extras.packingBedrooms ?? 0) * settings.packingHourPerBedroom;
  const unpacking = (extras.unpackingBedrooms ?? 0) * settings.unpackingHourPerBedroom;
  const disassembly = (extras.disassemblyItems ?? 0) * settings.disassemblyHourPerItem;

  return packing + unpacking + disassembly;
}

function recommendedTruckAndCrew(input: PricingInput): {
  truck: "SIX_TONNE" | "TEN_TONNE";
  crew: number;
} {
  if (input.propertySize === "4plus") return { truck: "TEN_TONNE", crew: 4 };

  if (input.propertySize === "3bed" || input.hasHeavyItem) {
    return { truck: "TEN_TONNE", crew: 3 };
  }

  return { truck: "SIX_TONNE", crew: 2 };
}

/**
 * Estimates a move's price range from property size, access difficulty,
 * travel time, and extras. See CLAUDE.md section 6 for the formula and
 * three worked examples this implementation was checked against.
 */
export function calculateQuote(input: PricingInput, settings: PricingSettings): PricingResult {
  const [baseLow, baseHigh] = settings.baseHoursBySize[input.propertySize];

  const accessHours =
    accessPenaltyHours(input.pickupAccess, settings) +
    accessPenaltyHours(input.dropoffAccess, settings);
  const travelHours = input.travelMinutes / 60;
  const extras = extrasHours(input, settings);
  const calloutHours = settings.calloutMinutes / 60;

  const lowHours = baseLow + accessHours + travelHours + extras;
  const highHours = baseHigh + accessHours + travelHours + extras;

  const billableLowHours = Math.max(settings.minimumHours, lowHours);
  const billableHighHours = Math.max(settings.minimumHours, highHours);

  const { truck, crew } = recommendedTruckAndCrew(input);
  const extraMovers = Math.max(0, crew - 2);

  const extraMoverCostLowCents =
    extraMovers * settings.extraMoverHourlyRateCents * billableLowHours;
  const extraMoverCostHighCents =
    extraMovers * settings.extraMoverHourlyRateCents * billableHighHours;

  const priceLowCents = roundToNearest10Dollars(
    billableLowHours * settings.hourlyRateCents +
      calloutHours * settings.hourlyRateCents +
      extraMoverCostLowCents,
  );
  const priceHighCents = roundToNearest10Dollars(
    billableHighHours * settings.hourlyRateCents +
      calloutHours * settings.hourlyRateCents +
      extraMoverCostHighCents,
  );

  return {
    lowHours: billableLowHours,
    highHours: billableHighHours,
    priceLowCents,
    priceHighCents,
    recommendedTruck: truck,
    recommendedCrewCount: crew,
    assumptions: {
      baseHoursRange: [baseLow, baseHigh],
      accessPenaltyHours: accessHours,
      travelHours,
      extrasHours: extras,
      calloutHours,
    },
  };
}
