import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";
import { business } from "@/config/business";

export const metadata: Metadata = {
  title: "Cancellation Policy",
  description: `How to reschedule or cancel a booking with ${business.tradingName}.`,
};

// TODO(owner): the specific notice period and any cancellation fee are not
// confirmed yet (see TODO-OWNER.md). This page intentionally states the
// general approach without inventing numbers. Update once confirmed.
export default function CancellationPolicyPage() {
  return (
    <LegalPage title="Cancellation Policy" updated="2026">
      <p className="text-muted-foreground">
        Plans change, we get it. Here&apos;s how rescheduling and cancelling works with{" "}
        {business.tradingName}.
      </p>

      <h2>Rescheduling</h2>
      <p>
        Need to move your date? Call us on {business.phoneDisplay} as early as you can. We&apos;ll
        always do our best to find you a new time that works.
      </p>

      <h2>Cancelling</h2>
      <p>
        If you need to cancel a booked move, call us as soon as possible. The more notice you can
        give us, the more likely we can fill that slot and avoid any cancellation cost.
      </p>

      <h2>Late cancellations and no-shows</h2>
      <p>
        We hold a truck and crew for your booking, so cancelling with very little notice, or not
        being available when we arrive, has a real cost to us. We&apos;ll always talk this through
        with you directly rather than surprise you with a fee.
      </p>

      <h2>Questions</h2>
      <p>
        If anything here is unclear, just ask. Call {business.phoneDisplay} or use our{" "}
        <a href="/contact" className="text-primary hover:underline">
          contact form
        </a>
        .
      </p>
    </LegalPage>
  );
}
