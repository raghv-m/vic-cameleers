import Link from "next/link";
import { ArrowRight, Phone, Star } from "lucide-react";
import { cn } from "cn";

import { CamelMark } from "@/components/brand/camel-mark";
import { CoverageMap } from "@/components/brand/coverage-map";
import { RouteArrow, SignPlate } from "@/components/brand/signage";
import { StoryPanel } from "@/components/brand/story-panel";
import { UseSuburbButton } from "@/components/home/use-suburb-button";
import { Container, SectionHeader } from "@/components/site/layout-primitives";
import { buttonVariants } from "@/components/ui/button";
import { business } from "@/config/business";
import { ctaCopy } from "@/config/copy";
import { publishedSuburbs } from "@/content/suburbs";
import { db } from "@/lib/db";

/** Stop: where do you operate? A real map, real local pages, and the limits stated plainly. */
export function CoverageSection() {
  return (
    <section aria-labelledby="coverage-title" className="py-16 sm:py-20">
      <Container className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <SectionHeader
            index="05 / Coverage"
            id="coverage-title"
            title="Based in Cranbourne. Moving all of Greater Melbourne."
            lede="We start closest to home: Casey and Cardinia are minutes from the depot. We go anywhere in Greater Melbourne, and we stay in Victoria."
          />
          <ul className="border-navy-900 mt-8 grid grid-cols-2 border-t-2">
            {publishedSuburbs.map((suburb) => (
              <li key={suburb.slug} className="border-navy-900/20 flex items-center border-b">
                <Link
                  href={`/removalists/${suburb.slug}`}
                  className="group text-navy-900 hover:text-terracotta-600 flex min-h-12 min-w-0 flex-1 items-center justify-between gap-2 pr-1 font-semibold"
                >
                  <span>
                    {suburb.name}
                    <span className="text-muted-600 tabular block text-xs font-medium">
                      {suburb.driveTimeFromCranbourneMins
                        ? `About ${suburb.driveTimeFromCranbourneMins} min from the depot`
                        : "Our home base"}
                    </span>
                  </span>
                  <RouteArrow className="w-5 shrink-0 transition-transform duration-150 group-hover:translate-x-1 motion-reduce:transition-none" />
                </Link>
                <UseSuburbButton suburb={suburb.name} />
              </li>
            ))}
          </ul>
          <p className="text-muted-600 mt-3 flex items-center gap-1.5 text-sm">
            <span aria-hidden="true">&uarr;</span>
            Tap the arrow next to a suburb to start your estimate from there.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <SignPlate tone="amber" className="vc-glow">
              Victoria only
            </SignPlate>
            <Link
              href="/removalists"
              className="text-navy-900 inline-flex min-h-11 items-center font-semibold underline decoration-2 underline-offset-4"
            >
              All service areas
            </Link>
          </div>
        </div>
        <div className="lg:col-span-7">
          <div className="border-navy-900 bg-sand-50 rounded-sm border-2 p-3 sm:p-5">
            <CoverageMap />
          </div>
        </div>
      </Container>
    </section>
  );
}

/** Stop: who are you? The one navy section, where the camel story lives. */
export function StorySection() {
  return (
    <section
      aria-labelledby="story-title"
      className="on-navy bg-navy-900 text-sand-200 relative overflow-hidden py-16 sm:py-24"
    >
      <CamelMark className="text-navy-700 pointer-events-none absolute -right-16 -bottom-10 h-72 w-auto opacity-60 sm:h-96" />
      <Container className="relative grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
        <div className="lg:col-span-6">
          <StoryPanel className="h-auto w-full" />
        </div>
        <div className="lg:col-span-6">
          <SectionHeader
            index="07 / The name"
            id="story-title"
            tone="dark"
            title="Why a removals crew is named after camels."
          />
          <div className="mt-6 max-w-[58ch] space-y-4 text-[1.0625rem] leading-relaxed">
            <p>
              In 1860, camels and their cameleers landed at Port Melbourne to carry supplies for the
              Burke and Wills expedition. For decades after, cameleers hauled freight across country
              no wagon could handle.
            </p>
            <p>
              We&apos;re not them, and we don&apos;t pretend to be. {business.tradingName} is a
              modern crew with modern trucks. We took the name because we like the job they did:
              turn up, carry the load, get it there in one piece.
            </p>
            <p className="font-headline text-terracotta-400 display-md">
              Same idea. Bigger trucks.
            </p>
          </div>
          <Link
            href="/about"
            className={cn(buttonVariants({ variant: "onNavy", size: "lg" }), "mt-8")}
          >
            More about us
            <ArrowRight data-icon="inline-end" />
          </Link>
        </div>
      </Container>
    </section>
  );
}

/**
 * Stop: what do customers say? Real, approved reviews only (admin-moderated). With none yet, the
 * section doesn't render at all rather than filling space with anything else.
 */
export async function ReviewsStop() {
  const reviews = await db.review
    .findMany({
      where: { status: "APPROVED" },
      orderBy: [{ isFeatured: "desc" }, { submittedAt: "desc" }],
      take: 3,
    })
    .catch(() => []);

  if (reviews.length === 0) return null;

  return (
    <section aria-labelledby="reviews-title" className="py-16 sm:py-20">
      <Container>
        <SectionHeader index="08 / Customers" id="reviews-title" title="What customers said." />
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {reviews.map((review) => (
            <li key={review.id} className="border-navy-900 border-t-2 pt-5">
              <p className="flex gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    aria-hidden="true"
                    className={cn(
                      "size-4",
                      i < review.rating ? "fill-signal-400 text-signal-400" : "text-kraft-400",
                    )}
                  />
                ))}
              </p>
              <blockquote className="text-ink-900 mt-3 line-clamp-4 text-[1.0625rem] leading-relaxed">
                {review.body}
              </blockquote>
              <p className="text-navy-900 mt-3 text-sm font-bold">{review.authorName}</p>
            </li>
          ))}
        </ul>
        <Link
          href="/reviews"
          className="text-navy-900 mt-8 inline-flex min-h-11 items-center font-semibold underline decoration-2 underline-offset-4"
        >
          All reviews
        </Link>
      </Container>
    </section>
  );
}

/** Stop: what do I do next? The route ends at this button. */
export function FinalCta({ index }: { index: string }) {
  return (
    <section
      aria-labelledby="final-cta-title"
      className="kraft-band relative overflow-hidden py-16 sm:py-24"
    >
      <Container className="relative flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="manifest-index text-navy-900 mb-4 flex items-center gap-3">
            <span
              aria-hidden="true"
              className="bg-terracotta-600 inline-block size-3 rounded-full"
            />
            {index} / End of the route
          </p>
          <h2 id="final-cta-title" className="font-headline text-navy-900 display-lg max-w-[14ch]">
            Moving day starts with a plan.
          </h2>
          <p className="text-ink-900 mt-4 max-w-[46ch] text-lg">
            Get your estimate in a couple of minutes, then we&apos;ll confirm the details and lock
            in your truck and crew.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row md:flex-col lg:flex-row">
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
            {business.phoneDisplay}
          </a>
        </div>
      </Container>
    </section>
  );
}
