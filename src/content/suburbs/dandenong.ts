import type { SuburbData } from "./types";

/**
 * Dandenong. Not published: no page is built until the local sections are written and checked.
 */
export const suburbData: SuburbData = {
  name: "Dandenong",
  postcode: "3175",
  council: "City of Greater Dandenong",
  nearbySuburbs: ["keysborough", "lyndhurst"],
  // TODO(owner): real jobs from this suburb only, never invented.
  featuredJobs: [],
  // TODO(owner): real reviews from customers in this suburb only.
  reviews: [],
  // TODO(owner): real photos from jobs in this suburb (docs/photo-shot-list.md).
  photos: [],
  published: false,
};
