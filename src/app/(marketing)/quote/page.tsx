import type { Metadata } from "next";
import { connection } from "next/server";

import { QuoteFlow } from "@/components/quote/quote-flow";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Container } from "@/components/site/layout-primitives";
import { business } from "@/config/business";
import { allSuburbs, getPublishedSuburb } from "@/content/suburbs";
import { getPricingSettings } from "@/lib/pricing-settings";
import { pageMetadata } from "@/lib/seo";
import { prefillFromSearchParams } from "@/lib/quote-prefill";

export const metadata: Metadata = pageMetadata({
  title: "Free removalist quote Melbourne",
  price: true,
  path: "/quote",
  description: `Get a real price range for your Melbourne move in a couple of minutes, worked out from your actual job. ${business.hourlyRateShort}, ${business.minimumHours} hour minimum.`,
});

export default async function QuotePage({ searchParams }: PageProps<"/quote">) {
  // Rendered per request: the form loads Turnstile under the nonce CSP (src/proxy.ts).
  await connection();

  const params = await searchParams;
  const settings = await getPricingSettings();
  const initialValues = prefillFromSearchParams(params, getPublishedSuburb);
  const suburbOptions = allSuburbs.map((suburb) => `${suburb.name} VIC ${suburb.postcode}`);

  return (
    <div data-hides-mobile-bar>
      <Container className="pt-4 pb-16 sm:pb-24">
        <Breadcrumbs items={[{ name: "Get a quote", path: "/quote" }]} />
        <header className="mb-8 max-w-[60ch]">
          <h1 className="font-headline text-navy-900 display-lg">Get your moving quote</h1>
          <p className="text-ink-900 mt-3 text-lg">
            Three short steps. You&apos;ll see an estimated price as you go, and we confirm the real
            quote with you before anything is booked.
          </p>
        </header>
        <QuoteFlow
          settings={settings}
          initialValues={initialValues}
          suburbOptions={suburbOptions}
        />
      </Container>
    </div>
  );
}
