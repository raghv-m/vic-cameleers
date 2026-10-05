import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { cn } from "cn";

import { Container } from "@/components/site/layout-primitives";
import { PageHeader } from "@/components/site/page-header";
import { buttonVariants } from "@/components/ui/button";
import { business } from "@/config/business";
import { ctaCopy } from "@/config/copy";
import { getEnabledServices } from "@/config/services";

// Only reached after sending the contact form. Kept out of search results and the sitemap: a
// thank-you page in Google would be a dead end, and would muddy conversion numbers.
export const metadata: Metadata = {
  title: "Thanks, we've got your message",
  robots: { index: false, follow: true },
};

export default function ThankYouPage() {
  const services = getEnabledServices().slice(0, 6);

  return (
    <div data-hides-mobile-bar>
      <PageHeader
        breadcrumbs={[{ name: "Thank you", path: "/thank-you" }]}
        label="Message sent"
        title="Thanks. We've got it."
        lede={
          <p>
            {business.responsePromise ? `${business.responsePromise}. ` : ""}If it&apos;s urgent,
            call{" "}
            <a
              href={`tel:${business.phoneE164}`}
              className="text-navy-900 tabular font-semibold underline decoration-2 underline-offset-4"
            >
              {business.phoneDisplay}
            </a>
            .
          </p>
        }
      />
      <Container className="grid gap-12 py-12 sm:py-16 lg:grid-cols-12">
        <section className="lg:col-span-5" aria-labelledby="next-steps">
          <h2 id="next-steps" className="font-headline text-navy-900 text-3xl">
            What happens now
          </h2>
          <ol className="border-navy-900 mt-4 border-t-2">
            {[
              ["We read your message", "A real person on the crew, not a bot."],
              [
                "We get back to you",
                business.responsePromise
                  ? `${business.responsePromise}, by phone or email, whichever you gave us.`
                  : "By phone or email, whichever you gave us.",
              ],
              [
                "Want a price sooner?",
                `The quote form gives you an estimate on the spot, at ${business.hourlyRateDisplay} with a ${business.minimumHours} hour minimum.`,
              ],
            ].map(([title, detail], index) => (
              <li
                key={title}
                className="border-navy-900/20 grid grid-cols-[2.5rem_1fr] border-b py-4"
              >
                <span className="font-stencil text-terracotta-600 text-2xl leading-none">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-navy-900 font-bold">{title}</p>
                  <p className="text-muted-600 text-sm">{detail}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/quote"
              className={cn(buttonVariants({ size: "lg" }), "tracking-[0.08em] uppercase")}
            >
              {ctaCopy.primary}
              <ArrowRight data-icon="inline-end" />
            </Link>
            <a
              href={`tel:${business.phoneE164}`}
              className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "tabular")}
            >
              <Phone aria-hidden="true" />
              Call {business.phoneDisplay}
            </a>
          </div>
        </section>

        <section className="lg:col-span-7" aria-labelledby="more-help">
          <h2 id="more-help" className="font-headline text-navy-900 text-3xl">
            While you&apos;re planning
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="border-navy-900 hover:bg-sand-100 block h-full rounded-sm border-2 p-4 transition-colors motion-reduce:transition-none"
                >
                  <p className="text-navy-900 font-bold">{service.name}</p>
                  <p className="text-muted-600 mt-1 text-sm">{service.shortDescription}</p>
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-ink-900 mt-6">
            Getting ready to move? Our{" "}
            <Link
              href="/guides"
              className="text-navy-900 font-semibold underline decoration-2 underline-offset-4"
            >
              moving guides
            </Link>{" "}
            cover packing, checklists and what a move really costs.
          </p>
        </section>
      </Container>
    </div>
  );
}
