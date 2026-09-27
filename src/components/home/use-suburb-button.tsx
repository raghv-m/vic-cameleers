"use client";

import { Calculator } from "lucide-react";

import { requestEstimatePrefill } from "@/lib/browser-store";

/** Puts a suburb into the hero estimator's "Moving from" field and scrolls up to it. */
export function UseSuburbButton({ suburb }: { suburb: string }) {
  return (
    <button
      type="button"
      onClick={() => requestEstimatePrefill({ from: `${suburb} VIC` })}
      className="text-muted-600 hover:text-terracotta-600 hover:bg-sand-100 grid size-11 shrink-0 place-items-center rounded-sm transition-colors"
      aria-label={`Use ${suburb} as the pickup in the estimate`}
      title={`Estimate a move from ${suburb}`}
    >
      <Calculator className="size-4" aria-hidden="true" />
    </button>
  );
}
