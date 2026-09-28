import { describe, expect, it } from "vitest";

import { melbourneDayRange, melbourneOffsetMinutes, melbourneParts } from "@/lib/melbourne-time";

describe("melbourne time", () => {
  it("knows standard time and daylight saving", () => {
    expect(melbourneOffsetMinutes(new Date("2026-07-01T00:00:00Z"))).toBe(600);
    expect(melbourneOffsetMinutes(new Date("2026-01-15T00:00:00Z"))).toBe(660);
  });

  it("reads the Melbourne hour", () => {
    // 21:00 UTC in winter is 7am the next day in Melbourne.
    expect(melbourneParts(new Date("2026-07-01T21:00:00Z"))).toMatchObject({ day: 2, hour: 7 });
  });

  it("gives a whole Melbourne day as a UTC range", () => {
    const now = new Date("2026-07-01T21:00:00Z"); // 2 July, 7am Melbourne
    const { start, end } = melbourneDayRange(0, now);
    expect(start.toISOString()).toBe("2026-07-01T14:00:00.000Z");
    expect(end.toISOString()).toBe("2026-07-02T14:00:00.000Z");
    expect(melbourneDayRange(7, now).start.toISOString()).toBe("2026-07-08T14:00:00.000Z");
  });
});
