import { describe, expect, it } from "vitest";

import { DEPOT_XY, findKnownPlace, kmBetween, projectLatLng } from "@/lib/geo";

describe("projectLatLng", () => {
  it("puts the depot coordinates on the depot", () => {
    const p = projectLatLng(-38.0996, 145.2834);
    expect(p.x).toBeCloseTo(DEPOT_XY.x, 5);
    expect(p.y).toBeCloseTo(DEPOT_XY.y, 5);
  });

  it("lands Berwick within a couple of units of its published pin (354.4, 255)", () => {
    const p = projectLatLng(-38.0333, 145.35);
    expect(Math.abs(p.x - 354.4)).toBeLessThan(3);
    expect(Math.abs(p.y - 255)).toBeLessThan(3);
  });
});

describe("kmBetween", () => {
  it("converts map units back to kilometres", () => {
    expect(kmBetween({ x: 0, y: 0 }, { x: 90, y: 0 })).toBeCloseTo(10);
  });
});

describe("findKnownPlace", () => {
  const places = [
    { name: "Cranbourne", point: { x: 1, y: 1 } },
    { name: "Cranbourne North", point: { x: 2, y: 2 } },
    { name: "Berwick", point: { x: 3, y: 3 } },
  ];

  it("matches a suburb inside a full address", () => {
    expect(findKnownPlace("4 High St, Berwick VIC 3806", places)?.name).toBe("Berwick");
  });

  it("prefers the longer name", () => {
    expect(findKnownPlace("Cranbourne North VIC", places)?.name).toBe("Cranbourne North");
  });

  it("doesn't match part of a word", () => {
    expect(findKnownPlace("Berwicke", places)).toBeNull();
  });
});
