import Link from "next/link";
import { MapPin, MessageCircle, Star, Truck, Wallet } from "lucide-react";

import { business } from "@/config/business";
import { db } from "@/lib/db";

/**
 * No fake reviews, ratings, or counts (CLAUDE.md section 3). Until real,
 * admin-approved reviews exist, this leads with concrete, honest trust
 * signals instead of an apologetic "we're new" - only claims this business
 * can actually back up today (no insurance/licensing badges here, those
 * stay false in business.claims until an owner confirms them).
 */
const trustSignals = [
  {
    icon: MapPin,
    title: "Local Melbourne crew",
    description: `Based in ${business.baseSuburb}, not a call centre.`,
  },
  {
    icon: Wallet,
    title: "Transparent pricing",
    description: `${business.hourlyRateDisplay}, ${business.minimumHours} hour minimum. No surprise invoice.`,
  },
  {
    icon: Truck,
    title: "Professional fleet",
    description: `${business.fleet.map((truck) => truck.label).join(" and ")}.`,
  },
  {
    icon: MessageCircle,
    title: "Direct communication",
    description: "Talk to the crew who's actually moving you, not a booking agent.",
  },
];

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
        {featured.length === 0 ? (
          <>
            <h2 className="text-3xl font-semibold tracking-tight">Why people choose us</h2>
            <p className="text-muted-foreground mx-auto mt-2 max-w-xl">
              We&apos;re a young business, so we&apos;d rather show you what we can back up today
              than pad this out with numbers we can&apos;t.
            </p>
            <div className="mt-8 grid gap-4 text-left sm:grid-cols-2">
              {trustSignals.map((signal) => (
                <div key={signal.title} className="bg-card flex gap-3 rounded-lg border p-4">
                  <signal.icon className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                  <div>
                    <p className="text-foreground text-sm font-medium">{signal.title}</p>
                    <p className="text-muted-foreground mt-0.5 text-sm">{signal.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-semibold tracking-tight">Reviews</h2>
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
          </>
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
