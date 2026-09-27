/** Shared map geometry (see coverage-map.tsx for the projection). Kept free of content imports so client components can use it cheaply. */
export const DEPOT = { x: 301.9, y: 319.6 };

/** Projected positions (see the projection note above). */
export const POSITIONS: Record<
  string,
  { x: number; y: number; anchor: "start" | "end"; dy: number }
> = {
  cranbourne: { x: 301.9, y: 319.6, anchor: "end", dy: 22 },
  "cranbourne-east": { x: 327.6, y: 328.0, anchor: "start", dy: 20 },
  "cranbourne-north": { x: 312.6, y: 298.0, anchor: "end", dy: -8 },
  "clyde-north": { x: 359.9, y: 313.0, anchor: "start", dy: 4 },
  berwick: { x: 354.4, y: 255.0, anchor: "start", dy: -6 },
  "narre-warren": { x: 317.4, y: 247.0, anchor: "end", dy: -8 },
  officer: { x: 400.8, y: 281.0, anchor: "start", dy: -10 },
  pakenham: { x: 462.2, y: 291.0, anchor: "end", dy: -12 },
};

export const REFERENCE_TOWNS = [
  { name: "Melbourne CBD", x: 49.7, y: 33.6 },
  { name: "Dandenong", x: 248.1, y: 207.0 },
  { name: "Frankston", x: 175.6, y: 364.0 },
];

export const PORT_PHILLIP =
  "M0,0 L23.6,0 39.4,60 59.1,87 65.4,102 70.9,135 81.9,171 110.2,205 147.3,226 175.6,295 179.5,325 175.6,364 149.6,410 108.7,438 78.7,480 39.4,540 0,540 Z";
export const WESTERN_PORT =
  "M204.7,540 L228.4,525 267.7,480 322.9,445 374,435 425.2,455 488.2,500 511.9,540 Z";
