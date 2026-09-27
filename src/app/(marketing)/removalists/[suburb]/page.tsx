import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Phone } from "lucide-react";
import { cn } from "cn";

import { RouteArrow } from "@/components/brand/signage";
import { JsonLd } from "@/components/seo/json-ld";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { InlineCta } from "@/components/site/inline-cta";
import { Container } from "@/components/site/layout-primitives";
import { PageHeader } from "@/components/site/page-header";
import { buttonVariants } from "@/components/ui/button";
import { business } from "@/config/business";
import { faqs } from "@/config/faq";
import { getServiceBySlug } from "@/config/services";
import {
  getPublishedNearby,
  getPublishedSuburb,
  publishedSuburbs,
  type Suburb,
} from "@/content/suburbs";
import { pageMetadata } from "@/lib/seo";
import { faqPageJsonLd } from "@/lib/structured-data";

// Only published suburbs are ever built; any other slug (unpublished or unknown) is a plain 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return publishedSuburbs.map((suburb) => ({ suburb: suburb.slug }));
}

/** The services most suburb moves need; each suburb page links to these. */
const SUBURB_SERVICE_SLUGS = ["house-removals", "furniture-removals", "packing"];

/** General questions shown under the suburb's own ones, by question text from src/config/faq.ts. */
const GENERAL_FAQ_QUESTIONS = [
  "What's your minimum charge?",
  "Do you charge more for stairs or a lift?",
];

const truckLabel = { SIX_TONNE: "6 tonne truck", TEN_TONNE: "10 tonne truck" } as const;

function driveTimeLabel(suburb: Suburb): string | null {
  if (suburb.slug === "cranbourne") return "Our home base";
  if (!suburb.driveTimeFromCranbourneMins) return null;
  return `About ${suburb.driveTimeFromCranbourneMins} minutes from our Cranbourne depot`;
}

export async function generateMetadata({
  params,
}: PageProps<"/removalists/[suburb]">): Promise<Metadata> {
  const { suburb: slug } = await params;
  const suburb = getPublishedSuburb(slug);
  if (!suburb) return {};

  const distance = suburb.driveTimeFromCranbourneMins
    ? `, about ${suburb.driveTimeFromCranbourneMins} minutes from our Cranbourne depot`
    : ", right where our trucks are based";

  return pageMetadata({
    title: `Removalists ${suburb.name}`,
    price: true,
    path: `/removalists/${suburb.slug}`,
    description: `Local removalists for ${suburb.name} VIC ${suburb.postcode}${distance}. ${business.hourlyRateShort}, ${business.minimumHours} hour minimum. Get a free quote.`,
  });
}

export default async function SuburbPage({ params }: PageProps<"/removalists/[suburb]">) {
  const { suburb: slug } = await params;
  const suburb = getPublishedSuburb(slug);
  if (!suburb) notFound();

  const nearby = getPublishedNearby(suburb);
  const services = SUBURB_SERVICE_SLUGS.map((serviceSlug) => getServiceBySlug(serviceSlug)).filter(
    (service): service is NonNullable<typeof service> => Boolean(service),
  );
  const pageFaqs = [
    ...(suburb.localFaqs ?? []),
    ...faqs.filter((faq) => GENERAL_FAQ_QUESTIONS.includes(faq.question)),
  ];
  const faqJsonLd = faqPageJsonLd(pageFaqs);
  const quoteHref = `/quote?suburb=${suburb.slug}`;
  const distance = driveTimeLabel(suburb);
  const localNotes = [
    { heading: "Housing", body: suburb.housingNotes },
    { heading: "Access", body: suburb.accessNotes },
    { heading: "Parking", body: suburb.parkingNotes },
  ].filter((note): note is { heading: string; body: string } => Boolean(note.body));
  const photo = suburb.photos?.[0];

  return (
    <>
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      <PageHeader
        breadcrumbs={[
          { name: "Service areas", path: "/removalists" },
          { name: suburb.name, path: `/removalists/${suburb.slug}` },
        ]}
        label={distance ?? suburb.council}
        title={`Removalists in ${suburb.name}`}
        lede={
          <>
            {suburb.intro && <p>{suburb.intro}</p>}
            <p className="text-muted-600 tabular mt-3 text-base">
              VIC {suburb.postcode} &middot; {suburb.council} &middot; {business.hourlyRateShort},{" "}
              {business.minimumHours} hour minimum
            </p>
          </>
        }
        actions={
          <>
            <Link
              href={quoteHref}
              className={cn(buttonVariants({ size: "lg" }), "tracking-[0.08em] uppercase")}
            >
              Get a {suburb.name} quote
              <ArrowRight data-icon="inline-end" />
            </Link>
            <a
              href={`tel:${business.phoneE164}`}
              className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "tabular")}
            >
              <Phone />
              {business.phoneDisplay}
            </a>
          </>
        }
        aside={
          photo ? (
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="border-navy-900 w-full rounded-sm border-2 object-cover"
            />
          ) : undefined
        }
      />

      <Container className="grid gap-12 py-12 sm:py-16 lg:grid-cols-12 lg:gap-12">
        <div className="space-y-14 lg:col-span-8">
          {localNotes.length > 0 && (
            <section aria-labelledby="local-title">
              <h2 id="local-title" className="font-headline text-navy-900 display-md">
                What moves in {suburb.name} are usually like
              </h2>
              <dl className="border-navy-900 bg-navy-900 mt-6 grid gap-px overflow-hidden rounded-sm border-2 md:grid-cols-3">
                {localNotes.map((note) => (
                  <div key={note.heading} className="bg-sand-50 p-5">
                    <dt className="manifest-index text-terracotta-600">{note.heading}</dt>
                    <dd className="text-ink-900 mt-2">{note.body}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {suburb.featuredJobs && suburb.featuredJobs.length > 0 && (
            <section aria-labelledby="jobs-title">
              <h2 id="jobs-title" className="font-headline text-navy-900 display-md">
                Recent jobs in {suburb.name}
              </h2>
              <ul className="mt-6 grid gap-4 md:grid-cols-2">
                {suburb.featuredJobs.map((job) => (
                  <li
                    key={`${job.date}-${job.title}`}
                    className="border-navy-900 bg-sand-50 rounded-sm border-2 p-5"
                  >
                    <p className="font-headline text-navy-900 text-xl">{job.title}</p>
                    <p className="text-ink-900 mt-2">{job.story}</p>
                    <p className="text-muted-600 tabular mt-3 text-sm">
                      {truckLabel[job.truck]}, {job.crewCount} movers, {job.hours} hours, $
                      {job.priceAud.toLocaleString("en-AU")}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {suburb.reviews && suburb.reviews.length > 0 && (
            <section aria-labelledby="reviews-title">
              <h2 id="reviews-title" className="font-headline text-navy-900 display-md">
                What {suburb.name} customers said
              </h2>
              <ul className="mt-6 grid gap-4 md:grid-cols-2">
                {suburb.reviews.map((review) => (
                  <li
                    key={`${review.date}-${review.authorName}`}
                    className="border-navy-900 bg-sand-50 rounded-sm border-2 p-5"
                  >
                    <p
                      className="text-terracotta-600 tracking-[0.2em]"
                      aria-label={`${review.rating} out of 5`}
                    >
                      {"\u2605".repeat(review.rating)}
                      <span className="text-kraft-400">{"\u2605".repeat(5 - review.rating)}</span>
                    </p>
                    <blockquote className="text-ink-900 mt-3">{review.body}</blockquote>
                    <p className="text-navy-900 mt-3 font-bold">{review.authorName}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {pageFaqs.length > 0 && (
            <section aria-labelledby="faq-title">
              <h2 id="faq-title" className="font-headline text-navy-900 display-md">
                Questions about moving in {suburb.name}
              </h2>
              <Accordion className="border-navy-900 mt-6 border-t-2">
                {pageFaqs.map((faq, index) => (
                  <AccordionItem key={faq.question} value={`faq-${index}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          )}

          <div>
            <InlineCta
              title={`Moving in or out of ${suburb.name}?`}
              href={quoteHref}
              body="See an estimate in a couple of minutes. Same rate as everywhere else we go."
            />
            <p className="mt-4 text-sm">
              Planning ahead?{" "}
              <Link
                href="/guides/moving-checklist"
                className="text-navy-900 font-semibold underline decoration-2 underline-offset-4"
              >
                Read the moving checklist
              </Link>
            </p>
          </div>
        </div>

        <aside className="space-y-10 lg:col-span-4">
          {services.length > 0 && (
            <nav aria-labelledby="services-title">
              <h2 id="services-title" className="manifest-index text-terracotta-600">
                Moves we do in {suburb.name}
              </h2>
              <ul className="border-navy-900 mt-3 border-t-2">
                {services.map((service) => (
                  <li key={service.slug} className="border-navy-900/20 border-b">
                    <Link
                      href={`/services/${service.slug}`}
                      className="group text-navy-900 hover:text-terracotta-600 flex min-h-12 items-center justify-between gap-3 py-2"
                    >
                      <span>
                        <span className="block font-bold">{service.name}</span>
                        <span className="text-muted-600 block text-sm">
                          {service.shortDescription}
                        </span>
                      </span>
                      <RouteArrow className="w-5 shrink-0 transition-transform duration-150 group-hover:translate-x-1 motion-reduce:transition-none" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {nearby.length > 0 && (
            <nav aria-labelledby="nearby-title">
              <h2 id="nearby-title" className="manifest-index text-terracotta-600">
                Nearby suburbs we move
              </h2>
              <ul className="border-navy-900 mt-3 border-t-2">
                {nearby.map((neighbour) => (
                  <li key={neighbour.slug} className="border-navy-900/20 border-b">
                    <Link
                      href={`/removalists/${neighbour.slug}`}
                      className="group text-navy-900 hover:text-terracotta-600 flex min-h-12 items-center justify-between gap-3 font-semibold"
                    >
                      Removalists {neighbour.name}
                      <RouteArrow className="w-5 shrink-0 transition-transform duration-150 group-hover:translate-x-1 motion-reduce:transition-none" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </aside>
      </Container>
    </>
  );
}
