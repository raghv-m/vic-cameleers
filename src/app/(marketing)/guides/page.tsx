import type { Metadata } from "next";
import Link from "next/link";
import { format } from "date-fns";

import { pageMetadata } from "@/lib/seo";
import { guides } from "@/content/guides";

export const metadata: Metadata = pageMetadata({
  title: "Moving guides",
  path: "/guides",
  description: `Practical moving advice from a Cranbourne removalist crew: what a move costs, packing, apartment moves and a week-by-week checklist.`,
});

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
