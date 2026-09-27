import type { SuburbData } from "./types";

/**
 * Langwarrin. Not published: no page is built until the local sections are written and checked.
 */
export const suburbData: SuburbData = {
  name: "Langwarrin",
  postcode: "3910",
  council: "City of Frankston",
  nearbySuburbs: ["carrum-downs", "frankston", "skye"],
  // TODO(owner): real jobs from this suburb only, never invented.
  featuredJobs: [],
  // TODO(owner): real reviews from customers in this suburb only.
  reviews: [],
  // TODO(owner): real photos from jobs in this suburb (docs/photo-shot-list.md).
  photos: [],
  published: false,
};
