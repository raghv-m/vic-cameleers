import { business } from "@/config/business";
import type { PricingResult, PricingSettings } from "@/types/pricing";

const truckLabel = { SIX_TONNE: "6 tonne truck", TEN_TONNE: "10 tonne truck" } as const;

function dollars(cents: number): string {
  return `$${Math.round(cents / 100).toLocaleString("en-AU")}`;
}

function hours(value: number): string {
  return `${Number(value.toFixed(2))} ${value === 1 ? "hour" : "hours"}`;
}

/**
 * The maths behind one estimate, line by line, from the real pricing engine's own breakdown
 * (src/lib/pricing.ts), so the example can never disagree with what the quote form charges.
 */
export function WorkedPriceExample({
  heading,
  description,
  result,
  settings,
}: {
  heading: string;
  description: string;
  result: PricingResult;
  settings: PricingSettings;
}) {
  const { assumptions } = result;
  const [baseLow, baseHigh] = assumptions.baseHoursRange;
  const workLow =
    baseLow + assumptions.accessPenaltyHours + assumptions.travelHours + assumptions.extrasHours;
  const minimumApplies = workLow < settings.minimumHours;
  const calloutCents = assumptions.calloutHours * settings.hourlyRateCents;
  const sameTotal = result.priceLowCents === result.priceHighCents;

  return (
    <div className="bg-card rounded-lg border p-6">
      <p className="text-primary text-xs font-semibold tracking-[0.14em] uppercase">
        Worked example
      </p>
      <h3 className="font-heading mt-1 text-lg font-medium">{heading}</h3>
      <p className="text-muted-foreground mt-1 text-sm">{description}</p>

      <dl className="mt-4 space-y-2 text-sm tabular-nums">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Loading and unloading</dt>
          <dd>{baseLow === baseHigh ? hours(baseLow) : `${baseLow} to ${hours(baseHigh)}`}</dd>
        </div>
        {assumptions.accessPenaltyHours > 0 && (
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Extra time for stairs and carrying</dt>
            <dd>+{hours(assumptions.accessPenaltyHours)}</dd>
          </div>
        )}
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Driving between the two addresses</dt>
          <dd>+{hours(assumptions.travelHours)}</dd>
        </div>
        {assumptions.extrasHours > 0 && (
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Packing and other extras</dt>
            <dd>+{hours(assumptions.extrasHours)}</dd>
          </div>
        )}
        {minimumApplies && (
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">
              Under the {settings.minimumHours} hour minimum, so the minimum applies
            </dt>
            <dd>{hours(settings.minimumHours)}</dd>
          </div>
        )}
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">
            Call-out, {settings.calloutMinutes} minutes at {business.hourlyRateDisplay}
          </dt>
          <dd>{dollars(calloutCents)}</dd>
        </div>
        <div className="flex justify-between gap-4 border-t pt-2 font-medium">
          <dt>Estimated total</dt>
          <dd>
            {sameTotal
              ? dollars(result.priceLowCents)
              : `${dollars(result.priceLowCents)} to ${dollars(result.priceHighCents)}`}
          </dd>
        </div>
      </dl>

      <p className="text-muted-foreground mt-3 text-xs">
        {truckLabel[result.recommendedTruck]}, {result.recommendedCrewCount} movers. An estimate at
        our current rates, rounded to the nearest $10; the final price is the actual time on the
        day.
      </p>
    </div>
  );
}
