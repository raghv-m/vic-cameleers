import Link from "next/link";

import { GuideH2, GuideList, GuideP } from "@/components/guides/guide-elements";
import type { Guide } from "./types";

function Body() {
  return (
    <>
      <GuideP>
        Moving day goes a lot smoother when the weeks before it are organised. Here&apos;s a simple
        timeline to work from.
      </GuideP>

      <GuideH2>6 to 8 weeks before</GuideH2>
      <GuideList
        items={[
          "Book your removalist and lock in a date",
          "Start sorting through belongings, decide what to sell, donate, or bin",
          "If you&apos;re renting, give notice and confirm your bond inspection date",
          "Research schools, doctors, and services near your new place if you&apos;re moving suburbs",
        ]}
      />

      <GuideH2>2 to 4 weeks before</GuideH2>
      <GuideList
        items={[
          "Start packing rooms you use less often, spare rooms, garage, storage",
          "Organise mail redirection with Australia Post",
          "Update your address with your bank, employer, and Medicare",
          "Book any lift access or building move-in/out windows if you&apos;re in an apartment",
        ]}
      />

      <GuideH2>1 week before</GuideH2>
      <GuideList
        items={[
          "Finish packing everything except daily essentials",
          "Label boxes by room, it makes unloading much faster",
          "Confirm your move time and any access details with your removalist",
          "Arrange parking for the truck at both ends if needed",
        ]}
      />

      <GuideH2>Moving day</GuideH2>
      <GuideList
        items={[
          "Have essentials (medication, chargers, a change of clothes) packed separately",
          "Do a final walkthrough of every room, including cupboards and the garage",
          "Take meter readings if you&apos;re responsible for utilities",
          "Keep your phone charged, your removalist will call or text if anything comes up",
        ]}
      />

      <GuideP>
        Want a hand with the packing itself? See our{" "}
        <Link href="/guides/how-to-pack-for-a-move" className="text-primary hover:underline">
          packing guide
        </Link>
        , or{" "}
        <Link href="/quote" className="text-primary hover:underline">
          get an estimate
        </Link>{" "}
        for your move.
      </GuideP>
    </>
  );
}

export const movingChecklist: Guide = {
  slug: "moving-checklist",
  title: "The complete moving house checklist",
  description:
    "A week-by-week timeline to keep your move organised, from 8 weeks out to moving day.",
  publishedAt: "2026-01-08",
  Body,
};
