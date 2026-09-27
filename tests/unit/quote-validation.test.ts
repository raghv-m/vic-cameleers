import { describe, expect, it } from "vitest";

import { addressProblem, moveDateProblem, stepSchemas } from "@/lib/validation/quote";

const today = new Date(2026, 8, 27); // 27 Sep 2026

describe("moveDateProblem", () => {
  it("accepts today and future dates within 18 months", () => {
    expect(moveDateProblem("2026-09-27", today)).toBeNull();
    expect(moveDateProblem("2027-03-01", today)).toBeNull();
  });

  it("rejects past, impossible, too-far and malformed dates", () => {
    expect(moveDateProblem("2026-09-26", today)).toMatch(/later date/);
    expect(moveDateProblem("2026-02-30", today)).toMatch(/doesn't exist/);
    expect(moveDateProblem("2028-06-01", today)).toMatch(/18 months/);
    expect(moveDateProblem("", today)).toMatch(/Pick a moving date/);
    expect(moveDateProblem("27/09/2026", today)).toMatch(/Pick a moving date/);
  });
});

describe("addressProblem", () => {
  it("accepts Victorian addresses, with or without a postcode", () => {
    expect(addressProblem("12 Smith St, Clyde North VIC 3978")).toBeNull();
    expect(addressProblem("4 High St, Berwick")).toBeNull();
    expect(addressProblem("1234 Long Rd, Pakenham 3810")).toBeNull();
  });

  it("rejects addresses that are too short or outside Victoria", () => {
    expect(addressProblem("abc")).toMatch(/street and suburb/);
    expect(addressProblem("10 George St, Sydney NSW 2000")).toMatch(/outside Victoria/);
  });
});

describe("stepSchemas", () => {
  it("has exactly three steps", () => {
    expect(Object.keys(stepSchemas)).toEqual(["1", "2", "3"]);
  });
});
