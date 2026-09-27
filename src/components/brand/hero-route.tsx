import { CAMEL_PATH } from "@/components/brand/camel-mark";
import {
  DEPOT,
  PORT_PHILLIP,
  REFERENCE_TOWNS,
  WESTERN_PORT,
} from "@/components/brand/coverage-map";

/**
 * Line-art of Melbourne's south-east (the same projected coastline as the coverage map) with a
 * small truck driving from the CBD, past Dandenong, into the Cranbourne depot on a 9 second loop.
 * SVG <animateMotion>, no JavaScript. Under reduced motion the moving truck is hidden and a
 * parked one shows at the depot instead (see .vc-motion-only / .vc-still-only in globals.css).
 * Decorative: the hero text already says where we are and where we go.
 */
const ROUTE = `M49.7 33.6 C 110 80, 190 140, 248.1 207 S 292 290, ${DEPOT.x} ${DEPOT.y}`;

function TruckGlyph() {
  // Drawn pointing along +x so rotate="auto" faces it down the road.
  return (
    <g transform="translate(-15 -12)">
      <rect x="0" y="0" width="20" height="14" rx="1.5" fill="var(--color-sand-50)" />
      <path d="M20 5h6l4 5v4H20z" fill="var(--color-terracotta-600)" />
      <rect
        x="0"
        y="0"
        width="20"
        height="14"
        rx="1.5"
        fill="none"
        stroke="var(--color-navy-900)"
        strokeWidth="1.8"
      />
      <circle cx="6" cy="15" r="3" fill="var(--color-navy-900)" />
      <circle cx="25" cy="15" r="3" fill="var(--color-navy-900)" />
    </g>
  );
}

export function HeroRoute({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="-10 0 520 380"
      className={className}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d={PORT_PHILLIP}
        stroke="var(--color-navy-900)"
        strokeOpacity="0.35"
        strokeWidth="1.5"
      />
      <path
        d={WESTERN_PORT}
        stroke="var(--color-navy-900)"
        strokeOpacity="0.35"
        strokeWidth="1.5"
      />

      {/* the road, dashed, then the travelled part drawn solid behind the truck */}
      <path
        id="hero-route"
        d={ROUTE}
        stroke="var(--color-kraft-400)"
        strokeWidth="3"
        strokeDasharray="2 8"
      />
      <path
        d={ROUTE}
        pathLength={1}
        stroke="var(--color-terracotta-600)"
        strokeWidth="3"
        strokeDasharray="1 1"
        strokeDashoffset="1"
        className="vc-motion-only"
      >
        <animate
          attributeName="stroke-dashoffset"
          values="1;0;0"
          keyTimes="0;0.85;1"
          dur="9s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="1;1;0"
          keyTimes="0;0.9;1"
          dur="9s"
          repeatCount="indefinite"
        />
      </path>

      {REFERENCE_TOWNS.map((town) => (
        <g key={town.name}>
          <rect
            x={town.x - 3}
            y={town.y - 3}
            width="6"
            height="6"
            fill="var(--color-navy-900)"
            fillOpacity="0.55"
          />
          <text
            x={town.x + 9}
            y={town.y + 4}
            className="fill-navy-900/70 text-[12px] font-semibold"
            stroke="none"
          >
            {town.name}
          </text>
        </g>
      ))}

      {/* depot */}
      <g transform={`translate(${DEPOT.x - 18} ${DEPOT.y + 10})`}>
        <rect x="0" y="0" width="36" height="26" rx="3" fill="var(--color-navy-900)" />
        <path
          d={CAMEL_PATH}
          fill="var(--color-signal-400)"
          transform="translate(3 1) scale(0.47)"
        />
      </g>
      <text
        x={DEPOT.x + 24}
        y={DEPOT.y + 28}
        className="fill-navy-900 text-[11px] font-bold tracking-[0.14em] uppercase"
        stroke="none"
      >
        Cranbourne depot
      </text>

      {/* moving truck (motion allowed) */}
      <g className="vc-motion-only">
        <TruckGlyph />
        <animateMotion
          dur="9s"
          repeatCount="indefinite"
          rotate="auto"
          keyPoints="0;1;1"
          keyTimes="0;0.85;1"
          calcMode="linear"
        >
          <mpath href="#hero-route" />
        </animateMotion>
        <animate
          attributeName="opacity"
          values="0;1;1;0"
          keyTimes="0;0.05;0.9;1"
          dur="9s"
          repeatCount="indefinite"
        />
      </g>

      {/* parked truck (reduced motion) */}
      <g className="vc-still-only" transform={`translate(${DEPOT.x - 34} ${DEPOT.y - 4})`}>
        <TruckGlyph />
      </g>
    </svg>
  );
}
