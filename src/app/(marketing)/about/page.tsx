import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { business } from "@/config/business";
import { ctaCopy } from "@/config/copy";

export const metadata: Metadata = {
  title: "About us",
  description: `${business.tradingName} is a ${business.baseSuburb} based removalist crew. Here's our story and how we work.`,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">Our story</h1>
        <p className="text-muted-foreground mt-2">
          Based in {business.baseSuburb}, moving {business.serviceAreaDescription}.
        </p>
      </div>

      <div className="space-y-6 leading-relaxed">
        <p>
          Cameleers were Australia&apos;s original long-haul movers. In 1860, camels and cameleers
          landed at Port Melbourne to carry supplies for the Burke and Wills expedition, and for
          decades after they hauled goods across the country through some genuinely tough
          conditions, heat, distance, and terrain that beat most other transport of the time.
        </p>
        <p>
          {business.tradingName} takes the name because we back the same idea: turn up, carry the
          load, get it there properly, no drama. We&apos;re not trying to be the cheapest crew in
          Melbourne or the flashiest. We quote honestly, we show up when we say we will, and we
          treat your things like they&apos;re going into our own home.
        </p>
        <p>
          We&apos;re based in {business.baseSuburb} and built the business around the Cranbourne
          growth corridor first, the suburbs we actually know, before expanding across{" "}
          {business.serviceAreaDescription}. Every job runs the same way regardless of postcode: one
          transparent hourly rate, a real crew, and the right truck for the job.
        </p>
        <p>
          {business.tradingName} is still a young business. We&apos;d rather tell you that honestly
          than pad out a story with numbers we can&apos;t back up. What we can promise is
          straightforward pricing and a crew that treats your move like it matters, because it does.
        </p>
      </div>

      <div className="mt-12 rounded-lg border p-6 text-center">
        <h2 className="font-heading text-xl font-medium">Our crew</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          {business.crewSize} movers, {business.fleet.map((truck) => truck.label).join(" and ")}.
          Real photos of the truck and crew are going up as we get them, this section will fill in
          as the site grows.
        </p>
      </div>

      <div className="mt-12 text-center">
        <Button size="lg" render={<Link href="/quote" />} nativeButton={false}>
          {ctaCopy.primary}
        </Button>
      </div>
    </div>
  );
}
