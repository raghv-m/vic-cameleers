import type { SuburbData } from "./types";

/**
 * Lyndhurst. Not published: no page is built until the local sections are written and checked.
 */
export const suburbData: SuburbData = {
  name: "Lyndhurst",
  postcode: "3975",
  council: "City of Casey / City of Greater Dandenong",
  nearbySuburbs: ["lynbrook", "hampton-park", "keysborough"],
  // TODO(owner): real jobs from this suburb only, never invented.
  featuredJobs: [],
  // TODO(owner): real reviews from customers in this suburb only.
  reviews: [],
  // TODO(owner): real photos from jobs in this suburb (docs/photo-shot-list.md).
  photos: [],
  published: false,
};
