import type { SuburbData } from "./types";

/**
 * Pakenham. Published. Local details drafted 27 Sep 2026 and marked REVIEW for the owner to fact-check.
 */
export const suburbData: SuburbData = {
  name: "Pakenham",
  postcode: "3810",
  council: "Shire of Cardinia",
  // REVIEW: approximate drive from the Cranbourne depot, confirm from real trips.
  driveTimeFromCranbourneMins: 28,
  // REVIEW
  intro:
    "Pakenham is further out the south-east corridor, about twenty-eight minutes from our Cranbourne depot, with an established town centre and big new estates around it.",
  // REVIEW
  housingNotes:
    "Established houses around the older parts of town, and large areas of newer estate housing around them.",
  // REVIEW
  accessNotes:
    "Established streets usually give the truck room to get close. Newer estates can have tighter streets and shorter driveways.",
  // REVIEW
  parkingNotes:
    "Tell us if the truck will need to park on the street, and whether the street is usually busy with parked cars.",
  nearbySuburbs: ["officer", "berwick", "clyde-north"],
  // REVIEW
  localFaqs: [
    {
      question: "Does it cost more because Pakenham is further out?",
      answer:
        "The drive between your two addresses is part of the job time, so a longer trip adds to the total. The call-out itself is the same flat 45 minutes for everyone.",
    },
    {
      question: "Do you move people from Pakenham into Melbourne?",
      answer:
        "Yes, anywhere in Greater Melbourne. Put both addresses in the quote and the estimate includes the drive.",
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
