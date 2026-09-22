import type { Metadata } from "next";

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

export const metadata: Metadata = {
  title: "Melbourne Removalists",
  description:
    "Vic Cameleers is a Cranbourne based removalist crew moving homes and businesses across Greater Melbourne. Transparent hourly pricing, no surprises.",
};

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
