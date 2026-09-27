import type { Metadata } from "next";
import Link from "next/link";
// parseISO reads a date-only string as a local date; new Date() would read it as UTC
// midnight and show the previous day in timezones behind UTC.
import { format, parseISO } from "date-fns";

import { RouteArrow } from "@/components/brand/signage";
import { Container } from "@/components/site/layout-primitives";
import { PageHeader } from "@/components/site/page-header";
import { guides } from "@/content/guides";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Moving guides",
  path: "/guides",
  description: `Practical moving advice from a Cranbourne removalist crew: what a move costs, packing, apartment moves and a week-by-week checklist.`,
});

export default function GuidesIndexPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ name: "Guides", path: "/guides" }]}
        label="Moving guides"
        title="Plan the move before the truck turns up."
        lede={
          <p>
            Practical advice from the crew. What it costs, what to pack first, and what to sort out
            with your building.
          </p>
        }
      />
      <Container className="py-12 sm:py-16">
        <ol className="border-navy-900 border-t-2">
          {guides.map((guide, index) => (
            <li key={guide.slug} className="border-navy-900/20 border-b">
              <Link
                href={`/guides/${guide.slug}`}
                className="group grid grid-cols-[3rem_1fr] gap-x-4 gap-y-2 py-7 sm:grid-cols-[4.5rem_1fr_auto] sm:items-center"
              >
                <span className="font-stencil text-terracotta-600 text-3xl leading-none sm:text-4xl">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="font-headline text-navy-900 group-hover:text-terracotta-600 block text-2xl leading-tight transition-colors sm:text-3xl">
                    {guide.title}
                  </span>
                  <span className="text-ink-900 mt-1 block max-w-[60ch]">{guide.description}</span>
                  <span className="text-muted-600 mt-2 block text-sm">
                    {format(parseISO(guide.publishedAt), "d MMMM yyyy")}
                  </span>
                </span>
                <span className="text-navy-900 col-start-2 inline-flex items-center gap-2 text-sm font-bold sm:col-start-3">
                  Read
                  <RouteArrow className="text-terracotta-600 w-6 transition-transform duration-150 group-hover:translate-x-1 motion-reduce:transition-none" />
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </Container>
    </>
  );
}
