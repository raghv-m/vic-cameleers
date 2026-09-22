import Link from "next/link";

import { GuideH2, GuideList, GuideP } from "@/components/guides/guide-elements";
import type { Guide } from "./types";

function Body() {
  return (
    <>
      <GuideP>
        Good packing protects your things and makes moving day faster, since a well-packed box loads
        and unloads in seconds instead of minutes.
      </GuideP>

      <GuideH2>Start with what you use least</GuideH2>
      <GuideP>
        Pack out-of-season clothes, spare linen, books, and decorations first. Save your kitchen,
        bathroom, and anything you use daily for last.
      </GuideP>

      <GuideH2>Use the right box for the job</GuideH2>
      <GuideList
        items={[
          "Small boxes for heavy items like books, so they stay liftable",
          "Medium boxes for kitchenware and general items",
          "Large boxes for light, bulky things like linen and cushions",
          "Wardrobe boxes for hanging clothes, saves folding and re-ironing",
        ]}
      />

      <GuideH2>Label every box properly</GuideH2>
      <GuideP>
        Write the room it&apos;s going to and a rough idea of what&apos;s inside on at least two
        sides. It means your removalist can put boxes straight into the right room, and you&apos;re
        not opening ten boxes to find the kettle.
      </GuideP>

      <GuideH2>Protect fragile items properly</GuideH2>
      <GuideList
        items={[
          "Wrap plates individually and pack them on their edge, not flat",
          "Fill gaps in boxes with paper or towels so nothing shifts in transit",
          "Keep glassware and electronics away from the bottom of the box",
          "Use a dedicated box for anything irreplaceable, and let your removalist know",
        ]}
      />

      <GuideH2>Pack an essentials box last</GuideH2>
      <GuideP>
        Toiletries, a change of clothes, phone chargers, basic tools, and anything you&apos;ll need
        the first night. Keep it with you rather than in the truck.
      </GuideP>

      <GuideP>
        Don&apos;t want to pack it all yourself? We offer full or partial packing as part of{" "}
        <Link href="/services/packing" className="text-primary hover:underline">
          our packing service
        </Link>
        .
      </GuideP>
    </>
  );
}

export const packingGuide: Guide = {
  slug: "how-to-pack-for-a-move",
  title: "How to pack for a move: a room-by-room guide",
  description: "Practical packing tips, from choosing the right boxes to protecting fragile items.",
  publishedAt: "2026-01-22",
  Body,
};
