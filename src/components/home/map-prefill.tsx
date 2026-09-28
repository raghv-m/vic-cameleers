"use client";

import { requestEstimatePrefill } from "@/lib/browser-store";

/**
 * Wraps the coverage map so a plain click on a suburb pin starts an estimate from that suburb
 * instead of leaving the page. The pins stay real links: without JavaScript, or with Ctrl/Cmd/
 * Shift/middle click, they still open the suburb's page (which the list beside the map also
 * links to).
 */
export function MapPrefill({ children }: { children: React.ReactNode }) {
  function onClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    const pin = (event.target as Element).closest<HTMLElement | SVGElement>("[data-prefill]");
    const suburb = pin?.getAttribute("data-prefill");
    if (!suburb) return;
    // Capture phase: stop the pin's own Link handler from navigating before this runs.
    event.preventDefault();
    event.stopPropagation();
    requestEstimatePrefill({ from: `${suburb} VIC` });
  }

  return <div onClickCapture={onClick}>{children}</div>;
}
