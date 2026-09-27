import type { Metadata } from "next";

import { business } from "@/config/business";
import { pageMetadata } from "@/lib/seo";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { FinalCta } from "@/components/marketing/final-cta";
import { FleetSection } from "@/components/marketing/fleet-section";
import { Hero } from "@/components/marketing/hero";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { MovingTimeline } from "@/components/marketing/moving-timeline";
import { PricingTeaser } from "@/components/marketing/pricing-teaser";
import { ReviewsSection } from "@/components/marketing/reviews-section";
import { ServiceAreas } from "@/components/marketing/service-areas";
import { ServicesGrid } from "@/components/marketing/services-grid";
import { TrustStrip } from "@/components/marketing/trust-strip";
import { WhyUs } from "@/components/marketing/why-us";

export const metadata: Metadata = pageMetadata({
  title: "Removalists Melbourne",
  price: true,
  path: "/",
  description: `Removalists based in Cranbourne, moving homes and businesses across Melbourne. ${business.hourlyRateShort}, ${business.minimumHours} hour minimum, 6 and 10 tonne trucks. Get a free quote in a couple of minutes.`,
});

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <ServicesGrid />
      <PricingTeaser />
      <HowItWorks />
      <WhyUs />
      <FleetSection />
      <ServiceAreas />
      <ReviewsSection />
      <MovingTimeline />
      <FaqAccordion />
      <FinalCta />
    </>
  );
}
