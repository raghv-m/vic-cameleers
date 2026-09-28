"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Search, ThumbsDown, ThumbsUp, X } from "lucide-react";
import { cn } from "cn";

import { FAQ_CATEGORIES, type Faq, type FaqCategory } from "@/config/faq";
import { readStore, writeStore } from "@/lib/browser-store";
import { useTextHighlight } from "@/lib/use-text-highlight";

const HELPFUL_KEY = "vc:faq-helpful:v1";
type Vote = "up" | "down";

/** Opens the question named in the URL hash and brings it into view. */
function openFromHash(root: HTMLElement | null) {
  const id = decodeURIComponent(window.location.hash.slice(1));
  if (!id || !root) return;
  const target = root.querySelector<HTMLDetailsElement>(`details[id="${CSS.escape(id)}"]`);
  if (!target) return;
  target.open = true;
  const reduce =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    document.visibilityState === "hidden";
  target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  target.querySelector("summary")?.focus({ preventScroll: true });
}

/**
 * The /faq page body: sticky search with a live result count, category chips with counts, and the
 * questions grouped by category as native <details> (server-rendered, so every answer is in the
 * HTML and works without JavaScript). Open answers carry "Was this helpful?" (kept only in this
 * browser, no personal data) and links to related questions. /faq#<id> opens that question.
 */
export function FaqExplorer({ faqs }: { faqs: Faq[] }) {
  const id = useId();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<FaqCategory | "All">("All");
  const [votes, setVotes] = useState<Record<string, Vote>>({});
  const listRef = useRef<HTMLDivElement>(null);

  const needle = query.trim().toLowerCase();
  const matchesQuery = (faq: Faq) =>
    needle === "" || `${faq.question} ${faq.answer}`.toLowerCase().includes(needle);
  const visible = (faq: Faq) =>
    matchesQuery(faq) && (category === "All" || faq.category === category);
  const shown = faqs.filter(visible);
  const byId = new Map(faqs.map((faq) => [faq.id, faq]));

  useTextHighlight(listRef, query);

  useEffect(() => {
    const saved = readStore<Record<string, Vote>>(HELPFUL_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of localStorage, only available after hydration
    if (saved) setVotes(saved);
    openFromHash(listRef.current);
    const onHash = () => openFromHash(listRef.current);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // While searching, open every match so the highlighted words are visible.
  useEffect(() => {
    if (needle.length < 2) return;
    listRef.current
      ?.querySelectorAll<HTMLDetailsElement>("details:not([hidden])")
      .forEach((row) => (row.open = true));
  }, [needle, category]);

  function vote(faqId: string, value: Vote) {
    setVotes((current) => {
      const next = { ...current };
      if (next[faqId] === value) delete next[faqId];
      else next[faqId] = value;
      writeStore(HELPFUL_KEY, next);
      return next;
    });
  }

  return (
    <div>
      <div className="bg-sand-50/95 border-navy-900 sticky top-16 z-20 -mx-4 border-b-2 px-4 py-4 backdrop-blur-sm sm:mx-0 sm:px-0">
        <label htmlFor={`${id}-search`} className="relative block">
          <span className="sr-only">Search the questions</span>
          <Search
            className="text-muted-600 pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2"
            aria-hidden="true"
          />
          <input
            id={`${id}-search`}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search: minimum charge, stairs, trucks, cancel..."
            className="border-navy-900 bg-sand-50 h-12 w-full rounded-sm border-2 pr-11 pl-11 text-base"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-muted-600 hover:text-navy-900 absolute top-1/2 right-1.5 grid size-10 -translate-y-1/2 place-items-center"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </label>

        <div role="group" aria-label="Filter by category" className="mt-3 flex flex-wrap gap-2">
          {(["All", ...FAQ_CATEGORIES] as const).map((cat) => {
            const count = faqs.filter(
              (faq) => matchesQuery(faq) && (cat === "All" || faq.category === cat),
            ).length;
            return (
              <button
                key={cat}
                type="button"
                aria-pressed={category === cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  "border-navy-900 inline-flex min-h-9 items-center gap-1.5 rounded-full border-2 px-3 text-sm font-bold transition-colors duration-150",
                  category === cat ? "bg-navy-900 text-sand-50" : "text-navy-900 hover:bg-sand-100",
                )}
              >
                {cat}
                <span
                  className={cn(
                    "tabular rounded-full px-1.5 text-xs",
                    category === cat ? "bg-sand-50/20" : "bg-navy-900/10",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <p className="text-muted-600 mt-3 text-sm" aria-live="polite">
          {needle
            ? `${shown.length} result${shown.length === 1 ? "" : "s"} for “${query.trim()}”`
            : `${shown.length} question${shown.length === 1 ? "" : "s"}`}
          {category !== "All" && ` in ${category}`}
        </p>
      </div>

      <div ref={listRef} className="mt-8 space-y-10">
        {FAQ_CATEGORIES.map((cat) => {
          const items = faqs.filter((faq) => faq.category === cat);
          const anyVisible = items.some(visible);
          return (
            <section key={cat} aria-labelledby={`${id}-${cat}`} hidden={!anyVisible}>
              <h2
                id={`${id}-${cat}`}
                className="manifest-index text-terracotta-600 border-navy-900 border-b-2 pb-2"
              >
                {cat}
              </h2>
              <div className="divide-navy-900/20 divide-y">
                {items.map((faq) => (
                  <details
                    key={faq.id}
                    id={faq.id}
                    hidden={!visible(faq)}
                    className="group vc-details scroll-mt-64"
                  >
                    <summary className="text-navy-900 flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 text-lg font-bold">
                      {faq.question}
                      <span
                        aria-hidden="true"
                        className="border-navy-900 group-open:bg-navy-900 group-open:text-sand-50 grid size-7 shrink-0 place-items-center rounded-full border-2 leading-none transition-[transform,background-color,color] duration-200 group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <div className="pb-5">
                      <p className="text-ink-900 max-w-[65ch] text-base leading-relaxed">
                        {faq.answer}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-600 font-semibold">Was this helpful?</span>
                          {(["up", "down"] as const).map((v) => {
                            const Icon = v === "up" ? ThumbsUp : ThumbsDown;
                            return (
                              <button
                                key={v}
                                type="button"
                                aria-pressed={votes[faq.id] === v}
                                onClick={() => vote(faq.id, v)}
                                className={cn(
                                  "border-navy-900/30 grid size-9 place-items-center rounded-sm border transition-colors",
                                  votes[faq.id] === v
                                    ? "bg-navy-900 text-sand-50 border-navy-900"
                                    : "text-navy-900 hover:bg-sand-100",
                                )}
                              >
                                <Icon className="size-4" aria-hidden="true" />
                                <span className="sr-only">{v === "up" ? "Yes" : "No"}</span>
                              </button>
                            );
                          })}
                          {votes[faq.id] && (
                            <span className="text-muted-600 text-xs">Thanks, noted.</span>
                          )}
                        </div>

                        {faq.related && faq.related.length > 0 && (
                          <p className="text-muted-600">
                            <span className="font-semibold">Related: </span>
                            {faq.related
                              .map((rel) => byId.get(rel))
                              .filter((rel): rel is Faq => Boolean(rel))
                              .map((rel, index) => (
                                <span key={rel.id}>
                                  {index > 0 && " · "}
                                  <a
                                    href={`#${rel.id}`}
                                    className="text-navy-900 font-semibold underline decoration-2 underline-offset-4"
                                  >
                                    {rel.question}
                                  </a>
                                </span>
                              ))}
                          </p>
                        )}
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          );
        })}
        {shown.length === 0 && (
          <p className="text-muted-600 py-6 text-lg">
            Nothing matches that. Try another word, or just call us and ask.
          </p>
        )}
      </div>
    </div>
  );
}
