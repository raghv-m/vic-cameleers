"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "cn";

import { Photo } from "@/components/brand/photo";
import { RouteArrow } from "@/components/brand/signage";
import type { DirectoryCategory } from "@/config/service-directory";

/**
 * The homepage service selector, set out like a freight manifest. Hover, focus or tap a line and
 * the photo panel swaps to that category (a quick crossfade plus a small roller-door lift), and
 * the manifest metadata under it updates. Every line is a real link, so it works as plain
 * navigation too. All four photos are rendered once and stacked, so switching never loads or
 * shifts anything.
 */
export function ServiceManifest({ categories }: { categories: DirectoryCategory[] }) {
  const [activeId, setActiveId] = useState(categories[0]?.id);
  const active = categories.find((category) => category.id === activeId) ?? categories[0]!;

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
      <ol className="border-navy-900 border-t-2 lg:col-span-7">
        {categories.map((category) => {
          const isActive = category.id === active.id;
          const firstLink = category.entries.find((entry) => entry.slug)?.slug;
          return (
            <li key={category.id} className="border-navy-900/25 border-b">
              <Link
                href={firstLink ? `/services#${category.id}` : "/quote"}
                onMouseEnter={() => setActiveId(category.id)}
                onFocus={() => setActiveId(category.id)}
                className={cn(
                  "group relative grid grid-cols-[3.25rem_1fr_auto] items-start gap-x-3 py-5 pr-2 transition-colors duration-150 sm:grid-cols-[4.5rem_1fr_auto]",
                  isActive ? "text-navy-900" : "text-navy-900/80 hover:text-navy-900",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "bg-terracotta-600 absolute top-0 bottom-0 left-0 w-1 origin-top transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                    isActive ? "scale-y-100" : "scale-y-0",
                  )}
                />
                <span className="font-stencil text-terracotta-600 pl-3 text-3xl leading-none sm:text-4xl">
                  {category.index}
                </span>
                <span>
                  <span className="manifest-index text-muted-600 block">{category.label}</span>
                  <span className="mt-1 block text-xl font-bold sm:text-2xl">{category.title}</span>
                  <span className="text-muted-600 mt-1 block text-[0.9375rem]">
                    {category.summary}
                  </span>
                  <span className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold">
                    {category.entries.map((entry) => (
                      <span key={entry.name} className="text-navy-900">
                        {entry.name}
                      </span>
                    ))}
                  </span>
                </span>
                <RouteArrow
                  className={cn(
                    "text-terracotta-600 mt-2 w-7 transition-transform duration-200 motion-reduce:transition-none",
                    isActive ? "translate-x-1" : "group-hover:translate-x-1",
                  )}
                />
              </Link>
            </li>
          );
        })}
      </ol>

      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-24">
          <div className="relative">
            {categories.map((category) => (
              <div
                key={category.id}
                aria-hidden={category.id !== active.id}
                className={cn(
                  "transition-[opacity,clip-path] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                  category.id === categories[0]!.id ? "relative" : "absolute inset-0",
                  category.id === active.id
                    ? "opacity-100 [clip-path:inset(0_0_0_0)]"
                    : "pointer-events-none opacity-0 [clip-path:inset(0_0_14%_0)]",
                )}
              >
                <Photo id={category.image} sizes="(min-width: 1024px) 38vw, 100vw" ratio="4 / 3" />
              </div>
            ))}
          </div>

          <dl className="border-navy-900 bg-sand-50 mt-4 grid grid-cols-2 border-2 text-sm">
            <div className="border-navy-900 border-r-2 p-3">
              <dt className="manifest-index text-muted-600">Consignment</dt>
              <dd className="text-navy-900 mt-1 font-bold">
                {active.index} / {active.label}
              </dd>
            </div>
            <div className="p-3">
              <dt className="manifest-index text-muted-600">Usual setup</dt>
              <dd className="text-navy-900 mt-1 font-bold">{active.typicalSetup}</dd>
            </div>
          </dl>
          <Link
            href={`/services#${active.id}`}
            className="text-navy-900 mt-4 inline-flex min-h-11 items-center gap-2 font-bold underline decoration-2 underline-offset-4"
          >
            See {active.title.toLowerCase()}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
