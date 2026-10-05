import Link from "next/link";
import { CookieSettingsButton } from "@/components/analytics/cookie-settings-button";
import { CranbourneClock } from "@/components/layout/cranbourne-clock";
import { ArrowRight, Phone } from "lucide-react";
import { cn } from "cn";

import { CamelMark } from "@/components/brand/camel-mark";
import { CamelSign } from "@/components/brand/signage";
import { buttonVariants } from "@/components/ui/button";
import { business } from "@/config/business";
import { ctaCopy } from "@/config/copy";
import { footerLegalNav, primaryNav, secondaryNav } from "@/config/nav";
import { getEnabledServices } from "@/config/services";
import { publishedSuburbs } from "@/content/suburbs";

/**
 * The business footer: who we are, what we move, where, how to reach us, and the legal details
 * a customer or a directory might check. Socials only appear once they exist.
 */
export function Footer() {
  const year = new Date().getFullYear();
  const services = getEnabledServices();
  const socials = [
    { label: "Facebook", href: business.social.facebook },
    { label: "Instagram", href: business.social.instagram },
  ].filter((social): social is { label: string; href: string } => Boolean(social.href));

  return (
    <footer data-hides-mobile-bar className="on-navy bg-navy-950 text-sand-200 relative">
      <div className="border-kraft-400/30 border-b">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex items-center gap-5">
            <CamelSign className="size-16 shrink-0" />
            <p className="font-headline text-sand-50 display-md">Moving soon? Get your price.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/quote"
              className={cn(buttonVariants({ size: "lg" }), "tracking-[0.08em] uppercase")}
            >
              {ctaCopy.primary}
              <ArrowRight data-icon="inline-end" />
            </Link>
            <a
              href={`tel:${business.phoneE164}`}
              className={cn(buttonVariants({ variant: "onNavy", size: "lg" }), "tabular")}
            >
              <Phone aria-hidden="true" />
              {business.phoneDisplay}
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] lg:px-8">
        <div className="space-y-4">
          <Link href="/" className="text-sand-50 inline-flex items-center gap-2.5">
            <CamelMark className="text-terracotta-400 h-7 w-auto" />
            <span className="font-headline text-2xl leading-none tracking-[0.04em]">
              VIC CAMELEERS
            </span>
          </Link>
          <p className="max-w-sm text-[0.9375rem]">
            A Cranbourne removals crew with a 6 tonne and a 10 tonne truck, moving homes and
            businesses across Greater Melbourne. Victoria only.
          </p>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
            <dt className="text-kraft-400 font-semibold">Phone</dt>
            <dd>
              <a
                href={`tel:${business.phoneE164}`}
                className="text-sand-50 tabular font-semibold hover:underline"
              >
                {business.phoneDisplay}
              </a>
            </dd>
            {business.publicEmail && (
              <>
                <dt className="text-kraft-400 font-semibold">Email</dt>
                <dd>
                  <a
                    href={`mailto:${business.publicEmail}`}
                    className="text-sand-50 hover:underline"
                  >
                    {business.publicEmail}
                  </a>
                </dd>
              </>
            )}
            <dt className="text-kraft-400 font-semibold">Base</dt>
            <dd>{business.baseSuburb}</dd>
            <dt className="text-kraft-400 font-semibold">Rate</dt>
            <dd>
              {business.hourlyRateDisplay}, {business.minimumHours} hour minimum
            </dd>
          </dl>
          {socials.length > 0 && (
            <ul className="flex gap-4 text-sm">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sand-50 underline-offset-4 hover:underline"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav aria-labelledby="footer-services">
          <h2 id="footer-services" className="text-kraft-400 manifest-index mb-4">
            Services
          </h2>
          <ul className="space-y-2 text-[0.9375rem]">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="text-sand-50 underline-offset-4 hover:underline"
                >
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-areas">
          <h2 id="footer-areas" className="text-kraft-400 manifest-index mb-4">
            Service areas
          </h2>
          <ul className="space-y-2 text-[0.9375rem]">
            {publishedSuburbs.map((suburb) => (
              <li key={suburb.slug}>
                <Link
                  href={`/removalists/${suburb.slug}`}
                  className="text-sand-50 underline-offset-4 hover:underline"
                >
                  {suburb.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/removalists"
                className="text-signal-400 font-semibold underline-offset-4 hover:underline"
              >
                All of Greater Melbourne
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-labelledby="footer-company">
          <h2 id="footer-company" className="text-kraft-400 manifest-index mb-4">
            Company
          </h2>
          <ul className="space-y-2 text-[0.9375rem]">
            {[
              ...primaryNav.filter(
                (link) =>
                  link.href !== "/services" && link.href !== "/removalists" && link.href !== "/faq",
              ),
              ...secondaryNav,
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sand-50 underline-offset-4 hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-help">
          <h2 id="footer-help" className="text-kraft-400 manifest-index mb-4">
            Help
          </h2>
          <ul className="space-y-2 text-[0.9375rem]">
            {[
              { href: "/faq", label: "FAQ" },
              { href: "/quote", label: "Get a quote" },
              { href: "/contact", label: "Contact us" },
              { href: "/cancellation-policy", label: "Changes and cancellations" },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sand-50 underline-offset-4 hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-kraft-400/30 border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>
            &copy; {year} {business.legalName ?? business.tradingName}. ABN {business.abn}. ACN{" "}
            {business.acn}.
          </p>
          <CranbourneClock />
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {footerLegalNav.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sand-50 underline-offset-4 hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <CookieSettingsButton className="text-sand-50 cursor-pointer underline-offset-4 hover:underline" />
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
