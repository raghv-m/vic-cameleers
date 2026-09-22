import type { Metadata } from "next";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { JsonLd } from "@/components/seo/json-ld";
import { business } from "@/config/business";
import { faqs } from "@/config/faq";

export const metadata: Metadata = {
  title: "FAQ",
  description: `Common questions about moving with ${business.tradingName}: pricing, call-out fees, access, and what we don't move.`,
};

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
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <JsonLd data={faqPageJsonLd} />
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">Frequently asked questions</h1>
        <p className="text-muted-foreground mt-2">
          Can&apos;t find what you need? Call {business.phoneDisplay}.
        </p>
      </div>

      <Accordion>
        {faqs.map((faq, index) => (
          <AccordionItem key={faq.question} value={`faq-${index}`}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
