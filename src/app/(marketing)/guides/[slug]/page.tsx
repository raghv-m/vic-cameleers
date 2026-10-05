import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
// parseISO reads a date-only string as a local date; new Date() would read it as UTC
// midnight and show the previous day in timezones behind UTC.
import { format, parseISO } from "date-fns";

import { RouteArrow } from "@/components/brand/signage";
import { GuideToc } from "@/components/guides/guide-toc";
import { ShareButtons } from "@/components/marketing/share-buttons";
import { JsonLd } from "@/components/seo/json-ld";
import { InlineCta } from "@/components/site/inline-cta";
import { Container } from "@/components/site/layout-primitives";
import { PageHeader } from "@/components/site/page-header";
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

  const articleId = "guide-body";

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <PageHeader
        breadcrumbs={[
          { name: "Guides", path: "/guides" },
          { name: guide.title, path: `/guides/${guide.slug}` },
        ]}
        label="Moving guide"
        title={guide.title}
        lede={
          <>
            <p>{guide.description}</p>
            <p className="text-muted-600 mt-3 text-sm">
              By the {GUIDE_AUTHOR.name} &middot;{" "}
              <time dateTime={guide.publishedAt}>
                {format(parseISO(guide.publishedAt), "d MMMM yyyy")}
              </time>
            </p>
          </>
        }
      />

      <Container className="grid gap-10 py-12 sm:py-16 lg:grid-cols-12 lg:gap-12">
        <aside className="lg:order-last lg:col-span-4">
          <div className="space-y-8 lg:sticky lg:top-24">
            <GuideToc articleId={articleId} />
            {relatedService && (
              <div className="border-navy-900 border-t-2 pt-4">
                <p className="manifest-index text-muted-600">Related service</p>
                <Link
                  href={`/services/${relatedService.slug}`}
                  className="text-navy-900 hover:text-terracotta-600 mt-2 inline-flex min-h-11 items-center gap-2 text-lg font-bold"
                >
                  {relatedService.name}
                  <RouteArrow className="text-terracotta-600 w-6" />
                </Link>
              </div>
            )}
          </div>
        </aside>

        <div className="lg:col-span-8">
          <article id={articleId} className="prose-vc">
            <guide.Body />
          </article>
          <ShareButtons
            path={`/guides/${guide.slug}`}
            title={guide.title}
            className="border-navy-900/20 mt-10 max-w-[68ch] border-t pt-6"
          />
          <InlineCta className="mt-12 max-w-[68ch]" />
        </div>
      </Container>
    </>
  );
}
