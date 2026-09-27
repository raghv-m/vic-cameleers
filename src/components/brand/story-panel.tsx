import { CAMEL_PATH } from "@/components/brand/camel-mark";

/**
 * Archival-style panel for the 1860 story, drawn for a navy ground: a camel caravan heading out
 * across hatched country, a route line running to the horizon, and a date stamp. Facts on it are
 * only the well-documented ones (the Burke and Wills expedition left Royal Park, Melbourne, on
 * 20 August 1860). It illustrates the idea behind the name, not the company's own history.
 */
export function StoryPanel({ className }: { className?: string }) {
  const camels = [
    { x: 96, y: 168, s: 1.35 },
    { x: 190, y: 174, s: 1.18 },
    { x: 268, y: 180, s: 1.02 },
  ];

  return (
    <svg viewBox="0 0 480 320" className={className} role="img" aria-labelledby="story-panel-title">
      <title id="story-panel-title">
        Illustration: a camel caravan leaving Melbourne in 1860, heading inland
      </title>
      <defs>
        <pattern
          id="hatch"
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-20)"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="6"
            stroke="var(--color-kraft-400)"
            strokeOpacity="0.45"
            strokeWidth="1.2"
          />
        </pattern>
        <pattern id="sky" width="480" height="4" patternUnits="userSpaceOnUse">
          <line x1="0" y1="2" x2="480" y2="2" stroke="var(--color-kraft-400)" strokeOpacity="0.1" />
        </pattern>
        <clipPath id="panel-clip">
          <rect x="12" y="12" width="456" height="296" rx="3" />
        </clipPath>
      </defs>

      <g clipPath="url(#panel-clip)">
        <rect x="0" y="0" width="480" height="320" fill="url(#sky)" />
        {/* sun low on the horizon */}
        <circle cx="372" cy="170" r="46" fill="var(--color-terracotta-400)" fillOpacity="0.85" />
        <g stroke="var(--color-navy-900)" strokeWidth="3">
          {[150, 160, 170, 180].map((y) => (
            <line key={y} x1="320" x2="424" y1={y} y2={y} />
          ))}
        </g>
        {/* ridges */}
        <path
          d="M0 214 C60 196 110 204 170 196 S300 178 360 190 480 196 480 196 V320 H0Z"
          fill="var(--color-navy-900)"
        />
        <path
          d="M0 214 C60 196 110 204 170 196 S300 178 360 190 480 196 480 196 V320 H0Z"
          fill="url(#hatch)"
        />
        <path
          d="M0 214 C60 196 110 204 170 196 S300 178 360 190 480 196"
          fill="none"
          stroke="var(--color-kraft-400)"
          strokeWidth="2"
        />
        {/* the route, heading inland */}
        <path
          d="M18 300 C120 270 170 262 230 244 S360 214 420 200"
          fill="none"
          stroke="var(--color-sand-200)"
          strokeWidth="3"
          strokeDasharray="0.1 10"
          strokeLinecap="round"
        />
        {/* lead rope */}
        <path
          d="M150 206 C168 214 186 208 202 212 M236 214 C250 220 262 214 276 216"
          fill="none"
          stroke="var(--color-kraft-400)"
          strokeWidth="1.5"
        />
        {/* the caravan */}
        {camels.map((camel) => (
          <path
            key={camel.x}
            d={CAMEL_PATH}
            fill="var(--color-sand-100)"
            transform={`translate(${camel.x} ${camel.y}) scale(${camel.s})`}
          />
        ))}
        {/* cameleer walking ahead */}
        <g transform="translate(330 186)" fill="var(--color-sand-100)">
          <circle cx="6" cy="4" r="4" />
          <path d="M2 10h8l2 16-3 16h-3l1-15-2 0-3 15H-1l2-16z" />
          <line x1="-2" y1="14" x2="-14" y2="32" stroke="var(--color-sand-100)" strokeWidth="1.6" />
        </g>
      </g>

      {/* frame */}
      <rect
        x="12"
        y="12"
        width="456"
        height="296"
        rx="3"
        fill="none"
        stroke="var(--color-kraft-400)"
        strokeWidth="2"
      />
      <rect
        x="4"
        y="4"
        width="472"
        height="312"
        rx="5"
        fill="none"
        stroke="var(--color-kraft-400)"
        strokeOpacity="0.4"
      />

      {/* date stamp */}
      <g transform="translate(40 46) rotate(-6)">
        <rect
          x="0"
          y="0"
          width="168"
          height="54"
          rx="3"
          fill="none"
          stroke="var(--color-signal-400)"
          strokeWidth="2.5"
        />
        <text
          x="84"
          y="22"
          textAnchor="middle"
          className="fill-signal-400 text-[11px] font-bold tracking-[0.18em]"
        >
          ROYAL PARK, MELBOURNE
        </text>
        <text
          x="84"
          y="43"
          textAnchor="middle"
          className="fill-signal-400 font-stencil text-[20px]"
        >
          20 AUGUST 1860
        </text>
      </g>
    </svg>
  );
}
