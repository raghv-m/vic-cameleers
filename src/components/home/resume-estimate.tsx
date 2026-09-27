"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";

import { STORE_KEYS, readStore } from "@/lib/browser-store";

interface SavedEstimate {
  kind: "home" | "office" | "item";
  homeSize: string;
  stairs: string;
  packing: boolean;
  from: string;
  to: string;
  date: string;
}

const SIZE_WORDS: Record<string, string> = {
  studio: "studio",
  "1bed": "1 bedroom",
  "2bed": "2 bedroom",
  "3bed": "3 bedroom",
  "4plus": "4+ bedroom",
};

/**
 * "You were estimating a 2 bedroom move from Berwick." Shown at the end of the page only when the
 * visitor has already played with the estimator, and it carries their answers into the quote form.
 */
export function ResumeEstimate() {
  const [saved, setSaved] = useState<SavedEstimate | null>(null);

  useEffect(() => {
    const value = readStore<SavedEstimate>(STORE_KEYS.estimator);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of localStorage, only available after hydration
    if (value && (value.from || value.to || value.date)) setSaved(value);
  }, []);

  if (!saved) return null;

  const size =
    saved.kind === "office"
      ? "an office"
      : saved.kind === "item"
        ? "a single item"
        : `a ${SIZE_WORDS[saved.homeSize] ?? ""} home`;
  const route = [saved.from && `from ${saved.from}`, saved.to && `to ${saved.to}`]
    .filter(Boolean)
    .join(" ");

  const params = new URLSearchParams({
    type: saved.kind,
    size:
      saved.kind === "office" ? "office" : saved.kind === "item" ? "singleItem" : saved.homeSize,
    stairs: saved.stairs,
  });
  if (saved.packing) params.set("packing", "1");
  if (saved.from) params.set("from", saved.from);
  if (saved.to) params.set("to", saved.to);
  if (saved.date) params.set("date", saved.date);

  return (
    <Link
      href={`/quote?${params.toString()}`}
      className="border-navy-900 bg-sand-50 text-navy-900 hover:bg-sand-100 vc-lift mt-6 inline-flex max-w-full items-center gap-3 rounded-sm border-2 px-4 py-3 text-[0.9375rem]"
    >
      <RotateCcw className="text-terracotta-600 size-5 shrink-0" aria-hidden="true" />
      <span>
        <span className="font-bold">Carry on with your estimate:</span> {size}
        {route ? ` ${route}` : ""}.
      </span>
    </Link>
  );
}
