"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import { Move3d } from "lucide-react";
import { cn } from "cn";

import { fleetSpinFrames } from "@/config/images";

const FRAMES = 24;
const DEG_PER_FRAME = 360 / FRAMES;
const PX_PER_FRAME = 14;

type Vec3 = [number, number, number];

interface TruckShape {
  /** Cargo box length and the cab in front of it, in metres-ish model units. */
  box: number;
  cab: number;
}

const SHAPES: Record<"six" | "ten", TruckShape> = {
  six: { box: 4.6, cab: 1.7 },
  ten: { box: 6.2, cab: 1.9 },
};

interface Hotspot {
  id: string;
  label: string;
  detail: string;
  /** Model-space anchor, and the outward normal of the face it sits on (for visibility). */
  at: (s: TruckShape) => Vec3;
  normal: Vec3;
  placeholder?: boolean;
}

const HOTSPOTS: Hotspot[] = [
  {
    id: "cab",
    label: "Cab",
    detail: "Crew ride in the cab to your job.",
    at: (s) => [s.box / 2 + s.cab, 1.05, 0],
    normal: [1, 0, 0],
  },
  {
    id: "straps",
    label: "Straps and blankets",
    detail: "Furniture is wrapped in blankets and strapped in the truck on every job.",
    at: () => [0, 1.4, 1.2],
    normal: [0, 0, 1],
  },
  {
    id: "tail",
    label: "Tail-lift (to confirm)",
    detail: "Placeholder: whether each truck has a tail-lift is still to be confirmed.",
    at: (s) => [-s.box / 2, 0.55, 0],
    normal: [-1, 0, 0],
    placeholder: true,
  },
];

/** Rotate around the vertical axis, then a gentle 3/4 view from slightly above. */
function project([x, y, z]: Vec3, angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180;
  const rx = x * Math.cos(a) - z * Math.sin(a);
  const rz = x * Math.sin(a) + z * Math.cos(a);
  const tilt = 0.28; // camera looks down a little
  const px = rx;
  const py = -y + rz * tilt;
  const depth = rz;
  return { x: 200 + px * 34, y: 150 + py * 34, depth };
}

function rotateNormal([x, , z]: Vec3, angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180;
  return x * Math.sin(a) + z * Math.cos(a); // component toward the camera (+z after rotation)
}

function boxFaces(min: Vec3, max: Vec3): { pts: Vec3[]; normal: Vec3 }[] {
  const [x0, y0, z0] = min;
  const [x1, y1, z1] = max;
  return [
    {
      pts: [
        [x1, y0, z0],
        [x1, y1, z0],
        [x1, y1, z1],
        [x1, y0, z1],
      ],
      normal: [1, 0, 0],
    },
    {
      pts: [
        [x0, y0, z0],
        [x0, y0, z1],
        [x0, y1, z1],
        [x0, y1, z0],
      ],
      normal: [-1, 0, 0],
    },
    {
      pts: [
        [x0, y0, z1],
        [x1, y0, z1],
        [x1, y1, z1],
        [x0, y1, z1],
      ],
      normal: [0, 0, 1],
    },
    {
      pts: [
        [x0, y0, z0],
        [x0, y1, z0],
        [x1, y1, z0],
        [x1, y0, z0],
      ],
      normal: [0, 0, -1],
    },
    {
      pts: [
        [x0, y1, z0],
        [x0, y1, z1],
        [x1, y1, z1],
        [x1, y1, z0],
      ],
      normal: [0, 1, 0],
    },
  ];
}

/** One placeholder frame: a line-art box truck seen from `angle` degrees. */
function PlaceholderFrame({ truck, angle }: { truck: "six" | "ten"; angle: number }) {
  const s = SHAPES[truck];
  const half = s.box / 2;
  const faces = [
    ...boxFaces([-half, 0.45, -1.2], [half, 3, 1.2]).map((f) => ({ ...f, tone: "box" as const })),
    ...boxFaces([half + 0.1, 0.45, -1.1], [half + s.cab, 2.2, 1.1]).map((f) => ({
      ...f,
      tone: "cab" as const,
    })),
  ]
    .filter((f) => f.normal[1] === 1 || rotateNormal(f.normal, angle) > 0.01)
    .map((f) => {
      const p = f.pts.map((pt) => project(pt, angle));
      return { ...f, p, depth: p.reduce((sum, q) => sum + q.depth, 0) / p.length };
    })
    .sort((a, b) => a.depth - b.depth);

  const wheels = [
    [half + s.cab * 0.55, 1.2],
    [-half + 0.9, 1.2],
    ...(truck === "ten" ? [[-half + 2.1, 1.2]] : []),
  ].flatMap(([x, z]) => [
    [x!, z!],
    [x!, -z!],
  ]);

  return (
    <g>
      <ellipse cx="200" cy="168" rx="175" ry="26" fill="var(--color-navy-900)" fillOpacity="0.08" />
      {wheels
        .map(([x, z]) => project([x!, 0.45, z!], angle))
        .sort((a, b) => a.depth - b.depth)
        .map((w, i) => (
          <ellipse key={i} cx={w.x} cy={w.y} rx="14" ry="15" fill="var(--color-navy-900)" />
        ))}
      {faces.map((f, i) => (
        <polygon
          key={i}
          points={f.p.map((q) => `${q.x},${q.y}`).join(" ")}
          fill={
            f.tone === "cab"
              ? "var(--color-terracotta-400)"
              : f.normal[1] === 1
                ? "var(--color-sand-200)"
                : "var(--color-sand-50)"
          }
          stroke="var(--color-navy-900)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      ))}
    </g>
  );
}

/**
 * 360° drag-to-rotate truck viewer. Drag (mouse or touch) or use the arrow keys to turn it in 15°
 * steps; hotspots show only while their side faces you. Uses the real 24-photo spin set from
 * config when it exists; until then it draws labelled line-art placeholder frames.
 */
export function Fleet360({ truck, truckLabel }: { truck: "six" | "ten"; truckLabel: string }) {
  const id = useId();
  const [frame, setFrame] = useState(3);
  const [open, setOpen] = useState<string | null>(null);
  const drag = useRef<{ x: number; frame: number } | null>(null);
  const photos = fleetSpinFrames[truck];
  const real = photos.length === FRAMES;
  const angle = frame * DEG_PER_FRAME;
  const shape = SHAPES[truck];

  function turn(by: number) {
    setFrame((f) => (((f + by) % FRAMES) + FRAMES) % FRAMES);
  }

  return (
    <figure className="border-navy-900 bg-sand-50 relative rounded-sm border-2">
      <div
        role="slider"
        tabIndex={0}
        aria-label={`Rotate the ${truckLabel}`}
        aria-valuemin={0}
        aria-valuemax={345}
        aria-valuenow={angle}
        aria-valuetext={`${angle} degrees`}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") turn(1);
          else if (event.key === "ArrowLeft") turn(-1);
          else return;
          event.preventDefault();
        }}
        onPointerDown={(event) => {
          drag.current = { x: event.clientX, frame };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!drag.current) return;
          const steps = Math.round((event.clientX - drag.current.x) / PX_PER_FRAME);
          setFrame((((drag.current.frame - steps) % FRAMES) + FRAMES) % FRAMES);
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
        className="relative aspect-[4/3] cursor-grab touch-pan-y select-none active:cursor-grabbing"
      >
        {real ? (
          // Every frame is loaded and stacked; only the current one is shown, so turning is instant.
          photos.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt=""
              fill
              sizes="(min-width: 1024px) 30vw, 100vw"
              className={cn("object-contain", i === frame ? "visible" : "invisible")}
              draggable={false}
            />
          ))
        ) : (
          <svg viewBox="0 30 400 230" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <PlaceholderFrame truck={truck} angle={angle} />
          </svg>
        )}

        {/* hotspots */}
        {!real &&
          HOTSPOTS.map((spot) => {
            const facing = rotateNormal(spot.normal, angle) > 0.25;
            if (!facing) return null;
            const p = project(spot.at(shape), angle);
            // SVG viewBox is 400x230 starting at y=30; convert to % of the box.
            const left = (p.x / 400) * 100;
            const top = ((p.y - 30) / 230) * 100;
            const expanded = open === spot.id;
            return (
              <div
                key={spot.id}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${left}%`, top: `${top}%` }}
              >
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={`${id}-${spot.id}`}
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={() => setOpen(expanded ? null : spot.id)}
                  onMouseEnter={() => setOpen(spot.id)}
                  onMouseLeave={() => setOpen((o) => (o === spot.id ? null : o))}
                  className={cn(
                    "grid size-7 place-items-center rounded-full border-2 text-sm font-bold shadow-sm",
                    spot.placeholder
                      ? "border-navy-900 bg-sand-50 text-navy-900 border-dashed"
                      : "border-sand-50 bg-navy-900 text-signal-400",
                  )}
                >
                  <span aria-hidden="true">+</span>
                  <span className="sr-only">{spot.label}</span>
                </button>
                <div
                  id={`${id}-${spot.id}`}
                  role="tooltip"
                  hidden={!expanded}
                  className="bg-navy-900 text-sand-50 absolute bottom-full left-1/2 mb-2 w-52 -translate-x-1/2 rounded-sm p-2.5 text-xs leading-snug shadow-lg"
                >
                  <p className="text-signal-400 font-bold">{spot.label}</p>
                  <p className="mt-0.5">{spot.detail}</p>
                </div>
              </div>
            );
          })}

        {!real && (
          <span className="border-navy-900/40 text-muted-600 bg-sand-50/90 absolute top-2 left-2 rounded-[3px] border border-dashed px-2 py-1 text-[0.6875rem] font-bold tracking-[0.1em] uppercase">
            Placeholder drawing · real photos coming
          </span>
        )}
      </div>
      <figcaption className="text-muted-600 border-navy-900/20 flex items-center justify-between gap-3 border-t px-3 py-2 text-xs">
        <span className="flex items-center gap-1.5">
          <Move3d className="size-4" aria-hidden="true" />
          Drag or use arrow keys to turn the {truckLabel}
        </span>
        <span className="tabular" aria-hidden="true">
          {angle}°
        </span>
      </figcaption>
    </figure>
  );
}
