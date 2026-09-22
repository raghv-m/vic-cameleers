import { Phone } from "lucide-react";
import Link from "next/link";

import { CamelMark } from "@/components/brand/camel-mark";
import { business } from "@/config/business";
import { footerLegalNav, primaryNav, secondaryNav } from "@/config/nav";

export function Footer() {
  const year = new Date().getFullYear();
  const hasSocial = business.social.facebook || business.social.instagram;

  return (
    <footer className="border-border bg-secondary/40 border-t">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-3 lg:col-span-1">
            <div className="font-heading flex items-center gap-2 text-lg font-semibold">
              <CamelMark className="text-primary h-7 w-7" />
              {business.tradingName}
            </div>
            <p className="text-muted-foreground text-sm">
              Professional Melbourne removalists, based in {business.baseSuburb}, moving homes and
              businesses across {business.serviceAreaDescription}.
            </p>
            {hasSocial && (
              <div className="flex gap-3 pt-1 text-sm">
                {business.social.facebook && (
                  <a
                    href={business.social.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Facebook
                  </a>
                )}
                {business.social.instagram && (
                  <a
                    href={business.social.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Instagram
                  </a>
                )}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-foreground mb-3 text-sm font-semibold">Services</h2>
            <ul className="space-y-2">
              {primaryNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-foreground mb-3 text-sm font-semibold">Resources</h2>
            <ul className="space-y-2">
              {secondaryNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-foreground mb-3 text-sm font-semibold">Contact</h2>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>
                <a
                  href={`tel:${business.phoneE164}`}
                  className="hover:text-foreground flex items-center gap-1.5"
                >
                  <Phone className="h-4 w-4" />
                  {business.phoneDisplay}
                </a>
              </li>
              <li>{business.baseSuburb}</li>
              <li>{business.serviceAreaDescription}</li>
            </ul>
          </div>

          <div>
            <h2 className="text-foreground mb-3 text-sm font-semibold">Legal</h2>
            <ul className="space-y-2">
              {footerLegalNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-border text-muted-foreground mt-10 flex flex-col gap-2 border-t pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {business.tradingName}. ABN {business.abn}. ACN {business.acn}.
          </p>
          <p>Victoria only. No interstate removals.</p>
        </div>
      </div>
    </footer>
  );
}
