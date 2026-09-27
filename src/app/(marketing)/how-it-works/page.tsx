import type { Metadata } from "next";

import { InlineCta } from "@/components/site/inline-cta";
import { Container } from "@/components/site/layout-primitives";
import { PageHeader } from "@/components/site/page-header";
import { business } from "@/config/business";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "How a move with us works",
  path: "/how-it-works",
  description: `From a free online quote to moving day: how a move with ${business.tradingName} works. ${business.hourlyRateShort}, ${business.minimumHours} hour minimum, you pay for actual time.`,
});

const STOPS = [
  {
    title: "Tell us about your move",
    you: "Answer three short steps: where from and to, what's moving, and how to reach you. It takes a couple of minutes.",
    us: "Your request lands with a reference number, so it can't get lost.",
  },
  {
    title: "See your estimate",
    you: "Check the price range on screen. It's worked out from your job, not a generic guess.",
    us: `We show the working: base hours for the size of the place, extra time for stairs or a long carry, and the ${business.calloutMinutes} minute call-out.`,
  },
  {
    title: "Confirm the date",
    you: "Tell us if your date is fixed or flexible. A flexible date sometimes gets you in sooner.",
    us: "We call or text to confirm the details, then assign a truck and crew. You get reminders 7 days and 1 day before.",
  },
  {
    title: "Moving day",
    you: "Point to where things go. Have keys, lift bookings and parking sorted if you can.",
    us: "The crew arrives with the right truck, loads carefully, drives safely and unloads where you want things. You pay for the actual time on the job.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ name: "How it works", path: "/how-it-works" }]}
        label="From quote to moving day"
        title="Four stops. No guesswork."
        lede={
          <p>
            Here&apos;s what you do and what we do at each stage. Priced at{" "}
            {business.hourlyRateShort} with a {business.minimumHours} hour minimum, and you pay for
            actual time.
          </p>
        }
      />

      <Container className="py-14 sm:py-20">
        <ol className="relative">
          {STOPS.map((stop, index) => (
            <li
              key={stop.title}
              className="relative grid gap-4 pb-12 pl-16 last:pb-0 sm:pl-24 lg:grid-cols-12 lg:gap-10"
            >
              {index < STOPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className="border-kraft-400 absolute top-14 bottom-2 left-[1.375rem] border-l-2 border-dashed sm:left-[1.875rem]"
                />
              )}
              <span
                aria-hidden="true"
                className="font-stencil border-navy-900 bg-sand-50 text-navy-900 absolute top-0 left-0 grid size-11 place-items-center rounded-sm border-2 text-2xl leading-none sm:size-15 sm:text-3xl"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h2 className="font-headline text-navy-900 display-md lg:col-span-4">
                <span className="sr-only">Stop {index + 1}: </span>
                {stop.title}
              </h2>
              <dl className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
                <div className="border-navy-900 border-t-2 pt-3">
                  <dt className="manifest-index text-terracotta-600">You</dt>
                  <dd className="text-ink-900 mt-2">{stop.you}</dd>
                </div>
                <div className="border-navy-900 border-t-2 pt-3">
                  <dt className="manifest-index text-terracotta-600">Us</dt>
                  <dd className="text-ink-900 mt-2">{stop.us}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ol>
      </Container>

      <Container className="pb-16 sm:pb-24">
        <InlineCta />
      </Container>
    </>
  );
}
