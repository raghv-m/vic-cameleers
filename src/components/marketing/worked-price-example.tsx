import { cn } from "cn";

import { business } from "@/config/business";
import type { PricingResult, PricingSettings } from "@/types/pricing";

const truckLabel = { SIX_TONNE: "6 tonne truck", TEN_TONNE: "10 tonne truck" } as const;

function dollars(cents: number): string {
  return `$${Math.round(cents / 100).toLocaleString("en-AU")}`;
}

function hours(value: number): string {
  return `${Number(value.toFixed(2))} ${value === 1 ? "hr" : "hrs"}`;
}

function Line({
  label,
  value,
  strong,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  strong?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-4 py-2",
        strong && "text-navy-900 font-bold",
      )}
    >
      <dt className={strong ? undefined : "text-ink-900"}>{label}</dt>
      <dd className="tabular shrink-0 text-right">{value}</dd>
    </div>
  );
}

/**
 * One estimate laid out like an invoice, line by line, from the pricing engine's own breakdown
 * (src/lib/pricing.ts), so the example can never disagree with what the quote form works out.
 * Every line that changes the total is shown, including extra movers on bigger jobs.
 */
export function WorkedPriceExample({
  heading,
  description,
  result,
  settings,
  className,
}: {
  heading: string;
  description: string;
  result: PricingResult;
  settings: PricingSettings;
  className?: string;
}) {
  const { assumptions } = result;
  const [baseLow, baseHigh] = assumptions.baseHoursRange;
  const workLow =
    baseLow + assumptions.accessPenaltyHours + assumptions.travelHours + assumptions.extrasHours;
  const minimumApplies = workLow < settings.minimumHours;
  const calloutCents = assumptions.calloutHours * settings.hourlyRateCents;
  const extraMovers = Math.max(0, result.recommendedCrewCount - 2);
  const sameTotal = result.priceLowCents === result.priceHighCents;

  return (
    <article
      className={cn(
        "border-navy-900 bg-sand-50 shadow-crate flex flex-col rounded-sm border-2",
        className,
      )}
    >
      <header className="bg-navy-900 text-sand-50 flex items-center justify-between gap-3 px-4 py-2">
        <p className="text-[0.75rem] font-bold tracking-[0.14em] uppercase">Worked example</p>
        <p className="text-kraft-400 text-[0.75rem] font-bold tracking-[0.08em] uppercase">
          Estimate
        </p>
      </header>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-headline text-navy-900 text-2xl leading-tight">{heading}</h3>
        <p className="text-muted-600 mt-1 text-sm">{description}</p>

        <dl className="divide-navy-900/15 border-navy-900/15 mt-4 divide-y border-y text-[0.9375rem]">
          <Line
            label="Loading and unloading"
            value={baseLow === baseHigh ? hours(baseLow) : `${baseLow} to ${hours(baseHigh)}`}
          />
          {assumptions.accessPenaltyHours > 0 && (
            <Line
              label="Stairs and long carry"
              value={`+${hours(assumptions.accessPenaltyHours)}`}
            />
          )}
          <Line label="Drive between addresses" value={`+${hours(assumptions.travelHours)}`} />
          {assumptions.extrasHours > 0 && (
            <Line label="Packing and extras" value={`+${hours(assumptions.extrasHours)}`} />
          )}
          {minimumApplies && (
            <Line
              label={`Under ${settings.minimumHours} hrs, so the minimum applies`}
              value={hours(settings.minimumHours)}
            />
          )}
          <Line label="Hourly rate" value={business.hourlyRateShort} />
          {extraMovers > 0 && (
            <Line
              label={`${extraMovers === 1 ? "Extra mover" : `${extraMovers} extra movers`} at ${dollars(settings.extraMoverHourlyRateCents)}/hr each`}
              value={`+${dollars(settings.extraMoverHourlyRateCents * extraMovers)}/hr`}
            />
          )}
          <Line label={`Call-out, ${settings.calloutMinutes} min`} value={dollars(calloutCents)} />
        </dl>

        <div className="mt-auto pt-4">
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-navy-900 font-bold">Estimated total</p>
            <p className="font-headline text-terracotta-600 text-3xl leading-none">
              {sameTotal
                ? dollars(result.priceLowCents)
                : `${dollars(result.priceLowCents)} to ${dollars(result.priceHighCents)}`}
            </p>
          </div>
          <p className="text-muted-600 mt-3 text-sm">
            {truckLabel[result.recommendedTruck]}, {result.recommendedCrewCount} movers. Rounded to
            the nearest $10. You pay for the actual time on the day.
          </p>
        </div>
      </div>
    </article>
  );
}
