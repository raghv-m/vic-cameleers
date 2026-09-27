import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "cn";

import { Photo } from "@/components/brand/photo";
import { RouteArrow } from "@/components/brand/signage";
import { Container } from "@/components/site/layout-primitives";
import { PageHeader } from "@/components/site/page-header";
import { buttonVariants } from "@/components/ui/button";
import { business } from "@/config/business";
import { ctaCopy } from "@/config/copy";
import { serviceDirectory } from "@/config/service-directory";
import { getServiceBySlug } from "@/config/services";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Removal services Melbourne",
  price: true,
  path: "/services",
  description: `House, apartment, office and furniture removals, marketplace pickups and packing across Melbourne, from ${business.hourlyRateShort}. Pick your service and get a quote.`,
});

/**
 * The service directory: every service grouped the way people look for it, numbered like a
 * manifest (01.1, 01.2...), each with what it is, where the price starts, and a way in. Only real,
 * enabled services link to pages; add-ons go straight to the quote form.
 */
export default function ServicesPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ name: "Services", path: "/services" }]}
        label="Service directory"
        title="What we move, and how it's priced."
        lede={
          <p>
            Every job is the same {business.hourlyRateDisplay} with a {business.minimumHours} hour
            minimum. The truck and crew change with the load; the rate doesn&apos;t.
          </p>
        }
        actions={
          <Link
            href="/quote"
            className={cn(buttonVariants({ size: "lg" }), "tracking-[0.08em] uppercase")}
          >
            {ctaCopy.primary}
            <ArrowRight data-icon="inline-end" />
          </Link>
        }
      />

      <nav
        aria-label="Service groups"
        className="border-navy-900 bg-sand-100 sticky top-16 z-20 border-b-2"
      >
        <Container>
          <ul className="flex [scrollbar-width:none] gap-1 overflow-x-auto py-2">
            {serviceDirectory.map((category) => (
              <li key={category.id} className="shrink-0">
                <a
                  href={`#${category.id}`}
                  className="text-navy-900 hover:bg-sand-200 inline-flex min-h-11 items-center gap-2 rounded-sm px-3 text-sm font-semibold"
                >
                  <span className="font-stencil text-terracotta-600 text-lg leading-none">
                    {category.index}
                  </span>
                  {category.label}
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </nav>

      <Container className="py-12 sm:py-16">
        <div className="space-y-16 sm:space-y-24">
          {serviceDirectory.map((category) => (
            <section
              key={category.id}
              id={category.id}
              aria-labelledby={`${category.id}-title`}
              className="grid scroll-mt-36 gap-8 lg:grid-cols-12 lg:gap-12"
            >
              <div className="lg:col-span-4">
                <div className="lg:sticky lg:top-36">
                  <p className="font-stencil text-terracotta-600 text-7xl leading-none">
                    {category.index}
                  </p>
                  <p className="manifest-index text-muted-600 mt-3">{category.label}</p>
                  <h2
                    id={`${category.id}-title`}
                    className="font-headline text-navy-900 display-md mt-2"
                  >
                    {category.title}
                  </h2>
                  <p className="text-ink-900 mt-3">{category.summary}</p>
                  <p className="border-navy-900 text-navy-900 mt-4 border-l-4 pl-3 text-sm font-semibold">
                    {category.typicalSetup}
                  </p>
                  <Photo
                    id={category.image}
                    sizes="(min-width: 1024px) 28vw, 100vw"
                    ratio="4 / 3"
                    className="mt-6"
                    roller
                  />
                </div>
              </div>

              <ol className="border-navy-900 border-t-2 lg:col-span-8">
                {category.entries.map((entry, index) => {
                  const service = entry.slug ? getServiceBySlug(entry.slug) : undefined;
                  const number = `${category.index}.${index + 1}`;
                  const href = service ? `/services/${service.slug}` : "/quote";
                  return (
                    <li key={entry.name} className="border-navy-900/20 border-b">
                      <Link
                        href={href}
                        className="group grid grid-cols-[3.5rem_1fr] gap-x-4 gap-y-3 py-6 sm:grid-cols-[4.5rem_1fr_auto] sm:items-center"
                      >
                        <span className="manifest-index text-terracotta-600 pt-1.5 sm:pt-0">
                          {number}
                        </span>
                        <span>
                          <span className="text-navy-900 group-hover:text-terracotta-600 block text-xl font-bold transition-colors sm:text-2xl">
                            {entry.name}
                          </span>
                          <span className="text-muted-600 mt-1 block">
                            {service?.shortDescription ?? entry.line}
                          </span>
                          <span className="text-navy-900 tabular mt-2 block text-sm font-semibold">
                            {service
                              ? `From ${business.hourlyRateShort}, ${business.minimumHours} hr minimum`
                              : `Added to any move at ${business.hourlyRateShort}`}
                          </span>
                        </span>
                        <span className="text-navy-900 col-start-2 inline-flex items-center gap-2 text-sm font-bold sm:col-start-3">
                          {service ? "Details" : "Add in your quote"}
                          <RouteArrow className="text-terracotta-600 w-6 transition-transform duration-150 group-hover:translate-x-1 motion-reduce:transition-none" />
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </section>
          ))}
        </div>

        <p className="text-muted-600 border-navy-900 mt-16 border-t-2 pt-6 text-sm">
          We don&apos;t do interstate moves, and we don&apos;t currently move pianos, safes or pool
          tables. Not sure if we can help with something? Call{" "}
          <a
            href={`tel:${business.phoneE164}`}
            className="text-navy-900 tabular font-semibold underline decoration-2 underline-offset-4"
          >
            {business.phoneDisplay}
          </a>
          .
        </p>
      </Container>
    </>
  );
}
