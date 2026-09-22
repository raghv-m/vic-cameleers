import Link from "next/link";
import { Star } from "lucide-react";

import { db } from "@/lib/db";

/**
 * No fake reviews, ratings, or counts (CLAUDE.md section 3). Shows the
 * honest empty state until real, admin-approved reviews exist.
 */
export async function ReviewsSection() {
  const featured = await db.review
    .findMany({
      where: { status: "APPROVED" },
      orderBy: [{ isFeatured: "desc" }, { submittedAt: "desc" }],
      take: 3,
    })
    .catch(() => []);

  return (
    <section className="bg-secondary/30 py-16">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold tracking-tight">Reviews</h2>

        {featured.length === 0 ? (
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
            We&apos;re new. Be one of our first reviews once your move is done, we&apos;d genuinely
            appreciate it.
          </p>
        ) : (
          <div className="mt-8 grid gap-4 text-left sm:grid-cols-3">
            {featured.map((review) => (
              <div key={review.id} className="bg-card rounded-lg border p-5">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${i < review.rating ? "fill-current text-amber-500" : "text-muted-foreground"}`}
                    />
                  ))}
                </div>
                <p className="text-foreground mt-2 line-clamp-4 text-sm">{review.body}</p>
                <p className="text-muted-foreground mt-2 text-xs font-medium">
                  {review.authorName}
                </p>
              </div>
            ))}
          </div>
        )}

        <Link
          href="/reviews"
          className="text-primary mt-6 inline-block text-sm font-medium hover:underline"
        >
          Read our reviews page
        </Link>
      </div>
    </section>
  );
}
