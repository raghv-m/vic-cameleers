import type { Metadata } from "next";
import { format } from "date-fns";
import { Star } from "lucide-react";

import { AddManualReviewForm } from "@/components/admin/add-manual-review-form";
import { ReviewRowControls } from "@/components/admin/review-row-controls";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/rbac";

export const metadata: Metadata = {
  title: "Reviews",
  robots: { index: false, follow: false },
};

const sourceLabel = { ON_SITE: "On site", GOOGLE: "Google", MANUAL: "Manual" } as const;

export default async function ReviewsPage() {
  await requireRole("SUPPORT");
  const reviews = await db.review.findMany({ orderBy: { submittedAt: "desc" } });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Reviews</h1>

      <div className="mt-6 rounded-md border p-4">
        <AddManualReviewForm />
      </div>

      <ul className="mt-6 space-y-3">
        {reviews.map((review) => (
          <li key={review.id} className="rounded-md border p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{review.authorName}</p>
                  <Badge variant="outline">{sourceLabel[review.source]}</Badge>
                  {review.isFeatured && <Badge>Featured</Badge>}
                </div>
                <div className="mt-1 flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${i < review.rating ? "fill-current text-amber-500" : "text-muted-foreground"}`}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mt-2 text-sm">{review.body}</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {format(review.submittedAt, "d MMM yyyy")}
                </p>
              </div>
              <ReviewRowControls
                id={review.id}
                status={review.status}
                isFeatured={review.isFeatured}
              />
            </div>
          </li>
        ))}

        {reviews.length === 0 && (
          <p className="text-muted-foreground py-10 text-center text-sm">
            No reviews yet. We&apos;re new, be one of our first.
          </p>
        )}
      </ul>
    </div>
  );
}
