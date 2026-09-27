import { describe, expect, it } from "vitest";

import { calculateQuote } from "@/lib/pricing";
import { prefillFromSearchParams } from "@/lib/quote-prefill";
import { floorToFlights, toPricingInput } from "@/lib/quote-pricing";
import type { PricingSettings } from "@/types/pricing";

const findSuburb = (slug: string) =>
  slug === "clyde-north" ? { name: "Clyde North", postcode: "3978" } : undefined;

describe("prefillFromSearchParams", () => {
  it("carries the homepage estimator's choices into the form", () => {
    const values = prefillFromSearchParams(
      {
        type: "home",
        size: "3bed",
        stairs: "2",
        packing: "1",
        from: "Berwick",
        to: "Officer",
        date: "2026-11-02",
      },
      findSuburb,
    );
    expect(values.propertyType).toBe("HOUSE");
    expect(values.propertySize).toBe("3bed");
    expect(values.pickupAccess).toMatchObject({ floorLevel: "2", stairsCount: 2, hasLift: false });
    expect(values.extras).toMatchObject({ packing: true, packingBedrooms: 3 });
    expect(values.pickupAddress).toBe("Berwick");
    expect(values.dropoffAddress).toBe("Officer");
    expect(values.moveDate).toBe("2026-11-02");
  });

  it("maps office and single-item moves to their fixed sizes", () => {
    expect(prefillFromSearchParams({ type: "office" }, findSuburb)).toMatchObject({
      propertyType: "OFFICE",
      propertySize: "office",
    });
    expect(prefillFromSearchParams({ type: "item" }, findSuburb)).toMatchObject({
      propertyType: "SINGLE_ITEM",
      propertySize: "singleItem",
    });
  });

  it("uses only a published suburb's own name and postcode", () => {
    expect(prefillFromSearchParams({ suburb: "clyde-north" }, findSuburb).pickupAddress).toBe(
      "Clyde North VIC 3978",
    );
    expect(
      prefillFromSearchParams({ suburb: "<script>" }, findSuburb).pickupAddress,
    ).toBeUndefined();
  });

  it("ignores values that aren't on the allow-list or the right shape", () => {
    const values = prefillFromSearchParams(
      { type: "castle", size: "12bed", stairs: "99", date: "tomorrow", packing: "yes" },
      findSuburb,
    );
    expect(values).toEqual({});
  });

  it("strips control characters and caps free text", () => {
    const values = prefillFromSearchParams(
      { from: `Cranbourne\u0000${"x".repeat(300)}` },
      findSuburb,
    );
    expect(values.pickupAddress).not.toContain("\u0000");
    expect(values.pickupAddress?.length).toBe(120);
  });
});

const settings: PricingSettings = {
  hourlyRateCents: 12000,
  extraMoverHourlyRateCents: 6000,
  minimumHours: 2,
  calloutMinutes: 45,
  gstInclusive: false,
  baseHoursBySize: {
    studio: [1.5, 2],
    "1bed": [2, 3],
    "2bed": [3, 4],
    "3bed": [4, 5.5],
    "4plus": [5.5, 7.5],
    office: [3, 5],
    singleItem: [1, 1.5],
  },
  accessPenaltyPerFlightHours: 0.25,
  accessPenaltyLongCarryHours: 0.25,
  packingHourPerBedroom: 1,
  unpackingHourPerBedroom: 1,
  disassemblyHourPerItem: 0.25,
};

describe("toPricingInput", () => {
  it("counts stairs only when there's no lift", () => {
    const withLift = toPricingInput({ pickupAccess: { hasLift: true, stairsCount: 3 } });
    const noLift = toPricingInput({ pickupAccess: { hasLift: false, stairsCount: "3" } });
    expect(withLift.pickupAccess.flightsOfStairsNoLift).toBe(0);
    expect(noLift.pickupAccess.flightsOfStairsNoLift).toBe(3);
  });

  it("ignores extra counts for extras that aren't ticked, and clamps junk", () => {
    const input = toPricingInput({
      extras: { packing: false, packingBedrooms: 4, disassembly: true, disassemblyItems: "-2" },
    });
    expect(input.extras).toEqual({ packingBedrooms: 0, unpackingBedrooms: 0, disassemblyItems: 0 });
  });

  it("gives the form and the server the same number", () => {
    const data = {
      propertySize: "3bed" as const,
      pickupAccess: { hasLift: false, stairsCount: 1, longCarry: true },
      dropoffAccess: { hasLift: true, stairsCount: 0, longCarry: false },
      extras: { packing: true, packingBedrooms: 3 },
    };
    expect(calculateQuote(toPricingInput(data), settings)).toEqual(
      calculateQuote(toPricingInput(structuredClone(data)), settings),
    );
  });

  it("maps floor chips to flights", () => {
    expect(floorToFlights("ground")).toBe(0);
    expect(floorToFlights("2")).toBe(2);
    expect(floorToFlights("4plus")).toBe(4);
  });
});
