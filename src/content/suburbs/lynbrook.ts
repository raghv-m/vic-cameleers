import type { SuburbData } from "./types";

/**
 * Lynbrook. Not published: no page is built until the local sections are written and checked.
 */
export const suburbData: SuburbData = {
  name: "Lynbrook",
  postcode: "3975",
  council: "City of Casey",
  nearbySuburbs: ["hampton-park", "lyndhurst", "narre-warren-south"],
  // TODO(owner): real jobs from this suburb only, never invented.
  featuredJobs: [],
  // TODO(owner): real reviews from customers in this suburb only.
  reviews: [],
  // TODO(owner): real photos from jobs in this suburb (docs/photo-shot-list.md).
  photos: [],
  published: false,
};
