import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Phone } from "lucide-react";
import { cn } from "cn";

import { LostCamel } from "@/components/brand/lost-camel";
import { Container } from "@/components/site/layout-primitives";
import { buttonVariants } from "@/components/ui/button";
import { business } from "@/config/business";
import { ctaCopy } from "@/config/copy";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <Container className="grid min-h-[70svh] items-center gap-10 py-16 lg:grid-cols-12">
      <div className="lg:col-span-6">
        <p className="manifest-index text-terracotta-600">Error 404</p>
        <h1 className="font-headline text-navy-900 display-lg mt-3">
          This camel took a wrong turn.
        </h1>
        <p className="text-ink-900 mt-4 max-w-[46ch] text-lg">
          That page doesn&apos;t exist, or it&apos;s moved. Head back home, or get a price for your
          move from here.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "navy", size: "lg" }),
              "tracking-[0.08em] uppercase",
            )}
          >
            Take me home
          </Link>
          <Link
            href="/quote"
            className={cn(buttonVariants({ size: "lg" }), "tracking-[0.08em] uppercase")}
          >
            {ctaCopy.primary}
            <ArrowRight data-icon="inline-end" />
          </Link>
        </div>
        <a
          href={`tel:${business.phoneE164}`}
          className="text-navy-900 hover:text-terracotta-600 tabular mt-6 inline-flex min-h-11 items-center gap-2 font-bold"
        >
          <Phone className="size-4" aria-hidden="true" />
          Or call {business.phoneDisplay}
        </a>
      </div>
      <LostCamel className="w-full max-w-lg lg:col-span-6" />
    </Container>
  );
}
