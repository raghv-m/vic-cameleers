import Link from "next/link";

import { GuideH2, GuideP } from "@/components/guides/guide-elements";
import { business } from "@/config/business";
import type { Guide } from "./types";

function Body() {
  return (
    <>
      <GuideP>
        When you&apos;re comparing removalists, you&apos;ll usually see two pricing models: hourly
        rate, or a fixed quote. Both are legitimate, but they work differently, and it&apos;s worth
        knowing why before you book.
      </GuideP>

      <GuideH2>Fixed price</GuideH2>
      <GuideP>
        A fixed price is agreed upfront, usually after a phone call or an in-home assessment. The
        advantage is certainty, you know the number before moving day. The trade-off is that the
        mover has to price in some buffer for the unexpected, since they&apos;re taking on the risk
        if the job runs long. That buffer is baked into the number whether your move needs it or
        not.
      </GuideP>

      <GuideH2>Hourly rate</GuideH2>
      <GuideP>
        An hourly rate means you pay for the time the job actually takes. If your move goes smoothly
        and finishes early, you pay less. If it runs longer than expected, say a lift breaks down or
        there&apos;s more to pack than planned, you pay for that extra time rather than the mover
        absorbing a loss or the price being padded to cover it either way.
      </GuideP>
      <GuideP>
        The trade-off is less certainty about the exact final number, which is why a good estimate
        range matters. We quote {business.hourlyRateDisplay} with a {business.minimumHours} hour
        minimum, and give you a real low-to-high range based on your actual move, not a single
        number pulled from thin air.
      </GuideP>

      <GuideH2>Why we quote hourly</GuideH2>
      <GuideP>
        We think it&apos;s the fairer model for most household moves. You&apos;re not paying for a
        worst-case buffer you might never need, and you can see exactly what&apos;s driving the
        price, base hours for your property size, access at both ends, and any extras. See our{" "}
        <Link href="/pricing" className="text-primary hover:underline">
          pricing page
        </Link>{" "}
        for worked examples, or{" "}
        <Link href="/quote" className="text-primary hover:underline">
          get your own estimate
        </Link>
        .
      </GuideP>
    </>
  );
}

export const hourlyVsFixedPrice: Guide = {
  slug: "hourly-vs-fixed-price-removalists",
  title: "Hourly rate vs fixed price: which is better for your move?",
  description:
    "The real difference between hourly and fixed-price removalist quotes, and why it matters.",
  publishedAt: "2026-01-29",
  Body,
};
