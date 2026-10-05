import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";

import { SignPlate } from "@/components/brand/signage";
import { ContactForm } from "@/components/contact/contact-form";
import { directionsUrl, GoogleMapEmbed } from "@/components/marketing/google-map-embed";
import { Container } from "@/components/site/layout-primitives";
import { PageHeader } from "@/components/site/page-header";
import { business } from "@/config/business";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact our removalists",
  path: "/contact",
  description: `Call ${business.phoneDisplay} or send us a message. ${business.tradingName} is based in Cranbourne and moves homes and businesses across ${business.serviceAreaDescription}.`,
});

export default async function ContactPage() {
  // Rendered per request: the form loads Turnstile under the nonce CSP (src/proxy.ts).
  await connection();

  return (
    <div data-hides-mobile-bar>
      <PageHeader
        breadcrumbs={[{ name: "Contact", path: "/contact" }]}
        label="Contact"
        title="Call us, or leave a message."
        lede={
          <p>
            Want a price? The{" "}
            <Link
              href="/quote"
              className="text-navy-900 font-semibold underline decoration-2 underline-offset-4"
            >
              quote form
            </Link>{" "}
            is quickest. For anything else, call or write below.
          </p>
        }
      />
      <Container className="grid gap-10 py-12 sm:py-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <dl className="border-navy-900 border-t-2">
            <div className="border-navy-900/20 border-b py-5">
              <dt className="manifest-index text-terracotta-600">Phone</dt>
              <dd>
                <a
                  href={`tel:${business.phoneE164}`}
                  className="font-headline text-navy-900 hover:text-terracotta-600 tabular mt-1 inline-flex min-h-11 items-center text-4xl"
                >
                  {business.phoneDisplay}
                </a>
              </dd>
            </div>
            {/* TODO(owner): shows automatically once business.publicEmail is set. */}
            {business.publicEmail && (
              <div className="border-navy-900/20 border-b py-5">
                <dt className="manifest-index text-terracotta-600">Email</dt>
                <dd>
                  <a
                    href={`mailto:${business.publicEmail}`}
                    className="text-navy-900 mt-1 inline-flex min-h-11 items-center text-xl font-bold underline underline-offset-4"
                  >
                    {business.publicEmail}
                  </a>
                </dd>
              </div>
            )}
            <div className="border-navy-900/20 border-b py-5">
              <dt className="manifest-index text-terracotta-600">Base</dt>
              <dd className="text-ink-900 mt-1 text-lg">{business.baseSuburb}</dd>
            </div>
            <div className="border-navy-900/20 border-b py-5">
              <dt className="manifest-index text-terracotta-600">Service area</dt>
              <dd className="text-ink-900 mt-1 text-lg">
                {business.serviceAreaDescription}.{" "}
                <Link
                  href="/removalists"
                  className="text-navy-900 font-semibold underline decoration-2 underline-offset-4"
                >
                  See suburbs
                </Link>
              </dd>
            </div>
            <div className="py-5">
              <dt className="manifest-index text-terracotta-600">Business</dt>
              <dd className="text-ink-900 tabular mt-1">
                ABN {business.abn} &middot; ACN {business.acn}
              </dd>
            </div>
          </dl>
          <SignPlate tone="amber" className="mt-2">
            Victoria only
          </SignPlate>
          <GoogleMapEmbed className="mt-8" />
          <a
            href={directionsUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-navy-900 mt-3 inline-flex min-h-11 items-center text-sm font-bold underline underline-offset-4"
          >
            Get directions in Google Maps
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
        <div className="lg:col-span-7">
          <ContactForm />
        </div>
      </Container>
    </div>
  );
}
