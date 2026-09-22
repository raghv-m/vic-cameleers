import type { Metadata } from "next";
import Link from "next/link";
import { format } from "date-fns";

import { business } from "@/config/business";
import { guides } from "@/content/guides";

export const metadata: Metadata = {
  title: "Moving guides",
  description: `Practical moving advice from ${business.tradingName}: costs, checklists, packing, and more.`,
};

export default function GuidesIndexPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">Moving guides</h1>
        <p className="text-muted-foreground mt-2">Practical advice for your move, no fluff.</p>
      </div>

      <ul className="space-y-6">
        {guides.map((guide) => (
          <li key={guide.slug} className="border-b pb-6 last:border-0">
            <Link href={`/guides/${guide.slug}`} className="group">
              <h2 className="font-heading group-hover:text-primary text-xl font-medium">
                {guide.title}
              </h2>
              <p className="text-muted-foreground mt-1">{guide.description}</p>
              <p className="text-muted-foreground mt-2 text-xs">
                {format(new Date(guide.publishedAt), "d MMMM yyyy")}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
