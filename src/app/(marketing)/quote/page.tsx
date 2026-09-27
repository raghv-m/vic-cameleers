import type { Metadata } from "next";
import { connection } from "next/server";

import { QuoteFlow } from "@/components/quote/quote-flow";
import { business } from "@/config/business";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Free removalist quote Melbourne",
  price: true,
  path: "/quote",
  description: `Get a real price range for your Melbourne move in a couple of minutes, worked out from your actual job. ${business.hourlyRateShort}, ${business.minimumHours} hour minimum.`,
});

export default async function QuotePage() {
  // Rendered per request: the form loads Turnstile under the nonce CSP (src/proxy.ts).
  await connection();
  return <QuoteFlow />;
}
