import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail, MessageSquare, Phone } from "lucide-react";
import { cn } from "cn";

import { FaqExplorer } from "@/components/faq/faq-explorer";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/site/layout-primitives";
import { PageHeader } from "@/components/site/page-header";
import { buttonVariants } from "@/components/ui/button";
import { business } from "@/config/business";
import { faqs } from "@/config/faq";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Removalist FAQs: price, booking, trucks and moving day",
  path: "/faq",
  description: `Straight answers before you book a Melbourne removalist: ${business.hourlyRateShort}, ${business.minimumHours} hour minimum, the call-out, trucks and crew, moving day, changes and cancellations. Victoria only.`,
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
        title="Removalist questions, answered."
        lede={<p>Everything you&apos;d ask a removalist before booking. Answered straight.</p>}
      />
      <Container className="grid gap-12 pt-4 pb-16 sm:pb-24 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <FaqExplorer faqs={faqs} />
        </div>

        <aside className="lg:col-span-4">
          <div className="on-navy bg-navy-900 text-sand-100 rounded-sm p-6 lg:sticky lg:top-24">
            <h2 className="font-headline text-sand-50 text-3xl">Still have questions?</h2>
            <p className="mt-2">Ask us. You&apos;ll get a straight answer from the crew.</p>
            <ul className="mt-5 space-y-2">
              <li>
                <a
                  href={`tel:${business.phoneE164}`}
                  className="text-signal-400 tabular inline-flex min-h-11 items-center gap-2.5 text-lg font-bold"
                >
                  <Phone className="size-5" aria-hidden="true" />
                  Call {business.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`sms:${business.phoneE164}`}
                  className="text-sand-50 inline-flex min-h-11 items-center gap-2.5 font-semibold underline decoration-2 underline-offset-4"
                >
                  <MessageSquare className="size-5" aria-hidden="true" />
                  Send a text
                </a>
              </li>
              <li className="text-sand-200 inline-flex min-h-11 items-center gap-2.5">
                {/* PLACEHOLDER: no public email address yet (business.ts TODO_PUBLIC_EMAIL). */}
                <Mail className="size-5" aria-hidden="true" />
                <span>
                  Email <span className="text-xs">(address coming soon)</span>
                </span>
              </li>
            </ul>
            <Link
              href="/contact"
              className={cn(buttonVariants({ variant: "onNavy", size: "lg" }), "mt-5 w-full")}
            >
              Book a callback
              <ArrowRight data-icon="inline-end" />
            </Link>
          </div>
        </aside>
      </Container>
    </>
  );
}
