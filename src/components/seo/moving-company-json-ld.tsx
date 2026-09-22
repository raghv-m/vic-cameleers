import { headers } from "next/headers";

import { business } from "@/config/business";

/**
 * MovingCompany (LocalBusiness) structured data. No aggregateRating —
 * see CLAUDE.md section 3: no rating claims until real reviews exist.
 */
export async function MovingCompanyJsonLd() {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

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

  return (
    <script
      type="application/ld+json"
      nonce={nonce}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
