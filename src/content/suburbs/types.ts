/**
 * Suburb page data. One typed file per suburb in this folder, each exporting `suburbData`.
 * No MDX, no Markdown: plain strings, so everything is type-checked and the build stays simple.
 *
 * Every optional section on the page renders only when its field has real content, so a
 * suburb page never shows a template sentence with just the name swapped in. Drafted local
 * details are marked `// REVIEW` in the data file for the owner to fact-check before they're
 * treated as confirmed. Never invent landmarks, council rules, parking laws, job stories,
 * reviews or statistics here.
 */

export type TruckSize = "SIX_TONNE" | "TEN_TONNE";

/** A real job done in or out of this suburb. Only ever filled from the business's own records. */
export interface FeaturedJob {
  /** e.g. "3 bedroom house, Clyde North to Officer" */
  title: string;
  /** A short, true account of the job in plain words. */
  story: string;
  truck: TruckSize;
  crewCount: number;
  hours: number;
  /** Final price paid, in whole dollars. */
  priceAud: number;
  /** ISO date of the move. */
  date: string;
  photo?: SuburbPhoto;
}

/** A real review from a customer in this suburb, copied from its source with permission. */
export interface Review {
  authorName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  body: string;
  /** ISO date the review was posted. */
  date: string;
  source: "GOOGLE" | "MANUAL";
}

export interface SuburbPhoto {
  /** Path under /public, e.g. "/photos/suburbs/clyde-north-street.jpg". */
  src: string;
  /** Describes the actual scene, e.g. "Crew loading a couch into the 10 tonne truck in Clyde North". */
  alt: string;
  width: number;
  height: number;
}

export interface LocalFaq {
  question: string;
  answer: string;
}

export interface SuburbData {
  name: string;
  postcode: string;
  council: string;
  driveTimeFromCranbourneMins?: number;
  /** One or two sentences opening the page, specific to this suburb. */
  intro?: string;
  housingNotes?: string;
  accessNotes?: string;
  parkingNotes?: string;
  /** Slugs of neighbouring suburbs (file names without .ts). Only published ones are linked. */
  nearbySuburbs?: string[];
  /** 2 to 3 questions only this suburb would ask. */
  localFaqs?: LocalFaq[];
  featuredJobs?: FeaturedJob[];
  reviews?: Review[];
  photos?: SuburbPhoto[];
  /** Only published suburbs are built, linked, listed in the sitemap and in structured data. */
  published: boolean;
}

export interface Suburb extends SuburbData {
  slug: string;
}
