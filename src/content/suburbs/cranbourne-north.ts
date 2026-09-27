import type { SuburbData } from "./types";

/**
 * Cranbourne North. Published. Local details drafted 26 Sep 2026 and marked REVIEW for the owner to fact-check.
 */
export const suburbData: SuburbData = {
  name: "Cranbourne North",
  postcode: "3977",
  council: "City of Casey",
  // REVIEW: approximate drive from the Cranbourne depot, confirm from real trips.
  driveTimeFromCranbourneMins: 7,
  // REVIEW
  intro:
    "Cranbourne North borders our home suburb, roughly seven minutes from the depot, and its estates are some of the closest jobs we do.",
  // REVIEW
  housingNotes:
    "Largely newer estates, with a mix of single and double-storey family homes and some townhouses.",
  // REVIEW
  accessNotes:
    "Newer homes often have short driveways, and garages full of boxes on moving day. Clearing a path from the garage or front door to the street makes the load go faster.",
  // REVIEW
  parkingNotes:
    "If there's a clear bit of kerb out the front, that's usually where the truck parks. Tell us if you're in a narrow court.",
  nearbySuburbs: [
    "cranbourne",
    "cranbourne-east",
    "narre-warren",
    "hampton-park",
    "narre-warren-south",
  ],
  // REVIEW
  localFaqs: [
    {
      question: "Can the 10 tonne truck get into a Cranbourne North court?",
      answer:
        "Usually yes. If the court is tight or crowded with parked cars, we'll park at the entrance and carry further, which adds a little time. Let us know in your quote.",
    },
    {
      question: "Do you move people from Cranbourne North into a new build?",
      answer:
        "Yes. If your new home has no finished driveway yet, tell us so we can plan where the truck parks.",
    },
  ],
  // TODO(owner): real jobs from this suburb only, never invented.
  featuredJobs: [],
  // TODO(owner): real reviews from customers in this suburb only.
  reviews: [],
  // TODO(owner): real photos from jobs in this suburb (docs/photo-shot-list.md).
  photos: [],
  published: true,
};
