"use client";

import { useEffect, useId, useState } from "react";
import { cn } from "cn";

import { Fleet360 } from "@/components/home/fleet-360";
import {
  JOB_SIZE_EVENT,
  announceJobSize,
  type FleetBand,
  type JobSizeDetail,
} from "@/lib/job-size-sync";
import type { ImageId } from "@/config/images";

export interface FleetTier {
  id: string;
  index: string;
  title: string;
  truck: "six" | "ten";
  truckLabel: string;
  crew: string;
  typical: string;
  /** Example estimate from the pricing engine, e.g. "$480 to $660". */
  example: string;
  exampleNote: string;
  image: ImageId;
  /** How many item glyphs the load diagram shows. Illustrative, not a capacity figure. */
  load: { couch: number; bed: number; fridge: number; boxes: number };
}

/** Item glyphs for the load diagram, positioned inside the cargo body. */
/** `fill` (0 to 1) is how much of this tier's typical load is shown, driven by the slider. */
function LoadDiagram({ tier, fill = 1 }: { tier: FleetTier; fill?: number }) {
  const bodyWidth = tier.truck === "ten" ? 300 : 220;
  const items: { key: string; x: number; y: number; w: number; h: number; label: string }[] = [];
  let x = 12;
  const floor = 150;
  for (let i = 0; i < tier.load.couch; i++) {
    items.push({ key: `couch${i}`, x, y: floor - 34, w: 58, h: 34, label: "Couch" });
    x += 64;
  }
  for (let i = 0; i < tier.load.bed; i++) {
    items.push({ key: `bed${i}`, x, y: floor - 82, w: 14, h: 82, label: "Mattress on its side" });
    x += 20;
  }
  for (let i = 0; i < tier.load.fridge; i++) {
    items.push({ key: `fridge${i}`, x, y: floor - 70, w: 32, h: 70, label: "Fridge" });
    x += 38;
  }
  let bx = x;
  let row = 0;
  for (let i = 0; i < tier.load.boxes; i++) {
    items.push({ key: `box${i}`, x: bx, y: floor - 26 - row * 28, w: 26, h: 26, label: "Box" });
    row += 1;
    if (row === 3) {
      row = 0;
      bx += 30;
    }
  }

  return (
    <svg
      viewBox={`0 0 ${bodyWidth + 110} 200`}
      className="text-navy-900 h-auto w-full"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinejoin="round"
      role="img"
      aria-label={`Illustration of a typical load in the ${tier.truckLabel}, not to scale`}
    >
      {/* cargo body */}
      <rect x="2" y="30" width={bodyWidth} height="124" rx="2" className="fill-sand-50" />
      {/* cab */}
      <path d={`M${bodyWidth + 8} 74h54l34 40v40h-88z`} className="fill-sand-50" />
      <path d={`M${bodyWidth + 16} 82h40l22 28h-62z`} strokeOpacity="0.5" />
      <line x1="2" y1="162" x2={bodyWidth + 104} y2="162" />
      <circle cx="44" cy="172" r="15" className="fill-sand-50" />
      {tier.truck === "ten" && <circle cx="80" cy="172" r="15" className="fill-sand-50" />}
      <circle cx={bodyWidth + 58} cy="172" r="15" className="fill-sand-50" />
      {/* load, dropped in one by one */}
      <g transform="translate(2 4)">
        {items.slice(0, Math.max(1, Math.ceil(items.length * fill))).map((item, index) => (
          <rect
            key={`${tier.id}-${item.key}`}
            x={item.x}
            y={item.y}
            width={item.w}
            height={item.h}
            rx="1.5"
            className="fill-kraft-400/70 vc-drop"
            style={{ animationDelay: `${Math.min(index, 14) * 25}ms` }}
          >
            <title>{item.label}</title>
          </rect>
        ))}
      </g>
    </svg>
  );
}

/**
 * The fleet as a system: three job sizes, which truck and crew each gets (the pricing engine's own
 * rules), an example estimate, and a load diagram that fills when you switch. Tabs follow the ARIA
 * tabs pattern with arrow-key support.
 */
export function FleetSelector({ tiers }: { tiers: FleetTier[] }) {
  const baseId = useId();
  // The slider runs 0 to 100 across all tiers: which band it's in picks the tier, and how far
  // into the band sets how full the truck is. Tabs jump to a fully loaded truck.
  const band_ = 100 / tiers.length;
  const bandEnd = (index: number) => Math.round((index + 1) * band_) - 1;
  const [position, setPosition] = useState(bandEnd(1));
  const activeIndex = Math.min(tiers.length - 1, Math.floor(position / band_));
  const fill = Math.min(1, 0.35 + (0.65 * (position - activeIndex * band_)) / (band_ - 1));
  // User changes here tell the hero estimator; its changes move this slider (job-size-sync).
  function moveTo(nextPosition: number) {
    setPosition(nextPosition);
    const band = Math.min(tiers.length - 1, Math.floor(nextPosition / band_)) as FleetBand;
    announceJobSize({ source: "fleet", band });
  }
  const setActiveIndex = (index: number) => moveTo(bandEnd(index));
  useEffect(() => {
    function onJobSize(event: Event) {
      const detail = (event as CustomEvent<JobSizeDetail>).detail;
      if (detail.source !== "estimator") return;
      setPosition((current) =>
        Math.floor(current / band_) === detail.band ? current : bandEnd(detail.band),
      );
    }
    window.addEventListener(JOB_SIZE_EVENT, onJobSize);
    return () => window.removeEventListener(JOB_SIZE_EVENT, onJobSize);
    // bandEnd and band_ only depend on the tier count, which never changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const active = tiers[activeIndex]!;

  function onKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const next = (activeIndex + (event.key === "ArrowRight" ? 1 : tiers.length - 1)) % tiers.length;
    setActiveIndex(next);
    document.getElementById(`${baseId}-tab-${next}`)?.focus();
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Job size"
        className="border-navy-900 grid border-2 sm:grid-cols-3"
      >
        {tiers.map((tier, index) => {
          const selected = index === activeIndex;
          return (
            <button
              key={tier.id}
              id={`${baseId}-tab-${index}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveIndex(index)}
              onKeyDown={onKeyDown}
              className={cn(
                "border-navy-900 flex min-h-16 items-center gap-3 px-4 py-3 text-left transition-colors duration-150 not-last:border-b-2 sm:not-last:border-r-2 sm:not-last:border-b-0",
                selected
                  ? "bg-navy-900 text-sand-50"
                  : "bg-sand-50 text-navy-900 hover:bg-sand-100",
              )}
            >
              <span
                className={cn(
                  "font-stencil text-3xl leading-none",
                  selected ? "text-signal-400" : "text-terracotta-600",
                )}
              >
                {tier.index}
              </span>
              <span className="text-[0.9375rem] leading-tight font-bold">{tier.title}</span>
            </button>
          );
        })}
      </div>

      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${activeIndex}`}
        className="border-navy-900 grid gap-6 border-x-2 border-b-2 p-4 sm:p-6 lg:grid-cols-12 lg:gap-10"
      >
        <div className="lg:col-span-7">
          <LoadDiagram key={active.id} tier={active} fill={fill} />
          <p className="text-muted-600 mt-2 text-xs">Typical load, illustrated. Not to scale.</p>
          <label htmlFor={`${baseId}-slider`} className="mt-5 block">
            <span className="manifest-index text-muted-600">Drag to size the job</span>
            <input
              id={`${baseId}-slider`}
              type="range"
              min={0}
              max={99}
              step={1}
              value={position}
              onChange={(event) => moveTo(Number(event.target.value))}
              aria-valuetext={`${active.title}, ${Math.round(fill * 100)}% of a typical load`}
              className="accent-terracotta-600 mt-2 h-11 w-full cursor-pointer"
            />
          </label>
          <div
            className="text-muted-600 flex justify-between text-xs font-semibold"
            aria-hidden="true"
          >
            {tiers.map((tier, index) => (
              <span
                key={tier.id}
                className={cn(index === activeIndex && "text-navy-900 font-bold")}
              >
                {["Single items", "Studio to 2 bed", "3 bed+ and offices"][index] ?? tier.title}
              </span>
            ))}
          </div>
        </div>
        <div key={`detail-${active.id}`} className="vc-panel-in lg:col-span-5">
          <dl className="divide-navy-900/20 divide-y">
            {[
              { term: "Truck", detail: active.truckLabel },
              { term: "Crew", detail: active.crew },
              { term: "Typical job", detail: active.typical },
              { term: "Example estimate", detail: active.example },
            ].map((row) => (
              <div key={row.term} className="grid grid-cols-[8.5rem_1fr] gap-3 py-2.5">
                <dt className="manifest-index text-muted-600 pt-1">{row.term}</dt>
                <dd className="text-navy-900 tabular font-bold">{row.detail}</dd>
              </div>
            ))}
          </dl>
          <p className="text-muted-600 mt-2 text-xs">{active.exampleNote}</p>
          <div className="mt-4">
            <Fleet360 key={active.truck} truck={active.truck} truckLabel={active.truckLabel} />
          </div>
        </div>
      </div>
    </div>
  );
}
