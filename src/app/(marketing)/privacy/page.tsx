import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";
import { business } from "@/config/business";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy policy",
  path: "/privacy",
  description: `How ${business.tradingName} collects, uses and protects your personal information, in line with the Australian Privacy Principles.`,
});

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" path="/privacy" updated="October 2026">
      <p className="text-lg">
        {business.tradingName} (ABN {business.abn}) respects your privacy. This policy explains what
        personal information we collect, why we collect it, and what we do with it, in line with the
        Australian Privacy Principles under the Privacy Act 1988 (Cth).
      </p>

      <h2>What we collect</h2>
      <p>When you use our quote form, contact form, or call us, we may collect:</p>
      <ul>
        <li>Your name, mobile number, and email address</li>
        <li>
          Pickup and drop-off addresses and details about your move (property type, access,
          inventory)
        </li>
        <li>Any message or notes you give us</li>
        <li>
          Technical information like your IP address and browser details, used to protect the site
          from spam and abuse
        </li>
      </ul>
      <p>We never ask for payment card details through this website.</p>

      <h2>Why we collect it</h2>
      <ul>
        <li>To calculate and send you a moving estimate</li>
        <li>To respond to enquiries sent through the contact form</li>
        <li>To confirm and manage a booking if you go ahead</li>
        <li>To protect the site against spam, bots, and abuse</li>
        <li>To meet our own legal and accounting obligations</li>
      </ul>

      <h2>Who we share it with</h2>
      <p>
        We use a small number of service providers to run this website and don&apos;t sell or rent
        your information to anyone. These providers process data on our behalf:
      </p>
      <ul>
        <li>Our hosting and database providers, to store your enquiry securely</li>
        <li>
          Resend, to deliver transactional emails (like your quote or a reply to your message)
        </li>
        <li>Cloudflare Turnstile, to tell real visitors apart from bots on our forms</li>
        <li>Google Maps Platform, for address lookup and the maps shown on this site</li>
        <li>
          Google Analytics, to measure how visitors use the site, only if you agree to analytics
          cookies
        </li>
        <li>consentmanager, to record your cookie choices</li>
      </ul>
      <p>
        Some of these providers, including Google, may store or process information outside
        Australia, for example in the United States. We choose providers with strong security and
        privacy commitments.
      </p>

      <h2>Storage and security</h2>
      <p>
        Your information is stored with providers using encrypted connections and access controls.
        We keep enquiry information only as long as it&apos;s useful for the purpose it was
        collected for, or as required by law.
      </p>

      <h2>Access and correction</h2>
      <p>
        You can ask us what personal information we hold about you, and ask us to correct or delete
        it, by contacting us using the details below.
      </p>

      <h2>Cookies and analytics</h2>
      <p>
        We use Vercel Web Analytics, which counts visits without cookies and without tracking you
        across other websites.
      </p>
      <p>
        With your permission, we also use Google Analytics. It sets cookies to tell us things like
        which pages people visit, how they found us, and whether they asked for a quote or called.
        We use this to improve the site, not to build a profile of you, and we don&apos;t use it for
        advertising. When you first visit, a banner asks whether you agree. If you say no, Google
        Analytics doesn&apos;t set its cookies. You can change your choice at any time with the
        &ldquo;Cookie settings&rdquo; link at the bottom of every page.
      </p>
      <p>
        The maps on our contact and service-area pages are provided by Google, which may set its own
        cookies when the map loads. Google&apos;s privacy policy explains how it uses that
        information.
      </p>

      <h2>Complaints</h2>
      <p>
        If you have a concern about how we&apos;ve handled your personal information, contact us
        first so we can try to resolve it. If you&apos;re not satisfied with our response, you can
        contact the Office of the Australian Information Commissioner (OAIC) at oaic.gov.au.
      </p>

      <h2>Contact us</h2>
      <p>
        Call {business.phoneDisplay} or use our <a href="/contact">contact form</a>.
      </p>
    </LegalPage>
  );
}
