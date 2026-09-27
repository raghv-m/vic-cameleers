import type { Metadata } from "next";
import { Phone } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/site/layout-primitives";
import { PageHeader } from "@/components/site/page-header";
import { business } from "@/config/business";
import { faqs } from "@/config/faq";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Removalist FAQs",
  path: "/faq",
  description: `Straight answers on minimum charges, the call-out fee, stairs, parking, cancellations and payment. ${business.hourlyRateShort}, ${business.minimumHours} hour minimum. Call ${business.phoneDisplay}.`,
});

export default function FaqPage() {
  const faqPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      <JsonLd data={faqPageJsonLd} />
      <PageHeader
        breadcrumbs={[{ name: "FAQ", path: "/faq" }]}
        label="Questions"
        title="Straight answers before you book."
        lede={<p>Minimum charge, call-out, stairs, parking, cancellations and payment.</p>}
      />
      <Container className="grid gap-10 py-12 sm:py-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-8">
          <Accordion className="border-navy-900 border-t-2">
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`faq-${index}`}>
                <AccordionTrigger className="text-lg">
                  <span className="flex items-baseline gap-4">
                    <span className="manifest-index text-terracotta-600 w-6 shrink-0">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pl-10">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <aside className="lg:col-span-4">
          <div className="border-navy-900 bg-navy-900 text-sand-50 on-navy rounded-sm border-2 p-5 lg:sticky lg:top-24">
            <p className="font-headline text-2xl">Question not here?</p>
            <p className="text-sand-100 mt-2">
              Call and ask. We&apos;ll give you a straight answer.
            </p>
            <a
              href={`tel:${business.phoneE164}`}
              className="text-signal-400 tabular mt-4 inline-flex min-h-11 items-center gap-2 text-xl font-bold"
            >
              <Phone className="size-5" aria-hidden="true" />
              {business.phoneDisplay}
            </a>
          </div>
        </aside>
      </Container>
    </>
  );
}
