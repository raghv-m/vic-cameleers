"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { cn } from "cn";

import { buttonVariants } from "@/components/ui/button";
import { MeasureRule } from "@/components/brand/signage";
import { ChipGroup } from "@/components/quote/chip-group";
import { Odometer } from "@/components/quote/odometer";
import { business } from "@/config/business";
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
          onChange={setStairs}
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

        <details className="group border-border border-t pt-4">
          <summary className="text-navy-900 flex min-h-11 cursor-pointer list-none items-center justify-between text-[0.9375rem] font-semibold">
            Add suburbs and a date (optional)
            <span
              aria-hidden="true"
              className="text-terracotta-600 transition-transform duration-150 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
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
        <p className="text-navy-900 mt-1 text-[2.5rem] font-bold sm:text-5xl" aria-live="polite">
          <Odometer value={priceText} />
        </p>
        <p className="text-ink-900 mt-2 text-sm">
          About {estimate.lowHours.toFixed(1)} to {estimate.highHours.toFixed(1)} hours,{" "}
          {truckLabel[estimate.recommendedTruck]}, {estimate.recommendedCrewCount} movers,{" "}
          {business.calloutMinutes} minute call-out included.
        </p>
        <p className="text-muted-600 mt-1 text-xs">
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
