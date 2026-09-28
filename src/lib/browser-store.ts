/**
 * Small, failure-proof wrappers around localStorage for per-visitor conveniences (a remembered
 * estimate, a half-finished quote). Storage can be missing or throw (private windows, blocked
 * site data), so every call swallows errors and callers always have a sensible default.
 *
 * Never store contact details here: names, phone numbers and emails stay in memory only.
 */

export const STORE_KEYS = {
  estimator: "vc:estimator:v1",
  quoteDraft: "vc:quote-draft:v1",
} as const;

/** Drafts older than this are ignored and cleared. */
const MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000;

interface Stored<T> {
  savedAt: number;
  value: T;
}

export function readStore<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Stored<T>;
    if (!parsed || typeof parsed.savedAt !== "number" || Date.now() - parsed.savedAt > MAX_AGE_MS) {
      window.localStorage.removeItem(key);
      return null;
    }
    return parsed.value;
  } catch {
    return null;
  }
}

export function writeStore<T>(key: string, value: T): void {
  try {
    const stored: Stored<T> = { savedAt: Date.now(), value };
    window.localStorage.setItem(key, JSON.stringify(stored));
  } catch {
    // Storage full or blocked: the page works the same, it just won't remember.
  }
}

export function clearStore(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Nothing to clear if storage is unavailable.
  }
}

/** Fired by "use this suburb" buttons; the hero estimator listens and fills its suburb fields. */
export const PREFILL_EVENT = "vc:prefill-estimate";

export interface PrefillDetail {
  from?: string;
  to?: string;
}

export function requestEstimatePrefill(detail: PrefillDetail): void {
  window.dispatchEvent(new CustomEvent<PrefillDetail>(PREFILL_EVENT, { detail }));
  const target = document.getElementById("estimate");
  if (!target) return;
  // Smooth scrolls never run in a hidden tab, so jump instead of stalling.
  const reduce =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    document.visibilityState === "hidden";
  target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}
