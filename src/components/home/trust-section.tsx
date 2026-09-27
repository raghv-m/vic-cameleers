import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { MeasureRule } from "@/components/brand/signage";
import { Photo } from "@/components/brand/photo";
import { business } from "@/config/business";

/**
 * "Why should I trust you?" answered as the questions people actually ask before handing over
 * their home, each with an answer the business can back today. Anything not yet confirmed
 * (insurance, reviews, a job count, years operating, response times) simply isn't here; the
 * insurance line appears on its own once business.claims.isFullyInsured is true with detail.
 */

const ABN_LOOKUP = `https://abr.business.gov.au/ABN/View?abn=${business.abn.replace(/\s/g, "")}`;

export function TrustSection() {
  const questions: { q: string; a: React.ReactNode }[] = [
    {
      q: "Are you a real business?",
      a: (
        <>
          Yes. Registered in Australia, ABN {business.abn}, ACN {business.acn}, based in{" "}
          {business.baseSuburb}.{" "}
          <a
            href={ABN_LOOKUP}
            target="_blank"
            rel="noreferrer"
            className="text-terracotta-600 inline-flex items-center gap-1 font-semibold underline decoration-2 underline-offset-4"
          >
            Check us on ABN Lookup
            <ExternalLink className="size-3.5" aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </>
      ),
    },
    {
      q: "Will you actually turn up?",
      a: "You get a reference number when you ask for a quote, a booking confirmation once we lock in the date, and reminders 7 days and 1 day before. A truck and crew are assigned to your booking.",
    },
    {
      q: "What will it really cost?",
      a: (
        <>
          {business.hourlyRateDisplay}, {business.minimumHours} hour minimum, plus a{" "}
          {business.calloutMinutes} minute call-out that&apos;s already in every estimate. You pay
          for actual time. If something on the day changes the job, we talk it through before it
          changes the price.{" "}
          <Link
            href="/pricing"
            className="text-terracotta-600 font-semibold underline decoration-2 underline-offset-4"
          >
            See the maths
          </Link>
        </>
      ),
    },
    {
      q: "Will my furniture be looked after?",
      a: "Furniture is wrapped in blankets and strapped in the truck on every job. Beds and flat-pack can be taken apart and rebuilt if you ask. Tell us about anything fragile or awkward before the day.",
    },
    ...(business.claims.isFullyInsured && business.claims.insuranceDetail
      ? [{ q: "Are you insured?", a: business.claims.insuranceDetail }]
      : []),
    {
      q: "What if plans change?",
      a: (
        <>
          Call us as early as you can and we&apos;ll find a new date.{" "}
          <Link
            href="/cancellation-policy"
            className="text-terracotta-600 font-semibold underline decoration-2 underline-offset-4"
          >
            Our cancellation policy
          </Link>{" "}
          sets out how it works.
        </>
      ),
    },
    {
      q: "Who do I talk to?",
      a: (
        <>
          The crew, direct, on{" "}
          <a
            href={`tel:${business.phoneE164}`}
            className="text-navy-900 tabular font-semibold underline decoration-2 underline-offset-4"
          >
            {business.phoneDisplay}
          </a>
          . No call centre in between.
        </>
      ),
    },
  ];

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-4">
        <dl className="border-navy-900 grid grid-cols-2 border-2">
          {[
            { value: "2", label: "Trucks, 6t and 10t" },
            { value: `${business.crewSize}`, label: "Movers on the crew" },
            {
              value: business.hourlyRateShort.replace("/hr", ""),
              label: "Per hour, shown upfront",
            },
            { value: `${business.minimumHours} hr`, label: "Minimum charge" },
          ].map((metric, index) => (
            <div
              key={metric.label}
              className={`border-navy-900 flex flex-col-reverse p-4 ${index % 2 === 0 ? "border-r-2" : ""} ${index < 2 ? "border-b-2" : ""}`}
            >
              <dt className="text-muted-600 mt-2 text-sm font-semibold">{metric.label}</dt>
              <dd className="font-stencil text-navy-900 text-5xl leading-none">{metric.value}</dd>
            </div>
          ))}
        </dl>
        <MeasureRule className="text-navy-900/40 mt-4" />
        <Photo
          id="gear"
          sizes="(min-width: 1024px) 30vw, 100vw"
          ratio="3 / 2"
          className="mt-4"
          roller
        />
      </div>

      <dl className="divide-navy-900/20 border-navy-900 divide-y border-t-2 lg:col-span-8">
        {questions.map((item) => (
          <div
            key={item.q}
            className="vc-reveal grid gap-2 py-5 sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-8"
          >
            <dt className="text-navy-900 text-lg font-bold">{item.q}</dt>
            <dd className="text-ink-900 text-base leading-relaxed">{item.a}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
