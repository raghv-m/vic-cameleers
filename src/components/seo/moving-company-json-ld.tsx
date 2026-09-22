import { business } from "@/config/business";
import { JsonLd } from "@/components/seo/json-ld";

/**
 * MovingCompany (LocalBusiness) structured data. No aggregateRating —
 * see CLAUDE.md section 3: no rating claims until real reviews exist.
 */
export function MovingCompanyJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "MovingCompany",
    name: business.tradingName,
    url: business.siteUrl,
    telephone: business.phoneE164,
    taxID: business.abn,
    areaServed: {
      "@type": "AdministrativeArea",
      name: business.serviceAreaDescription,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: business.baseSuburb.replace(" VIC", ""),
      addressRegion: "VIC",
      addressCountry: "AU",
    },
    priceRange: business.hourlyRateDisplay,
  };

  return <JsonLd data={data} />;
}
