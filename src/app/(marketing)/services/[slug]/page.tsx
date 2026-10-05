import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Phone } from "lucide-react";
import { cn } from "cn";

import { Photo } from "@/components/brand/photo";
import { RouteArrow, SignPlate } from "@/components/brand/signage";
import { ProcessRoute } from "@/components/home/process-route";
import { ShareButtons } from "@/components/marketing/share-buttons";
import { WorkedPriceExample } from "@/components/marketing/worked-price-example";
import { JsonLd } from "@/components/seo/json-ld";
import { Container, SectionHeader } from "@/components/site/layout-primitives";
import { PageHeader } from "@/components/site/page-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import { business } from "@/config/business";
import { ctaCopy } from "@/config/copy";
import { serviceContent, type ServicePriceExample } from "@/config/service-content";
import { getEnabledServices, getServiceBySlug, type ServiceSlug } from "@/config/services";
import { absoluteUrl } from "@/config/site-url";
import { publishedSuburbs } from "@/content/suburbs";
import { calculateQuote } from "@/lib/pricing";
import { getPricingSettings } from "@/lib/pricing-settings";
import { pageMetadata } from "@/lib/seo";
import { businessRef, faqPageJsonLd, hourlyPriceSpecification } from "@/lib/structured-data";

// Only enabled services are ever built; a disabled or unknown slug is a plain 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getEnabledServices().map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  return pageMetadata({
    title: service.seoKeyword,
    price: true,
    path: `/services/${service.slug}`,
    description: `${service.shortDescription} From ${business.hourlyRateShort}, ${business.minimumHours} hour minimum, based in Cranbourne. Get a free quote.`,
  });
}

const easyAccess = { flightsOfStairsNoLift: 0, longCarry: false };

/** A worked example for services that don't define their own, typical of the service. */
const DEFAULT_EXAMPLES: Partial<Record<ServiceSlug, ServicePriceExample>> = {
  "house-removals": {
    heading: "3 bedroom house, single storey both ends",
    description: "Easy access, the truck parked in the driveway, about a 20 minute drive.",
    input: {
      propertySize: "3bed",
      pickupAccess: easyAccess,
      dropoffAccess: easyAccess,
      travelMinutes: 20,
    },
  },
  "apartment-removals": {
    heading: "2 bedroom apartment, second floor, no lift",
    description:
      "Two flights of stairs at the pickup, a lift at the new place, about 20 minutes apart.",
    input: {
      propertySize: "2bed",
      pickupAccess: { flightsOfStairsNoLift: 2, longCarry: false },
      dropoffAccess: easyAccess,
      travelMinutes: 20,
    },
  },
  "office-removals": {
    heading: "Small office, ground floor",
    description: "Desks, chairs and filing for a small team, with four desks to take apart.",
    input: {
      propertySize: "office",
      pickupAccess: easyAccess,
      dropoffAccess: easyAccess,
      travelMinutes: 20,
      extras: { disassemblyItems: 4 },
    },
  },
  "furniture-removals": {
    heading: "One wardrobe across town",
    description: "A single item, ground floor at both ends, about a 20 minute drive.",
    input: {
      propertySize: "singleItem",
      pickupAccess: easyAccess,
      dropoffAccess: easyAccess,
      travelMinutes: 20,
    },
  },
  packing: {
    heading: "2 bedroom unit, fully packed",
    description: "Both bedrooms packed before loading, easy access, about 20 minutes apart.",
    input: {
      propertySize: "2bed",
      pickupAccess: easyAccess,
      dropoffAccess: easyAccess,
      travelMinutes: 20,
      extras: { packingBedrooms: 2 },
    },
  },
  "same-day-removals": {
    heading: "1 bedroom flat, same day",
    description: "Same rate as any other day. Easy access, about a 20 minute drive.",
    input: {
      propertySize: "1bed",
      pickupAccess: easyAccess,
      dropoffAccess: easyAccess,
      travelMinutes: 20,
    },
  },
};

const PRICE_FACTORS = [
  {
    title: "How much is moving",
    detail:
      "More to carry takes longer, and bigger loads get the 10 tonne truck and an extra mover.",
  },
  {
    title: "Stairs and lifts",
    detail: "Every flight without a lift adds carrying time at that end.",
  },
  {
    title: "Parking",
    detail:
      "A long walk from the truck to the door adds time. A clear spot out the front saves it.",
  },
  { title: "The drive", detail: "Time on the road between your two addresses is part of the job." },
  {
    title: "Extras",
    detail: "Packing, unpacking and furniture assembly are shown separately in your estimate.",
  },
];

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const content = serviceContent[service.slug];
  const settings = await getPricingSettings();
  const example = content.priceExample ?? DEFAULT_EXAMPLES[service.slug];
  const priceExample = example
    ? { ...example, result: calculateQuote(example.input, settings) }
    : null;

  // The published suburbs closest to the Cranbourne depot (Cranbourne itself counts as 0).
  const closestSuburbs = [...publishedSuburbs]
    .sort((a, b) => (a.driveTimeFromCranbourneMins ?? 0) - (b.driveTimeFromCranbourneMins ?? 0))
    .slice(0, 4);
  const related = getEnabledServices()
    .filter((other) => other.slug !== service.slug)
    .slice(0, 3);

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${absoluteUrl(`/services/${service.slug}`)}#service`,
    name: service.name,
    serviceType: service.name,
    description: content.intro,
    url: absoluteUrl(`/services/${service.slug}`),
    provider: businessRef,
    areaServed: { "@type": "AdministrativeArea", name: business.serviceAreaDescription },
    offers: {
      "@type": "Offer",
      priceSpecification: hourlyPriceSpecification(),
    },
  };

  // Only the FAQs rendered below; none rendered means no FAQPage at all.
  const faqJsonLd = faqPageJsonLd(content.faqs);

  return (
    <>
      <JsonLd data={serviceJsonLd} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}

      <PageHeader
        breadcrumbs={[
          { name: "Services", path: "/services" },
          { name: service.name, path: `/services/${service.slug}` },
        ]}
        label={`From ${business.hourlyRateShort} · ${business.minimumHours} hr minimum`}
        title={service.name}
        lede={<p>{content.intro}</p>}
        actions={
          <>
            <Link
              href="/quote"
              className={cn(buttonVariants({ size: "lg" }), "tracking-[0.08em] uppercase")}
            >
              {ctaCopy.primary}
              <ArrowRight data-icon="inline-end" />
            </Link>
            <a
              href={`tel:${business.phoneE164}`}
              className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "tabular")}
            >
              <Phone aria-hidden="true" />
              {business.phoneDisplay}
            </a>
          </>
        }
        aside={
          <Photo
            id={service.image}
            priority
            sizes="(min-width: 1024px) 38vw, 100vw"
            ratio="4 / 3"
          />
        }
      />

      <Container className="py-14 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <section aria-labelledby="included-title" className="lg:col-span-7">
            <h2 id="included-title" className="font-headline text-navy-900 display-md">
              What&apos;s included
            </h2>
            <ol className="border-navy-900 mt-6 border-t-2">
              {content.included.map((item, index) => (
                <li
                  key={item}
                  className="border-navy-900/20 grid grid-cols-[3rem_1fr] gap-3 border-b py-4"
                >
                  <span className="manifest-index text-terracotta-600 pt-1">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-ink-900">{item}</span>
                </li>
              ))}
            </ol>
          </section>
          <section aria-labelledby="who-title" className="lg:col-span-5">
            <div className="border-navy-900 bg-sand-100 rounded-sm border-2 p-5 sm:p-6">
              <h2 id="who-title" className="text-navy-900 text-xl font-bold">
                Who it&apos;s for
              </h2>
              <ul className="mt-4 space-y-3">
                {content.whoFor.map((item) => (
                  <li key={item} className="text-ink-900 flex gap-3">
                    <RouteArrow className="text-terracotta-600 mt-2 w-5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        {content.sections?.map((section) => (
          <section key={section.heading} className="mt-14 max-w-3xl">
            <h2 className="font-headline text-navy-900 display-md">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-ink-900 mt-4 leading-relaxed">
                {paragraph}
              </p>
            ))}
            {section.list && (
              <ul className="text-ink-900 marker:text-terracotta-600 mt-4 list-disc space-y-2 pl-5 leading-relaxed">
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
        <ShareButtons
          path={`/services/${service.slug}`}
          title={`${service.name} | ${business.tradingName}`}
          className="border-navy-900/20 mt-10 border-t pt-6"
        />
      </Container>

      <section
        aria-labelledby="process-title"
        className="border-navy-900/15 blueprint-grid border-y py-14 sm:py-20"
      >
        <Container>
          <SectionHeader id="process-title" title="How it works" size="md" className="mb-10" />
          <ProcessRoute />
        </Container>
      </section>

      <Container className="py-14 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <section aria-labelledby="price-title" className="lg:col-span-6">
            <h2 id="price-title" className="font-headline text-navy-900 display-md">
              What affects the price
            </h2>
            <dl className="border-navy-900 mt-6 border-t-2">
              {PRICE_FACTORS.map((factor) => (
                <div key={factor.title} className="border-navy-900/20 border-b py-4">
                  <dt className="text-navy-900 font-bold">{factor.title}</dt>
                  <dd className="text-muted-600 mt-1">{factor.detail}</dd>
                </div>
              ))}
            </dl>
            <Link
              href="/pricing"
              className="text-navy-900 mt-5 inline-flex min-h-11 items-center gap-2 font-semibold underline decoration-2 underline-offset-4"
            >
              Full pricing, with the maths
            </Link>
          </section>
          {priceExample && (
            <div className="lg:col-span-6">
              <WorkedPriceExample
                heading={priceExample.heading}
                description={priceExample.description}
                result={priceExample.result}
                settings={settings}
              />
            </div>
          )}
        </div>
      </Container>

      <section aria-labelledby="area-title" className="kraft-band py-14 sm:py-16">
        <Container className="grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <h2 id="area-title" className="font-headline text-navy-900 display-md">
              Where we do it
            </h2>
            <p className="text-ink-900 mt-3">
              Anywhere in {business.serviceAreaDescription}, from our base in{" "}
              {business.baseSuburb.replace(" VIC", "")}.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <SignPlate>Victoria only</SignPlate>
              <SignPlate tone="amber">No interstate</SignPlate>
            </div>
          </div>
          <ul className="grid gap-2 sm:grid-cols-2 lg:col-span-7">
            {closestSuburbs.map((suburb) => (
              <li key={suburb.slug}>
                <Link
                  href={`/removalists/${suburb.slug}`}
                  className="border-navy-900 bg-sand-50 text-navy-900 hover:bg-navy-900 hover:text-sand-50 flex min-h-12 items-center justify-between rounded-sm border-2 px-4 font-semibold transition-colors"
                >
                  {service.name} in {suburb.name}
                  <RouteArrow className="w-5" />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Container className="py-14 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          {content.faqs.length > 0 && (
            <section aria-labelledby="faq-title" className="lg:col-span-7">
              <h2 id="faq-title" className="font-headline text-navy-900 display-md">
                Questions about {service.name.toLowerCase()}
              </h2>
              <Accordion className="border-navy-900 mt-6 border-t-2">
                {content.faqs.map((faq, index) => (
                  <AccordionItem key={faq.question} value={`faq-${index}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          )}
          <aside aria-labelledby="trust-title" className="lg:col-span-5">
            <div className="on-navy bg-navy-900 text-sand-200 rounded-sm p-6">
              <h2 id="trust-title" className="text-sand-50 text-xl font-bold">
                Before you book
              </h2>
              <dl className="mt-4 space-y-3 text-[0.9375rem]">
                <div>
                  <dt className="manifest-index text-kraft-400">Business</dt>
                  <dd>
                    ABN {business.abn}, ACN {business.acn}, {business.baseSuburb}
                  </dd>
                </div>
                <div>
                  <dt className="manifest-index text-kraft-400">Price</dt>
                  <dd>
                    {business.hourlyRateDisplay}, {business.minimumHours} hour minimum,{" "}
                    {business.calloutMinutes} min call-out in every estimate
                  </dd>
                </div>
                <div>
                  <dt className="manifest-index text-kraft-400">Fleet</dt>
                  <dd>6 and 10 tonne trucks, {business.crewSize} movers</dd>
                </div>
                <div>
                  <dt className="manifest-index text-kraft-400">Talk to</dt>
                  <dd>
                    The crew, direct:{" "}
                    <a
                      href={`tel:${business.phoneE164}`}
                      className="text-sand-50 tabular font-semibold underline underline-offset-4"
                    >
                      {business.phoneDisplay}
                    </a>
                  </dd>
                </div>
              </dl>
              <Link
                href="/quote"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "mt-6 w-full tracking-[0.08em] uppercase",
                )}
              >
                {ctaCopy.primary}
                <ArrowRight data-icon="inline-end" />
              </Link>
            </div>
            <h2 className="manifest-index text-muted-600 mt-8">Related services</h2>
            <ul className="mt-3 space-y-2">
              {related.map((other) => (
                <li key={other.slug}>
                  <Link
                    href={`/services/${other.slug}`}
                    className="text-navy-900 hover:text-terracotta-600 inline-flex min-h-11 items-center gap-2 font-semibold"
                  >
                    {other.name}
                    <RouteArrow className="w-5" />
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </Container>
    </>
  );
}
