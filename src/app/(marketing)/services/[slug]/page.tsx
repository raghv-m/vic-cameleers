import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { business } from "@/config/business";
import { ctaCopy } from "@/config/copy";
import { serviceContent } from "@/config/service-content";
import { getEnabledServices, getServiceBySlug } from "@/config/services";
import { absoluteUrl } from "@/config/site-url";
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

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const content = serviceContent[service.slug];

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
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { name: "Services", path: "/services" },
          { name: service.name, path: `/services/${service.slug}` },
        ]}
      />
      <JsonLd data={serviceJsonLd} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}

      <div className="mb-10 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">{service.name}</h1>
        <p className="text-muted-foreground mt-2">
          {business.hourlyRateDisplay}, {business.minimumHours} hour minimum. Serving{" "}
          {business.serviceAreaDescription}.
        </p>
      </div>

      <p className="text-foreground text-lg">{content.intro}</p>

      <div className="mt-8">
        <h2 className="font-heading text-lg font-medium">What&apos;s included</h2>
        <ul className="mt-3 space-y-2">
          {content.included.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm">
              <Check className="text-primary mt-0.5 h-4 w-4 shrink-0" />
              <span className="text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12 text-center">
        <Button size="lg" render={<Link href="/quote" />} nativeButton={false}>
          {ctaCopy.primary}
        </Button>
      </div>

      {content.faqs.length > 0 && (
        <div className="mt-16">
          <h2 className="font-heading text-lg font-medium">
            Questions about {service.name.toLowerCase()}
          </h2>
          <Accordion className="mt-3">
            {content.faqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`faq-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
}
