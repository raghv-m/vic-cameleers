import type { Metadata } from "next";
import Link from "next/link";
import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { business } from "@/config/business";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Reviews",
  description: `Real reviews from ${business.tradingName} customers.`,
};

export default async function ReviewsPage() {
  const reviews = await db.review
    .findMany({
      where: { status: "APPROVED" },
      orderBy: [{ isFeatured: "desc" }, { submittedAt: "desc" }],
    })
    .catch(() => []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">Reviews</h1>
        <p className="text-muted-foreground mt-2">
          What people say after moving with {business.tradingName}.
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="rounded-lg border p-10 text-center">
          <p className="text-foreground font-medium">We&apos;re new here.</p>
          <p className="text-muted-foreground mt-2">
            Be one of our first reviews once your move is done, we&apos;d genuinely appreciate it.
          </p>
          <Button className="mt-6" render={<Link href="/quote" />} nativeButton={false}>
            Get your free estimate
          </Button>
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
