import { describe, expect, it } from "vitest";

import { findBookingConflicts, type ExistingBookingRef } from "@/lib/booking-conflicts";

const existing: ExistingBookingRef[] = [
  { id: "b1", dateISO: "2026-03-10", truckId: "truck-6t", crewMemberIds: ["c1", "c2"] },
  { id: "b2", dateISO: "2026-03-11", truckId: "truck-10t", crewMemberIds: ["c3"] },
];

describe("findBookingConflicts", () => {
  it("finds no conflict on a free day", () => {
    const result = findBookingConflicts(existing, {
      dateISO: "2026-03-12",
      truckId: "truck-6t",
      crewMemberIds: ["c1"],
    });
    expect(result.hasConflict).toBe(false);
  });

  it("flags a truck already booked that day", () => {
    const result = findBookingConflicts(existing, {
      dateISO: "2026-03-10",
      truckId: "truck-6t",
      crewMemberIds: [],
    });
    expect(result.truckConflict).toBe(true);
    expect(result.hasConflict).toBe(true);
  });

  it("does not flag a different truck on the same day", () => {
    const result = findBookingConflicts(existing, {
      dateISO: "2026-03-10",
      truckId: "truck-10t",
      crewMemberIds: [],
    });
    expect(result.truckConflict).toBe(false);
  });

  it("flags a crew member already assigned that day", () => {
    const result = findBookingConflicts(existing, {
      dateISO: "2026-03-10",
      truckId: null,
      crewMemberIds: ["c2", "c9"],
    });
    expect(result.crewConflictIds).toEqual(["c2"]);
    expect(result.hasConflict).toBe(true);
  });

  it("excludes the booking being edited from its own conflict check", () => {
    const result = findBookingConflicts(existing, {
      dateISO: "2026-03-10",
      truckId: "truck-6t",
      crewMemberIds: ["c1"],
      excludeBookingId: "b1",
    });
    expect(result.hasConflict).toBe(false);
  });
});
