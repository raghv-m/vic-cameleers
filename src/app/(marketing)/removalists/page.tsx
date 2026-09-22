import type { Metadata } from "next";
import Link from "next/link";

import { business } from "@/config/business";
import { suburbs } from "@/content/suburbs";

export const metadata: Metadata = {
  title: "Service areas",
  description: `Suburbs ${business.tradingName} covers across ${business.serviceAreaDescription}, based in ${business.baseSuburb}.`,
};

export default function ServiceAreasPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">Where we move</h1>
        <p className="text-muted-foreground mt-2">
          Based in {business.baseSuburb}, covering {business.serviceAreaDescription}. Don&apos;t see
          your suburb below? Call {business.phoneDisplay}, we may still be able to help.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {suburbs.map((suburb) => (
          <Link
            key={suburb.slug}
            href={`/removalists/${suburb.slug}`}
            className="border-border bg-card hover:border-primary/40 rounded-md border px-4 py-3 text-center text-sm font-medium transition-colors"
          >
            {suburb.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
