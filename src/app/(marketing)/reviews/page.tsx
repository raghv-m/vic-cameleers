import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, MessageCircle, Star, Truck, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { business } from "@/config/business";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Reviews",
  description: `Real reviews from ${business.tradingName} customers.`,
};

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
        <div>
          <div className="rounded-lg border p-8 text-center">
            <p className="text-foreground font-medium">
              We&apos;re a young business, no reviews here yet.
            </p>
            <p className="text-muted-foreground mt-2 text-sm">
              We&apos;d rather show you what we can back up today than pad this out with numbers we
              can&apos;t. Once your move is done, we&apos;d genuinely appreciate your review.
            </p>
            <Button className="mt-6" render={<Link href="/quote" />} nativeButton={false}>
              Get your free estimate
            </Button>
          </div>

          <div className="mt-8 grid gap-4 text-left sm:grid-cols-2">
            {trustSignals.map((signal) => (
              <div key={signal.title} className="flex gap-3 rounded-lg border p-4">
                <signal.icon className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <p className="text-foreground text-sm font-medium">{signal.title}</p>
                  <p className="text-muted-foreground mt-0.5 text-sm">{signal.description}</p>
                </div>
              </div>
            ))}
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
