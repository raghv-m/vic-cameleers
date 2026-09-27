import type { SuburbData } from "./types";

/**
 * Cranbourne. Published. Local details drafted 27 Sep 2026 and marked REVIEW for the owner to fact-check.
 */
export const suburbData: SuburbData = {
  name: "Cranbourne",
  postcode: "3977",
  council: "City of Casey",
  // REVIEW
  intro:
    "This is home. Our trucks and crew are based in Cranbourne, so it's the suburb we can usually get to fastest, often with room for a same-day job.",
  // REVIEW
  housingNotes:
    "A mix of older, established streets around the town centre and newer estates on the edges of the suburb, so a Cranbourne move can be anything from a single-storey brick house with a big driveway to a double-storey on a tight estate block.",
  // REVIEW
  accessNotes:
    "Established streets usually give the truck room to back up close to the front door. On newer estate blocks the driveway is often short, so the truck may need to park on the street and the crew carries a little further.",
  // REVIEW
  parkingNotes:
    "Let us know if the street is narrow or usually has cars parked on both sides, so we can plan where the truck goes before moving day.",
  nearbySuburbs: [
    "cranbourne-east",
    "cranbourne-north",
    "clyde-north",
    "cranbourne-west",
    "botanic-ridge",
  ],
  // REVIEW
  localFaqs: [
    {
      question: "Can you do a same-day move in Cranbourne?",
      answer:
        "Often, because we're based here, but it depends on whether a truck and crew are free that day. Call us rather than using the online form for same-day jobs so we can check straight away.",
    },
    {
      question: "Is the call-out fee lower if I'm in Cranbourne?",
      answer:
        "No. The call-out is a flat 45 minutes at the hourly rate for every job, so the price works the same wherever you are in our service area. Being close just means we can often fit you in sooner.",
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
