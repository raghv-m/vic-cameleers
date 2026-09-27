"use client";

import { useEffect, useState } from "react";

/**
 * "In this guide": built from the article's own h2s after it renders, so it can never list a
 * heading the article doesn't have. Renders nothing until then, and nothing for short guides.
 */
export function GuideToc({ articleId }: { articleId: string }) {
  const [headings, setHeadings] = useState<{ id: string; text: string }[]>([]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const found = [...document.querySelectorAll<HTMLHeadingElement>(`#${articleId} h2[id]`)].map(
        (h) => ({ id: h.id, text: h.textContent ?? "" }),
      );
      setHeadings(found);
    });
    return () => cancelAnimationFrame(frame);
  }, [articleId]);

  if (headings.length < 3) return null;

  return (
    <nav aria-label="In this guide" className="border-navy-900 border-t-2 pt-4">
      <p className="manifest-index text-muted-600">In this guide</p>
      <ol className="mt-3 space-y-1">
        {headings.map((heading, index) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className="text-navy-900 hover:text-terracotta-600 flex min-h-10 items-baseline gap-3 py-1 text-[0.9375rem] font-semibold"
            >
              <span className="manifest-index text-terracotta-600 w-6 shrink-0">
                {String(index + 1).padStart(2, "0")}
              </span>
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
