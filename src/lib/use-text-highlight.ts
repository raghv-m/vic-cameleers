"use client";

import { useEffect, type RefObject } from "react";

/** The CSS highlight name; style it with ::highlight(vc-search) in globals.css. */
export const SEARCH_HIGHLIGHT = "vc-search";

/**
 * Highlights every case-insensitive match of `query` inside `container` with the CSS Custom
 * Highlight API, without touching the DOM, so links and formatting inside answers stay intact and
 * nothing re-renders. Hidden rows are skipped. Browsers without the API just don't highlight.
 */
export function useTextHighlight(container: RefObject<HTMLElement | null>, query: string) {
  useEffect(() => {
    const root = container.current;
    const registry = typeof CSS !== "undefined" && "highlights" in CSS ? CSS.highlights : null;
    if (!root || !registry || typeof Highlight === "undefined") return;

    const needle = query.trim().toLowerCase();
    if (needle.length < 2) {
      registry.delete(SEARCH_HIGHLIGHT);
      return;
    }

    const ranges: Range[] = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) =>
        node.parentElement?.closest("[hidden], .sr-only")
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_ACCEPT,
    });
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const text = node.textContent?.toLowerCase() ?? "";
      let at = text.indexOf(needle);
      while (at !== -1) {
        const range = new Range();
        range.setStart(node, at);
        range.setEnd(node, at + needle.length);
        ranges.push(range);
        at = text.indexOf(needle, at + needle.length);
      }
    }
    registry.set(SEARCH_HIGHLIGHT, new Highlight(...ranges));
    return () => {
      registry.delete(SEARCH_HIGHLIGHT);
    };
  });
}
