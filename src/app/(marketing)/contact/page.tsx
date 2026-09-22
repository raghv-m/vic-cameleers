import { Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";

import { ContactForm } from "@/components/contact/contact-form";
import { business } from "@/config/business";

export const metadata: Metadata = {
  title: "Contact us",
  description: `Call, email, or send us a message. Vic Cameleers is based in ${business.baseSuburb} and covers ${business.serviceAreaDescription}.`,
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
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

          <div className="flex items-start gap-3">
            <Mail className="text-primary mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="text-foreground font-medium">Email</p>
              {business.publicEmail ? (
                <a
                  href={`mailto:${business.publicEmail}`}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {business.publicEmail}
                </a>
              ) : (
                <p className="text-muted-foreground">
                  Use the form, or call us, our email goes live with the new site.
                </p>
              )}
            </div>
          </div>

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
