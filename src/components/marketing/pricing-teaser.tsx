"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { business } from "@/config/business";
import { defaultPricingSettings } from "@/config/pricing-defaults";
import { calculateQuote } from "@/lib/pricing";
import type { PropertySize } from "@/types/pricing";

const sizeOptions: { value: PropertySize; label: string }[] = [
  { value: "studio", label: "Studio / few boxes" },
  { value: "1bed", label: "1 bedroom" },
  { value: "2bed", label: "2 bedroom" },
  { value: "3bed", label: "3 bedroom" },
  { value: "4plus", label: "4+ bedroom" },
  { value: "office", label: "Small office" },
];

/**
 * A rough, no-address-needed estimate using calculateQuote() directly.
 * Assumes easy access on both ends and a short trip. The full /quote flow
 * asks for real addresses and access details for an accurate range.
 */
export function PricingTeaser() {
  const [size, setSize] = useState<PropertySize>("2bed");

  const estimate = useMemo(
    () =>
      calculateQuote(
        {
          propertySize: size,
          pickupAccess: { flightsOfStairsNoLift: 0, longCarry: false },
          dropoffAccess: { flightsOfStairsNoLift: 0, longCarry: false },
          travelMinutes: 15,
        },
        defaultPricingSettings,
      ),
    [size],
  );

  return (
    <section className="bg-secondary/30 py-16">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold tracking-tight">
          {business.hourlyRateDisplay}. {business.minimumHours} hour minimum. No surprises.
        </h2>
        <p className="text-muted-foreground mt-2">
          Every quote is a real range, worked out from the actual job. Try a rough number below, or
          get an exact estimate with your addresses.
        </p>

        <div className="border-border bg-card mx-auto mt-8 flex max-w-md flex-col items-center gap-4 rounded-lg border p-6">
          <div className="flex w-full items-center gap-3">
            <label htmlFor="teaser-size" className="text-foreground text-sm font-medium">
              Moving a
            </label>
            <Select value={size} onValueChange={(value) => setSize(value as PropertySize)}>
              <SelectTrigger id="teaser-size" className="flex-1">
                <SelectValue>
                  {(value: PropertySize) =>
                    sizeOptions.find((option) => option.value === value)?.label
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {sizeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <p className="text-foreground text-3xl font-semibold">
            ${estimate.priceLowCents / 100} to ${estimate.priceHighCents / 100}
          </p>
          <p className="text-muted-foreground text-xs">
            Rough estimate assuming easy access and a short trip. Your actual range depends on your
            real addresses and access.
          </p>

          <Button render={<Link href="/quote" />} nativeButton={false} className="w-full">
            Get my exact estimate
          </Button>
        </div>
      </div>
    </section>
  );
}
