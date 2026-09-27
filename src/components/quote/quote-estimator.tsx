"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { cn } from "cn";

import { buttonVariants } from "@/components/ui/button";
import { MeasureRule } from "@/components/brand/signage";
import { ChipGroup } from "@/components/quote/chip-group";
import { Odometer } from "@/components/quote/odometer";
import { business } from "@/config/business";
import {
  PREFILL_EVENT,
  STORE_KEYS,
  readStore,
  writeStore,
  type PrefillDetail,
} from "@/lib/browser-store";
import { calculateQuote } from "@/lib/pricing";
import type { PricingSettings, PropertySize } from "@/types/pricing";

export type MoveKind = "home" | "office" | "item";

const KIND_OPTIONS: { value: MoveKind; label: string }[] = [
  { value: "home", label: "Home" },
  { value: "office", label: "Office" },
  { value: "item", label: "Single item" },
];

const HOME_SIZES: { value: PropertySize; label: string }[] = [
  { value: "studio", label: "Studio" },
  { value: "1bed", label: "1 bed" },
  { value: "2bed", label: "2 bed" },
  { value: "3bed", label: "3 bed" },
  { value: "4plus", label: "4+ bed" },
];

const STAIR_OPTIONS = [
  { value: "0", label: "None or lift" },
  { value: "1", label: "1 flight" },
  { value: "2", label: "2 flights" },
  { value: "3", label: "3+" },
];

const BEDROOMS: Partial<Record<PropertySize, number>> = {
  studio: 1,
  "1bed": 1,
  "2bed": 2,
  "3bed": 3,
  "4plus": 4,
};

/** The drive between addresses isn't known here, so the estimate assumes this, and says so. */
const ASSUMED_DRIVE_MINUTES = 20;

const truckLabel = { SIX_TONNE: "6 tonne truck", TEN_TONNE: "10 tonne truck" } as const;

function sizeFor(kind: MoveKind, homeSize: PropertySize): PropertySize {
  if (kind === "office") return "office";
  if (kind === "item") return "singleItem";
  return homeSize;
}

function dollars(cents: number): string {
  return `$${Math.round(cents / 100).toLocaleString("en-AU")}`;
}

function todayISO(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

/** "1.5 hrs", "45 min": short and exact enough for a breakdown line. */
function formatHours(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  const rounded = Math.round(hours * 10) / 10;
  return `${rounded} hr${rounded === 1 ? "" : "s"}`;
}

const SIZE_LABEL: Record<PropertySize, string> = {
  studio: "studio",
  "1bed": "1 bedroom home",
  "2bed": "2 bedroom home",
  "3bed": "3 bedroom home",
  "4plus": "4+ bedroom home",
  office: "small office",
  singleItem: "single item or small load",
};

interface SavedEstimate {
  kind: MoveKind;
  homeSize: PropertySize;
  stairs: string;
  stairsTouched: boolean;
  packing: boolean;
  from: string;
  to: string;
  date: string;
}

/**
 * How much of the move we know about. Deliberately never claims "accurate": even with every field
 * filled, the drive time is still assumed until we check the addresses.
 */
function completeness(details: { stairsTouched: boolean; from: string; to: string; date: string }) {
  const known = [
    details.stairsTouched,
    details.from.trim() !== "",
    details.to.trim() !== "",
    details.date !== "",
  ].filter(Boolean).length;
  if (known >= 4) {
    return { level: 3, label: "Ready to confirm", hint: "That's what we need to confirm a quote." };
  }
  if (known >= 2) {
    return { level: 2, label: "Getting closer", hint: "Add your suburbs and date to firm it up." };
  }
  return {
    level: 1,
    label: "Ballpark",
    hint: "Tell us about stairs, suburbs and a date to firm it up.",
  };
}

/**
 * The hero price tool. Live estimate from the real pricing engine at the current rates (passed
 * from the server, so admin changes apply), clearly labelled as an estimate, with the confirmed
 * quote one tap away. Everything entered carries over to the quote form.
 */
export function QuoteEstimator({
  settings,
  suburbNames,
  className,
}: {
  settings: PricingSettings;
  suburbNames: string[];
  className?: string;
}) {
  const id = useId();
  const [kind, setKind] = useState<MoveKind>("home");
  const [homeSize, setHomeSize] = useState<PropertySize>("2bed");
  const [stairs, setStairs] = useState("0");
  const [packing, setPacking] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [stairsTouched, setStairsTouched] = useState(false);
  const [flash, setFlash] = useState(false);
  const restored = useRef(false);
  const detailsRef = useRef<HTMLDetailsElement>(null);

  // Restore the visitor's last estimate after mount, never during render: the page is
  // prerendered, and a render-time read would mismatch the server HTML.
  useEffect(() => {
    const saved = readStore<SavedEstimate>(STORE_KEYS.estimator);
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from localStorage, which only exists after hydration
      setKind(saved.kind);
      setHomeSize(saved.homeSize);
      setStairs(saved.stairs);
      setStairsTouched(saved.stairsTouched);
      setPacking(saved.packing);
      setFrom(saved.from);
      setTo(saved.to);
      setDate(saved.date);
      if (saved.from || saved.to || saved.date) detailsRef.current?.setAttribute("open", "");
    }
    restored.current = true;
  }, []);

  useEffect(() => {
    if (!restored.current) return;
    writeStore<SavedEstimate>(STORE_KEYS.estimator, {
      kind,
      homeSize,
      stairs,
      stairsTouched,
      packing,
      from,
      to,
      date,
    });
  }, [kind, homeSize, stairs, stairsTouched, packing, from, to, date]);

  // "Use as pickup" buttons elsewhere on the page fill the suburb fields.
  useEffect(() => {
    let timer = 0;
    function onPrefill(event: Event) {
      const detail = (event as CustomEvent<PrefillDetail>).detail;
      if (detail.from !== undefined) setFrom(detail.from);
      if (detail.to !== undefined) setTo(detail.to);
      detailsRef.current?.setAttribute("open", "");
      setFlash(true);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setFlash(false), 1400);
    }
    window.addEventListener(PREFILL_EVENT, onPrefill);
    return () => {
      window.removeEventListener(PREFILL_EVENT, onPrefill);
      window.clearTimeout(timer);
    };
  }, []);

  const size = sizeFor(kind, homeSize);
  const canPack = BEDROOMS[size] !== undefined;

  const estimate = useMemo(
    () =>
      calculateQuote(
        {
          propertySize: size,
          pickupAccess: { flightsOfStairsNoLift: Number(stairs), longCarry: false },
          dropoffAccess: { flightsOfStairsNoLift: 0, longCarry: false },
          travelMinutes: ASSUMED_DRIVE_MINUTES,
          extras: packing && canPack ? { packingBedrooms: BEDROOMS[size] ?? 0 } : undefined,
        },
        settings,
      ),
    [size, stairs, packing, canPack, settings],
  );

  const priceText =
    estimate.priceLowCents === estimate.priceHighCents
      ? dollars(estimate.priceLowCents)
      : `${dollars(estimate.priceLowCents)} to ${dollars(estimate.priceHighCents)}`;

  const known = completeness({ stairsTouched, from, to, date });
  const a = estimate.assumptions;
  const extraMovers = Math.max(0, estimate.recommendedCrewCount - 2);
  const breakdown: { label: string; value: string }[] = [
    {
      label: `Loading and unloading, ${SIZE_LABEL[size]}`,
      value: `${formatHours(a.baseHoursRange[0])} to ${formatHours(a.baseHoursRange[1])}`,
    },
    ...(a.accessPenaltyHours > 0
      ? [{ label: "Stairs at the pickup", value: `+${formatHours(a.accessPenaltyHours)}` }]
      : []),
    ...(a.extrasHours > 0 ? [{ label: "Packing", value: `+${formatHours(a.extrasHours)}` }] : []),
    { label: "Drive between addresses (assumed)", value: `+${formatHours(a.travelHours)}` },
  ];

  const quoteHref = useMemo(() => {
    const params = new URLSearchParams({ type: kind, size, stairs });
    if (packing && canPack) params.set("packing", "1");
    if (from.trim()) params.set("from", from.trim());
    if (to.trim()) params.set("to", to.trim());
    if (date) params.set("date", date);
    return `/quote?${params.toString()}`;
  }, [kind, size, stairs, packing, canPack, from, to, date]);

  return (
    <section
      aria-labelledby={`${id}-title`}
      className={cn("border-navy-900 bg-sand-50 shadow-crate rounded-sm border-2", className)}
    >
      <div className="bg-navy-900 text-sand-50 flex items-center justify-between gap-3 px-4 py-2.5 sm:px-5">
        <h2 id={`${id}-title`} className="text-[0.8125rem] font-bold tracking-[0.14em] uppercase">
          Instant estimate
        </h2>
        <span className="text-kraft-400 text-[0.75rem] font-semibold tracking-[0.08em] uppercase">
          {business.hourlyRateShort} &middot; {business.minimumHours} hr min
        </span>
      </div>

      <div className="space-y-5 p-4 sm:p-5">
        <ChipGroup
          legend="What's moving?"
          name={`${id}-kind`}
          value={kind}
          options={KIND_OPTIONS}
          onChange={setKind}
        />
        {kind === "home" && (
          <ChipGroup
            legend="Size of the home"
            name={`${id}-size`}
            value={homeSize}
            options={HOME_SIZES}
            onChange={setHomeSize}
          />
        )}
        <ChipGroup
          legend="Stairs at the pickup"
          name={`${id}-stairs`}
          value={stairs}
          options={STAIR_OPTIONS}
          onChange={(value) => {
            setStairs(value);
            setStairsTouched(true);
          }}
        />
        {canPack && (
          <label className="text-navy-900 flex min-h-11 cursor-pointer items-center gap-3 text-[0.9375rem] font-semibold">
            <input
              type="checkbox"
              checked={packing}
              onChange={(event) => setPacking(event.target.checked)}
              className="accent-navy-900 size-5"
            />
            Add packing for every room
          </label>
        )}

        <details ref={detailsRef} className="group vc-details border-border border-t pt-4">
          <summary className="text-navy-900 flex min-h-11 cursor-pointer list-none items-center justify-between text-[0.9375rem] font-semibold">
            Add suburbs and a date (optional)
            <span
              aria-hidden="true"
              className="text-terracotta-600 transition-transform duration-150 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <div
            className={cn(
              "mt-3 grid gap-3 rounded-sm transition-shadow duration-500 sm:grid-cols-2",
              flash && "ring-signal-400 ring-offset-sand-50 ring-4 ring-offset-4",
            )}
          >
            <label className="text-sm font-semibold" htmlFor={`${id}-from`}>
              Moving from
              <input
                id={`${id}-from`}
                list={`${id}-suburbs`}
                value={from}
                onChange={(event) => setFrom(event.target.value)}
                autoComplete="address-level2"
                placeholder="Suburb"
                className="border-input bg-card mt-1.5 h-11 w-full rounded-sm border px-3 text-base font-normal"
              />
            </label>
            <label className="text-sm font-semibold" htmlFor={`${id}-to`}>
              Moving to
              <input
                id={`${id}-to`}
                list={`${id}-suburbs`}
                value={to}
                onChange={(event) => setTo(event.target.value)}
                autoComplete="off"
                placeholder="Suburb"
                className="border-input bg-card mt-1.5 h-11 w-full rounded-sm border px-3 text-base font-normal"
              />
            </label>
            <label className="text-sm font-semibold sm:col-span-2" htmlFor={`${id}-date`}>
              Moving date
              <input
                id={`${id}-date`}
                type="date"
                // Set on focus, not render: the page is prerendered, so a render-time "today"
                // would be the build date.
                onFocus={(event) => {
                  event.currentTarget.min = todayISO();
                }}
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="border-input bg-card mt-1.5 h-11 w-full rounded-sm border px-3 text-base font-normal"
              />
            </label>
            <datalist id={`${id}-suburbs`}>
              {suburbNames.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
          </div>
          <p className="text-muted-600 mt-2 text-xs">
            Suburbs and date carry over to your quote request. They don&apos;t change this estimate.
          </p>
        </details>
      </div>

      <div className="border-navy-900 bg-sand-100 border-t-2 p-4 sm:p-5">
        <MeasureRule className="text-navy-900/40 mb-3" />
        <p className="text-muted-600 text-[0.75rem] font-bold tracking-[0.14em] uppercase">
          Estimated price
        </p>
        <p
          className="font-headline text-navy-900 mt-1 text-[2.75rem] leading-none sm:text-5xl"
          aria-live="polite"
        >
          <Odometer value={priceText} />
        </p>
        <p className="text-ink-900 mt-2 text-sm">
          About {estimate.lowHours.toFixed(1)} to {estimate.highHours.toFixed(1)} hours,{" "}
          {truckLabel[estimate.recommendedTruck]}, {estimate.recommendedCrewCount} movers,{" "}
          {business.calloutMinutes} minute call-out included.
        </p>

        <div className="mt-4">
          <div className="flex items-center justify-between gap-3">
            <span className="manifest-index text-muted-600">How firm is this?</span>
            <span className="text-navy-900 text-[0.8125rem] font-bold">{known.label}</span>
          </div>
          <div
            className="mt-1.5 grid grid-cols-3 gap-1"
            role="img"
            aria-label={`Estimate detail: ${known.label}, ${known.level} of 3`}
          >
            {[1, 2, 3].map((step) => (
              <span
                key={step}
                className={cn(
                  "h-1.5 rounded-full transition-colors duration-300 motion-reduce:transition-none",
                  step <= known.level ? "bg-terracotta-600" : "bg-navy-900/15",
                )}
              />
            ))}
          </div>
          <p className="text-muted-600 mt-1.5 text-xs">{known.hint}</p>
        </div>

        <details className="group vc-details border-navy-900/20 mt-4 border-t pt-2">
          <summary className="text-navy-900 flex min-h-11 cursor-pointer list-none items-center justify-between text-[0.9375rem] font-semibold">
            How we got this number
            <span
              aria-hidden="true"
              className="text-terracotta-600 transition-transform duration-150 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <dl className="text-ink-900 tabular mt-1 space-y-1.5 text-sm">
            {breakdown.map((row) => (
              <div key={row.label} className="flex justify-between gap-4">
                <dt className="text-muted-600">{row.label}</dt>
                <dd className="shrink-0 font-semibold">{row.value}</dd>
              </div>
            ))}
            <div className="border-navy-900/30 flex justify-between gap-4 border-t pt-1.5">
              <dt className="text-navy-900 font-bold">Time on the job</dt>
              <dd className="text-navy-900 shrink-0 font-bold">
                {formatHours(estimate.lowHours)} to {formatHours(estimate.highHours)}
              </dd>
            </div>
          </dl>
          <p className="text-muted-600 mt-2 text-xs leading-relaxed">
            Charged at {business.hourlyRateShort} with a {business.minimumHours} hour minimum, plus
            the {formatHours(a.calloutHours)} call-out at the same rate.
            {extraMovers > 0 &&
              ` A job this size gets ${extraMovers} extra mover${extraMovers > 1 ? "s" : ""} at ${dollars(settings.extraMoverHourlyRateCents)}/hr each.`}{" "}
            Rounded to the nearest $10.
          </p>
        </details>

        <p className="text-muted-600 mt-3 text-xs">
          Estimate only, assuming a {ASSUMED_DRIVE_MINUTES} minute drive and easy parking. Your
          confirmed quote comes after we check the addresses and access.
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href={quoteHref} className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}>
            Request a confirmed quote
            <ArrowRight data-icon="inline-end" />
          </Link>
          <a
            href={`tel:${business.phoneE164}`}
            className="text-navy-900 inline-flex min-h-11 items-center justify-center gap-2 text-[0.9375rem] font-semibold underline decoration-2 underline-offset-4 sm:justify-start"
          >
            <Phone className="size-4" aria-hidden="true" />
            or call {business.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
