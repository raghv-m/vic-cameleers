import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { business } from "@/config/business";
import { ctaCopy } from "@/config/copy";
import { getGuideBySlug, guides } from "@/content/guides";

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: PageProps<"/guides/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};

  return { title: guide.title, description: guide.description };
}

export default async function GuidePage({ params }: PageProps<"/guides/[slug]">) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.publishedAt,
    author: { "@type": "Organization", name: business.tradingName },
    publisher: { "@type": "Organization", name: business.tradingName },
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <JsonLd data={articleJsonLd} />

      <Link href="/guides" className="text-muted-foreground text-sm hover:underline">
        &larr; All guides
      </Link>

      <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{guide.title}</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        {format(new Date(guide.publishedAt), "d MMMM yyyy")}
      </p>

      <div className="mt-8">
        <guide.Body />
      </div>

      <div className="mt-12 border-t pt-8 text-center">
        <Button size="lg" render={<Link href="/quote" />} nativeButton={false}>
          {ctaCopy.primary}
        </Button>
      </div>
    </div>
  );
}
