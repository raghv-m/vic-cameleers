/**
 * Single source of truth for Vic Cameleers business facts.
 * Never hardcode any of these values in components, copy, or metadata.
 * See CLAUDE.md section 1 for the source brief and open questions.
 */

export const business = {
  tradingName: "Vic Cameleers",
  // TODO(owner): confirm legal entity name before launch (likely "Vic Cameleers Pty Ltd").
  legalName: null as string | null,
  abn: "43 805 185 060",
  acn: "702 456 988",

  baseSuburb: "Cranbourne VIC",
  serviceAreaDescription: "Greater Melbourne, Victoria",

  phoneDisplay: "0481 950 085",
  phoneE164: "+61481950085",

  // TODO(owner): set the public inbox once the domain is live.
  publicEmail: null as string | null,

  // Read from env so it can be set once the domain is purchased.
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  fleet: [
    { label: "6 tonne truck", size: "SIX_TONNE" as const },
    { label: "10 tonne truck", size: "TEN_TONNE" as const },
  ],
  crewSize: 10,

  hourlyRateDisplay: "$120/hour",
  minimumHours: 2,
  calloutMinutes: 45,

  /**
   * Compliance-sensitive claims. Each must stay false, with no supporting
   * detail shown on the site, until a human confirms it and fills in the detail.
   * See CLAUDE.md section 3 (honesty rules).
   */
  claims: {
    isFullyInsured: false,
    insuranceDetail: null as string | null,
    isLicensed: false,
    licenseDetail: null as string | null,
  },

  googleReviewUrl: null as string | null,

  social: {
    // TODO(owner): add once created.
    facebook: null as string | null,
    instagram: null as string | null,
  },
} as const;

export type Business = typeof business;
