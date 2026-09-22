import { describe, expect, it } from "vitest";

import { defaultPricingSettings } from "@/config/pricing-defaults";
import { calculateQuote } from "@/lib/pricing";
import type { PricingInput } from "@/types/pricing";

const settings = defaultPricingSettings;

function baseInput(overrides: Partial<PricingInput> = {}): PricingInput {
  return {
    propertySize: "1bed",
    pickupAccess: { flightsOfStairsNoLift: 0, longCarry: false },
    dropoffAccess: { flightsOfStairsNoLift: 0, longCarry: false },
    travelMinutes: 10,
    ...overrides,
  };
}

describe("calculateQuote", () => {
  it("always shows a low/high range, never a single number", () => {
    const result = calculateQuote(baseInput(), settings);
    expect(result.priceLowCents).toBeLessThan(result.priceHighCents);
    expect(result.lowHours).toBeLessThan(result.highHours);
  });

  it("rounds every price to the nearest $10", () => {
    const result = calculateQuote(baseInput(), settings);
    expect(result.priceLowCents % 1000).toBe(0);
    expect(result.priceHighCents % 1000).toBe(0);
  });

  it("never bills under the minimum hours, even for a tiny job", () => {
    const result = calculateQuote(baseInput({ propertySize: "singleItem" }), settings);
    expect(result.lowHours).toBeGreaterThanOrEqual(settings.minimumHours);
  });

  it("always includes the call-out fee, even at the minimum", () => {
    const withoutCallout = calculateQuote(baseInput({ propertySize: "singleItem" }), {
      ...settings,
      calloutMinutes: 0,
    });
    const withCallout = calculateQuote(baseInput({ propertySize: "singleItem" }), settings);
    expect(withCallout.priceLowCents).toBeGreaterThan(withoutCallout.priceLowCents);
  });

  it("adds access penalties for stairs and long carries on both ends", () => {
    const easy = calculateQuote(baseInput(), settings);
    const hard = calculateQuote(
      baseInput({
        pickupAccess: { flightsOfStairsNoLift: 2, longCarry: true },
        dropoffAccess: { flightsOfStairsNoLift: 1, longCarry: false },
      }),
      settings,
    );
    // pickup: 2 flights * 0.25 + long carry 0.25 = 0.75h. dropoff: 1 flight * 0.25 = 0.25h.
    expect(hard.assumptions.accessPenaltyHours).toBeCloseTo(1, 5);
    expect(hard.priceLowCents).toBeGreaterThan(easy.priceLowCents);
  });

  it("adds packing, unpacking, and disassembly hours from extras", () => {
    const noExtras = calculateQuote(baseInput(), settings);
    const withExtras = calculateQuote(
      baseInput({ extras: { packingBedrooms: 2, unpackingBedrooms: 1, disassemblyItems: 2 } }),
      settings,
    );
    // 2*1 + 1*0.5 + 2*0.5 = 3.5h of extras
    expect(withExtras.assumptions.extrasHours).toBeCloseTo(3.5, 5);
    expect(withExtras.priceLowCents).toBeGreaterThan(noExtras.priceLowCents);
  });

  it("recommends a 6 tonne truck and 2 movers for a small job", () => {
    const result = calculateQuote(baseInput({ propertySize: "1bed" }), settings);
    expect(result.recommendedTruck).toBe("SIX_TONNE");
    expect(result.recommendedCrewCount).toBe(2);
  });

  it("recommends a 10 tonne truck and 3 movers for a 3 bedroom house", () => {
    const result = calculateQuote(baseInput({ propertySize: "3bed" }), settings);
    expect(result.recommendedTruck).toBe("TEN_TONNE");
    expect(result.recommendedCrewCount).toBe(3);
  });

  it("recommends a 10 tonne truck and 4 movers for a 4+ bedroom house", () => {
    const result = calculateQuote(baseInput({ propertySize: "4plus" }), settings);
    expect(result.recommendedTruck).toBe("TEN_TONNE");
    expect(result.recommendedCrewCount).toBe(4);
  });

  it("bumps to a 10 tonne truck and extra crew for a heavy item even in a small job", () => {
    const result = calculateQuote(
      baseInput({ propertySize: "1bed", hasHeavyItem: true }),
      settings,
    );
    expect(result.recommendedTruck).toBe("TEN_TONNE");
    expect(result.recommendedCrewCount).toBe(3);
  });

  it("charges for extra movers beyond the base crew of 2", () => {
    const twoMovers = calculateQuote(baseInput({ propertySize: "1bed" }), settings);
    const threeMovers = calculateQuote(baseInput({ propertySize: "3bed" }), settings);
    // 3bed has more base hours AND an extra mover, so it should cost
    // noticeably more per hour than a straight hourly-rate comparison would
    // suggest if the extra mover weren't billed.
    const perLowHourTwo = twoMovers.priceLowCents / twoMovers.lowHours;
    const perLowHourThree = threeMovers.priceLowCents / threeMovers.lowHours;
    expect(perLowHourThree).toBeGreaterThan(perLowHourTwo);
  });

  // Worked examples from the approved pricing plan, used here as a
  // regression check that the formula still matches what was presented.
  describe("worked examples", () => {
    it("example 1: 1-bedroom apartment, Cranbourne to Cranbourne East", () => {
      const result = calculateQuote(
        baseInput({ propertySize: "1bed", travelMinutes: 10 }),
        settings,
      );
      expect(result.recommendedTruck).toBe("SIX_TONNE");
      expect(result.recommendedCrewCount).toBe(2);
      expect(result.lowHours).toBeCloseTo(2.17, 2);
      expect(result.highHours).toBeCloseTo(3.17, 2);
      expect(result.priceLowCents / 100).toBeCloseTo(350, 0);
      expect(result.priceHighCents / 100).toBeCloseTo(470, 0);
    });

    it("example 2: 3-bedroom house with packing, Cranbourne to Berwick", () => {
      const result = calculateQuote(
        baseInput({
          propertySize: "3bed",
          pickupAccess: { flightsOfStairsNoLift: 1, longCarry: false },
          dropoffAccess: { flightsOfStairsNoLift: 0, longCarry: false },
          travelMinutes: 20,
          extras: { packingBedrooms: 3 },
        }),
        settings,
      );
      expect(result.recommendedTruck).toBe("TEN_TONNE");
      expect(result.recommendedCrewCount).toBe(3);
      expect(result.lowHours).toBeCloseTo(7.58, 2);
      expect(result.highHours).toBeCloseTo(9.58, 2);
      expect(result.priceLowCents / 100).toBeCloseTo(1270, 0);
      expect(result.priceHighCents / 100).toBeCloseTo(1580, 0);
    });

    it("example 3: small office removal within Cranbourne with desk disassembly", () => {
      const result = calculateQuote(
        baseInput({
          propertySize: "office",
          travelMinutes: 5,
          extras: { disassemblyItems: 4 },
        }),
        settings,
      );
      expect(result.recommendedTruck).toBe("SIX_TONNE");
      expect(result.recommendedCrewCount).toBe(2);
      expect(result.lowHours).toBeCloseTo(4.08, 2);
      expect(result.highHours).toBeCloseTo(5.08, 2);
      expect(result.priceLowCents / 100).toBeCloseTo(580, 0);
      expect(result.priceHighCents / 100).toBeCloseTo(700, 0);
    });
  });
});
