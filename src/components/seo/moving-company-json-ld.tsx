import { JsonLd } from "@/components/seo/json-ld";
import { business } from "@/config/business";
import { getEnabledServices } from "@/config/services";
import { absoluteUrl, SITE_URL } from "@/config/site-url";
import { publishedSuburbs } from "@/content/suburbs";
import { BUSINESS_ID, hourlyPriceSpecification } from "@/lib/structured-data";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

/**
 * The one MovingCompany node, rendered on every public page (marketing layout). Other schemas
 * point at it by @id. Only facts the business has confirmed go here:
 *
 * - No street address: it's a service-area business, so the address is suburb level only.
 * - No openingHoursSpecification: hours aren't confirmed (business.openingHours).
 * - No sameAs: no Google Business Profile or socials yet (business.googleBusinessProfileUrl,
 *   business.social). Added automatically once those are set.
 * - No aggregateRating/review: not until real reviews exist (business.reviewSchemaEnabled), and
 *   then only on pages that show them. CLAUDE.md section 3.
 */
export function MovingCompanyJsonLd() {
  const sameAs = [
    business.googleBusinessProfileUrl,
    business.social.facebook,
    business.social.instagram,
  ].filter((url): url is string => Boolean(url));

  const data = {
    "@context": "https://schema.org",
    "@type": "MovingCompany",
    "@id": BUSINESS_ID,
    name: business.tradingName,
    ...(business.legalName ? { legalName: business.legalName } : {}),
    url: SITE_URL,
    // TODO(owner): swap for the real logo once one is designed (CLAUDE.md section 2).
    logo: absoluteUrl("/apple-icon"),
    // TODO(owner): add real photos of the trucks and crew here once shot (docs/photo-shot-list.md).
    image: [absoluteUrl(DEFAULT_OG_IMAGE.url)],
    telephone: business.phoneE164,
    ...(business.publicEmail ? { email: business.publicEmail } : {}),
    priceRange: `From ${business.hourlyRateDisplay}`,
    taxID: business.abn,
    address: {
      "@type": "PostalAddress",
      addressLocality: business.baseSuburb.replace(" VIC", ""),
      postalCode: business.basePostcode,
      addressRegion: "VIC",
      addressCountry: "AU",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: business.baseGeo.latitude,
      longitude: business.baseGeo.longitude,
    },
    areaServed: publishedSuburbs.map((suburb) => ({
      "@type": "City",
      name: suburb.name,
      address: {
        "@type": "PostalAddress",
        postalCode: suburb.postcode,
        addressRegion: "VIC",
        addressCountry: "AU",
      },
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Removal services",
      itemListElement: getEnabledServices().map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.name,
          description: service.shortDescription,
          url: absoluteUrl(`/services/${service.slug}`),
        },
        priceSpecification: hourlyPriceSpecification(),
      })),
    },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };

  return <JsonLd data={data} />;
}
