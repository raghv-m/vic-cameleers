import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { cn } from "cn";

import { CamelSign } from "@/components/brand/signage";
import { buttonVariants } from "@/components/ui/button";
import { business } from "@/config/business";
import { ctaCopy } from "@/config/copy";

/**
 * A mid-page prompt for pages that are mostly reading (guides, suburbs, how it works). The footer
 * already closes every page with a CTA band, so this is the in-content version: short, one line of
 * copy, the quote button and the phone.
 */
export function InlineCta({
  title = "Want a price for your move?",
  body = `Answer a few questions and see an estimate straight away. ${business.hourlyRateShort}, ${business.minimumHours} hour minimum.`,
  href = "/quote",
  className,
}: {
  title?: string;
  body?: string;
  href?: string;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "border-navy-900 bg-sand-100 relative flex flex-col gap-5 rounded-sm border-2 p-5 sm:flex-row sm:items-center sm:p-6",
        className,
      )}
    >
      <CamelSign className="hidden size-14 shrink-0 sm:block" />
      <div className="flex-1">
        <p className="font-headline text-navy-900 text-2xl leading-tight">{title}</p>
        <p className="text-ink-900 mt-1">{body}</p>
      </div>
      <div className="flex flex-col gap-2 sm:items-end">
        <Link
          href={href}
          className={cn(buttonVariants({ size: "lg" }), "tracking-[0.08em] uppercase")}
        >
          {ctaCopy.primary}
          <ArrowRight data-icon="inline-end" />
        </Link>
        <a
          href={`tel:${business.phoneE164}`}
          className="text-navy-900 hover:text-terracotta-600 tabular inline-flex min-h-11 items-center gap-2 text-sm font-bold"
        >
          <Phone className="size-4" aria-hidden="true" />
          {business.phoneDisplay}
        </a>
      </div>
    </aside>
  );
}
