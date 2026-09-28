import { business } from "@/config/business";

/**
 * Single source of truth for FAQ content: the /faq page, its FAQPage JSON-LD, and the general
 * questions on suburb pages. Plain strings only, so the same data serializes straight into
 * structured data. Every answer states only what the business has confirmed elsewhere on the site;
 * anything unconfirmed (insurance, payment methods, cancellation fees) stays out or says so.
 *
 * `id` is the /faq#anchor, so keep ids stable once published. `related` lists other ids.
 */

export const FAQ_CATEGORIES = [
  "Pricing",
  "Booking",
  "Moving day",
  "Fleet & crew",
  "Coverage",
  "Furniture & care",
  "Changes & cancellations",
  "Business & trust",
] as const;
export type FaqCategory = (typeof FAQ_CATEGORIES)[number];

export interface Faq {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;
  related?: string[];
}

export const faqs: Faq[] = [
  // Pricing
  {
    id: "how-much-does-it-cost",
    category: "Pricing",
    question: "How much does a move cost?",
    answer: `${business.hourlyRateDisplay} for the truck and crew, with a ${business.minimumHours} hour minimum, plus a ${business.calloutMinutes} minute call-out at the same rate. You pay for the time the job actually takes. The online estimate gives you a range for your move in a couple of minutes.`,
    related: ["minimum-charge", "call-out-fee", "estimate-or-fixed"],
  },
  {
    id: "minimum-charge",
    category: "Pricing",
    question: "What's your minimum charge?",
    answer: `Every job has a ${business.minimumHours} hour minimum at ${business.hourlyRateDisplay}, plus the call-out fee.`,
    related: ["call-out-fee", "how-much-does-it-cost"],
  },
  {
    id: "call-out-fee",
    category: "Pricing",
    question: "What's the call-out fee?",
    answer: `We charge a ${business.calloutMinutes} minute call-out at our hourly rate to cover getting the truck and crew to your job. It's included in every estimate, not an extra surprise on the day.`,
    related: ["minimum-charge", "further-away"],
  },
  {
    id: "whats-included",
    category: "Pricing",
    question: "What's included in the hourly rate?",
    answer:
      "Our crew and truck, ready to load and unload. Packing, unpacking, and furniture disassembly are optional extras, shown separately when you get your estimate.",
    related: ["packing", "how-much-does-it-cost"],
  },
  {
    id: "stairs-or-lift",
    category: "Pricing",
    question: "Do you charge more for stairs or a lift?",
    answer:
      "There's no separate stair fee, but access affects how long a job takes, which affects the total. Tell us about stairs and lifts when you get your estimate so the range is accurate.",
    related: ["parking", "estimate-or-fixed"],
  },
  {
    id: "estimate-or-fixed",
    category: "Pricing",
    question: "Is the price an estimate or a fixed quote?",
    answer:
      "The online price is an estimate range. We confirm your quote after checking the addresses and access, and on the day you pay for the actual time. If something on the day changes the job, we talk it through before it changes the price.",
    related: ["how-much-does-it-cost", "after-quote"],
  },

  // Booking
  {
    id: "get-a-quote",
    category: "Booking",
    question: "How do I get a quote?",
    answer: `Fill in the four short steps on our quote page, or call ${business.phoneDisplay}. You'll see an estimated price as you go.`,
    related: ["after-quote", "estimate-or-fixed"],
  },
  {
    id: "after-quote",
    category: "Booking",
    question: "What happens after I ask for a quote?",
    answer:
      "You get a reference number straight away. We then confirm the date, the truck and the crew with you by phone or SMS, and send a booking confirmation by email.",
    related: ["reminders", "get-a-quote"],
  },
  {
    id: "how-do-i-pay",
    category: "Booking",
    question: "How do I pay?",
    answer:
      "We'll confirm payment options when we book your job. Let us know if you have a preference.",
    related: ["how-much-does-it-cost"],
  },

  // Moving day
  {
    id: "reminders",
    category: "Moving day",
    question: "Will I get a reminder before moving day?",
    answer:
      "Yes. Once your move is booked you get reminders 7 days and 1 day before, so nothing sneaks up on you.",
    related: ["after-quote", "change-date"],
  },
  {
    id: "parking",
    category: "Moving day",
    question: "Do I need to sort out parking?",
    answer:
      "Where you can, a clear space for the truck close to the door saves time and keeps your job on the lower end of the estimate. A long carry from the truck can add to the job.",
    related: ["stairs-or-lift"],
  },
  {
    id: "unloading",
    category: "Moving day",
    question: "Where do you put things at the new place?",
    answer:
      "Boxes go into the rooms they're labelled for and furniture is placed where you want it, not left by the door.",
    related: ["furniture-protection", "packing"],
  },

  // Fleet & crew
  {
    id: "trucks",
    category: "Fleet & crew",
    question: "What trucks do you have?",
    answer:
      "A 6 tonne and a 10 tonne truck. Single items and homes up to 2 bedrooms usually get the 6 tonne truck; 3 bedroom and bigger homes and offices get the 10 tonne truck.",
    related: ["how-many-movers"],
  },
  {
    id: "how-many-movers",
    category: "Fleet & crew",
    question: "How many movers will I get?",
    answer:
      "Most jobs get 2 movers. Bigger homes get 3 or 4, and any extra movers are charged at a separate hourly rate that's shown in your estimate.",
    related: ["trucks", "how-much-does-it-cost"],
  },
  {
    id: "crew-size",
    category: "Fleet & crew",
    question: "How big is your crew?",
    answer: `${business.crewSize} movers, based in ${business.baseSuburb}.`,
    related: ["who-will-i-deal-with"],
  },

  // Coverage
  {
    id: "where-do-you-operate",
    category: "Coverage",
    question: "Where do you operate?",
    answer: `We're based in ${business.baseSuburb} and move homes and businesses across Greater Melbourne. We stay in Victoria.`,
    related: ["interstate", "further-away"],
  },
  {
    id: "interstate",
    category: "Coverage",
    question: "Do you do interstate moves?",
    answer: "Not at the moment. We only move within Victoria.",
    related: ["where-do-you-operate"],
  },
  {
    id: "further-away",
    category: "Coverage",
    question: "Does it cost more if I'm further from Cranbourne?",
    answer:
      "The call-out is a flat 45 minutes at the hourly rate for every job, wherever you are in our service area. The drive between your pickup and drop-off is part of the job time.",
    related: ["call-out-fee", "where-do-you-operate"],
  },

  // Furniture & care
  {
    id: "furniture-protection",
    category: "Furniture & care",
    question: "How do you look after my furniture?",
    answer:
      "Furniture is wrapped in blankets and strapped in the truck on every job. Beds and flat-pack can be taken apart and rebuilt if you ask. Tell us about anything fragile or awkward before the day.",
    related: ["packing", "what-dont-you-move"],
  },
  {
    id: "packing",
    category: "Furniture & care",
    question: "Can you pack and unpack for me?",
    answer:
      "Yes, packing and unpacking are optional extras. Add them in your estimate to see how they change the time and price.",
    related: ["whats-included", "furniture-protection"],
  },
  {
    id: "what-dont-you-move",
    category: "Furniture & care",
    question: "What don't you move?",
    answer:
      "We don't currently handle pianos, safes, or other extremely heavy specialty items. If you're not sure whether we can help with something, give us a call.",
    related: ["furniture-protection"],
  },

  // Changes & cancellations
  {
    id: "change-date",
    category: "Changes & cancellations",
    question: "What if I need to change my date?",
    answer:
      "Call us as early as you can and we'll find a new date. Our cancellation policy page sets out how it works.",
    related: ["cancellation-policy", "reminders"],
  },
  {
    id: "cancellation-policy",
    category: "Changes & cancellations",
    question: "What's your cancellation policy?",
    answer:
      "Plans change, we get it. Call us as soon as you can if your date needs to move. See our cancellation policy page for the details.",
    related: ["change-date"],
  },

  // Business & trust
  {
    id: "registered-business",
    category: "Business & trust",
    question: "Are you a registered business?",
    answer: `Yes. Registered in Australia, ABN ${business.abn}, ACN ${business.acn}, based in ${business.baseSuburb}. You can check our ABN on the government's ABN Lookup.`,
    related: ["who-will-i-deal-with"],
  },
  {
    id: "who-will-i-deal-with",
    category: "Business & trust",
    question: "Who will I deal with?",
    answer: `The crew, direct, on ${business.phoneDisplay}. No call centre in between.`,
    related: ["registered-business", "after-quote"],
  },
];

export function faqById(id: string): Faq | undefined {
  return faqs.find((faq) => faq.id === id);
}
