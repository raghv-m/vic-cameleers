import type { SuburbData } from "./types";

/**
 * Cranbourne East. Published. Local details drafted 27 Sep 2026 and marked REVIEW for the owner to fact-check.
 */
export const suburbData: SuburbData = {
  name: "Cranbourne East",
  postcode: "3977",
  council: "City of Casey",
  // REVIEW: approximate drive from the Cranbourne depot, confirm from real trips.
  driveTimeFromCranbourneMins: 5,
  // REVIEW
  intro:
    "Cranbourne East is right next to our base, about five minutes from the depot, so it's one of the easiest suburbs for us to fit in.",
  // REVIEW
  housingNotes:
    "Mostly newer estate housing, with a lot of double-storey homes and townhouses on smaller blocks.",
  // REVIEW
  accessNotes:
    "Double-storey homes mean beds, wardrobes and drawers usually come down internal stairs, which adds time. Tell us about the stairs when you get your quote so the estimate allows for it.",
  // REVIEW
  parkingNotes:
    "Estate streets can be narrow with cars on both sides. If you can, keep a space clear out the front for the truck on moving day.",
  nearbySuburbs: ["cranbourne", "cranbourne-north", "clyde-north", "clyde"],
  // REVIEW
  localFaqs: [
    {
      question: "Does it cost more to move a double-storey house in Cranbourne East?",
      answer:
        "There's no stair fee, but carrying heavy furniture down internal stairs takes longer, and you pay for actual time. Mention the stairs in your quote and the range will include it.",
    },
    {
      question: "How long does it take you to get to Cranbourne East?",
      answer:
        "About five minutes from our Cranbourne depot, so it's rarely a problem to start early in the day.",
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
