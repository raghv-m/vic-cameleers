import type { Metadata } from "next";
import { connection } from "next/server";

import { QuoteFlow } from "@/components/quote/quote-flow";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { business } from "@/config/business";
import { getPublishedSuburb } from "@/content/suburbs";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Free removalist quote Melbourne",
  price: true,
  path: "/quote",
  description: `Get a real price range for your Melbourne move in a couple of minutes, worked out from your actual job. ${business.hourlyRateShort}, ${business.minimumHours} hour minimum.`,
});

export default async function QuotePage({ searchParams }: PageProps<"/quote">) {
  // Rendered per request: the form loads Turnstile under the nonce CSP (src/proxy.ts).
  await connection();

  // Suburb pages link here with ?suburb=<slug>. Only a published suburb's own name and
  // postcode are used, never the raw query value.
  const { suburb: suburbParam } = await searchParams;
  const suburb = typeof suburbParam === "string" ? getPublishedSuburb(suburbParam) : undefined;
  const initialPickupAddress = suburb ? `${suburb.name} VIC ${suburb.postcode}` : "";
  return (
    <>
      <div className="mx-auto max-w-xl px-4 pt-8 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ name: "Get a quote", path: "/quote" }]} className="mb-0" />
      </div>
      <QuoteFlow initialPickupAddress={initialPickupAddress} />
    </>
  );
}
