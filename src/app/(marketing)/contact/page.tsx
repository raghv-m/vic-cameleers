import { Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import { connection } from "next/server";

import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ContactForm } from "@/components/contact/contact-form";
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
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ name: "Contact", path: "/contact" }]} />
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">Get in touch</h1>
        <p className="text-muted-foreground mt-2">
          Call us direct, or send a message and we&apos;ll get back to you.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <Phone className="text-primary mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="text-foreground font-medium">Phone</p>
              <a
                href={`tel:${business.phoneE164}`}
                className="text-muted-foreground hover:text-foreground"
              >
                {business.phoneDisplay}
              </a>
            </div>
          </div>

          {/* TODO(owner): shows automatically once business.publicEmail is set. */}
          {business.publicEmail && (
            <div className="flex items-start gap-3">
              <Mail className="text-primary mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="text-foreground font-medium">Email</p>
                <a
                  href={`mailto:${business.publicEmail}`}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {business.publicEmail}
                </a>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <MapPin className="text-primary mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="text-foreground font-medium">Service area</p>
              <p className="text-muted-foreground">
                Based in {business.baseSuburb}, covering {business.serviceAreaDescription}.
              </p>
            </div>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
