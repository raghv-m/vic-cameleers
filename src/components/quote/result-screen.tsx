"use client";

import { CalendarPlus, Phone } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { business } from "@/config/business";
import { downloadMoveDateIcs } from "@/lib/ics";

export interface QuoteResult {
  referenceNumber: string;
  moveDate: string;
  estimate: {
    lowHours: number;
    highHours: number;
    priceLowCents: number;
    priceHighCents: number;
    recommendedTruck: "SIX_TONNE" | "TEN_TONNE";
    recommendedCrewCount: number;
  };
}

const truckLabel: Record<QuoteResult["estimate"]["recommendedTruck"], string> = {
  SIX_TONNE: "6 tonne truck",
  TEN_TONNE: "10 tonne truck",
};

export function ResultScreen({ result }: { result: QuoteResult }) {
  const { estimate } = result;

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <p className="text-primary text-sm font-medium">Reference {result.referenceNumber}</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Here&apos;s your estimate</h1>

      <div className="border-border bg-card mt-8 rounded-lg border p-6 text-left">
        <p className="text-foreground text-3xl font-semibold">
          ${estimate.priceLowCents / 100} to ${estimate.priceHighCents / 100}
        </p>
        <p className="text-muted-foreground mt-3 text-sm">
          Estimated {estimate.lowHours.toFixed(1)} to {estimate.highHours.toFixed(1)} hours with{" "}
          {estimate.recommendedCrewCount} movers and a {truckLabel[estimate.recommendedTruck]},
          including the {business.calloutMinutes} minute call-out.
        </p>
        <p className="text-muted-foreground mt-3 text-sm">
          This is a real range based on what you told us. The final price is based on actual time on
          the day, we&apos;ll confirm everything by phone or SMS before your move.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button size="lg" render={<a href={`tel:${business.phoneE164}`} />} nativeButton={false}>
          <Phone className="h-4 w-4" />
          Call us now
        </Button>
        <Button
          size="lg"
          variant="secondary"
          onClick={() =>
            downloadMoveDateIcs({
              moveDate: result.moveDate,
              referenceNumber: result.referenceNumber,
              summary: "Vic Cameleers moving day",
            })
          }
        >
          <CalendarPlus className="h-4 w-4" />
          Add to calendar
        </Button>
      </div>

      <Link href="/" className="text-primary mt-8 inline-block text-sm font-medium hover:underline">
        Back to home
      </Link>
    </div>
  );
}
