import { PORT_PHILLIP, WESTERN_PORT } from "@/components/brand/map-geometry";
import { DEPOT_XY, kmBetween, type MapPoint } from "@/lib/geo";

export interface MapPlace {
  name: string;
  point: MapPoint;
}

/**
 * The two ends of the move on a small map: pins, a route line that draws from pickup to drop-off
 * (800ms), then a bubble at the midpoint. The bubble gives straight-line distance only and says
 * the drive time comes with the quote: we don't calculate real drive times here, so we don't
 * show one. The view zooms to fit both ends. Keyed by the pair, so a new pair redraws.
 */
export function EstimateMiniMap({ from, to }: { from: MapPlace; to: MapPlace }) {
  const km = kmBetween(from.point, to.point);
  const pad = 60;
  const minX = Math.min(from.point.x, to.point.x, DEPOT_XY.x) - pad;
  const maxX = Math.max(from.point.x, to.point.x, DEPOT_XY.x) + pad;
  const minY = Math.min(from.point.y, to.point.y, DEPOT_XY.y) - pad;
  const maxY = Math.max(from.point.y, to.point.y, DEPOT_XY.y) + pad;
  // Keep a 2:1 frame so the card height doesn't jump between pairs.
  const width = Math.max(maxX - minX, (maxY - minY) * 2);
  const height = width / 2;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const viewBox = `${cx - width / 2} ${cy - height / 2} ${width} ${height}`;
  const scale = width / 320; // keeps pins and text the same size on screen at any zoom

  const mid = {
    x: (from.point.x + to.point.x) / 2,
    y: Math.min(from.point.y, to.point.y) - 24 * scale,
  };
  const route = `M${from.point.x} ${from.point.y} Q${mid.x} ${mid.y} ${to.point.x} ${to.point.y}`;
  const bubble = { x: mid.x, y: (from.point.y + to.point.y) / 2 - 12 * scale };
  const kmText = km < 1 ? "Under 1 km apart" : `About ${Math.round(km)} km apart`;
  const samePlace = km < 0.2;

  return (
    <figure className="border-navy-900/30 bg-sand-50 mt-3 overflow-hidden rounded-sm border">
      <svg
        viewBox={viewBox}
        className="block h-auto w-full"
        role="img"
        aria-label={`Map: ${from.name} to ${to.name}, ${kmText.toLowerCase()} in a straight line`}
      >
        <g stroke="var(--color-navy-900)" strokeOpacity="0.07" strokeWidth={scale}>
          {Array.from({ length: 24 }).map((_, i) => (
            <line key={i} x1={i * 45 - 200} y1="-400" x2={i * 45 - 200} y2="900" />
          ))}
        </g>
        <path
          d={PORT_PHILLIP}
          fill="var(--color-navy-900)"
          fillOpacity="0.06"
          stroke="var(--color-navy-900)"
          strokeOpacity="0.3"
          strokeWidth={scale}
        />
        <path
          d={WESTERN_PORT}
          fill="var(--color-navy-900)"
          fillOpacity="0.06"
          stroke="var(--color-navy-900)"
          strokeOpacity="0.3"
          strokeWidth={scale}
        />

        {/* depot for reference */}
        <rect
          x={DEPOT_XY.x - 4 * scale}
          y={DEPOT_XY.y - 4 * scale}
          width={8 * scale}
          height={8 * scale}
          fill="var(--color-navy-900)"
          fillOpacity="0.5"
        />

        {!samePlace && (
          <path
            key={`${from.name}-${to.name}`}
            d={route}
            pathLength={1}
            fill="none"
            stroke="var(--color-terracotta-600)"
            strokeWidth={3 * scale}
            strokeLinecap="round"
            className="vc-route-once"
          />
        )}

        {[
          { place: from, label: "A" },
          { place: to, label: "B" },
        ].map(({ place, label }) => (
          <g
            key={label}
            className="vc-pin-pop"
            style={{ transformOrigin: `${place.point.x}px ${place.point.y}px` }}
          >
            <circle
              cx={place.point.x}
              cy={place.point.y}
              r={9 * scale}
              fill="var(--color-navy-900)"
            />
            <text
              x={place.point.x}
              y={place.point.y + 3.6 * scale}
              textAnchor="middle"
              fill="var(--color-sand-50)"
              fontSize={10 * scale}
              fontWeight="700"
            >
              {label}
            </text>
            <text
              x={place.point.x}
              y={place.point.y + 22 * scale}
              textAnchor="middle"
              fill="var(--color-navy-900)"
              fontSize={10.5 * scale}
              fontWeight="700"
            >
              {place.name}
            </text>
          </g>
        ))}

        {!samePlace && (
          <g
            key={`bubble-${from.name}-${to.name}`}
            className="vc-bubble-pop"
            style={{ transformOrigin: `${bubble.x}px ${bubble.y}px` }}
          >
            <rect
              x={bubble.x - 62 * scale}
              y={bubble.y - 22 * scale}
              width={124 * scale}
              height={30 * scale}
              rx={3 * scale}
              fill="var(--color-navy-900)"
            />
            <text
              x={bubble.x}
              y={bubble.y - 9 * scale}
              textAnchor="middle"
              fill="var(--color-sand-50)"
              fontSize={10 * scale}
              fontWeight="700"
            >
              {kmText}
            </text>
            <text
              x={bubble.x}
              y={bubble.y + 3 * scale}
              textAnchor="middle"
              fill="var(--color-kraft-400)"
              fontSize={8 * scale}
              fontWeight="600"
            >
              Drive time: confirmed in your quote
            </text>
          </g>
        )}
      </svg>
      <figcaption className="text-muted-600 px-3 py-2 text-xs">
        Straight-line distance, not a drive time. The estimate still assumes a 20 minute drive until
        we check the addresses.
      </figcaption>
    </figure>
  );
}
