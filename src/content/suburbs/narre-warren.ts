import type { SuburbData } from "./types";

/**
 * Narre Warren. Published. Local details drafted 26 Sep 2026 and marked REVIEW for the owner to fact-check.
 */
export const suburbData: SuburbData = {
  name: "Narre Warren",
  postcode: "3805",
  council: "City of Casey",
  // REVIEW: approximate drive from the Cranbourne depot, confirm from real trips.
  driveTimeFromCranbourneMins: 20,
  // REVIEW
  intro:
    "Narre Warren is about twenty minutes from our Cranbourne depot, a well-established suburb with a lot of family homes and units.",
  // REVIEW
  housingNotes:
    "Mostly established houses, with a good number of units and townhouses closer to the shops and main roads.",
  // REVIEW
  accessNotes:
    "Units and townhouses often share a driveway, so the truck may have to park on the street. Tell us if your driveway is shared.",
  // REVIEW
  parkingNotes:
    "If you're in a unit block, check whether there's visitor parking or kerb space nearby that the truck can use.",
  nearbySuburbs: ["berwick", "cranbourne-north", "narre-warren-south", "hampton-park"],
  // REVIEW
  localFaqs: [
    {
      question:
        "I'm moving out of a unit with a shared driveway in Narre Warren. What should I do?",
      answer:
        "Let your neighbours know the date, and tell us about the shared driveway in your quote. If the truck can't block it, we'll park on the street and allow for the extra carry.",
    },
    {
      question: "Do you move people from Narre Warren to the new estates further out?",
      answer: "Yes. Put both addresses in the quote and we'll work out the range.",
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
