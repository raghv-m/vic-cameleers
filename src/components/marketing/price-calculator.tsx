"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { defaultPricingSettings } from "@/config/pricing-defaults";
import { calculateQuote } from "@/lib/pricing";
import type { PropertySize } from "@/types/pricing";

const sizeOptions: { value: PropertySize; label: string }[] = [
  { value: "singleItem", label: "A single item" },
  { value: "studio", label: "Studio / few boxes" },
  { value: "1bed", label: "1 bedroom" },
  { value: "2bed", label: "2 bedroom" },
  { value: "3bed", label: "3 bedroom" },
  { value: "4plus", label: "4+ bedroom" },
  { value: "office", label: "Small office" },
];

const stairsOptions = [
  { value: "0", label: "No stairs, or a lift" },
  { value: "1", label: "1 flight of stairs" },
  { value: "2", label: "2 flights of stairs" },
  { value: "3", label: "3 flights of stairs" },
];

/** Bedrooms to pack for each size; sizes without bedrooms can't add the packing extra. */
const BEDROOMS: Partial<Record<PropertySize, number>> = {
  studio: 1,
  "1bed": 1,
  "2bed": 2,
  "3bed": 3,
  "4plus": 4,
};

const truckLabel = { SIX_TONNE: "6 tonne truck", TEN_TONNE: "10 tonne truck" } as const;

/**
 * A quick, no-address estimate straight from the real pricing engine (src/lib/pricing.ts) at
 * the seeded rates, assuming about a 20 minute drive between addresses. The full /quote flow
 * asks for the real details.
 */
export function PriceCalculator({ id = "calculator" }: { id?: string }) {
  const [size, setSize] = useState<PropertySize>("2bed");
  const [stairs, setStairs] = useState("0");
  const [packing, setPacking] = useState(false);

  const estimate = useMemo(
    () =>
      calculateQuote(
        {
          propertySize: size,
          pickupAccess: { flightsOfStairsNoLift: Number(stairs), longCarry: false },
          dropoffAccess: { flightsOfStairsNoLift: 0, longCarry: false },
          travelMinutes: 20,
          extras: packing ? { packingBedrooms: BEDROOMS[size] ?? 0 } : undefined,
        },
        defaultPricingSettings,
      ),
    [size, stairs, packing],
  );

  const canPack = BEDROOMS[size] !== undefined;

  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor={`${id}-size`} className="text-sm font-medium">
            What are you moving?
          </label>
          <Select value={size} onValueChange={(value) => value && setSize(value as PropertySize)}>
            <SelectTrigger id={`${id}-size`} className="w-full">
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
        <div className="space-y-1.5">
          <label htmlFor={`${id}-stairs`} className="text-sm font-medium">
            Stairs at the pickup
          </label>
          <Select value={stairs} onValueChange={(value) => value && setStairs(value)}>
            <SelectTrigger id={`${id}-stairs`} className="w-full">
              <SelectValue>
                {(value: string) => stairsOptions.find((option) => option.value === value)?.label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {stairsOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {canPack && (
        <label className="mt-4 flex items-center gap-2 text-sm">
          <Checkbox checked={packing} onCheckedChange={(checked) => setPacking(checked === true)} />
          Add full packing for every bedroom
        </label>
      )}

      <p className="mt-6 text-3xl font-semibold tabular-nums" aria-live="polite">
        ${(estimate.priceLowCents / 100).toLocaleString("en-AU")}
        {estimate.priceHighCents !== estimate.priceLowCents &&
          ` to $${(estimate.priceHighCents / 100).toLocaleString("en-AU")}`}
      </p>
      <p className="text-muted-foreground mt-1 text-sm">
        About {estimate.lowHours.toFixed(1)} to {estimate.highHours.toFixed(1)} hours,{" "}
        {truckLabel[estimate.recommendedTruck]}, {estimate.recommendedCrewCount} movers, call-out
        included. Assumes about a 20 minute drive and no stairs at the drop-off.
      </p>

      <Button
        className="mt-5 w-full sm:w-auto"
        render={<Link href="/quote" />}
        nativeButton={false}
      >
        Get my exact quote
      </Button>
    </div>
  );
}
