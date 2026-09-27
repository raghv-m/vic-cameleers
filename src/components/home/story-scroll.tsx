"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "cn";

import { CAMEL_PATH } from "@/components/brand/camel-mark";

export interface StoryBeat {
  /** Timeline stop this beat belongs to (index into ERAS). */
  era: number;
  body: React.ReactNode;
}

const ERAS = ["1860", "Decades after", "Today"] as const;

/**
 * The story art as three layers that move at different speeds while the section scrolls past
 * (scroll-driven CSS, desktop only, see .vc-layer in globals.css): far country and sun, the 1860
 * caravan, and a modern truck rolling in up front. Decorative; the words carry the story.
 */
function LayeredArt({ era }: { era: number }) {
  const today = era >= 2;
  return (
    <div
      role="img"
      aria-label="Illustration: a camel caravan crossing inland country in 1860, with a modern removals truck in the foreground"
      className="border-kraft-400 relative aspect-[4/3] overflow-hidden rounded-[3px] border-2"
    >
      {/* L1: sky, sun, far country (slowest) */}
      <svg
        aria-hidden="true"
        viewBox="0 0 480 360"
        preserveAspectRatio="xMidYMid slice"
        className="vc-layer absolute inset-0 h-full w-full"
        style={{
          ["--vc-parallax-from" as string]: "18px",
          ["--vc-parallax-to" as string]: "-18px",
        }}
      >
        <defs>
          <pattern id="story-sky" width="480" height="5" patternUnits="userSpaceOnUse">
            <line
              x1="0"
              y1="2"
              x2="480"
              y2="2"
              stroke="var(--color-kraft-400)"
              strokeOpacity="0.1"
            />
          </pattern>
          <pattern
            id="story-hatch"
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
              strokeOpacity="0.35"
              strokeWidth="1.2"
            />
          </pattern>
        </defs>
        <rect x="-20" y="-40" width="520" height="440" fill="url(#story-sky)" />
        <circle cx="360" cy="170" r="54" fill="var(--color-terracotta-400)" fillOpacity="0.9" />
        <g stroke="var(--color-navy-900)" strokeWidth="3.5">
          {[150, 162, 174, 186].map((y) => (
            <line key={y} x1="300" x2="420" y1={y} y2={y} />
          ))}
        </g>
        <path
          d="M-20 212 C60 188 120 200 190 188 S320 170 380 184 500 190 500 190 V400 H-20Z"
          fill="var(--color-navy-700)"
        />
        <path
          d="M-20 212 C60 188 120 200 190 188 S320 170 380 184 500 190 500 190 V400 H-20Z"
          fill="url(#story-hatch)"
        />
      </svg>

      {/* L2: the 1860 caravan on the middle ground */}
      <svg
        aria-hidden="true"
        viewBox="0 0 480 360"
        preserveAspectRatio="xMidYMid slice"
        className="vc-layer absolute inset-0 h-full w-full"
        style={{
          ["--vc-parallax-from" as string]: "46px",
          ["--vc-parallax-to" as string]: "-46px",
        }}
      >
        <path
          d="M-20 262 C80 240 170 250 260 238 S420 226 500 232 V420 H-20Z"
          fill="var(--color-navy-900)"
        />
        <path
          d="M-20 262 C80 240 170 250 260 238 S420 226 500 232"
          fill="none"
          stroke="var(--color-kraft-400)"
          strokeWidth="2"
        />
        <path
          d="M20 330 C120 300 170 290 230 272 S360 244 440 232"
          fill="none"
          stroke="var(--color-sand-200)"
          strokeWidth="3"
          strokeDasharray="0.1 10"
          strokeLinecap="round"
        />
        {[
          { x: 70, y: 202, s: 1.3 },
          { x: 158, y: 206, s: 1.15 },
          { x: 234, y: 210, s: 1 },
        ].map((camel) => (
          <path
            key={camel.x}
            d={CAMEL_PATH}
            fill="var(--color-sand-100)"
            transform={`translate(${camel.x} ${camel.y}) scale(${camel.s})`}
          />
        ))}
        <path
          d="M128 240 C144 248 160 242 174 246 M204 246 C218 252 228 246 240 248"
          fill="none"
          stroke="var(--color-kraft-400)"
          strokeWidth="1.5"
        />
        <g transform="translate(300 214)" fill="var(--color-sand-100)">
          <circle cx="6" cy="4" r="4" />
          <path d="M2 10h8l2 16-3 16h-3l1-15-2 0-3 15H-1l2-16z" />
          <line x1="-2" y1="14" x2="-14" y2="32" stroke="var(--color-sand-100)" strokeWidth="1.6" />
        </g>
      </svg>

      {/* L3: a modern truck rolling in up front (fastest, sideways) */}
      <svg
        aria-hidden="true"
        viewBox="0 0 480 360"
        preserveAspectRatio="xMidYMid slice"
        className="vc-layer-x absolute inset-0 h-full w-full"
        style={{
          ["--vc-parallax-from" as string]: "-90px",
          ["--vc-parallax-to" as string]: "30px",
        }}
      >
        <rect x="-240" y="318" width="960" height="60" fill="var(--color-navy-950)" />
        <line
          x1="-240"
          y1="318"
          x2="720"
          y2="318"
          stroke="var(--color-kraft-400)"
          strokeWidth="2"
        />
        <g
          className={cn(
            "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
            today ? "translate-x-0" : "-translate-x-6",
          )}
        >
          <rect
            x="270"
            y="246"
            width="132"
            height="66"
            rx="3"
            fill="var(--color-sand-50)"
            stroke="var(--color-navy-950)"
            strokeWidth="2"
          />
          <path
            d="M402 268h28l20 22v22h-48z"
            fill="var(--color-terracotta-400)"
            stroke="var(--color-navy-950)"
            strokeWidth="2"
          />
          <path d="M408 274h19l13 15h-32z" fill="var(--color-navy-700)" />
          <path
            d={CAMEL_PATH}
            fill="var(--color-navy-900)"
            transform="translate(314 252) scale(0.66)"
          />
          <text
            x="336"
            y="298"
            className="fill-navy-900 font-stencil text-[10px]"
            textAnchor="middle"
            textLength="100"
            lengthAdjust="spacingAndGlyphs"
          >
            VIC CAMELEERS
          </text>
          {[296, 330, 428].map((cx) => (
            <g key={cx}>
              <circle cx={cx} cy="314" r="11" fill="var(--color-navy-950)" />
              <circle cx={cx} cy="314" r="4.5" fill="var(--color-sand-200)" />
            </g>
          ))}
        </g>
      </svg>

      {/* era stamp */}
      <div
        aria-hidden="true"
        className="border-signal-400 text-signal-400 absolute top-4 left-4 -rotate-6 rounded-[3px] border-2 px-3 py-1.5"
      >
        <span className="block text-[0.625rem] font-bold tracking-[0.18em]">
          {today ? "CRANBOURNE DEPOT" : "ROYAL PARK, MELBOURNE"}
        </span>
        <span className="font-stencil block text-xl leading-tight">
          {today ? "TODAY" : "20 AUGUST 1860"}
        </span>
      </div>
    </div>
  );
}

/**
 * The Name, told in beats. On desktop the art stays pinned while the beats scroll past; the beat
 * nearest the middle of the screen sets the timeline marker and the era stamp. On phones it's a
 * plain stack. Every beat is always fully visible text: only the marker and emphasis move.
 */
export function StoryScroll({ beats }: { beats: StoryBeat[] }) {
  const [activeBeat, setActiveBeat] = useState(0);
  const beatRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveBeat(Number((entry.target as HTMLElement).dataset.beat));
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    for (const el of beatRefs.current) if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const era = beats[activeBeat]?.era ?? 0;

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-6">
        <div className="lg:sticky lg:top-28">
          <LayeredArt era={era} />
          <ol aria-label="Timeline" className="relative mt-6 grid grid-cols-3">
            <span
              aria-hidden="true"
              className="bg-navy-700 absolute top-[7px] right-[16.66%] left-[16.66%] h-0.5"
            >
              <span
                className="bg-signal-400 block h-full origin-left transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none"
                style={{ transform: `scaleX(${era / (ERAS.length - 1)})` }}
              />
            </span>
            {ERAS.map((label, index) => (
              <li
                key={label}
                aria-current={index === era ? "step" : undefined}
                className="relative flex flex-col items-center gap-2 text-center"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "size-4 rounded-full border-2 transition-colors duration-300",
                    index <= era
                      ? "border-signal-400 bg-signal-400"
                      : "border-navy-700 bg-navy-900",
                  )}
                />
                <span
                  className={cn(
                    "text-[0.75rem] font-bold tracking-[0.12em] uppercase transition-colors duration-300",
                    index === era ? "text-signal-400" : "text-sand-200",
                  )}
                >
                  {label}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="lg:col-span-6">
        {beats.map((beat, index) => (
          <div
            key={index}
            ref={(el) => {
              beatRefs.current[index] = el;
            }}
            data-beat={index}
            className="flex py-4 lg:min-h-[48vh] lg:items-center lg:py-0"
          >
            <div
              className={cn(
                "border-l-4 pl-5 transition-[border-color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                index === activeBeat
                  ? "border-signal-400 lg:translate-x-0"
                  : "border-navy-700 lg:translate-x-2",
              )}
            >
              <p className="manifest-index text-kraft-400 mb-2">{ERAS[beat.era]}</p>
              {beat.body}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
