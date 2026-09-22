import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { business } from "@/config/business";
import { calculateQuote } from "@/lib/pricing";
import { getPricingSettings } from "@/lib/pricing-settings";
import type { PricingInput } from "@/types/pricing";

export const metadata: Metadata = {
  title: "Pricing",
  description: `${business.tradingName} pricing: ${business.hourlyRateDisplay}, ${business.minimumHours} hour minimum, no surprises. See worked examples.`,
};

function formatCents(cents: number): string {
  return `$${Math.round(cents / 100)}`;
}

const worked: { label: string; description: string; input: PricingInput }[] = [
  {
    label: "1 bedroom apartment",
    description: "Ground floor to ground floor, no stairs.",
    input: {
      propertySize: "1bed",
      pickupAccess: { flightsOfStairsNoLift: 0, longCarry: false },
      dropoffAccess: { flightsOfStairsNoLift: 0, longCarry: false },
      travelMinutes: 20,
    },
  },
  {
    label: "2 bedroom apartment, with packing",
    description: "Third floor, no lift, full packing service for both bedrooms.",
    input: {
      propertySize: "2bed",
      pickupAccess: { flightsOfStairsNoLift: 3, longCarry: false },
      dropoffAccess: { flightsOfStairsNoLift: 0, longCarry: false },
      travelMinutes: 20,
      extras: { packingBedrooms: 2 },
    },
  },
  {
    label: "3 bedroom house",
    description: "Standard house to house, single storey both ends.",
    input: {
      propertySize: "3bed",
      pickupAccess: { flightsOfStairsNoLift: 0, longCarry: false },
      dropoffAccess: { flightsOfStairsNoLift: 0, longCarry: false },
      travelMinutes: 20,
    },
  },
];

export default async function PricingPage() {
  const settings = await getPricingSettings();
  const examples = worked.map((example) => ({
    ...example,
    result: calculateQuote(example.input, settings),
  }));

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">Simple, transparent pricing</h1>
        <p className="text-muted-foreground mt-2">
          One hourly rate. No hidden fees. No surprise invoice.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-lg border p-6 text-center">
          <p className="text-3xl font-semibold">{business.hourlyRateDisplay}</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Hourly rate{settings.gstInclusive ? ", GST included" : ""}
          </p>
        </div>
        <div className="rounded-lg border p-6 text-center">
          <p className="text-3xl font-semibold">{business.minimumHours} hours</p>
          <p className="text-muted-foreground mt-1 text-sm">Minimum charge, every job</p>
        </div>
        <div className="rounded-lg border p-6 text-center">
          <p className="text-3xl font-semibold">{business.calloutMinutes} min</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Call-out fee, charged at the hourly rate, included in every estimate
          </p>
        </div>
      </div>

      <div className="mt-12 space-y-4 text-sm">
        <h2 className="font-heading text-xl font-medium">What&apos;s included</h2>
        <p className="text-muted-foreground">
          Our crew and truck, ready to load and unload. Packing, unpacking, and furniture
          disassembly are optional extras, shown separately when you get your estimate. There&apos;s
          no separate stair fee, but access affects how long a job takes, which affects the total.
        </p>
      </div>

      <div className="mt-12">
        <h2 className="font-heading text-xl font-medium">Worked examples</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Real numbers from our current rates, not made-up examples. Your actual estimate depends on
          your specific move, get one on the{" "}
          <Link href="/quote" className="text-primary hover:underline">
            quote page
          </Link>
          .
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {examples.map((example) => (
            <Card key={example.label}>
              <CardHeader>
                <CardTitle className="text-base">{example.label}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="text-muted-foreground">{example.description}</p>
                <p className="text-xl font-semibold">
                  {formatCents(example.result.priceLowCents)}&ndash;
                  {formatCents(example.result.priceHighCents)}
                </p>
                <p className="text-muted-foreground text-xs">
                  {example.result.lowHours.toFixed(1)}&ndash;{example.result.highHours.toFixed(1)}{" "}
                  hours, {example.result.recommendedCrewCount} movers,{" "}
                  {example.result.recommendedTruck === "SIX_TONNE" ? "6 tonne" : "10 tonne"} truck
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-12 text-center">
        <Button size="lg" render={<Link href="/quote" />} nativeButton={false}>
          Get my exact quote
        </Button>
      </div>
    </div>
  );
}
