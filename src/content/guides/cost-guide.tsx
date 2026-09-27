import Link from "next/link";

import { GuideH2, GuideList, GuideP } from "@/components/guides/guide-elements";
import { QuoteEstimator } from "@/components/quote/quote-estimator";
import { business } from "@/config/business";
import { allSuburbs } from "@/content/suburbs";
import { defaultPricingSettings } from "@/config/pricing-defaults";
import { calculateQuote } from "@/lib/pricing";
import type { PropertySize } from "@/types/pricing";
import type { Guide } from "./types";

const truckLabel = { SIX_TONNE: "6 tonne", TEN_TONNE: "10 tonne" } as const;

/**
 * Example estimates from the real pricing engine at the seeded rates, with easy access at both
 * ends and a 20 minute drive. Labelled as estimates, not past jobs: real job prices go here once
 * the business has them (TODO(owner), SEO report "worked price table from their own jobs").
 */
const EXAMPLE_SIZES: { size: PropertySize; label: string }[] = [
  { size: "singleItem", label: "A single item" },
  { size: "studio", label: "Studio" },
  { size: "1bed", label: "1 bedroom" },
  { size: "2bed", label: "2 bedroom" },
  { size: "3bed", label: "3 bedroom" },
  { size: "4plus", label: "4+ bedroom" },
  { size: "office", label: "Small office" },
];

function dollars(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-AU")}`;
}

function ExampleTable() {
  const rows = EXAMPLE_SIZES.map(({ size, label }) => ({
    label,
    result: calculateQuote(
      {
        propertySize: size,
        pickupAccess: { flightsOfStairsNoLift: 0, longCarry: false },
        dropoffAccess: { flightsOfStairsNoLift: 0, longCarry: false },
        travelMinutes: 20,
      },
      defaultPricingSettings,
    ),
  }));

  return (
    <div className="mt-4">
      <table className="w-full text-left text-sm tabular-nums">
        <caption className="text-muted-foreground mb-2 text-left text-xs">
          Estimates at our current rates, easy access at both ends and about a 20 minute drive. Not
          past jobs.
        </caption>
        <thead>
          <tr className="border-b">
            <th scope="col" className="py-2 pr-4 font-medium">
              Home size
            </th>
            <th scope="col" className="py-2 pr-4 font-medium">
              Truck and crew
            </th>
            <th scope="col" className="hidden py-2 pr-4 font-medium sm:table-cell">
              Hours
            </th>
            <th scope="col" className="py-2 font-medium">
              Estimate
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ label, result }) => (
            <tr key={label} className="border-b last:border-0">
              <th scope="row" className="py-2 pr-4 font-normal">
                {label}
              </th>
              <td className="text-muted-foreground py-2 pr-4">
                {truckLabel[result.recommendedTruck]}, {result.recommendedCrewCount} movers
              </td>
              <td className="text-muted-foreground hidden py-2 pr-4 sm:table-cell">
                {result.lowHours.toFixed(1)} to {result.highHours.toFixed(1)}
              </td>
              <td className="py-2 whitespace-nowrap">
                {result.priceLowCents === result.priceHighCents
                  ? dollars(result.priceLowCents)
                  : `${dollars(result.priceLowCents)} to ${dollars(result.priceHighCents)}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Body() {
  return (
    <>
      <GuideP>
        The honest answer is that it depends on how much you&apos;re moving, how easy both homes are
        to get in and out of, and how far apart they are. But none of that is a mystery. Once you
        know how removalists work out a price, you can get a good idea of your number before you
        ring anyone. Here&apos;s how it works, with our own rates and maths.
      </GuideP>

      <GuideH2>How removalists in Melbourne charge</GuideH2>
      <GuideP>
        Most Melbourne removalists, us included, charge by the hour for a truck and crew, with a
        minimum number of hours and a call-out fee to cover getting the truck to you. Some quote a
        fixed price instead, which we cover further down.
      </GuideP>
      <GuideP>
        Our rate is {business.hourlyRateDisplay} with a {business.minimumHours} hour minimum, and a{" "}
        {business.calloutMinutes} minute call-out charged at the same rate. The call-out is included
        in every estimate we give you, so it&apos;s never a surprise on the day. Bigger homes get
        the 10 tonne truck and an extra mover or two, which is why the price per hour climbs for
        three bedrooms and up.
      </GuideP>

      <GuideH2>Example prices by home size</GuideH2>
      <GuideP>
        These come straight from the pricing engine behind our quote form, for a straightforward
        move: no stairs, the truck parked close to the door, and about a 20 minute drive between the
        two homes.
      </GuideP>
      <ExampleTable />

      <GuideH2>Try your own numbers</GuideH2>
      <GuideP>
        Change the size, add stairs or packing, and watch the range move. It&apos;s the same maths
        our quote form uses, just without your addresses.
      </GuideP>
      <div className="mt-4">
        <QuoteEstimator
          settings={defaultPricingSettings}
          suburbNames={allSuburbs.map((suburb) => suburb.name)}
        />
      </div>

      <GuideH2>What changes the price</GuideH2>
      <GuideList
        items={[
          "How much you're moving. More bedrooms means more to carry, and a bigger truck and crew.",
          "Stairs. Every flight without a lift adds carrying time, at both the old place and the new one.",
          "Parking. If the truck can't park close to the door, a long carry adds time. Keep a spot clear on the day if you can.",
          "The drive between addresses. The time on the road between your two homes is part of the job.",
          "How ready you are. Boxes packed, sealed and labelled load in seconds. Loose items and half-packed rooms slow everything down.",
          "Extras. Packing, unpacking, and taking apart and putting back together beds or wardrobes all add time, and they're shown separately in your estimate.",
        ]}
      />

      <GuideH2>Hourly or fixed price?</GuideH2>
      <GuideP>
        With a fixed price you know the number upfront, but the mover has to build in a buffer in
        case the job runs long, and you pay that buffer whether you need it or not. With an hourly
        rate you pay for the time the job actually takes. If it goes smoothly, it costs less. The
        trade-off is less certainty, which is why we always give you a range worked out from your
        real move. We&apos;ve written more about this in{" "}
        <Link href="/guides/hourly-vs-fixed-price-removalists">hourly rate vs fixed price</Link>.
      </GuideP>

      <GuideH2>How to keep the cost down</GuideH2>
      <GuideList
        items={[
          "Pack everything before the crew arrives, and label boxes by room.",
          "Take apart flat-pack furniture yourself if you're handy with an Allen key.",
          "Sort out parking at both ends so the truck can get close.",
          "Book the lift or loading bay if you're in an apartment.",
          "Sell or donate what you don't need before moving day, not after.",
        ]}
      />

      <GuideP>
        For a real range based on your addresses and access, get a{" "}
        <Link href="/quote">free quote</Link> in a couple of minutes, or see what&apos;s included in
        our <Link href="/services/house-removals">house removals</Link> and full{" "}
        <Link href="/pricing">pricing breakdown</Link>.
      </GuideP>
    </>
  );
}

export const costGuide: Guide = {
  slug: "how-much-does-a-removalist-cost",
  title: "How much does a removalist cost in Melbourne?",
  description:
    "Example prices by home size, a calculator to try your own move, and what actually changes the price, from a Cranbourne removalist crew at $120/hour.",
  publishedAt: "2026-09-26",
  relatedService: "house-removals",
  Body,
};
