/**
 * Keeps the hero estimator's "what's moving / size" and the fleet section's job-size slider in
 * step. Each side keeps its own state and announces user changes with a window event; the other
 * side maps it to its own terms and only updates if that actually changes something, so the two
 * never ping-pong.
 */

import type { PropertySize } from "@/types/pricing";

export const JOB_SIZE_EVENT = "vc:job-size";

export type MoveKind = "home" | "office" | "item";

/** The fleet's three bands: 0 single items, 1 homes up to 2 bed, 2 bigger homes and offices. */
export type FleetBand = 0 | 1 | 2;

export interface JobSizeDetail {
  source: "estimator" | "fleet";
  band: FleetBand;
}

export function bandFor(kind: MoveKind, homeSize: PropertySize): FleetBand {
  if (kind === "item") return 0;
  if (kind === "office") return 2;
  return homeSize === "3bed" || homeSize === "4plus" ? 2 : 1;
}

/** The estimator choice for a band, keeping the current one if it already falls in that band. */
export function choiceForBand(
  band: FleetBand,
  current: { kind: MoveKind; homeSize: PropertySize },
): { kind: MoveKind; homeSize: PropertySize } {
  if (bandFor(current.kind, current.homeSize) === band) return current;
  if (band === 0) return { kind: "item", homeSize: current.homeSize };
  if (band === 1) return { kind: "home", homeSize: "2bed" };
  return { kind: "home", homeSize: "3bed" };
}

export function announceJobSize(detail: JobSizeDetail): void {
  window.dispatchEvent(new CustomEvent<JobSizeDetail>(JOB_SIZE_EVENT, { detail }));
}
