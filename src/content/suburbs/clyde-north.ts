import type { SuburbData } from "./types";

/**
 * Clyde North. Published. Local details drafted 26 Sep 2026 and marked REVIEW for the owner to fact-check.
 */
export const suburbData: SuburbData = {
  name: "Clyde North",
  postcode: "3978",
  council: "City of Casey",
  // REVIEW: approximate drive from the Cranbourne depot, confirm from real trips.
  driveTimeFromCranbourneMins: 12,
  // REVIEW
  intro:
    "Clyde North is one of the fastest-growing suburbs in Melbourne's south-east, and about twelve minutes from our Cranbourne depot.",
  // REVIEW
  housingNotes:
    "Mostly new estates, many of them only a few years old, with a lot of double-storey homes on smaller blocks and some streets still being built.",
  // REVIEW
  accessNotes:
    "Streets in newer estates can be narrow, and with construction still going on nearby there may be tradie vehicles, skips or temporary fencing to work around.",
  // REVIEW
  parkingNotes:
    "If you're moving into a brand new home, check the driveway and kerb are finished and clear. If they aren't, tell us and we'll plan for a longer carry.",
  nearbySuburbs: ["cranbourne-east", "berwick", "officer", "clyde"],
  // REVIEW
  localFaqs: [
    {
      question: "Can you move us into a brand new build in Clyde North?",
      answer:
        "Yes. Let us know if the driveway, paths or kerb aren't finished yet, or if there's building work next door, so we can plan where the truck goes and how far the crew will carry.",
    },
    {
      question: "Which truck do you usually send to Clyde North?",
      answer:
        "It depends on the size of your home, not the suburb. A studio to two bedroom usually fits the 6 tonne truck; three bedrooms and up usually gets the 10 tonne truck. Your quote tells you which one.",
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
