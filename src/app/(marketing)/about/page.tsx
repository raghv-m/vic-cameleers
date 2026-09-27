import type { Metadata } from "next";
import Link from "next/link";

import { Photo } from "@/components/brand/photo";
import { RouteArrow } from "@/components/brand/signage";
import { StoryPanel } from "@/components/brand/story-panel";
import { InlineCta } from "@/components/site/inline-cta";
import { Container, SectionHeader } from "@/components/site/layout-primitives";
import { PageHeader } from "@/components/site/page-header";
import { business } from "@/config/business";
import { hasCrewProfiles } from "@/content/crew";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About our Cranbourne removalists",
  path: "/about",
  description: `${business.tradingName} is a Cranbourne removalist crew named after the cameleers who carried Australia's freight from 1860. Here's our story and how we work. ${business.hourlyRateShort}.`,
});

/**
 * The history here is the documented story behind the name, not the company's own history:
 * Vic Cameleers is a young business and the page says so.
 */
const TIMELINE = [
  {
    when: "June 1860",
    title: "Camels land at Port Melbourne",
    body: "Camels and cameleers arrive to carry supplies for the Burke and Wills expedition.",
  },
  {
    when: "20 August 1860",
    title: "The expedition leaves Royal Park",
    body: "The caravan sets off from Melbourne, loaded for the long haul north.",
  },
  {
    when: "Decades after",
    title: "The inland freight runs",
    body: "Cameleers haul goods across the country through heat, distance and terrain that beat most other transport of the time.",
  },
  {
    when: "Today",
    title: `${business.tradingName}, ${business.baseSuburb.replace(" VIC", "")}`,
    body: "A young removals crew that borrowed the name because we back the same idea: carry the load and get it there properly.",
  },
];

const PRINCIPLES = [
  {
    title: "One published rate",
    body: `${business.hourlyRateDisplay}, ${business.minimumHours} hour minimum, ${business.calloutMinutes} minute call-out. The same on every job, in every suburb.`,
  },
  {
    title: "Estimates you can check",
    body: "Every estimate shows its working: base hours for the size of the place, extra time for stairs or a long carry, and the call-out.",
  },
  {
    title: "The right truck",
    body: `${business.fleet.map((truck) => truck.label).join(" and ")}. The truck and crew follow the size of the job.`,
  },
  {
    title: "No padded story",
    body: "We're a young business. We won't pad this page with numbers we can't back up, and there are no reviews here until real customers write them.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ name: "About", path: "/about" }]}
        label="Our story"
        title="Named after Australia's original long-haul movers."
        lede={
          <p>
            {business.tradingName} is a removals crew based in {business.baseSuburb}, moving homes
            and businesses across {business.serviceAreaDescription}.
          </p>
        }
        aside={
          <div className="bg-navy-900 rounded-sm p-3">
            <StoryPanel className="h-auto w-full" />
          </div>
        }
      />

      <Container className="py-14 sm:py-20">
        <SectionHeader
          title="The idea behind the name"
          lede={
            <p>
              The history below is where the name comes from. It isn&apos;t our company history, and
              we don&apos;t claim it is.
            </p>
          }
        />
        <ol className="relative mt-10 grid gap-8 md:grid-cols-4 md:gap-6">
          <span
            aria-hidden="true"
            className="border-kraft-400 absolute top-3 right-0 left-0 hidden border-t-2 border-dashed md:block"
          />
          {TIMELINE.map((item, index) => (
            <li
              key={item.when}
              className="border-navy-900 relative border-l-2 pl-5 md:border-l-0 md:pl-0"
            >
              <span
                aria-hidden="true"
                className={
                  index === TIMELINE.length - 1
                    ? "bg-terracotta-600 absolute top-1 -left-[7px] size-3 md:relative md:top-auto md:left-auto md:block md:size-6 md:rounded-sm"
                    : "bg-navy-900 absolute top-1 -left-[7px] size-3 md:relative md:top-auto md:left-auto md:block md:size-6 md:rounded-sm"
                }
              />
              <p className="manifest-index text-terracotta-600 md:mt-5">{item.when}</p>
              <h3 className="font-headline text-navy-900 mt-1 text-2xl leading-tight">
                {item.title}
              </h3>
              <p className="text-ink-900 mt-2">{item.body}</p>
            </li>
          ))}
        </ol>
      </Container>

      <section className="kraft-band py-14 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <SectionHeader
              title="How we run a job"
              lede={
                <p>
                  We&apos;re not trying to be the cheapest crew in Melbourne or the flashiest. We
                  quote honestly, turn up when we say we will, and handle your things like
                  they&apos;re going into our own home.
                </p>
              }
            />
          </div>
          <dl className="border-navy-900 bg-navy-900 grid gap-px overflow-hidden rounded-sm border-2 sm:grid-cols-2 lg:col-span-7">
            {PRINCIPLES.map((item) => (
              <div key={item.title} className="bg-sand-50 p-5">
                <dt className="font-headline text-navy-900 text-xl">{item.title}</dt>
                <dd className="text-ink-900 mt-2">{item.body}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <Container className="grid gap-10 py-14 sm:py-20 lg:grid-cols-12 lg:items-center lg:gap-12">
        <Photo
          id="aboutCrew"
          sizes="(min-width: 1024px) 50vw, 100vw"
          ratio="3 / 2"
          className="lg:col-span-6"
          roller
        />
        <div className="lg:col-span-6">
          <SectionHeader
            title="The crew and the trucks"
            lede={
              <p>
                {business.crewSize} movers and a{" "}
                {business.fleet.map((truck) => truck.label).join(" and a ")}, all working out of{" "}
                {business.baseSuburb.replace(" VIC", "")}. We started with the Cranbourne growth
                corridor, the suburbs we know best, and run every job the same way wherever it is.
              </p>
            }
          />
          <div className="mt-6 flex flex-wrap gap-x-6">
            {hasCrewProfiles() && (
              <Link
                href="/crew"
                className="text-navy-900 hover:text-terracotta-600 inline-flex min-h-11 items-center gap-2 font-bold"
              >
                Meet the crew
                <RouteArrow className="text-terracotta-600 w-6" />
              </Link>
            )}
            <Link
              href="/how-it-works"
              className="text-navy-900 hover:text-terracotta-600 inline-flex min-h-11 items-center gap-2 font-bold"
            >
              How a move works
              <RouteArrow className="text-terracotta-600 w-6" />
            </Link>
          </div>
        </div>
      </Container>

      <Container className="pb-16 sm:pb-24">
        <InlineCta />
      </Container>
    </>
  );
}
