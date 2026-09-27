import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { InlineCta } from "@/components/site/inline-cta";
import { Container } from "@/components/site/layout-primitives";
import { PageHeader } from "@/components/site/page-header";
import { business } from "@/config/business";
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
    <>
      <PageHeader
        breadcrumbs={[
          { name: "About", path: "/about" },
          { name: "Meet the crew", path: "/crew" },
        ]}
        label="The crew"
        title="The people who turn up on moving day."
        lede={<p>Based in {business.baseSuburb.replace(" VIC", "")}, in their own words.</p>}
      />
      <Container className="py-12 sm:py-16">
        <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {crew.map((member) => (
            <li key={member.name}>
              {member.photo && (
                <Image
                  src={member.photo.src}
                  alt={member.photo.alt}
                  width={member.photo.width}
                  height={member.photo.height}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="border-navy-900 aspect-[4/5] w-full rounded-sm border-2 object-cover"
                />
              )}
              <h2 className="font-headline text-navy-900 mt-4 text-3xl">{member.name}</h2>
              <p className="manifest-index text-terracotta-600 mt-1">{member.role}</p>
              <p className="text-ink-900 mt-3">{member.bio}</p>
            </li>
          ))}
        </ul>
      </Container>
      <Container className="pb-16 sm:pb-24">
        <InlineCta />
      </Container>
    </>
  );
}
