import Link from "next/link";

import { CAMEL_PATH } from "@/components/brand/camel-mark";
import { publishedSuburbs } from "@/content/suburbs";

/**
 * Schematic coverage map of Melbourne's south-east. Positions are real coordinates projected to
 * the SVG (equirectangular at latitude 38°S, about 9 units per km), the bay shorelines are
 * simplified, and the rings are straight-line distance from the Cranbourne base (10, 20, 30 km),
 * not drive times. Published suburbs are real links to their pages; routes from the depot draw
 * in on scroll (CSS only, see .vc-route-draw).
 */

export const DEPOT = { x: 301.9, y: 319.6 };

/** Projected positions (see the projection note above). */
const POSITIONS: Record<string, { x: number; y: number; anchor: "start" | "end"; dy: number }> = {
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

export function CoverageMap({ className }: { className?: string }) {
  const pins = publishedSuburbs
    .map((suburb) => ({ suburb, pos: POSITIONS[suburb.slug] }))
    .filter(
      (
        pin,
      ): pin is { suburb: (typeof publishedSuburbs)[number]; pos: NonNullable<typeof pin.pos> } =>
        Boolean(pin.pos),
    );

  return (
    <figure className={className}>
      <svg
        viewBox="0 0 520 540"
        className="h-auto w-full"
        role="group"
        aria-labelledby="coverage-map-title"
      >
        <title id="coverage-map-title">
          Schematic map of Melbourne&apos;s south-east showing our Cranbourne base and the suburbs
          we cover
        </title>
        <defs>
          <pattern id="map-water" width="8" height="8" patternUnits="userSpaceOnUse">
            <path
              d="M0 8 8 0"
              stroke="var(--color-navy-900)"
              strokeOpacity="0.14"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        {/* land grid */}
        <g stroke="var(--color-navy-900)" strokeOpacity="0.07">
          {Array.from({ length: 13 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 45} y1="0" x2={i * 45} y2="540" />
          ))}
          {Array.from({ length: 13 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 45} x2="520" y2={i * 45} />
          ))}
        </g>

        {/* water */}
        <path
          d={PORT_PHILLIP}
          fill="url(#map-water)"
          stroke="var(--color-navy-900)"
          strokeOpacity="0.45"
          strokeWidth="1.5"
        />
        <path
          d={WESTERN_PORT}
          fill="url(#map-water)"
          stroke="var(--color-navy-900)"
          strokeOpacity="0.45"
          strokeWidth="1.5"
        />
        <text
          x="54"
          y="300"
          className="fill-navy-900/55 text-[11px] font-semibold tracking-[0.16em] uppercase"
        >
          Port Phillip
        </text>
        <text
          x="300"
          y="500"
          className="fill-navy-900/55 text-[11px] font-semibold tracking-[0.16em] uppercase"
        >
          Western Port
        </text>

        {/* distance rings from the depot */}
        {[90, 180, 270].map((r, i) => (
          <g key={r}>
            <circle
              cx={DEPOT.x}
              cy={DEPOT.y}
              r={r}
              fill="none"
              stroke="var(--color-terracotta-600)"
              strokeOpacity={0.35 - i * 0.08}
              strokeWidth="1.5"
              strokeDasharray="3 7"
            />
            <text
              x={DEPOT.x + r * 0.71 + 4}
              y={DEPOT.y - r * 0.71}
              className="fill-terracotta-600 text-[10px] font-bold tracking-[0.12em]"
            >
              {(i + 1) * 10} KM
            </text>
          </g>
        ))}

        {/* routes from the depot to each covered suburb */}
        {pins
          .filter(({ suburb }) => suburb.slug !== "cranbourne")
          .map(({ suburb, pos }) => (
            <path
              key={`route-${suburb.slug}`}
              d={`M${DEPOT.x} ${DEPOT.y} Q${(DEPOT.x + pos.x) / 2} ${Math.min(DEPOT.y, pos.y) - 18} ${pos.x} ${pos.y}`}
              pathLength={1}
              fill="none"
              stroke="var(--color-navy-900)"
              strokeWidth="1.75"
              strokeLinecap="round"
              className="vc-route-draw"
            />
          ))}

        {/* reference towns (not links) */}
        {REFERENCE_TOWNS.map((town) => (
          <g key={town.name}>
            <rect
              x={town.x - 3}
              y={town.y - 3}
              width="6"
              height="6"
              fill="var(--color-navy-900)"
              fillOpacity="0.5"
            />
            <text
              x={town.x + 8}
              y={town.y + 4}
              className="fill-navy-900/70 text-[11px] font-semibold"
            >
              {town.name}
            </text>
          </g>
        ))}

        {/* covered suburbs */}
        {pins.map(({ suburb, pos }) => (
          <Link
            key={suburb.slug}
            href={`/removalists/${suburb.slug}`}
            className="group outline-none"
          >
            <circle
              cx={pos.x}
              cy={pos.y}
              r="5.5"
              className="fill-sand-50 stroke-navy-900 group-hover:fill-terracotta-600 group-focus-visible:fill-terracotta-600 transition-colors"
              strokeWidth="2.5"
            />
            <text
              x={pos.x + (pos.anchor === "start" ? 9 : -9)}
              y={pos.y + pos.dy}
              textAnchor={pos.anchor}
              className="fill-navy-900 group-hover:fill-terracotta-600 group-focus-visible:fill-terracotta-600 text-[12.5px] font-bold underline-offset-2 group-hover:underline group-focus-visible:underline"
            >
              {suburb.name}
            </text>
            {/* drive-time tag on hover and focus (from the suburb's own page data) */}
            {suburb.driveTimeFromCranbourneMins ? (
              <g
                aria-hidden="true"
                className="pointer-events-none opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                <rect
                  x={pos.x - 38}
                  y={pos.y - 34}
                  width="76"
                  height="20"
                  rx="2"
                  fill="var(--color-navy-900)"
                />
                <text
                  x={pos.x}
                  y={pos.y - 20}
                  textAnchor="middle"
                  className="fill-sand-50 text-[10.5px] font-bold"
                >
                  ~{suburb.driveTimeFromCranbourneMins} min drive
                </text>
              </g>
            ) : null}
          </Link>
        ))}

        {/* the depot, with a slow ping */}
        <circle
          cx={DEPOT.x}
          cy={DEPOT.y - 15}
          r="22"
          fill="none"
          stroke="var(--color-signal-400)"
          strokeWidth="3"
          className="vc-ping"
          aria-hidden="true"
        />
        <g transform={`translate(${DEPOT.x - 16} ${DEPOT.y - 30})`}>
          <rect x="-4" y="-4" width="40" height="30" rx="3" fill="var(--color-navy-900)" />
          <path
            d={CAMEL_PATH}
            fill="var(--color-signal-400)"
            transform="translate(1 0) scale(0.5)"
          />
        </g>
        <text
          x={DEPOT.x - 26}
          y={DEPOT.y - 38}
          textAnchor="end"
          className="fill-navy-900 text-[10px] font-bold tracking-[0.14em] uppercase"
        >
          Depot
        </text>

        {/* north arrow */}
        <g transform="translate(482 34)" className="fill-navy-900">
          <path d="M0 -16 6 6 0 2 -6 6Z" />
          <text y="22" textAnchor="middle" className="text-[10px] font-bold">
            N
          </text>
        </g>
      </svg>
      <figcaption className="text-muted-600 mt-3 text-sm">
        Schematic, not to scale. Rings show straight-line distance from our Cranbourne base; hover a
        suburb for a typical drive from the depot. We move across all of Greater Melbourne; the
        named suburbs have their own local pages.
      </figcaption>
    </figure>
  );
}
