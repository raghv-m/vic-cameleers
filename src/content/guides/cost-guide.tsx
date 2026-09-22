import Link from "next/link";

import { GuideH2, GuideList, GuideP } from "@/components/guides/guide-elements";
import { business } from "@/config/business";
import type { Guide } from "./types";

function Body() {
  return (
    <>
      <GuideP>
        The honest answer is: it depends on how much you&apos;re moving, how far, and how easy your
        home is to access. But you can get a good sense of what to expect once you understand how
        removalist pricing actually works.
      </GuideP>

      <GuideH2>Hourly rate vs fixed price</GuideH2>
      <GuideP>
        Most removalists, us included, charge an hourly rate rather than a flat fee. That&apos;s
        because no two moves take the same time, even between two homes of the same size. An hourly
        rate means you pay for the time the job actually takes, not a padded estimate built to cover
        the mover&apos;s worst-case scenario.
      </GuideP>
      <GuideP>
        We use {business.hourlyRateDisplay} with a {business.minimumHours} hour minimum, plus a{" "}
        {business.calloutMinutes} minute call-out included in every estimate. See our{" "}
        <Link href="/pricing" className="text-primary hover:underline">
          pricing page
        </Link>{" "}
        for the full breakdown and worked examples.
      </GuideP>

      <GuideH2>What actually affects the price</GuideH2>
      <GuideList
        items={[
          "Property size, more bedrooms means more to load and unload",
          "Access at both ends: stairs, lifts, and how far the truck can park from the door",
          "How much is already packed versus needing a full packing service",
          "Extras like furniture disassembly, or heavy or awkward items",
          "Distance between the pickup and drop-off",
        ]}
      />

      <GuideH2>How to get an accurate estimate</GuideH2>
      <GuideP>
        The most accurate number comes from telling a removalist the real details of your move, not
        a rough guess. Our{" "}
        <Link href="/quote" className="text-primary hover:underline">
          online quote
        </Link>{" "}
        asks for exactly that: your property size, access at both ends, and what extras you need,
        and gives you a real price range in a couple of minutes.
      </GuideP>
    </>
  );
}

export const costGuide: Guide = {
  slug: "how-much-does-a-removalist-cost",
  title: "How much does a removalist cost in Melbourne?",
  description:
    "What actually drives removalist pricing, and how to get an accurate estimate instead of a guess.",
  publishedAt: "2026-01-01",
  Body,
};
