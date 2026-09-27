import type { Metadata } from "next";
import Link from "next/link";
import { Star } from "lucide-react";

import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Button } from "@/components/ui/button";
import { business } from "@/config/business";
import { pageMetadata } from "@/lib/seo";
import { ctaCopy } from "@/config/copy";
import { db } from "@/lib/db";

export const metadata: Metadata = pageMetadata({
  title: "Customer reviews",
  path: "/reviews",
  description: `Reviews from ${business.tradingName} customers, a Cranbourne removalist crew moving homes across Melbourne from ${business.hourlyRateShort}.`,
});

export default async function ReviewsPage() {
  const reviews = await db.review
    .findMany({
      where: { status: "APPROVED" },
      orderBy: [{ isFeatured: "desc" }, { submittedAt: "desc" }],
    })
    .catch(() => []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ name: "Reviews", path: "/reviews" }]} />
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">Reviews</h1>
        <p className="text-muted-foreground mt-2">
          What people say after moving with {business.tradingName}.
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="rounded-lg border p-8 text-center">
          <p className="font-heading text-2xl font-medium">Reviews coming soon, we&apos;re new</p>
          <p className="text-muted-foreground mt-2">
            Reviews from real customers will show up here as they come in. We won&apos;t fill this
            page with anything else in the meantime.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button render={<Link href="/quote" />} nativeButton={false}>
              {ctaCopy.primary}
            </Button>
            {/* TODO(owner): appears once the Google review link is set (business.googleReviewUrl). */}
            {business.googleReviewUrl && (
              <Button
                variant="secondary"
                render={<a href={business.googleReviewUrl} target="_blank" rel="noreferrer" />}
                nativeButton={false}
              >
                Review us on Google
              </Button>
            )}
          </div>
        </div>
      ) : (
        <ul className="space-y-6">
          {reviews.map((review) => (
            <li key={review.id} className="rounded-lg border p-6">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < review.rating ? "fill-current text-amber-500" : "text-muted-foreground"}`}
                  />
                ))}
              </div>
              <p className="text-foreground mt-3">{review.body}</p>
              <p className="text-muted-foreground mt-3 text-sm font-medium">{review.authorName}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
