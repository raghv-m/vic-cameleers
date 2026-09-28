"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, X } from "lucide-react";
import { cn } from "cn";

import { useTextHighlight } from "@/lib/use-text-highlight";

export const TRUST_TOPICS = ["Reliability", "Pricing", "Care", "Changes", "Contact"] as const;
export type TrustTopic = (typeof TRUST_TOPICS)[number];

export interface TrustQuestion {
  q: string;
  a: React.ReactNode;
  topic: TrustTopic;
  /** Plain-text version of the answer, for search. */
  text: string;
  /** Shown under the open answer as "Related: <label>". */
  related?: { label: string; href: string };
}

/**
 * The pre-booking questions as a searchable, filterable accordion. Every answer stays in the page
 * (native <details>), so it's indexed and works without JavaScript; search and topic chips only
 * hide non-matching rows.
 */
export function TrustQuestions({ questions }: { questions: TrustQuestion[] }) {
  const id = useId();
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<TrustTopic | "All">("All");

  const needle = query.trim().toLowerCase();
  const matches = (item: TrustQuestion) =>
    (topic === "All" || item.topic === topic) &&
    (needle === "" || `${item.q} ${item.text}`.toLowerCase().includes(needle));
  const shown = questions.filter(matches).length;
  const topics = TRUST_TOPICS.filter((t) => questions.some((item) => item.topic === t));

  const listRef = useRef<HTMLDivElement>(null);
  useTextHighlight(listRef, query);
  // While searching, open every matching answer so the highlighted words are visible.
  useEffect(() => {
    listRef.current
      ?.querySelectorAll<HTMLDetailsElement>("details[data-match]")
      .forEach((row) => (row.open = true));
  }, [needle, topic]);

  return (
    <div>
      <div className="flex flex-col gap-3">
        <label htmlFor={`${id}-search`} className="relative block sm:max-w-sm">
          <span className="sr-only">Search the questions</span>
          <Search
            className="text-muted-600 pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
            aria-hidden="true"
          />
          <input
            id={`${id}-search`}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search questions"
            className="border-navy-900 bg-sand-50 h-11 w-full rounded-sm border-2 pr-9 pl-9 text-base"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-muted-600 hover:text-navy-900 absolute top-1/2 right-1 grid size-9 -translate-y-1/2 place-items-center"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </label>
        <div role="group" aria-label="Filter by topic" className="flex flex-wrap gap-2">
          {(["All", ...topics] as const).map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={topic === t}
              onClick={() => setTopic(t)}
              className={cn(
                "border-navy-900 min-h-9 rounded-full border-2 px-3.5 text-sm font-bold transition-colors duration-150",
                topic === t ? "bg-navy-900 text-sand-50" : "text-navy-900 hover:bg-sand-100",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {shown} of {questions.length} questions shown
      </p>

      <div ref={listRef} className="divide-navy-900/20 border-navy-900 mt-5 divide-y border-t-2">
        {questions.map((item, index) => (
          <details
            key={item.q}
            open={index === 0}
            hidden={!matches(item)}
            data-match={needle.length >= 2 && matches(item) ? "" : undefined}
            className="group vc-details py-1"
          >
            <summary className="text-navy-900 flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 text-lg font-bold">
              <span className="flex items-baseline gap-3">
                <span className="manifest-index text-terracotta-600 hidden w-24 shrink-0 sm:inline">
                  {item.topic}
                </span>
                {item.q}
              </span>
              <span
                aria-hidden="true"
                className="border-navy-900 text-navy-900 group-open:bg-navy-900 group-open:text-sand-50 grid size-7 shrink-0 place-items-center rounded-full border-2 text-lg leading-none transition-[transform,background-color,color] duration-200 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <div className="text-ink-900 pb-5 text-base leading-relaxed sm:pl-[7.75rem]">
              {item.a}
              {item.related && (
                <p className="border-navy-900/15 mt-3 border-t pt-2 text-sm">
                  <span className="text-muted-600 font-semibold">Related: </span>
                  <Link
                    href={item.related.href}
                    className="text-navy-900 font-semibold underline decoration-2 underline-offset-4"
                  >
                    {item.related.label}
                  </Link>
                </p>
              )}
            </div>
          </details>
        ))}
        {shown === 0 && (
          <p className="text-muted-600 py-6">
            Nothing matches that. Try another word, or just call us and ask.
          </p>
        )}
      </div>
      <Link
        href="/faq"
        className="text-navy-900 mt-6 inline-flex min-h-11 items-center gap-2 font-semibold underline decoration-2 underline-offset-4"
      >
        See all questions
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </div>
  );
}
