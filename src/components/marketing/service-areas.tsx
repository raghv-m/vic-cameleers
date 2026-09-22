import Link from "next/link";

import { business } from "@/config/business";

// Launch suburb list, Cranbourne area first (CLAUDE.md section 7). A map
// widget needs a Google Maps API key, which is pending (see TODO-OWNER.md);
// this is a suburb list in the meantime.
const topSuburbs = [
  "Cranbourne",
  "Cranbourne East",
  "Clyde",
  "Clyde North",
  "Berwick",
  "Narre Warren",
  "Pakenham",
  "Officer",
  "Dandenong",
  "Frankston",
  "Carrum Downs",
  "Langwarrin",
];

export function ServiceAreas() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">Where we move</h2>
        <p className="text-muted-foreground mt-2">
          Based in {business.baseSuburb}, covering {business.serviceAreaDescription}.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {topSuburbs.map((suburb) => (
          <Link
            key={suburb}
            href={`/removalists/${suburb.toLowerCase().replace(/\s+/g, "-")}`}
            className="border-border bg-card text-foreground hover:border-primary/40 rounded-full border px-4 py-1.5 text-sm font-medium"
          >
            {suburb}
          </Link>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link href="/removalists" className="text-primary text-sm font-medium hover:underline">
          See all service areas
        </Link>
      </div>
    </section>
  );
}
