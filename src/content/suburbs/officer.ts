import type { SuburbData } from "./types";

/**
 * Officer. Published. Local details drafted 26 Sep 2026 and marked REVIEW for the owner to fact-check.
 */
export const suburbData: SuburbData = {
  name: "Officer",
  postcode: "3809",
  council: "Shire of Cardinia",
  // REVIEW: approximate drive from the Cranbourne depot, confirm from real trips.
  driveTimeFromCranbourneMins: 22,
  // REVIEW
  intro:
    "Officer sits in the Cardinia growth corridor, about twenty-two minutes from our Cranbourne depot.",
  // REVIEW
  housingNotes: "Mostly newer estate housing, with a lot of recently built family homes.",
  // REVIEW
  accessNotes:
    "Newer estates often have tight streets and short driveways, and some areas still have building work going on around them.",
  // REVIEW
  parkingNotes:
    "If you're moving into a new build, check the driveway and kerb are finished. Tell us if they aren't, so we can plan where the truck parks.",
  nearbySuburbs: ["pakenham", "berwick", "clyde-north"],
  // REVIEW
  localFaqs: [
    {
      question: "Do you cover Officer, or only Casey?",
      answer:
        "We cover Officer and the rest of the Cardinia side too. It's about twenty-two minutes from our depot, and the price works the same way as everywhere else: hourly, with a 45 minute call-out.",
    },
    {
      question: "Can you move us into a new Officer estate that's still being built?",
      answer:
        "Yes. Tell us about unfinished driveways or building work nearby, and we'll plan the truck and the carry around it.",
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
