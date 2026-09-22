import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";
import { business } from "@/config/business";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: `Terms for using the ${business.tradingName} website and booking a move.`,
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms and Conditions" updated="2026">
      <p className="text-muted-foreground">
        These terms apply to your use of this website and to any move you book with{" "}
        {business.tradingName} (ABN {business.abn}, ACN {business.acn}). By using this site or
        booking with us, you agree to them.
      </p>

      <h2>Service area</h2>
      <p>
        We move homes and businesses across {business.serviceAreaDescription}. We don&apos;t
        currently offer interstate removals.
      </p>

      <h2>Estimates and pricing</h2>
      <ul>
        <li>
          Every price shown on this site, including the quote flow, is an estimate based on the
          details you give us, not a fixed quote.
        </li>
        <li>
          The final price is based on the actual time the job takes at our published hourly rate,
          plus the call-out fee and any extras you request.
        </li>
        <li>
          If the details of your move turn out to be different on the day (more items, harder
          access, and so on), the price may change, we&apos;ll always talk to you about it first.
        </li>
      </ul>

      <h2>Bookings and cancellations</h2>
      <p>
        Bookings are confirmed by phone or SMS after you submit a quote. See our{" "}
        <a href="/cancellation-policy" className="text-primary hover:underline">
          cancellation policy
        </a>{" "}
        for details on changing or cancelling a booked move.
      </p>

      <h2>Your responsibilities</h2>
      <ul>
        <li>Give us accurate information about your move so the estimate is realistic</li>
        <li>Make sure someone is available at both addresses on moving day</li>
        <li>Let us know about any items needing special handling before the day</li>
      </ul>

      <h2>Website use</h2>
      <p>
        This website and its content, including text, design, and the Vic Cameleers name and logo,
        belong to {business.tradingName}. You&apos;re welcome to browse and use it to get a quote or
        get in touch, but please don&apos;t copy or republish our content without asking us first.
      </p>

      <h2>Liability</h2>
      <p>
        Nothing in these terms excludes, restricts, or modifies any consumer guarantee, right, or
        remedy you have under the Australian Consumer Law that can&apos;t lawfully be excluded. To
        the extent the law allows, our liability for any claim relating to our services is limited
        to re-supplying the service or the cost of doing so.
      </p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of Victoria, Australia.</p>

      <h2>Contact us</h2>
      <p>
        Questions about these terms? Call {business.phoneDisplay} or use our{" "}
        <a href="/contact" className="text-primary hover:underline">
          contact form
        </a>
        .
      </p>
    </LegalPage>
  );
}
