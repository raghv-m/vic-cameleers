import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Phone, Star } from "lucide-react";

import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
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
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { name: "Service areas", path: "/removalists" },
          { name: suburb.name, path: `/removalists/${suburb.slug}` },
        ]}
      />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}

      <header>
        {distance && (
          <p className="text-primary text-xs font-semibold tracking-[0.14em] uppercase">
            {distance}
          </p>
        )}
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Removalists in {suburb.name}</h1>
        <p className="text-muted-foreground mt-2">
          VIC {suburb.postcode} &middot; {suburb.council} &middot; {business.hourlyRateDisplay},{" "}
          {business.minimumHours} hour minimum
        </p>
      </header>

      {suburb.intro && <p className="text-foreground mt-8 text-lg">{suburb.intro}</p>}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button size="lg" render={<Link href={quoteHref} />} nativeButton={false}>
          Get a free {suburb.name} quote
        </Button>
        <Button
          size="lg"
          variant="secondary"
          render={<a href={`tel:${business.phoneE164}`} />}
          nativeButton={false}
        >
          <Phone className="h-4 w-4" />
          Call {business.phoneDisplay}
        </Button>
      </div>

      {photo && (
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          sizes="(min-width: 768px) 768px, 100vw"
          className="mt-10 w-full rounded-lg object-cover"
        />
      )}

      {localNotes.length > 0 && (
        <section className="mt-12">
          <h2 className="font-heading text-2xl font-medium">
            What moves in {suburb.name} are usually like
          </h2>
          <dl className="mt-4 space-y-4">
            {localNotes.map((note) => (
              <div key={note.heading}>
                <dt className="text-foreground font-medium">{note.heading}</dt>
                <dd className="text-muted-foreground mt-1">{note.body}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {suburb.featuredJobs && suburb.featuredJobs.length > 0 && (
        <section className="mt-12">
          <h2 className="font-heading text-2xl font-medium">Recent jobs in {suburb.name}</h2>
          <ul className="mt-4 space-y-4">
            {suburb.featuredJobs.map((job) => (
              <li key={`${job.date}-${job.title}`} className="rounded-lg border p-5">
                <p className="text-foreground font-medium">{job.title}</p>
                <p className="text-muted-foreground mt-2">{job.story}</p>
                <p className="text-muted-foreground mt-3 text-sm tabular-nums">
                  {truckLabel[job.truck]}, {job.crewCount} movers, {job.hours} hours, $
                  {job.priceAud.toLocaleString("en-AU")}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {suburb.reviews && suburb.reviews.length > 0 && (
        <section className="mt-12">
          <h2 className="font-heading text-2xl font-medium">What {suburb.name} customers said</h2>
          <ul className="mt-4 space-y-4">
            {suburb.reviews.map((review) => (
              <li key={`${review.date}-${review.authorName}`} className="rounded-lg border p-5">
                <div className="flex items-center gap-0.5" aria-label={`${review.rating} out of 5`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      aria-hidden="true"
                      className={`h-4 w-4 ${i < review.rating ? "fill-current text-amber-500" : "text-muted-foreground"}`}
                    />
                  ))}
                </div>
                <p className="text-foreground mt-3">{review.body}</p>
                <p className="text-muted-foreground mt-2 text-sm">{review.authorName}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {services.length > 0 && (
        <section className="mt-12">
          <h2 className="font-heading text-2xl font-medium">Moves we do in {suburb.name}</h2>
          <ul className="mt-4 space-y-2">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="text-primary font-medium hover:underline"
                >
                  {service.name} in {suburb.name}
                </Link>
                <span className="text-muted-foreground"> &middot; {service.shortDescription}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {pageFaqs.length > 0 && (
        <section className="mt-12">
          <h2 className="font-heading text-2xl font-medium">
            Questions about moving in {suburb.name}
          </h2>
          <Accordion className="mt-3">
            {pageFaqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`faq-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      )}

      {nearby.length > 0 && (
        <section className="mt-12">
          <h2 className="font-heading text-2xl font-medium">Nearby suburbs we move</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {nearby.map((neighbour) => (
              <Link
                key={neighbour.slug}
                href={`/removalists/${neighbour.slug}`}
                className="border-border bg-card hover:border-primary/40 rounded-full border px-3 py-1 text-sm"
              >
                Removalists {neighbour.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-16 rounded-lg border p-6 text-center">
        <h2 className="font-heading text-xl font-medium">Moving in or out of {suburb.name}?</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Get a real price range in a couple of minutes, or read our{" "}
          <Link href="/guides/moving-checklist" className="text-primary hover:underline">
            moving checklist
          </Link>{" "}
          first.
        </p>
        <Button className="mt-4" render={<Link href={quoteHref} />} nativeButton={false}>
          Get a free {suburb.name} quote
        </Button>
      </div>
    </div>
  );
}
