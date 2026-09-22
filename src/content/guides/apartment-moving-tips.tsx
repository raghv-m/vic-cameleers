import Link from "next/link";

import { GuideH2, GuideList, GuideP } from "@/components/guides/guide-elements";
import type { Guide } from "./types";

function Body() {
  return (
    <>
      <GuideP>
        Apartments and units come with a few things a house move doesn&apos;t: lifts, building
        rules, and tighter access. A bit of planning ahead makes a real difference.
      </GuideP>

      <GuideH2>Check your building&apos;s move-in and move-out rules</GuideH2>
      <GuideP>
        Many apartment buildings require you to book the lift for a set window, or only allow moves
        during certain hours. Some also need a certificate of currency from your removalist&apos;s
        insurer, or a bond against damage to common areas. Check with your building manager or
        owners corporation well before your date, ideally as soon as you book your removalist.
      </GuideP>

      <GuideH2>Measure doorways and lift dimensions</GuideH2>
      <GuideP>
        Large furniture that fit going in doesn&apos;t always fit coming out, especially if
        you&apos;ve bought anything new since moving in. Measure your biggest pieces against the
        lift and stairwell dimensions ahead of time, so there are no surprises on the day.
      </GuideP>

      <GuideH2>Sort out parking for the truck</GuideH2>
      <GuideP>
        A loading zone or a clear space close to the entrance saves real time. If your building
        doesn&apos;t have one, check whether visitor parking or a nearby street can be used, and let
        your removalist know what to expect.
      </GuideP>

      <GuideH2>Tell your removalist about access, not just the address</GuideH2>
      <GuideList
        items={[
          "Floor number and whether there&apos;s a lift",
          "Any lift booking windows you need to work around",
          "Stairs, if the lift is out of action or too small for larger items",
          "How far the truck can park from the entrance",
        ]}
      />

      <GuideP>
        Include all of this when you{" "}
        <Link href="/quote" className="text-primary hover:underline">
          get your estimate
        </Link>
        , it directly affects how accurate your quote range is.
      </GuideP>
    </>
  );
}

export const apartmentMovingTips: Guide = {
  slug: "apartment-moving-tips",
  title: "Moving out of an apartment: what to plan for",
  description: "Lift bookings, building rules, and access tips for a smoother apartment move.",
  publishedAt: "2026-01-15",
  Body,
};
