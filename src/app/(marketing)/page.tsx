import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { RouteConnector } from "@/components/brand/route";
import {
  CoverageSection,
  FinalCta,
  ReviewsStop,
  StorySection,
} from "@/components/home/closing-sections";
import { FleetSelector, type FleetTier } from "@/components/home/fleet-selector";
import { Hero } from "@/components/home/hero";
import { ProcessRoute } from "@/components/home/process-route";
import { ServiceManifest } from "@/components/home/service-manifest";
import { TrustSection } from "@/components/home/trust-section";
import { Container, SectionHeader } from "@/components/site/layout-primitives";
import { business } from "@/config/business";
import { serviceDirectory } from "@/config/service-directory";
import { db } from "@/lib/db";
import { calculateQuote } from "@/lib/pricing";
import { getPricingSettings } from "@/lib/pricing-settings";
import { pageMetadata } from "@/lib/seo";
import type { PricingSettings, PropertySize } from "@/types/pricing";

export const metadata: Metadata = pageMetadata({
  title: "Removalists Melbourne",
  price: true,
  path: "/",
  description: `Removalists based in Cranbourne, moving homes and businesses across Melbourne. ${business.hourlyRateShort}, ${business.minimumHours} hour minimum, 6 and 10 tonne trucks. Get a free estimate in minutes.`,
});

function exampleFor(size: PropertySize, settings: PricingSettings): string {
  const result = calculateQuote(
    {
      propertySize: size,
      pickupAccess: { flightsOfStairsNoLift: 0, longCarry: false },
      dropoffAccess: { flightsOfStairsNoLift: 0, longCarry: false },
      travelMinutes: 20,
    },
    settings,
  );
  const low = `$${(result.priceLowCents / 100).toLocaleString("en-AU")}`;
  const high = `$${(result.priceHighCents / 100).toLocaleString("en-AU")}`;
  return low === high ? low : `${low} to ${high}`;
}

function fleetTiers(settings: PricingSettings): FleetTier[] {
  const note =
    "From our current rates, with easy access at both ends and about a 20 minute drive. Your quote will reflect your actual move.";
  return [
    {
      id: "small",
      index: "01",
      title: "Single items and small loads",
      truck: "six",
      truckLabel: "6 tonne truck",
      crew: "2 movers",
      typical: "A couch, a fridge, a marketplace pickup",
      example: exampleFor("singleItem", settings),
      exampleNote: note,
      image: "fleet6t",
      load: { couch: 1, bed: 0, fridge: 1, boxes: 3 },
    },
    {
      id: "standard",
      index: "02",
      title: "Homes up to 2 bedrooms",
      truck: "six",
      truckLabel: "6 tonne truck",
      crew: "2 movers",
      typical: "Studio, unit or 2 bedroom home",
      example: exampleFor("2bed", settings),
      exampleNote: note,
      image: "fleet6t",
      load: { couch: 1, bed: 1, fridge: 1, boxes: 6 },
    },
    {
      id: "large",
      index: "03",
      title: "3+ bedrooms and offices",
      truck: "ten",
      truckLabel: "10 tonne truck",
      crew: "3 to 4 movers",
      typical: "Family homes and small offices",
      example: exampleFor("3bed", settings),
      exampleNote: note,
      image: "fleet10t",
      load: { couch: 2, bed: 2, fridge: 1, boxes: 6 },
    },
  ];
}

export default async function Home() {
  const settings = await getPricingSettings();
  const reviewCount = await db.review.count({ where: { status: "APPROVED" } }).catch(() => 0);

  return (
    <>
      <Hero settings={settings} />

      <RouteConnector bend="right" label="Stop 02" />
      <section aria-labelledby="services-title" className="pt-6 pb-16 sm:pb-20">
        <Container>
          <SectionHeader
            index="02 / What we move"
            id="services-title"
            title="Homes, offices and single items."
            lede="Pick what's moving. Every job is the same hourly rate, with the truck and crew matched to the load."
            className="mb-10"
          />
          <ServiceManifest categories={serviceDirectory} />
        </Container>
      </section>

      <RouteConnector bend="left" label="Stop 03" />
      <section aria-labelledby="process-title" className="pt-6 pb-16 sm:pb-20">
        <Container>
          <SectionHeader
            index="03 / How it works"
            id="process-title"
            title="Four stops from quote to unloaded."
            className="mb-12"
          />
          <ProcessRoute />
          <Link
            href="/how-it-works"
            className="text-navy-900 mt-10 inline-flex min-h-11 items-center gap-2 font-semibold underline decoration-2 underline-offset-4"
          >
            The full process
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Container>
      </section>

      <RouteConnector bend="right" label="Stop 04" />
      <section
        aria-labelledby="trust-title"
        className="blueprint-grid border-navy-900/15 border-y py-16 sm:py-20"
      >
        <Container>
          <SectionHeader
            index="04 / Before you book"
            id="trust-title"
            title="The questions worth asking any removalist."
            lede="Here's how we'd answer them. Nothing on this list is a promise we can't back."
            className="mb-10"
          />
          <TrustSection />
        </Container>
      </section>

      <RouteConnector bend="left" label="Stop 05" />
      <CoverageSection />

      <RouteConnector bend="right" label="Stop 06" />
      <section aria-labelledby="fleet-title" className="kraft-band py-16 sm:py-20">
        <Container>
          <SectionHeader
            index="06 / The fleet"
            id="fleet-title"
            title="Two trucks, matched to the job."
            lede="Pick a job size to see which truck and crew it gets. The truck and crew follow the size of the job."
            className="mb-10"
          />
          <FleetSelector tiers={fleetTiers(settings)} />
        </Container>
      </section>

      <StorySection />
      <ReviewsStop />
      <FinalCta index={reviewCount > 0 ? "09" : "08"} />
    </>
  );
}
