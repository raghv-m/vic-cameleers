/**
 * Single source of truth for Vic Cameleers business facts.
 * Never hardcode any of these values in components, copy, or metadata.
 * See CLAUDE.md section 1 for the source brief and open questions.
 */

// Explicit .ts extension: prisma/seed.ts loads this file through Node's type stripping.
import { SITE_URL } from "./site-url.ts";

export const business = {
  tradingName: "Vic Cameleers",
  // TODO(owner): confirm legal entity name before launch (likely "Vic Cameleers Pty Ltd").
  legalName: null as string | null,
  abn: "43 805 185 060",
  acn: "702 456 988",

  baseSuburb: "Cranbourne VIC",
  basePostcode: "3977",
  /**
   * Centre of the suburb of Cranbourne (public gazetteer coordinates), used for schema `geo`.
   * Deliberately not the depot's street location: this is a service-area business with no
   * public street address.
   */
  baseGeo: { latitude: -38.0996, longitude: 145.2834 },
  serviceAreaDescription: "Greater Melbourne, Victoria",

  /**
   * Street address for the Google Maps embed. Null keeps the map at suburb level (Cranbourne),
   * which is the right default for a service-area business; set it only to an address the owner
   * is happy to publish.
   */
  // TODO(owner): depot address, if it should be public.
  depotAddress: null as string | null,

  /**
   * Reply-time promise, shown in the USP bar and on the thank-you page. Owner chose softer
   * wording over a fixed "within 2 hours" (5 Oct 2026). Set to null to hide it everywhere.
   */
  responsePromise: "We reply the same day" as string | null,

  phoneDisplay: "0481 950 085",
  phoneE164: "+61481950085",

  // TODO(owner): set the public inbox once the domain is live.
  publicEmail: null as string | null,

  // From NEXT_PUBLIC_SITE_URL, see src/config/site-url.ts.
  siteUrl: SITE_URL,

  fleet: [
    { label: "6 tonne truck", size: "SIX_TONNE" as const },
    { label: "10 tonne truck", size: "TEN_TONNE" as const },
  ],
  crewSize: 10,

  /** Numeric hourly rate in AUD, for structured data. GST treatment unconfirmed, see TODO-OWNER.md. */
  hourlyRateAud: 120,
  hourlyRateDisplay: "$120/hour",
  /** Short form for page titles, which have a 60 character budget. */
  hourlyRateShort: "$120/hr",
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
  // TODO(owner): Google Business Profile URL once the profile exists. Feeds schema `sameAs`.
  googleBusinessProfileUrl: null as string | null,

  // TODO(owner): business hours aren't confirmed. Until they are, there's no
  // openingHoursSpecification in the schema and no hours anywhere on the site.
  openingHours: null,

  /**
   * TODO(owner): stays false until real, verifiable reviews exist. Only then may the schema
   * include AggregateRating/Review, and only on pages that visibly show those reviews.
   */
  reviewSchemaEnabled: false,

  social: {
    // TODO(owner): add once created.
    facebook: null as string | null,
    instagram: null as string | null,
  },
} as const;

export type Business = typeof business;
