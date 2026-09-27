import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { cn } from "cn";

import { Container } from "@/components/site/layout-primitives";
import { PageHeader } from "@/components/site/page-header";
import { buttonVariants } from "@/components/ui/button";
import { business } from "@/config/business";
import { ctaCopy } from "@/config/copy";
import { db } from "@/lib/db";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Customer reviews",
  path: "/reviews",
  description: `Reviews from ${business.tradingName} customers, a Cranbourne removalist crew moving homes across Melbourne from ${business.hourlyRateShort}.`,
});

const ABN_LOOKUP = `https://abr.business.gov.au/ABN/View?abn=${business.abn.replace(/\s/g, "")}`;

export default async function ReviewsPage() {
  const reviews = await db.review
    .findMany({
      where: { status: "APPROVED" },
      orderBy: [{ isFeatured: "desc" }, { submittedAt: "desc" }],
    })
    .catch(() => []);

  return (
    <>
      <PageHeader
        breadcrumbs={[{ name: "Reviews", path: "/reviews" }]}
        label="Reviews"
        title="Only real customers, in their own words."
        lede={
          <p>
            Every review here comes from someone we&apos;ve moved. We don&apos;t write them, edit
            them or pad this page out.
          </p>
        }
      />

      <Container className="py-12 sm:py-16">
        {reviews.length === 0 ? (
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <h2 className="font-headline text-navy-900 display-md">No reviews to show yet.</h2>
              <p className="text-ink-900 mt-4 text-lg">
                They&apos;ll appear here as customers write them. Until then, here&apos;s what you
                can check for yourself.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/quote"
                  className={cn(buttonVariants({ size: "lg" }), "tracking-[0.08em] uppercase")}
                >
                  {ctaCopy.primary}
                </Link>
                {/* TODO(owner): appears once the Google review link is set (business.googleReviewUrl). */}
                {business.googleReviewUrl && (
                  <a
                    href={business.googleReviewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={buttonVariants({ variant: "secondary", size: "lg" })}
                  >
                    Review us on Google
                  </a>
                )}
              </div>
            </div>
            <dl className="border-navy-900 bg-navy-900 grid gap-px overflow-hidden rounded-sm border-2 sm:grid-cols-2 lg:col-span-7">
              <div className="bg-sand-50 p-5">
                <dt className="manifest-index text-terracotta-600">Registered business</dt>
                <dd className="text-ink-900 mt-2">
                  ABN {business.abn}, ACN {business.acn}.{" "}
                  <a
                    href={ABN_LOOKUP}
                    target="_blank"
                    rel="noreferrer"
                    className="text-navy-900 inline-flex items-center gap-1 font-semibold underline decoration-2 underline-offset-4"
                  >
                    Look us up
                    <ExternalLink className="size-3.5" aria-hidden="true" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </dd>
              </div>
              <div className="bg-sand-50 p-5">
                <dt className="manifest-index text-terracotta-600">Published price</dt>
                <dd className="text-ink-900 mt-2">
                  {business.hourlyRateDisplay}, {business.minimumHours} hour minimum,{" "}
                  {business.calloutMinutes} minute call-out.{" "}
                  <Link
                    href="/pricing"
                    className="text-navy-900 font-semibold underline decoration-2 underline-offset-4"
                  >
                    See worked examples
                  </Link>
                </dd>
              </div>
              <div className="bg-sand-50 p-5">
                <dt className="manifest-index text-terracotta-600">Two trucks</dt>
                <dd className="text-ink-900 mt-2">
                  {business.fleet.map((truck) => truck.label).join(" and ")}, based in{" "}
                  {business.baseSuburb}.
                </dd>
              </div>
              <div className="bg-sand-50 p-5">
                <dt className="manifest-index text-terracotta-600">Talk to us first</dt>
                <dd className="text-ink-900 mt-2">
                  Call{" "}
                  <a
                    href={`tel:${business.phoneE164}`}
                    className="tabular text-navy-900 font-semibold underline decoration-2 underline-offset-4"
                  >
                    {business.phoneDisplay}
                  </a>{" "}
                  and ask anything before you book.
                </dd>
              </div>
            </dl>
          </div>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2">
            {reviews.map((review) => (
              <li key={review.id} className="border-navy-900 bg-sand-50 rounded-sm border-2 p-6">
                <p
                  className="text-terracotta-600 text-lg tracking-[0.2em]"
                  aria-label={`${review.rating} out of 5`}
                >
                  {"★".repeat(review.rating)}
                  <span className="text-kraft-400">{"★".repeat(5 - review.rating)}</span>
                </p>
                <blockquote className="text-ink-900 mt-3 text-lg leading-relaxed">
                  {review.body}
                </blockquote>
                <p className="text-navy-900 mt-4 font-bold">{review.authorName}</p>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </>
  );
}
