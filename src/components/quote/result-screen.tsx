"use client";

import { CalendarPlus, Phone } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { cn } from "cn";

import { ReceivedStamp } from "@/components/brand/status";
import { ConfettiLite, CopyReference } from "@/components/quote/copy-reference";
import { Odometer } from "@/components/quote/odometer";
import { Button } from "@/components/ui/button";
import { business } from "@/config/business";
import { downloadMoveDateIcs } from "@/lib/ics";

export interface QuoteResult {
  referenceNumber: string;
  moveDate: string;
  /** True when the server matched this to a request sent minutes earlier, so no new lead was made. */
  duplicate?: boolean;
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

function dollars(cents: number): string {
  return `$${Math.round(cents / 100).toLocaleString("en-AU")}`;
}

function longDate(iso: string, offsetDays = 0): string | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  const date = new Date(
    Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]) + offsetDays),
  );
  return new Intl.DateTimeFormat("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(date);
}

/** From here to moving day: what actually happens, and when (reminders only once booked). */
function timeline(moveDate: string) {
  return [
    {
      title: "Request received",
      detail: "You're here. Your reference number is above.",
      done: true,
    },
    {
      title: "We confirm the details",
      detail: "We call or text to check the job, the price and a start time.",
    },
    {
      title: "You say yes, it's booked",
      detail: "Booking confirmation by email, with your truck and crew.",
    },
    { title: "Reminder, 7 days out", detail: longDate(moveDate, -7) ?? "A week before your move." },
    { title: "Reminder, 1 day out", detail: longDate(moveDate, -1) ?? "The day before your move." },
    { title: "Moving day", detail: longDate(moveDate) ?? "Your chosen date." },
  ];
}

/**
 * After a quote request goes through. The stamp says RECEIVED, never BOOKED, and the number is
 * labelled as an estimate, with what it assumes.
 */
export function ResultScreen({ result }: { result: QuoteResult }) {
  const { estimate } = result;
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Move focus to the result so keyboard and screen reader users land on it.
  useEffect(() => headingRef.current?.focus(), []);

  const price =
    estimate.priceLowCents === estimate.priceHighCents
      ? dollars(estimate.priceLowCents)
      : `${dollars(estimate.priceLowCents)} to ${dollars(estimate.priceHighCents)}`;

  return (
    <div className="border-navy-900 bg-sand-50 shadow-crate relative rounded-sm border-2">
      {!result.duplicate && <ConfettiLite />}
      <div className="bg-navy-900 text-sand-50 flex items-center justify-between gap-3 px-5 py-2.5">
        <p className="text-[0.8125rem] font-bold tracking-[0.14em] uppercase">Consignment note</p>
        <div className="flex items-center gap-2">
          <p className="tabular text-kraft-400 text-[0.8125rem] font-bold tracking-[0.08em]">
            REF {result.referenceNumber}
          </p>
          <CopyReference reference={result.referenceNumber} />
        </div>
      </div>

      <div className="grid gap-8 p-5 sm:p-8 md:grid-cols-[1fr_auto] md:items-start">
        <div>
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="font-headline text-navy-900 display-md outline-none"
          >
            Thanks. We&apos;ve got it.
          </h2>
          {result.duplicate && (
            <p className="border-signal-400 bg-sand-100 text-ink-900 mt-4 border-l-4 px-3 py-2 text-sm">
              You sent us this same request a few minutes ago, so we&apos;ve kept the first one
              rather than making a second.
            </p>
          )}

          <p className="manifest-index text-muted-600 mt-6">Estimated price</p>
          <p className="font-headline text-terracotta-600 mt-1 text-5xl leading-none sm:text-6xl">
            <Odometer value={price} />
          </p>
          <p className="text-ink-900 mt-3 max-w-[52ch]">
            About {estimate.lowHours.toFixed(1)} to {estimate.highHours.toFixed(1)} hours with{" "}
            {estimate.recommendedCrewCount} movers and a {truckLabel[estimate.recommendedTruck]},
            including the {business.calloutMinutes} minute call-out.
          </p>
          <p className="text-muted-600 mt-2 max-w-[52ch] text-sm">
            This is an estimate from what you told us. You pay for the actual time on the day, at{" "}
            {business.hourlyRateDisplay} with a {business.minimumHours} hour minimum.
          </p>

          <h3 className="text-navy-900 mt-8 text-sm font-bold tracking-[0.12em] uppercase">
            What happens now
          </h3>
          <ol className="relative mt-4">
            {/* the route down the page, drawn as the stops appear */}
            <span
              aria-hidden="true"
              className="bg-kraft-400 vc-line-down absolute top-2 bottom-2 left-[9px] w-0.5 origin-top"
            />
            {timeline(result.moveDate).map((stop, index) => (
              <li
                key={stop.title}
                className="vc-tick relative grid grid-cols-[20px_1fr] gap-3 pb-4 last:pb-0"
                style={{ animationDelay: `${200 + index * 160}ms` }}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "vc-pin-pop relative z-10 mt-0.5 size-5 rounded-full border-2",
                    stop.done
                      ? "border-navy-900 bg-navy-900"
                      : index === 5
                        ? "border-terracotta-600 bg-terracotta-600"
                        : "border-navy-900 bg-sand-50",
                  )}
                  style={{ animationDelay: `${200 + index * 160}ms` }}
                />
                <div>
                  <p className="text-navy-900 font-bold">
                    {stop.title}
                    {stop.done && <span className="sr-only"> (done)</span>}
                  </p>
                  <p className="text-muted-600 text-sm">{stop.detail}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              render={<a href={`tel:${business.phoneE164}`} />}
              nativeButton={false}
            >
              <Phone />
              Call {business.phoneDisplay}
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() =>
                downloadMoveDateIcs({
                  moveDate: result.moveDate,
                  referenceNumber: result.referenceNumber,
                  summary: "Moving day (Vic Cameleers, to be confirmed)",
                })
              }
            >
              <CalendarPlus />
              Add date to calendar
            </Button>
          </div>
          <Link
            href="/"
            className="text-navy-900 mt-6 inline-flex min-h-11 items-center text-sm font-bold underline underline-offset-4"
          >
            Back to the homepage
          </Link>
        </div>

        <ReceivedStamp
          reference={result.referenceNumber}
          className="order-first justify-self-start md:order-none md:mt-2"
        />
      </div>
    </div>
  );
}
