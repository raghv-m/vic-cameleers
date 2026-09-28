"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "cn";

const DEBOUNCE_MS = 300;
const TWEEN_MS = 480;

function dollars(cents: number): string {
  return `$${Math.round(cents / 100).toLocaleString("en-AU")}`;
}

function format(low: number, high: number): string {
  return low === high ? dollars(low) : `${dollars(low)} to ${dollars(high)}`;
}

/**
 * A price range that counts up or down to its new value. Changes are debounced (300ms) so tapping
 * through options doesn't make the numbers thrash, then both ends tween together with an ease-out,
 * and a small arrow says which way it moved. Screen readers hear only the settled value. Under
 * reduced motion the new value appears straight away.
 */
export function AnimatedRange({
  lowCents,
  highCents,
  className,
}: {
  lowCents: number;
  highCents: number;
  className?: string;
}) {
  const [shown, setShown] = useState({ low: lowCents, high: highCents });
  const [settled, setSettled] = useState(format(lowCents, highCents));
  const [direction, setDirection] = useState<"up" | "down" | null>(null);
  const shownRef = useRef(shown);
  const frame = useRef(0);

  useEffect(() => {
    shownRef.current = shown;
  }, [shown]);

  useEffect(() => {
    const from = shownRef.current;
    if (from.low === lowCents && from.high === highCents) return;

    let landing = 0;
    const timer = window.setTimeout(() => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setDirection(highCents + lowCents > from.low + from.high ? "up" : "down");
      setSettled(format(lowCents, highCents));
      if (reduce) {
        setShown({ low: lowCents, high: highCents });
        return;
      }
      const start = performance.now();
      cancelAnimationFrame(frame.current);
      const tick = (now: number) => {
        const t = Math.min(1, Math.max(0, (now - start) / TWEEN_MS));
        const eased = 1 - Math.pow(1 - t, 3);
        // Tween in whole $10 steps, like the real rounding, so it never shows odd cents.
        const step = (a: number, b: number) => Math.round((a + (b - a) * eased) / 1000) * 1000;
        setShown({ low: step(from.low, lowCents), high: step(from.high, highCents) });
        if (t < 1) frame.current = requestAnimationFrame(tick);
      };
      frame.current = requestAnimationFrame(tick);
      // Animation frames pause in background tabs; this guarantees the tween always lands.
      landing = window.setTimeout(() => {
        cancelAnimationFrame(frame.current);
        setShown({ low: lowCents, high: highCents });
      }, TWEEN_MS + 80);
    }, DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(landing);
    };
  }, [lowCents, highCents]);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  useEffect(() => {
    if (!direction) return;
    const timer = window.setTimeout(() => setDirection(null), 1400);
    return () => window.clearTimeout(timer);
  }, [direction, settled]);

  return (
    <span className={cn("tabular inline-flex items-baseline gap-2", className)}>
      <span className="sr-only" aria-live="polite">
        {settled}
      </span>
      <span aria-hidden="true">{format(shown.low, shown.high)}</span>
      <span
        aria-hidden="true"
        className={cn(
          "self-center text-[0.4em] leading-none transition-opacity duration-300",
          direction ? "opacity-100" : "opacity-0",
          direction === "down" ? "text-success-700" : "text-terracotta-600",
        )}
      >
        {direction === "down" ? "▼" : "▲"}
      </span>
    </span>
  );
}
