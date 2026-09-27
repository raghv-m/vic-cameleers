import type { SuburbData } from "./types";

/**
 * Berwick. Published. Local details drafted 26 Sep 2026 and marked REVIEW for the owner to fact-check.
 */
export const suburbData: SuburbData = {
  name: "Berwick",
  postcode: "3806",
  council: "City of Casey",
  // REVIEW: approximate drive from the Cranbourne depot, confirm from real trips.
  driveTimeFromCranbourneMins: 20,
  // REVIEW
  intro:
    "Berwick is about twenty minutes from our Cranbourne depot, and a mix of established streets and newer estates.",
  // REVIEW
  housingNotes:
    "Older, established homes on larger blocks closer to the village, and newer estate housing further out.",
  // REVIEW
  accessNotes:
    "Some Berwick streets are hilly, so a sloping driveway or front steps can make for a longer, slower carry. Let us know about slopes or steps when you get your quote.",
  // REVIEW
  parkingNotes:
    "Established streets usually have room for the truck close by. On newer estate streets, a clear spot out the front on moving day helps.",
  nearbySuburbs: ["clyde-north", "narre-warren", "officer", "narre-warren-south"],
  // REVIEW
  localFaqs: [
    {
      question: "I've got a sloping driveway in Berwick. Is that a problem?",
      answer:
        "No, but it can slow the carry down, especially with heavy furniture, so tell us about it in your quote. It goes into the estimate as access time, not a separate fee.",
    },
    {
      question: "Do you move from Berwick to other parts of Melbourne?",
      answer:
        "Yes. We move anywhere in Greater Melbourne, Victoria only. Put both addresses in the quote and we'll work out the range.",
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
