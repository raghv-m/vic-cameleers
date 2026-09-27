import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
// parseISO reads a date-only string as a local date; new Date() would read it as UTC
// midnight and show the previous day in timezones behind UTC.
import { format, parseISO } from "date-fns";

import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { business } from "@/config/business";
import { ctaCopy } from "@/config/copy";
import { getServiceBySlug } from "@/config/services";
import { absoluteUrl } from "@/config/site-url";
import { getGuideBySlug, GUIDE_AUTHOR, guides } from "@/content/guides";
import { DEFAULT_OG_IMAGE, pageMetadata } from "@/lib/seo";
import { businessRef } from "@/lib/structured-data";

// Only the guides that exist are ever built; any other slug is a plain 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: PageProps<"/guides/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};

  return pageMetadata({
    title: guide.title,
    path: `/guides/${guide.slug}`,
    description: guide.description,
    type: "article",
    publishedTime: guide.publishedAt,
  });
}

export default async function GuidePage({ params }: PageProps<"/guides/[slug]">) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const relatedService = getServiceBySlug(guide.relatedService);
  const url = absoluteUrl(`/guides/${guide.slug}`);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.publishedAt,
    dateModified: guide.publishedAt,
    author: { "@type": "Organization", name: GUIDE_AUTHOR.name, url: absoluteUrl("/about") },
    publisher: businessRef,
    image: [absoluteUrl(DEFAULT_OG_IMAGE.url)],
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { name: "Guides", path: "/guides" },
          { name: guide.title, path: `/guides/${guide.slug}` },
        ]}
      />
      <JsonLd data={articleJsonLd} />

      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{guide.title}</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        By the {GUIDE_AUTHOR.name} &middot;{" "}
        <time dateTime={guide.publishedAt}>
          {format(parseISO(guide.publishedAt), "d MMMM yyyy")}
        </time>
      </p>

      <div className="mt-8">
        <guide.Body />
      </div>

      <div className="mt-12 border-t pt-8 text-center">
        {relatedService && (
          <p className="text-muted-foreground mb-4 text-sm">
            Related:{" "}
            <Link
              href={`/services/${relatedService.slug}`}
              className="text-primary font-medium hover:underline"
            >
              {relatedService.name} with {business.tradingName}
            </Link>
          </p>
        )}
        <Button size="lg" render={<Link href="/quote" />} nativeButton={false}>
          {ctaCopy.primary}
        </Button>
      </div>
    </div>
  );
}
