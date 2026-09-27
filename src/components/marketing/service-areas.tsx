import Link from "next/link";

import { business } from "@/config/business";
import { getPublishedSuburb } from "@/content/suburbs";

/**
 * Grouped by where they actually are, not a generic compass-point template
 * (CLAUDE.md section 7: no invented coverage). Only the two clusters this
 * business's real suburb list actually covers, see src/content/suburbs/. Only
 * published suburbs are linked, and a zone with none published is hidden.
 */
const zones = [
  {
    name: "Casey & Cardinia corridor",
    slugs: [
      "cranbourne",
      "cranbourne-east",
      "cranbourne-north",
      "clyde",
      "clyde-north",
      "berwick",
      "narre-warren",
      "pakenham",
      "officer",
    ],
  },
  {
    name: "Dandenong & bayside",
    slugs: ["dandenong", "keysborough", "frankston", "carrum-downs", "langwarrin"],
  },
];

export function ServiceAreas() {
  const visibleZones = zones.filter((zone) => zone.slugs.some((slug) => getPublishedSuburb(slug)));

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">Where we move</h2>
        <p className="text-muted-foreground mt-2">
          Based in {business.baseSuburb}, covering {business.serviceAreaDescription}.
        </p>
      </div>

      <div className={visibleZones.length > 1 ? "grid gap-8 sm:grid-cols-2" : "grid gap-8"}>
        {visibleZones.map((zone) => (
          <div key={zone.name} className="border-border rounded-lg border p-5">
            <h3 className="font-heading text-sm font-semibold tracking-wide uppercase">
              {zone.name}
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {zone.slugs.map((slug) => {
                const suburb = getPublishedSuburb(slug);
                if (!suburb) return null;
                return (
                  <Link
                    key={slug}
                    href={`/removalists/${slug}`}
                    className="border-border bg-card text-foreground hover:border-primary/40 rounded-full border px-3 py-1 text-sm"
                  >
                    {suburb.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link href="/removalists" className="text-primary text-sm font-medium hover:underline">
          See all service areas
        </Link>
      </div>
    </section>
  );
}
