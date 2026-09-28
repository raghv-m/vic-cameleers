"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/** Copies the quote reference, with a short "Copied" confirmation that screen readers hear. */
export function CopyReference({ reference }: { reference: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(reference);
    } catch {
      // Older browsers or blocked clipboard: select a temporary field and copy that way.
      const field = document.createElement("textarea");
      field.value = reference;
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="border-kraft-400/60 hover:bg-navy-700 text-kraft-400 inline-flex min-h-9 items-center gap-1.5 rounded-sm border px-2.5 text-[0.75rem] font-bold tracking-[0.08em] uppercase"
    >
      {copied ? (
        <Check className="size-3.5" aria-hidden="true" />
      ) : (
        <Copy className="size-3.5" aria-hidden="true" />
      )}
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
      <span className="sr-only"> reference {reference}</span>
    </button>
  );
}

const PIECES = Array.from({ length: 18 }, (_, i) => i);
const COLOURS = [
  "var(--color-terracotta-600)",
  "var(--color-signal-400)",
  "var(--color-navy-900)",
  "var(--color-kraft-400)",
];

/**
 * A light, CSS-only confetti burst from the top of the card, played once. Positions come from the
 * index (no randomness), so server and client render the same. Hidden from assistive tech and
 * switched off under reduced motion.
 */
export function ConfettiLite() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 z-20 h-0 overflow-visible"
    >
      {PIECES.map((i) => (
        <span
          key={i}
          className="vc-confetti absolute top-0 block h-2.5 w-1.5 rounded-[1px]"
          style={{
            left: `${6 + ((i * 53) % 88)}%`,
            backgroundColor: COLOURS[i % COLOURS.length],
            animationDelay: `${(i % 6) * 60}ms`,
            ["--vc-drift" as string]: `${((i * 37) % 60) - 30}px`,
            ["--vc-spin" as string]: `${((i * 71) % 540) - 270}deg`,
            ["--vc-fall" as string]: `${140 + ((i * 29) % 120)}px`,
          }}
        />
      ))}
    </div>
  );
}
