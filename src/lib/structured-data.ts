import { business } from "@/config/business";
import { absoluteUrl, SITE_URL } from "@/config/site-url";

/**
 * Shared JSON-LD building blocks. Every schema that mentions the business points at one
 * MovingCompany node by `@id` rather than restating it, so the facts live in one place.
 */

export const BUSINESS_ID = `${SITE_URL}/#business`;

/** Reference to the MovingCompany node rendered on every public page. */
export const businessRef = { "@id": BUSINESS_ID } as const;

/** The hourly rate as a schema.org price, reused by the offer catalogue and Service pages. */
export function hourlyPriceSpecification() {
  return {
    "@type": "UnitPriceSpecification",
    price: business.hourlyRateAud,
    priceCurrency: "AUD",
    unitCode: "HUR",
    unitText: "hour",
  };
}

export interface BreadcrumbItem {
  name: string;
  /** Site-relative path. */
  path: string;
}

/** BreadcrumbList with Home prepended, matching the visible breadcrumb trail. */
export function breadcrumbListJsonLd(items: BreadcrumbItem[]) {
  const trail = [{ name: "Home", path: "/" }, ...items];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** FAQPage from Q&A that's visibly rendered on the same page. Returns null when there are none. */
export function faqPageJsonLd(faqs: readonly { question: string; answer: string }[]) {
  if (faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}
