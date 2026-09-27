import { CAMEL_PATH } from "@/components/brand/camel-mark";

/**
 * The 404 graphic: a lone camel off the end of a dashed route, a road sign pointing the wrong
 * way. Decorative; the page text says what happened.
 */
export function LostCamel({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 360 200" className={className} aria-hidden="true" fill="none">
      <path d="M10 170 H350" className="stroke-navy-900" strokeWidth="2" />
      <path
        d="M10 140 C 80 140, 110 120, 170 124"
        className="stroke-kraft-400"
        strokeWidth="3"
        strokeDasharray="2 9"
        strokeLinecap="round"
      />
      <path
        d="M170 124 l8 -6 m-8 6 l8 6"
        className="stroke-terracotta-600"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <text x="186" y="130" className="fill-terracotta-600" fontSize="22" fontWeight="800">
        ?
      </text>
      {/* signpost */}
      <path d="M70 170 V96" className="stroke-navy-900" strokeWidth="4" />
      <path
        d="M40 92 H104 l12 10 -12 10 H40 Z"
        className="fill-signal-400 stroke-navy-900"
        strokeWidth="2.5"
      />
      <text
        x="52"
        y="107"
        className="fill-navy-900"
        fontSize="11"
        fontWeight="800"
        letterSpacing="1.5"
      >
        HOME
      </text>
      {/* camel, facing away from the sign */}
      <g transform="translate(236 100) scale(1.55)">
        <path d={CAMEL_PATH} className="fill-terracotta-600" />
      </g>
    </svg>
  );
}
