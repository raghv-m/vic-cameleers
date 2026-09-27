"use client";

import { useId, useState } from "react";
import { cn } from "cn";

import { Photo } from "@/components/brand/photo";
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
function LoadDiagram({ tier }: { tier: FleetTier }) {
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
        {items.map((item, index) => (
          <rect
            key={`${tier.id}-${item.key}`}
            x={item.x}
            y={item.y}
            width={item.w}
            height={item.h}
            rx="1.5"
            className="fill-kraft-400/70 vc-drop"
            style={{ animationDelay: `${Math.min(index, 14) * 40}ms` }}
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
  const [activeIndex, setActiveIndex] = useState(1);
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
          <LoadDiagram key={active.id} tier={active} />
          <p className="text-muted-600 mt-2 text-xs">Typical load, illustrated. Not to scale.</p>
        </div>
        <div className="lg:col-span-5">
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
          <Photo
            id={active.image}
            sizes="(min-width: 1024px) 30vw, 100vw"
            ratio="3 / 2"
            className="mt-4"
          />
        </div>
      </div>
    </div>
  );
}
