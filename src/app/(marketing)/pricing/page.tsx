import type { Metadata } from "next";
import Link from "next/link";

import { WorkedPriceExample } from "@/components/marketing/worked-price-example";
import { QuoteEstimator } from "@/components/quote/quote-estimator";
import { InlineCta } from "@/components/site/inline-cta";
import { Container, SectionHeader } from "@/components/site/layout-primitives";
import { PageHeader } from "@/components/site/page-header";
import { business } from "@/config/business";
import { allSuburbs } from "@/content/suburbs";
import { pageMetadata } from "@/lib/seo";
import { calculateQuote } from "@/lib/pricing";
import { getPricingSettings } from "@/lib/pricing-settings";
import { FALLBACK_TRAVEL_MINUTES } from "@/lib/quote-pricing";
import type { PricingInput } from "@/types/pricing";

export const metadata: Metadata = pageMetadata({
  title: "Removalist prices Melbourne",
  price: true,
  path: "/pricing",
  description: `${business.hourlyRateShort}, ${business.minimumHours} hour minimum, ${business.calloutMinutes} minute call-out. Worked examples for real Melbourne moves using our actual rates. Get your free quote.`,
});

const worked: { label: string; description: string; input: PricingInput }[] = [
  {
    label: "1 bedroom apartment",
    description: "Ground floor to ground floor, no stairs, a 20 minute drive.",
    input: {
      propertySize: "1bed",
      pickupAccess: { flightsOfStairsNoLift: 0, longCarry: false },
      dropoffAccess: { flightsOfStairsNoLift: 0, longCarry: false },
      travelMinutes: FALLBACK_TRAVEL_MINUTES,
    },
  },
  {
    label: "2 bedroom apartment, with packing",
    description: "Third floor with no lift, and we pack both bedrooms.",
    input: {
      propertySize: "2bed",
      pickupAccess: { flightsOfStairsNoLift: 3, longCarry: false },
      dropoffAccess: { flightsOfStairsNoLift: 0, longCarry: false },
      travelMinutes: FALLBACK_TRAVEL_MINUTES,
      extras: { packingBedrooms: 2 },
    },
  },
  {
    label: "3 bedroom house",
    description: "Single storey at both ends, a 20 minute drive.",
    input: {
      propertySize: "3bed",
      pickupAccess: { flightsOfStairsNoLift: 0, longCarry: false },
      dropoffAccess: { flightsOfStairsNoLift: 0, longCarry: false },
      travelMinutes: FALLBACK_TRAVEL_MINUTES,
    },
  },
];

export default async function PricingPage() {
  const settings = await getPricingSettings();
  const examples = worked.map((example) => ({
    ...example,
    result: calculateQuote(example.input, settings),
  }));

  const rates = [
    {
      label: "Hourly rate",
      value: business.hourlyRateShort,
      note: settings.gstInclusive ? "GST included" : "Charged for actual time on the job",
    },
    { label: "Minimum", value: `${business.minimumHours} hrs`, note: "Every job, however small" },
    {
      label: "Call-out",
      value: `${business.calloutMinutes} min`,
      note: "At the hourly rate, already in every estimate",
    },
  ];

  return (
    <>
      <PageHeader
        breadcrumbs={[{ name: "Pricing", path: "/pricing" }]}
        label="Rate sheet"
        title="One hourly rate. The working shown."
        lede={
          <p>
            {business.hourlyRateDisplay}, a {business.minimumHours} hour minimum and a{" "}
            {business.calloutMinutes} minute call-out. Your price depends on how long your move
            takes, so here&apos;s exactly how we work it out.
          </p>
        }
      />

      <section aria-labelledby="rates-title" className="border-navy-900 border-b-2">
        <h2 id="rates-title" className="sr-only">
          Our rates
        </h2>
        <Container>
          <dl className="divide-navy-900 grid divide-y-2 sm:grid-cols-3 sm:divide-x-2 sm:divide-y-0">
            {rates.map((rate) => (
              <div key={rate.label} className="py-6 sm:px-6 sm:first:pl-0">
                <dt className="manifest-index text-terracotta-600">{rate.label}</dt>
                <dd>
                  <span className="font-headline text-navy-900 block text-5xl leading-none sm:text-6xl">
                    {rate.value}
                  </span>
                  <span className="text-ink-900 mt-2 block">{rate.note}</span>
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <Container className="grid gap-10 py-14 sm:py-20 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <SectionHeader
            title="Try it with your move"
            lede={
              <p>
                Pick the size and access and the estimate updates straight away, using the same
                rates as the quote form. It assumes a {FALLBACK_TRAVEL_MINUTES} minute drive until
                we know your addresses.
              </p>
            }
          />
          <h3 className="font-headline text-navy-900 mt-10 text-2xl">What&apos;s included</h3>
          <ul className="prose-vc mt-3 text-base">
            <li>The truck and crew, ready to load and unload</li>
            <li>Driving between your addresses, charged as time</li>
          </ul>
          <h3 className="font-headline text-navy-900 mt-8 text-2xl">What changes the price</h3>
          <ul className="prose-vc mt-3 text-base">
            <li>How much there is to move</li>
            <li>Stairs with no lift, and long walks from the truck</li>
            <li>Packing, unpacking and taking furniture apart</li>
            <li>Bigger jobs that need the 10 tonne truck and an extra mover</li>
          </ul>
        </div>
        <div className="lg:col-span-7">
          <QuoteEstimator
            settings={settings}
            suburbNames={allSuburbs.map((suburb) => suburb.name)}
          />
        </div>
      </Container>

      <section className="kraft-band py-14 sm:py-20">
        <Container>
          <SectionHeader
            title="Three moves, costed line by line"
            lede={
              <p>
                Worked out with our current rates. Yours will differ with your own job, so{" "}
                <Link
                  href="/quote"
                  className="text-navy-900 font-semibold underline decoration-2 underline-offset-4"
                >
                  get your own quote
                </Link>
                .
              </p>
            }
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {examples.map((example) => (
              <WorkedPriceExample
                key={example.label}
                heading={example.label}
                description={example.description}
                result={example.result}
                settings={settings}
              />
            ))}
          </div>
        </Container>
      </section>

      <Container className="py-16 sm:py-24">
        <InlineCta title="Ready for your own number?" />
      </Container>
    </>
  );
}
