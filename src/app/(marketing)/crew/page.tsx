import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Button } from "@/components/ui/button";
import { business } from "@/config/business";
import { ctaCopy } from "@/config/copy";
import { crew, hasCrewProfiles } from "@/content/crew";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Meet the crew",
  path: "/crew",
  description: `The people who'll turn up on your moving day: the ${business.tradingName} crew, based in Cranbourne, in their own words.`,
});

export default function CrewPage() {
  // No page at all until real crew profiles exist (src/content/crew.ts).
  if (!hasCrewProfiles()) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { name: "About", path: "/about" },
          { name: "Meet the crew", path: "/crew" },
        ]}
      />
      <h1 className="text-4xl font-semibold tracking-tight">Meet the crew</h1>
      <p className="text-muted-foreground mt-2">
        The people who&apos;ll turn up on your moving day, based in{" "}
        {business.baseSuburb.replace(" VIC", "")}.
      </p>

      <ul className="mt-10 grid gap-8 sm:grid-cols-2">
        {crew.map((member) => (
          <li key={member.name}>
            {member.photo && (
              <Image
                src={member.photo.src}
                alt={member.photo.alt}
                width={member.photo.width}
                height={member.photo.height}
                sizes="(min-width: 640px) 50vw, 100vw"
                className="aspect-[4/5] w-full rounded-lg object-cover"
              />
            )}
            <h2 className="font-heading mt-4 text-xl font-medium">{member.name}</h2>
            <p className="text-primary text-sm font-medium">{member.role}</p>
            <p className="text-muted-foreground mt-2">{member.bio}</p>
          </li>
        ))}
      </ul>

      <div className="mt-12 text-center">
        <Button size="lg" render={<Link href="/quote" />} nativeButton={false}>
          {ctaCopy.primary}
        </Button>
      </div>
    </div>
  );
}
