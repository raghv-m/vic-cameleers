import Link from "next/link";

/**
 * No fake reviews, ratings, or counts (CLAUDE.md section 3). This shows
 * only the honest empty state until real reviews exist via admin or a
 * Google import.
 */
export function ReviewsSection() {
  return (
    <section className="bg-secondary/30 py-16">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold tracking-tight">Reviews</h2>
        <p className="text-muted-foreground mt-4">
          We&apos;re new. Be one of our first reviews once your move is done, we&apos;d genuinely
          appreciate it.
        </p>
        <Link
          href="/reviews"
          className="text-primary mt-4 inline-block text-sm font-medium hover:underline"
        >
          Read our reviews page
        </Link>
      </div>
    </section>
  );
}
