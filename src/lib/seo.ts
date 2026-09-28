import type { Metadata } from "next";

import { business } from "@/config/business";

/** Google truncates titles around 60 characters, so every title is built to fit inside that. */
export const TITLE_MAX_LENGTH = 60;

/**
 * Default social share image, 1200x630.
 * The homepage hero photo cropped to 1200x630 (public/og/default.jpg). To change it, replace the
 * file at the same path and size, no code change.
 */
export const DEFAULT_OG_IMAGE = {
  url: "/og/default.jpg",
  width: 1200,
  height: 630,
  alt: `${business.tradingName}, removalists based in ${business.baseSuburb.replace(" VIC", "")}, ${business.hourlyRateShort}`,
};

/**
 * "[keyword] | From $120/hr | Vic Cameleers", dropping the price and then the brand if the
 * title would run past the 60 character budget. The brand never appears twice.
 */
export function seoTitle(keyword: string, { price = false }: { price?: boolean } = {}): string {
  const brand = business.tradingName;
  const candidates = [
    ...(price ? [`${keyword} | From ${business.hourlyRateShort} | ${brand}`] : []),
    `${keyword} | ${brand}`,
  ];
  return candidates.find((title) => title.length <= TITLE_MAX_LENGTH) ?? keyword;
}

interface PageMetadataOptions {
  /** Primary keyword for the page, without the brand, e.g. "Removalists Clyde North". */
  title: string;
  description: string;
  /** Site-relative path of this page, used as its self-referencing canonical. */
  path: string;
  /** Include "From $120/hr" in the title when it fits. */
  price?: boolean;
  image?: { url: string; width: number; height: number; alt: string };
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
}

/**
 * Canonical, title, description, Open Graph and Twitter card for a public page. Page-level
 * `openGraph` replaces the layout's rather than merging with it, so every field is set here.
 * Relative URLs resolve against metadataBase (SITE_URL) in the root layout.
 */
export function pageMetadata({
  title,
  description,
  path,
  price = false,
  image = DEFAULT_OG_IMAGE,
  type = "website",
  publishedTime,
  modifiedTime,
}: PageMetadataOptions): Metadata {
  const fullTitle = seoTitle(title, { price });

  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      siteName: business.tradingName,
      locale: "en_AU",
      title: fullTitle,
      description,
      images: [image],
      ...(type === "article" ? { publishedTime, modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image.url],
    },
  };
}
