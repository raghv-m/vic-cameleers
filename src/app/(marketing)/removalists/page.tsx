import type { Metadata } from "next";
import Link from "next/link";

import { CoverageMap } from "@/components/brand/coverage-map";
import { RouteArrow, SignPlate } from "@/components/brand/signage";
import { InlineCta } from "@/components/site/inline-cta";
import { Container, SectionHeader } from "@/components/site/layout-primitives";
import { PageHeader } from "@/components/site/page-header";
import { business } from "@/config/business";
import { allSuburbs, publishedSuburbs } from "@/content/suburbs";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Removalists south-east Melbourne",
  price: true,
  path: "/removalists",
  description: `Suburbs we move across Casey, Cardinia and south-east Melbourne from our Cranbourne base. ${business.hourlyRateShort}, ${business.minimumHours} hour minimum. Get a free quote.`,
});

export default function ServiceAreasPage() {
  // Grouped by council, closest to the depot first within each group.
  const councils = [...new Set(publishedSuburbs.map((suburb) => suburb.council))];
  const alsoServed = allSuburbs.filter((suburb) => !suburb.published);

  return (
    <>
      <PageHeader
        breadcrumbs={[{ name: "Service areas", path: "/removalists" }]}
        label="Service areas"
        title="Based in Cranbourne. Moving all of Greater Melbourne."
        lede={
          <p>
            The south-east is minutes from the depot, and we go anywhere in{" "}
            {business.serviceAreaDescription}. Victoria only, no interstate moves.
          </p>
        }
      />

      <Container className="grid gap-10 py-12 sm:py-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:order-last lg:col-span-7">
          <div className="border-navy-900 bg-sand-50 rounded-sm border-2 p-3 sm:p-5 lg:sticky lg:top-24">
            <CoverageMap />
          </div>
        </div>
        <div className="space-y-10 lg:col-span-5">
          {councils.map((council) => (
            <section key={council} aria-labelledby={`council-${council}`}>
              <h2 id={`council-${council}`} className="manifest-index text-terracotta-600">
                {council}
              </h2>
              <ul className="border-navy-900 mt-3 border-t-2">
                {publishedSuburbs
                  .filter((suburb) => suburb.council === council)
                  .sort(
                    (a, b) =>
                      (a.driveTimeFromCranbourneMins ?? 0) - (b.driveTimeFromCranbourneMins ?? 0),
                  )
                  .map((suburb) => (
                    <li key={suburb.slug} className="border-navy-900/20 border-b">
                      <Link
                        href={`/removalists/${suburb.slug}`}
                        className="group text-navy-900 hover:text-terracotta-600 flex min-h-14 items-center justify-between gap-3"
                      >
                        <span>
                          <span className="font-headline block text-xl">
                            Removalists {suburb.name}
                          </span>
                          <span className="text-muted-600 tabular block text-sm">
                            {suburb.postcode} &middot;{" "}
                            {suburb.driveTimeFromCranbourneMins
                              ? `about ${suburb.driveTimeFromCranbourneMins} min from the depot`
                              : "our home base"}
                          </span>
                        </span>
                        <RouteArrow className="w-6 shrink-0 transition-transform duration-150 group-hover:translate-x-1 motion-reduce:transition-none" />
                      </Link>
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </div>
      </Container>

      {alsoServed.length > 0 && (
        <section className="kraft-band py-12 sm:py-16">
          <Container>
            <SectionHeader
              size="md"
              title="We move here too"
              lede={
                <p>
                  These suburbs don&apos;t have their own page yet, but they&apos;re well inside our
                  area. Same rate, same crew.
                </p>
              }
            />
            <ul className="mt-6 flex flex-wrap gap-2">
              {alsoServed.map((suburb) => (
                <li
                  key={suburb.slug}
                  className="border-navy-900/30 bg-sand-50 text-navy-900 rounded-sm border px-3 py-1.5 text-sm font-semibold"
                >
                  {suburb.name}{" "}
                  <span className="text-muted-600 tabular font-medium">{suburb.postcode}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <SignPlate tone="amber">Victoria only</SignPlate>
            </div>
          </Container>
        </section>
      )}

      <Container className="py-16 sm:py-24">
        <InlineCta title="Moving in or out of one of these suburbs?" />
      </Container>
    </>
  );
}
