/**
 * Third-party tracking IDs. Both are public by design (they ship in page source on every site
 * that uses them), so they live in config rather than secret env vars. Set either to null to
 * switch that integration off everywhere, including its CSP allowances.
 */
export const tracking = {
  /** Google Analytics 4 web stream. Loads only after the visitor consents (see consent below). */
  ga4MeasurementId: "G-X31VERYW4Z" as string | null,

  /**
   * consentmanager.net CMP (cookie banner). Its autoblocking script holds back Google Analytics
   * until the visitor agrees, and passes the choice to Google through Consent Mode v2 (switch
   * that on in the consentmanager dashboard).
   */
  consentManager: {
    scriptUrl: "https://cdn.consentmanager.net/delivery/autoblocking/b4e2422d827dd.js",
    host: "d.delivery.consentmanager.net",
    cdn: "cdn.consentmanager.net",
    codeSrc: "16",
  } as { scriptUrl: string; host: string; cdn: string; codeSrc: string } | null,
} as const;
