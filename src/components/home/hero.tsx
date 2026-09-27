import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { cn } from "cn";

import { CamelSign, SignPlate } from "@/components/brand/signage";
import { Photo } from "@/components/brand/photo";
import { QuoteEstimator } from "@/components/quote/quote-estimator";
import { Container } from "@/components/site/layout-primitives";
import { buttonVariants } from "@/components/ui/button";
import { business } from "@/config/business";
import { ctaCopy } from "@/config/copy";
import { allSuburbs } from "@/content/suburbs";
import type { PricingSettings } from "@/types/pricing";

const HEADLINE = ["Same", "job", "as", "the", "1860", "cameleers."];
const PUNCHLINE = ["Better", "suspension."];

/** Faint survey contours behind the hero, drifting very slowly (off under reduced motion). */
function Contours() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 700"
      preserveAspectRatio="xMidYMid slice"
      className="vc-drift text-navy-900 pointer-events-none absolute inset-0 h-full w-[106%] opacity-[0.06]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      {Array.from({ length: 9 }).map((_, i) => (
        <path
          key={i}
          d={`M-40 ${140 + i * 58} C 220 ${90 + i * 60}, 380 ${230 + i * 52}, 640 ${170 + i * 57} S 1040 ${120 + i * 61}, 1260 ${200 + i * 55}`}
        />
      ))}
    </svg>
  );
}

export function Hero({ settings }: { settings: PricingSettings }) {
  return (
    <section
      data-hides-mobile-bar
      aria-labelledby="hero-title"
      className="relative overflow-hidden"
    >
      <Contours />
      <Container className="relative grid gap-10 pt-6 pb-14 lg:grid-cols-12 lg:gap-12 lg:pt-10 lg:pb-20">
        <div className="lg:col-span-6 xl:col-span-7">
          <div className="flex flex-wrap items-center gap-3">
            <SignPlate>Cranbourne depot</SignPlate>
            <p className="text-muted-600 text-sm font-semibold">
              Removals across Greater Melbourne &middot; Victoria only
            </p>
          </div>

          <h1 id="hero-title" className="font-stencil text-navy-900 display-xl mt-6">
            {HEADLINE.map((word, i) => (
              <span
                key={word}
                className="vc-stamp-word mr-[0.22em]"
                style={{ ["--i" as string]: i }}
              >
                {word}
              </span>
            ))}{" "}
            <span className="text-terracotta-600">
              {PUNCHLINE.map((word, i) => (
                <span
                  key={word}
                  className="vc-stamp-word mr-[0.22em]"
                  style={{ ["--i" as string]: HEADLINE.length + i }}
                >
                  {word}
                </span>
              ))}
            </span>
          </h1>

          <p className="text-ink-900 mt-6 max-w-[34rem] text-lg leading-relaxed sm:text-xl">
            {business.tradingName} is a modern Cranbourne removals crew, moving homes and offices
            across Greater Melbourne. Our name honours the cameleers who carried Melbourne&apos;s
            freight inland in 1860.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/quote"
              className={cn(buttonVariants({ size: "xl" }), "tracking-[0.08em] uppercase")}
            >
              {ctaCopy.primary}
              <ArrowRight data-icon="inline-end" />
            </Link>
            <a
              href={`tel:${business.phoneE164}`}
              className={cn(buttonVariants({ variant: "secondary", size: "xl" }), "tabular")}
            >
              <Phone aria-hidden="true" />
              Call {business.phoneDisplay}
            </a>
          </div>

          <dl className="border-navy-900 mt-10 hidden max-w-xl grid-cols-3 border-t-2 sm:grid">
            {[
              { term: "Fleet", detail: "6t and 10t trucks" },
              {
                term: "Rate",
                detail: `${business.hourlyRateShort}, ${business.minimumHours} hr min`,
              },
              { term: "Crew", detail: `${business.crewSize} movers` },
            ].map((item) => (
              <div
                key={item.term}
                className="border-navy-900/20 border-r pt-3 pr-3 last:border-r-0 [&:not(:first-child)]:pl-3"
              >
                <dt className="manifest-index text-muted-600">{item.term}</dt>
                <dd className="text-navy-900 mt-1 text-[0.9375rem] leading-snug font-bold">
                  {item.detail}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative flex flex-col lg:col-span-6 xl:col-span-5">
          {/* One photo: after the estimator on phones, behind its top edge on desktop. */}
          <div className="relative order-2 mt-6 lg:order-1 lg:mt-0">
            <Photo
              id="heroTruck"
              priority
              sizes="(min-width: 1280px) 34vw, (min-width: 1024px) 48vw, 100vw"
              ratio="4 / 3"
              className="vc-hero-media"
            />
            <CamelSign className="absolute -top-6 -right-3 hidden size-20 rotate-6 drop-shadow-sm sm:block" />
          </div>
          <div
            id="estimate"
            className="relative z-10 order-1 scroll-mt-24 lg:order-2 lg:-mt-28 lg:ml-10"
          >
            <QuoteEstimator
              settings={settings}
              suburbNames={allSuburbs.map((suburb) => suburb.name)}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
