import type { PlaceholderScene } from "@/config/images";

/**
 * Hand-drawn-style line illustrations in one stroke weight, used for photo placeholders, the
 * fleet diagram and loading states. All currentColor, no fills except where a shape needs mass,
 * so they sit quietly on kraft and sand grounds.
 */

export type TruckSize = "six" | "ten";

/** Side-view box truck, facing right. The 10 tonne body is longer, with dual rear wheels. */
export function TruckGlyph({
  size = "ten",
  className,
  wheelClassName,
}: {
  size?: TruckSize;
  className?: string;
  wheelClassName?: string;
}) {
  const body = size === "ten" ? 82 : 62;
  const cabX = body + 6;
  const width = cabX + 34;
  return (
    <svg
      viewBox={`0 0 ${width} 64`}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {/* cargo body with panel lines */}
      <rect x="3" y="6" width={body} height="38" rx="1.5" />
      {Array.from({ length: Math.floor(body / 14) }).map((_, i) => (
        <line
          key={i}
          x1={3 + (i + 1) * 14}
          y1="9"
          x2={3 + (i + 1) * 14}
          y2="41"
          strokeOpacity="0.35"
        />
      ))}
      {/* cab */}
      <path d={`M${cabX} 18h17l10 12v14h-27z`} />
      <path d={`M${cabX + 5} 22h10l6 8h-16z`} strokeOpacity="0.6" />
      {/* chassis */}
      <line x1="3" y1="48" x2={width - 3} y2="48" />
      {/* wheels */}
      <g className={wheelClassName}>
        <circle cx="18" cy="53" r="7" fill="var(--color-sand-50, #faf6ee)" />
        <line x1="18" y1="48" x2="18" y2="58" strokeOpacity="0.5" />
      </g>
      {size === "ten" && (
        <g className={wheelClassName}>
          <circle cx="34" cy="53" r="7" fill="var(--color-sand-50, #faf6ee)" />
          <line x1="34" y1="48" x2="34" y2="58" strokeOpacity="0.5" />
        </g>
      )}
      <g className={wheelClassName}>
        <circle cx={cabX + 16} cy="53" r="7" fill="var(--color-sand-50, #faf6ee)" />
        <line x1={cabX + 16} y1="48" x2={cabX + 16} y2="58" strokeOpacity="0.5" />
      </g>
    </svg>
  );
}

function Street() {
  return (
    <g>
      <line x1="10" y1="236" x2="390" y2="236" />
      <line x1="10" y1="252" x2="390" y2="252" strokeDasharray="14 12" strokeOpacity="0.5" />
      {/* houses */}
      <path d="M28 236V170l38-30 38 30v66" />
      <rect x="56" y="200" width="20" height="36" />
      <rect x="36" y="178" width="18" height="14" />
      <path d="M118 236v-58l30-24 30 24v58" />
      <rect x="136" y="186" width="24" height="16" />
      {/* tree */}
      <circle cx="196" cy="182" r="18" />
      <line x1="196" y1="200" x2="196" y2="236" />
      {/* truck */}
      <g transform="translate(222 150)">
        <rect x="0" y="12" width="104" height="58" rx="2" />
        <path d="M110 34h26l14 18v18h-40z" />
        <path d="M116 40h16l9 12h-25z" strokeOpacity="0.6" />
        <line x1="0" y1="76" x2="152" y2="76" />
        <circle cx="24" cy="84" r="10" />
        <circle cx="48" cy="84" r="10" />
        <circle cx="126" cy="84" r="10" />
      </g>
      {/* couch being carried to the truck */}
      <path d="M190 226h28v-10h-28z" strokeOpacity="0.8" />
    </g>
  );
}

function Load() {
  return (
    <g>
      {/* truck interior in perspective */}
      <path d="M60 60h280l-40 40H100z" strokeOpacity="0.5" />
      <path d="M60 60v200l40-40V100M340 60v200l-40-40V100M100 220h200" strokeOpacity="0.5" />
      {/* stacked boxes */}
      <rect x="112" y="150" width="56" height="70" />
      <rect x="120" y="104" width="44" height="46" />
      <rect x="176" y="136" width="64" height="84" />
      <rect x="248" y="160" width="44" height="60" />
      <path d="M112 185h56M176 178h64M248 190h44" strokeOpacity="0.4" />
      {/* ratchet straps */}
      <path d="M104 132l196 38M104 176l196 20" strokeWidth="3" strokeOpacity="0.8" />
      <rect x="196" y="146" width="14" height="10" transform="rotate(11 203 151)" />
    </g>
  );
}

function Gear() {
  return (
    <g>
      <line x1="20" y1="244" x2="380" y2="244" />
      {/* hand trolley */}
      <path d="M92 90l18 140h36" />
      <path d="M86 90h14" />
      <circle cx="120" cy="236" r="10" />
      <rect x="112" y="150" width="46" height="40" />
      <rect x="116" y="112" width="40" height="38" />
      {/* folded blankets */}
      <path d="M190 244v-24h90v24M190 220v-22h90v22M196 198v-20h78v20" />
      <path d="M200 208h70M200 230h70" strokeOpacity="0.4" strokeDasharray="4 6" />
      {/* boxes */}
      <rect x="296" y="178" width="66" height="66" />
      <rect x="306" y="132" width="48" height="46" />
      <path d="M296 204h66M306 150h48" strokeOpacity="0.4" />
      {/* tape roll */}
      <circle cx="238" cy="160" r="12" />
      <circle cx="238" cy="160" r="5" />
    </g>
  );
}

function Office() {
  return (
    <g>
      <line x1="20" y1="244" x2="380" y2="244" />
      {/* desks */}
      <path d="M40 186h140M52 186v58M168 186v58" />
      <path d="M210 186h140M222 186v58M338 186v58" />
      {/* wrapped monitors */}
      <rect x="84" y="126" width="56" height="40" />
      <path d="M112 166v20M84 136l56 20M84 156l56-20" strokeOpacity="0.4" />
      <rect x="254" y="126" width="56" height="40" />
      <path d="M282 166v20M254 136l56 20M254 156l56-20" strokeOpacity="0.4" />
      {/* archive boxes */}
      <rect x="150" y="210" width="44" height="34" />
      <rect x="196" y="210" width="44" height="34" />
      <path d="M150 222h44M196 222h44" strokeOpacity="0.4" />
    </g>
  );
}

function Truck() {
  return (
    <g>
      <line x1="10" y1="240" x2="390" y2="240" />
      <line x1="10" y1="256" x2="390" y2="256" strokeDasharray="14 12" strokeOpacity="0.5" />
      <g transform="translate(58 104)">
        <rect x="0" y="10" width="190" height="104" rx="2" />
        {[38, 76, 114, 152].map((x) => (
          <line key={x} x1={x} y1="16" x2={x} y2="108" strokeOpacity="0.3" />
        ))}
        <path d="M198 50h48l24 32v32h-72z" />
        <path d="M208 58h32l16 22h-48z" strokeOpacity="0.6" />
        <line x1="0" y1="122" x2="272" y2="122" />
        <circle cx="40" cy="134" r="14" />
        <circle cx="76" cy="134" r="14" />
        <circle cx="226" cy="134" r="14" />
      </g>
    </g>
  );
}

const SCENES: Record<PlaceholderScene, () => React.JSX.Element> = {
  truck: Truck,
  street: Street,
  load: Load,
  gear: Gear,
  office: Office,
};

/** A 400x300 line scene for a photo placeholder. */
export function SceneIllustration({
  scene,
  className,
}: {
  scene: PlaceholderScene;
  className?: string;
}) {
  const Scene = SCENES[scene];
  return (
    <svg
      viewBox="0 0 400 300"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <Scene />
    </svg>
  );
}
