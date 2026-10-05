import { track as vercelTrack } from "@vercel/analytics";

declare global {
  interface Window {
    dataLayer?: unknown[];
    /** Defined by the Google tag snippet in the root layout. */
    gtag?: (...args: unknown[]) => void;
  }
}

type EventProps = Record<string, string | number | boolean | null>;

/**
 * GA4 names for our events where Google has a recommended one, so they can be marked as key
 * events (conversions) in GA4 without custom setup. Everything else goes through as named.
 */
const GA4_EVENT_NAMES: Record<string, string> = {
  quote_submitted: "generate_lead",
  contact_submitted: "generate_lead",
};

/**
 * One call for client-side events: Vercel Web Analytics custom events plus GA4 (when it's loaded
 * and the visitor has consented; before that gtag queues the event and GA drops it unless
 * consent is granted). Never throws.
 */
export function track(name: string, props: EventProps = {}): void {
  try {
    vercelTrack(name, props);
  } catch {
    // analytics must never break the page
  }
  try {
    const gaName = GA4_EVENT_NAMES[name];
    window.gtag?.("event", gaName ?? name, gaName ? { ...props, lead_type: name } : props);
  } catch {
    // same
  }
}
