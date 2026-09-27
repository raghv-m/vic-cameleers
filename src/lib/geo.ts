/**
 * Map geometry shared by the coverage map, the hero route and the estimator mini-map. Everything
 * is in the coverage map's SVG space: an equirectangular projection centred on the Cranbourne
 * depot at about 9 SVG units per kilometre (checked against the published suburb pins).
 */

export const DEPOT_LATLNG = { lat: -38.0996, lng: 145.2834 } as const;
export const DEPOT_XY = { x: 301.9, y: 319.6 } as const;
export const UNITS_PER_KM = 9;

const KM_PER_DEG_LAT = 110.57;
const KM_PER_DEG_LNG = 111.32 * Math.cos((38.1 * Math.PI) / 180);

export interface MapPoint {
  x: number;
  y: number;
}

export function projectLatLng(lat: number, lng: number): MapPoint {
  return {
    x: DEPOT_XY.x + (lng - DEPOT_LATLNG.lng) * KM_PER_DEG_LNG * UNITS_PER_KM,
    y: DEPOT_XY.y - (lat - DEPOT_LATLNG.lat) * KM_PER_DEG_LAT * UNITS_PER_KM,
  };
}

/** Straight-line distance between two map points, in kilometres. */
export function kmBetween(a: MapPoint, b: MapPoint): number {
  return Math.hypot(a.x - b.x, a.y - b.y) / UNITS_PER_KM;
}

/**
 * Finds a place we have a map position for in free text like "Berwick VIC" or
 * "4 High St, Berwick VIC 3806". Longest names first, so "Cranbourne North" wins over
 * "Cranbourne". Returns null when the text doesn't name a mapped place.
 */
export function findKnownPlace(
  text: string,
  places: { name: string; point: MapPoint }[],
): { name: string; point: MapPoint } | null {
  const haystack = ` ${text.toLowerCase().replace(/[^a-z0-9]+/g, " ")} `;
  const sorted = [...places].sort((a, b) => b.name.length - a.name.length);
  for (const place of sorted) {
    const needle = ` ${place.name.toLowerCase().replace(/[^a-z0-9]+/g, " ")} `;
    if (haystack.includes(needle)) return place;
  }
  return null;
}
