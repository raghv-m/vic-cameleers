import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { DraftContentNotice } from "@/components/seo/draft-content-notice";
import { JsonLd } from "@/components/seo/json-ld";
import { business } from "@/config/business";
import { faqs } from "@/config/faq";
import { getEnabledServices } from "@/config/services";
import { getSuburbBySlug, suburbs } from "@/content/suburbs";

export function generateStaticParams() {
  return suburbs.map((suburb) => ({ suburb: suburb.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/removalists/[suburb]">): Promise<Metadata> {
  const { suburb: slug } = await params;
  const suburb = getSuburbBySlug(slug);
  if (!suburb) return {};

  return {
    title: `Removalists ${suburb.name} | ${business.hourlyRateDisplay} | ${business.tradingName}`,
    description: `Local removalists covering ${suburb.name} VIC ${suburb.postcode}. Transparent hourly pricing, no surprises. Get a free estimate.`,
  };
}

export default async function SuburbPage({ params }: PageProps<"/removalists/[suburb]">) {
  const { suburb: slug } = await params;
  const suburb = getSuburbBySlug(slug);
  if (!suburb) notFound();

  const nearby = suburb.nearbySlugs
    .map((nearbySlug) => getSuburbBySlug(nearbySlug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const services = getEnabledServices();
  const localFaq = {
    question: `Do you cover ${suburb.name}?`,
    answer: `Yes, ${suburb.name} is within our regular service area. Get a free estimate and we'll confirm your date.`,
  };
  const pageFaqs = [localFaq, ...faqs.slice(0, 4)];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pageFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <JsonLd data={faqJsonLd} />
      <DraftContentNotice />

      <div className="mb-10 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">Removalists in {suburb.name}</h1>
        <p className="text-muted-foreground mt-2">
          VIC {suburb.postcode} &middot; {suburb.lga} &middot; {business.hourlyRateDisplay}, no
          surprises.
        </p>
      </div>

      <p className="text-foreground text-lg">{suburb.character}</p>

      <p className="text-muted-foreground mt-4">
        We&apos;re based in {business.baseSuburb} and cover {suburb.name} as part of{" "}
        {business.serviceAreaDescription}. Every job gets the same crew, the same truck, and the
        same transparent hourly rate, whether you&apos;re moving into {suburb.name}, out of it, or
        across town.
      </p>

      <div className="mt-10">
        <h2 className="font-heading text-lg font-medium">Services in {suburb.name}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="border-border bg-card hover:border-primary/40 rounded-full border px-3 py-1 text-sm"
            >
              {service.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-12 text-center">
        <Button size="lg" render={<Link href="/quote" />} nativeButton={false}>
          Get your free {suburb.name} estimate
        </Button>
      </div>

      <div className="mt-16">
        <h2 className="font-heading text-lg font-medium">Questions</h2>
        <Accordion className="mt-3">
          {pageFaqs.map((faq, index) => (
            <AccordionItem key={faq.question} value={`faq-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {nearby.length > 0 && (
        <div className="mt-16">
          <h2 className="font-heading text-lg font-medium">Nearby suburbs</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {nearby.map((n) => (
              <Link
                key={n.slug}
                href={`/removalists/${n.slug}`}
                className="border-border bg-card hover:border-primary/40 rounded-full border px-3 py-1 text-sm"
              >
                {n.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      <p className="text-muted-foreground mt-16 text-center text-sm">
        Planning ahead? See our{" "}
        <Link href="/guides" className="text-primary hover:underline">
          moving guides
        </Link>{" "}
        for packing tips and a full moving checklist.
      </p>
    </div>
  );
}
