"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CalendarCheck, Check, ClipboardList, PackageOpen, Truck } from "lucide-react";
import { cn } from "cn";

import { business } from "@/config/business";

/**
 * How a move works, drawn as four stops on one route. Every step and deliverable describes what
 * actually happens, including the emails the system really sends.
 *
 * Desktop: an interactive stepper (ARIA tabs). It advances every 6 seconds while on screen, pauses
 * while hovered or focused, and stops for good once someone picks a step. Phones and reduced
 * motion: the full route as a list, nothing moving on its own.
 */
const STOPS = [
  {
    title: "Tell us what's moving",
    detail:
      "Get an estimate online in a couple of minutes, or call us. Tell us about stairs, lifts and parking so the range is right.",
    meta: "You get a reference number",
    icon: ClipboardList,
    deliverables: [
      "Instant estimate online, or over the phone",
      "Reference number emailed straight away",
    ],
  },
  {
    title: "We plan the move",
    detail:
      "We confirm the date, the truck and the crew by phone or SMS, then send a booking confirmation, and reminders 7 days and 1 day out.",
    meta: "Truck and crew assigned",
    icon: CalendarCheck,
    deliverables: [
      "Truck and crew assigned to your booking",
      "Booking confirmation by email",
      "Reminder 7 days out",
      "Reminder 1 day out",
    ],
  },
  {
    title: "The crew loads and drives",
    detail:
      "Furniture gets blankets and straps. Beds and flat-pack come apart if you've asked. You pay for the time the job actually takes.",
    meta: `${business.hourlyRateShort}, ${business.minimumHours} hr minimum`,
    icon: Truck,
    deliverables: [
      "Blankets and straps on furniture",
      "Beds and flat-pack taken apart if you ask",
      "Charged on actual time",
    ],
  },
  {
    title: "Unloaded where you want it",
    detail:
      "Boxes go into the rooms they're labelled for and furniture is placed, not dumped by the door. Then we settle up on actual time.",
    meta: "Settled on actual time",
    icon: PackageOpen,
    deliverables: [
      "Boxes into the rooms they're labelled for",
      "Furniture placed, not left by the door",
      "Settle up on actual time",
    ],
  },
];

const ADVANCE_MS = 6000;

function StopMarker({ index, active }: { index: number; active?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "font-stencil border-navy-900 relative z-10 grid size-11 place-items-center rounded-full border-2 text-xl leading-none transition-colors duration-300",
        active ? "bg-navy-900 text-signal-400" : "bg-sand-50 text-navy-900",
      )}
    >
      {String(index + 1).padStart(2, "0")}
    </span>
  );
}

/** Phones and reduced motion: every stop visible, the route drawn in on scroll. */
function RouteList({ className }: { className?: string }) {
  return (
    <ol className={cn("relative grid gap-10", className)}>
      <svg
        aria-hidden="true"
        className="text-kraft-400 absolute top-[22px] bottom-[22px] left-[21px] w-2"
        viewBox="0 0 2 100"
        preserveAspectRatio="none"
        fill="none"
      >
        <line
          x1="1"
          y1="0"
          x2="1"
          y2="100"
          pathLength={1}
          stroke="currentColor"
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
          className="vc-route-draw"
        />
      </svg>
      {STOPS.map((stop, index) => (
        <li key={stop.title} className="relative grid grid-cols-[44px_1fr] gap-4">
          <StopMarker index={index} />
          <div className="vc-reveal">
            <h3 className="text-navy-900 text-xl font-bold">
              <span className="sr-only">Step {index + 1}: </span>
              {stop.title}
            </h3>
            <p className="text-muted-600 mt-2 text-[0.9375rem] leading-relaxed">{stop.detail}</p>
            <ul className="mt-3 space-y-1.5">
              {stop.deliverables.map((item) => (
                <li key={item} className="text-ink-900 flex gap-2 text-[0.9375rem]">
                  <Check className="text-success-700 mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ol>
  );
}

function RouteStepper() {
  const baseId = useId();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [inView, setInView] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reads a media query that only exists in the browser
      setStopped(true);
      return;
    }
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(Boolean(entry?.isIntersecting)),
      {
        threshold: 0.5,
      },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const running = inView && !paused && !stopped;

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => setActive((i) => (i + 1) % STOPS.length), ADVANCE_MS);
    return () => window.clearTimeout(timer);
  }, [running, active]);

  function choose(index: number) {
    setStopped(true);
    setActive(index);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const next = (active + (event.key === "ArrowRight" ? 1 : STOPS.length - 1)) % STOPS.length;
    choose(next);
    document.getElementById(`${baseId}-tab-${next}`)?.focus();
  }

  const stop = STOPS[active]!;
  const Icon = stop.icon;

  return (
    <div
      ref={rootRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div role="tablist" aria-label="Steps of a move" className="relative grid grid-cols-4 gap-6">
        {/* The route, filling up to the active stop. It runs from the first marker's centre to the
            last one's: with 4 columns and 1.5rem gaps, that's one column width minus 22px short
            of the right edge. */}
        <div
          aria-hidden="true"
          className="absolute top-[14px] right-[calc((100%-4.5rem)/4-22px)] left-[22px] h-4"
        >
          {/* SVG route: dashed road ahead, solid line drawn up to the active stop (stroke offset). */}
          <svg
            className="absolute inset-0 h-full w-full overflow-visible"
            viewBox="0 0 100 16"
            preserveAspectRatio="none"
          >
            <line
              x1="0"
              y1="8"
              x2="100"
              y2="8"
              stroke="var(--color-kraft-400)"
              strokeWidth="3"
              strokeDasharray="2 6"
              vectorEffect="non-scaling-stroke"
            />
            <line
              x1="0"
              y1="8"
              x2="100"
              y2="8"
              pathLength={1}
              stroke="var(--color-terracotta-600)"
              strokeWidth="3"
              strokeDasharray="1 1"
              strokeDashoffset={1 - active / (STOPS.length - 1)}
              // No non-scaling-stroke here: it would measure the dash in screen pixels instead of
              // pathLength. A horizontal line's width isn't stretched by the x-only scaling anyway.
              className="transition-[stroke-dashoffset] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none"
            />
          </svg>
          {/* a small truck driving to the active stop */}
          <span
            className="absolute -top-[34px] transition-[left] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none"
            style={{ left: `calc(${(active / (STOPS.length - 1)) * 100}% - 10px)` }}
          >
            <Truck className="text-navy-900 size-5" strokeWidth={2.25} />
          </span>
        </div>
        {STOPS.map((item, index) => {
          const selected = index === active;
          return (
            <button
              key={item.title}
              id={`${baseId}-tab-${index}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => choose(index)}
              onKeyDown={onKeyDown}
              className="group flex flex-col items-start gap-4 text-left"
            >
              <StopMarker index={index} active={index <= active} />
              <span
                className={cn(
                  "text-lg leading-snug font-bold transition-colors duration-200",
                  selected ? "text-navy-900" : "text-muted-600 group-hover:text-navy-900",
                )}
              >
                {item.title}
              </span>
              {/* countdown to the next stop */}
              <span
                aria-hidden="true"
                className="bg-navy-900/10 block h-1 w-full overflow-hidden rounded-full"
              >
                {selected && (
                  <span
                    // Remounts on resume so the bar restarts in step with the 6s timer.
                    key={`${active}-${running}-${stopped}`}
                    className={cn(
                      "bg-navy-900 block h-full origin-left",
                      stopped ? "scale-x-100" : "vc-countdown",
                    )}
                    style={{
                      animationDuration: `${ADVANCE_MS}ms`,
                      animationPlayState: running ? "running" : "paused",
                    }}
                  />
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${active}`}
        className="border-navy-900 bg-sand-50 shadow-crate mt-8 grid grid-cols-12 gap-8 rounded-sm border-2 p-6 lg:p-8"
      >
        <div key={active} className="vc-panel-in col-span-7">
          <p className="manifest-index text-terracotta-600">
            Stop {String(active + 1).padStart(2, "0")} of {String(STOPS.length).padStart(2, "0")}
          </p>
          <h3 className="font-headline text-navy-900 display-md mt-2">{stop.title}</h3>
          <p className="text-ink-900 mt-3 max-w-[52ch] text-[1.0625rem] leading-relaxed">
            {stop.detail}
          </p>
          <p className="manifest-index text-muted-600 mt-4">{stop.meta}</p>
        </div>
        <div key={`list-${active}`} className="vc-panel-in col-span-5">
          <div className="bg-navy-900 text-signal-400 grid size-14 place-items-center rounded-sm">
            <Icon className="size-7" aria-hidden="true" />
          </div>
          <ul className="mt-5 space-y-2.5">
            {stop.deliverables.map((item, index) => (
              <li
                key={item}
                className="vc-tick text-navy-900 flex gap-2.5 font-semibold"
                style={{ animationDelay: `${120 + index * 90}ms` }}
              >
                <Check className="text-success-700 mt-0.5 size-5 shrink-0" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function ProcessRoute() {
  return (
    <>
      <RouteList className="md:hidden" />
      <div className="hidden md:block">
        <RouteStepper />
      </div>
    </>
  );
}
