import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { MeasureRule } from "@/components/brand/signage";
import { Photo } from "@/components/brand/photo";
import { TrustQuestions, type TrustQuestion } from "@/components/home/trust-questions";
import { CountUp } from "@/components/motion/count-up";
import { business } from "@/config/business";

/**
 * "Why should I trust you?" answered as the questions people actually ask before handing over
 * their home, each with an answer the business can back today. Anything not yet confirmed
 * (insurance, reviews, a job count, years operating, response times) simply isn't here; the
 * insurance line appears on its own once business.claims.isFullyInsured is true with detail.
 */

const ABN_LOOKUP = `https://abr.business.gov.au/ABN/View?abn=${business.abn.replace(/\s/g, "")}`;

export function TrustSection() {
  const questions: TrustQuestion[] = [
    {
      q: "Are you a real business?",
      topic: "Reliability",
      text: `Registered in Australia ABN ${business.abn} ACN ${business.acn} ${business.baseSuburb} ABN Lookup`,
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
      topic: "Reliability",
      text: "reference number booking confirmation reminders 7 days 1 day truck crew assigned",
      a: "You get a reference number when you ask for a quote, a booking confirmation once we lock in the date, and reminders 7 days and 1 day before. A truck and crew are assigned to your booking.",
    },
    {
      q: "What will it really cost?",
      topic: "Pricing",
      text: `${business.hourlyRateDisplay} hourly rate price minimum hours call-out actual time maths estimate`,
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
      topic: "Care",
      text: "furniture blankets straps beds flat-pack disassembly fragile awkward damage",
      a: "Furniture is wrapped in blankets and strapped in the truck on every job. Beds and flat-pack can be taken apart and rebuilt if you ask. Tell us about anything fragile or awkward before the day.",
    },
    ...(business.claims.isFullyInsured && business.claims.insuranceDetail
      ? [
          {
            q: "Are you insured?",
            topic: "Care" as const,
            text: `insurance insured ${business.claims.insuranceDetail}`,
            a: business.claims.insuranceDetail,
          },
        ]
      : []),
    {
      q: "What if plans change?",
      topic: "Changes",
      text: "reschedule new date cancel cancellation policy change plans",
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
      topic: "Contact",
      text: `phone call crew direct ${business.phoneDisplay} no call centre`,
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
              <dd className="font-headline text-navy-900 text-5xl leading-none">
                <CountUp value={metric.value} />
              </dd>
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

      <div className="lg:col-span-8">
        <TrustQuestions questions={questions} />
      </div>
    </div>
  );
}
