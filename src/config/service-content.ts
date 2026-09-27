import type { ServiceSlug } from "@/config/services";
import type { PricingInput } from "@/types/pricing";

export interface ServiceSection {
  heading: string;
  paragraphs: string[];
  list?: string[];
}

/** A worked price, calculated live from the real pricing engine and current settings. */
export interface ServicePriceExample {
  heading: string;
  description: string;
  input: PricingInput;
}

export interface ServiceContent {
  intro: string;
  /** Who this service suits, in plain words. */
  whoFor: string[];
  included: string[];
  /** Longer-form sections for the fuller service pages. */
  sections?: ServiceSection[];
  priceExample?: ServicePriceExample;
  faqs: { question: string; answer: string }[];
}

/**
 * Per-service page copy (CLAUDE.md section 5: "unique content, FAQs, CTA").
 * Keyed by slug so a disabled service (see src/config/services.ts) simply
 * has no page rendered for it, rather than needing its own flag here too.
 */
export const serviceContent: Record<ServiceSlug, ServiceContent> = {
  "house-removals": {
    intro:
      "Moving a house is the big one, and it's where a properly run crew matters most. Whatever the size, from a one-bedroom to a four-plus bedroom family home, we send the right truck and enough movers to get it done in one trip where possible.",
    whoFor: [
      "Families moving between houses anywhere in Greater Melbourne",
      "Anyone moving into a new-build estate, including double-storey homes",
      "People who want packing or furniture assembly handled too",
    ],
    included: [
      "Careful loading and unloading of furniture, boxes, and appliances",
      "Furniture blankets and basic protection for your things in transit",
      "Disassembly and reassembly of beds and flat-pack furniture (extra, quoted upfront)",
      "Packing and unpacking if you want it (extra, quoted upfront)",
    ],
    faqs: [
      {
        question: "How long does a house move usually take?",
        answer:
          "It depends on the size of the house, access at both ends, and how much you've already packed. Get an estimate on our quote page for a real range based on your actual move.",
      },
      {
        question: "Do you move appliances like fridges and washing machines?",
        answer:
          "Yes, our crew can move standard household appliances. Let us know about anything oversized or awkward when you get your estimate.",
      },
    ],
  },
  "apartment-removals": {
    intro:
      "Apartments and units come with their own challenges: lift bookings, building access rules, and tight stairwells. We handle it regularly and factor access into your estimate so there's no surprise on the day.",
    whoFor: [
      "Units, flats and apartments with stairs or a lift",
      "Buildings with loading bays, lift bookings or move-in time windows",
      "Studio to three-bedroom apartments",
    ],
    included: [
      "Careful navigation of stairs, lifts, and tight corridors",
      "Coordination around lift booking windows if your building requires one",
      "Furniture blankets and basic protection for your things in transit",
      "Disassembly and reassembly of beds and flat-pack furniture (extra, quoted upfront)",
    ],
    faqs: [
      {
        question: "Do you charge extra for using the lift?",
        answer:
          "There's no separate lift fee, but tell us about lift access when you get your estimate so we can plan the job and give you an accurate time range.",
      },
      {
        question: "What if my building has a strict move-in/move-out time window?",
        answer:
          "Let us know your booking window and preferred time when you get your estimate, we'll aim to have the crew there ready to go.",
      },
    ],
  },
  "office-removals": {
    intro:
      "Office moves need to happen with minimal disruption to your business. We move desks, chairs, filing cabinets, and equipment, and work with you on timing so you're back up and running fast.",
    whoFor: [
      "Small offices and studios moving across Melbourne",
      "Businesses that need an after-hours or weekend move",
      "Teams moving desks, chairs, filing and equipment",
    ],
    included: [
      "Desks, chairs, filing cabinets, and standard office equipment",
      "Careful handling of computers and monitors (pack your own drives and sensitive data first)",
      "Flexible timing, including after-hours or weekend moves on request",
      "Packing materials for files and loose items (extra, quoted upfront)",
    ],
    faqs: [
      {
        question: "Can you move us on a weekend or after hours?",
        answer:
          "Yes, tell us your preferred timing when you get your estimate and we'll do our best to fit it in, useful for keeping downtime to a minimum.",
      },
      {
        question: "Do you disconnect and reconnect IT equipment?",
        answer:
          "We move desks, monitors, and equipment as physical items, but we're not an IT service. Please back up and handle data and network setup separately.",
      },
    ],
  },
  "furniture-removals": {
    intro:
      "Not every move is a full house. If you just need a couch, a bed, or a single piece delivered, including marketplace pickups, we can send a crew without booking a full move.",
    whoFor: [
      "One item or a small load, without booking a full move",
      "Furniture going to a family member, storage or a new flat",
      "Anyone who doesn't have a ute or a spare set of hands",
    ],
    included: [
      "Single item or small load pickup and delivery",
      "Marketplace and second-hand furniture pickups",
      "Careful handling to protect the item and your home at both ends",
      "Basic disassembly if needed to fit through doorways (extra, quoted upfront)",
    ],
    faqs: [
      {
        question: "Do you do marketplace pickups?",
        answer:
          "Yes. Give us the pickup and drop-off address and a description of the item when you get your estimate.",
      },
      {
        question: "Is there a minimum charge for a single item?",
        answer:
          "Yes, the same minimum charge applies as any other job, since it still needs a truck and crew on the road. See our pricing page for the details.",
      },
    ],
  },
  packing: {
    intro:
      "Packing takes longer than most people expect. We offer full or partial packing before your move and unpacking at the other end, with boxes and materials supplied.",
    whoFor: [
      "People short on time before moving day",
      "Kitchens, wardrobes and fragile items you'd rather not pack yourself",
      "Anyone who wants unpacking done at the other end",
    ],
    included: [
      "Full or partial packing of your belongings before the move",
      "Boxes, tape, and packing paper supplied",
      "Unpacking service at your new place if you want it",
      "Careful, labelled packing so things end up in the right room",
    ],
    faqs: [
      {
        question: "Do I have to pack everything, or can I do some myself?",
        answer:
          "Either way works. Tell us which rooms or how many bedrooms you'd like packed when you get your estimate, and pack the rest yourself.",
      },
      {
        question: "Do you supply the boxes?",
        answer: "Yes, boxes and packing materials are included in the packing service.",
      },
    ],
  },
  "heavy-items": {
    intro:
      "Pianos, safes, pool tables, and other heavy or awkward items need specific handling and equipment. Talk to us before booking so we can plan the right approach.",
    whoFor: ["Owners of pianos, safes and other heavy items (currently not offered)"],
    included: [
      "Careful assessment of access and equipment needed before the job",
      "Appropriate moving equipment for heavy or awkward items",
      "Coordination with the rest of your move if needed",
    ],
    faqs: [
      {
        question: "What heavy items can you move?",
        answer:
          "Call us to discuss your specific item before booking, access and equipment needs vary a lot for pianos, safes, and similar items.",
      },
    ],
  },
  "same-day-removals": {
    intro:
      "Mover cancelled on you, or plans changed last minute? We can often get a crew and truck out the same day. Call us directly rather than using the online quote form for same-day requests.",
    whoFor: [
      "People whose mover cancelled at the last minute",
      "Urgent moves inside Greater Melbourne",
      "Small same-day jobs, subject to a truck and crew being free",
    ],
    included: [
      "Fast response for last-minute moves, subject to crew and truck availability",
      "The same transparent hourly rate as any other job",
      "A real assessment over the phone so you know what to expect before we arrive",
    ],
    faqs: [
      {
        question: "Can you really move me today?",
        answer:
          "Often, yes, but it depends on truck and crew availability. Call us directly rather than using the online form so we can check right away.",
      },
      {
        question: "Do you charge more for same-day bookings?",
        answer:
          "The same hourly rate applies. We'll be upfront on the phone if last-minute availability affects timing.",
      },
    ],
  },
  "marketplace-pickups": {
    intro:
      "Found a couch on Facebook Marketplace or a fridge on Gumtree, and now you need to get it home? We pick up second-hand furniture from the seller's place and bring it to yours, anywhere in Greater Melbourne. For one or two items, the 6 tonne truck with two movers is usually the right fit.",
    whoFor: [
      "Facebook Marketplace and Gumtree buyers",
      "Anyone collecting from one or two sellers in one trip",
      "Buyers without a ute, trailer or helper",
    ],
    included: [
      "Pickup from the seller's home and delivery to the room you choose",
      "Furniture blankets and straps to protect the item in the truck",
      "A second pickup on the same trip, added as an extra stop in your quote",
      "Disassembly and reassembly if it won't fit through a doorway (extra, quoted upfront)",
    ],
    sections: [
      {
        heading: "How a marketplace pickup works",
        paragraphs: [
          "Once you've agreed a price with the seller, get a free quote with the seller's address as the pickup and yours as the drop-off. Collecting from more than one seller? Add the second address as an extra stop so it all happens in one trip.",
          "Sort out payment and a pickup time with the seller before we arrive. We do the carrying, but the sale is between you and them, so we can't pay sellers or negotiate for you.",
          "On the day, we load at the seller's place with blankets and straps, drive it over, and carry it into the room you want it in.",
        ],
      },
      {
        heading: "Check these before you book",
        paragraphs: [
          "A few minutes of checking before pickup day saves a wasted trip, or a couch stuck in a doorway.",
        ],
        list: [
          "Get the height, width and depth from the seller, then measure your doorways, hallways, stairs and lift. A three-seater that fits the seller's lounge won't always fit through your front door.",
          "Ask whether it comes apart. Bed frames, wardrobes and some couches do, which makes them much easier to carry. If the seller has already taken it apart, ask them to keep the screws and fittings together.",
          "Ask about access at the seller's end: stairs, a lift, or a long walk from where the truck can park all add time.",
          "Look closely at the photos, or ask for more. We don't inspect or vouch for items, so check the condition before you pay.",
          "For fridges and washing machines, ask the seller to have them disconnected and drained before we arrive.",
        ],
      },
      {
        heading: "What a pickup costs",
        paragraphs: [
          "Every job has a 2 hour minimum at $120/hour, plus the 45 minute call-out. A single pickup between nearby suburbs often fits inside that minimum, so the total is just the minimum charge. Two pickups on one trip, stairs at either end, or a long drive between addresses can take it past the minimum, and then you pay for the actual time on the job.",
        ],
      },
    ],
    priceExample: {
      heading: "One couch, Cranbourne North to Clyde North",
      description:
        "A single three-seater, ground floor at both ends, about 15 minutes' drive between the seller and you.",
      input: {
        propertySize: "singleItem",
        pickupAccess: { flightsOfStairsNoLift: 0, longCarry: false },
        dropoffAccess: { flightsOfStairsNoLift: 0, longCarry: false },
        travelMinutes: 15,
      },
    },
    faqs: [
      {
        question: "Can you pick up from two different sellers in one trip?",
        answer:
          "Yes. Add the second seller's address as an extra stop when you get your quote. Each stop adds driving and loading time, so the price range allows for it.",
      },
      {
        question: "Do I need to be at the pickup?",
        answer:
          "Someone needs to be at the seller's place to hand the item over, usually the seller. You, or someone you trust, should be at the drop-off to show us where it goes.",
      },
      {
        question: "Can you pay the seller for me?",
        answer:
          "No. Please sort out payment with the seller directly before pickup day. We just do the carrying.",
      },
      {
        question: "What's the minimum charge for one item?",
        answer:
          "The same as any job: 2 hours at $120/hour, plus the 45 minute call-out, because it still takes a truck and two movers on the road.",
      },
    ],
  },
  "end-of-lease-moves": {
    intro:
      "Renting means your move has a hard deadline: the lease ends, the keys go back, and the final inspection happens whether you're packed or not. We help renters across Melbourne get out on time, at an hourly rate you can see before you book.",
    whoFor: [
      "Renters moving out on a fixed lease end date",
      "Anyone working around a key handover or final inspection",
      "Sharehouses and units moving out together",
    ],
    included: [
      "Loading, transport and unloading of your furniture and boxes",
      "Furniture blankets to protect your things on the way out",
      "Packing and unpacking if you want it (extra, quoted upfront)",
      "Disassembly and reassembly of beds and flat-pack furniture (extra, quoted upfront)",
    ],
    sections: [
      {
        heading: "Work back from the day you hand the keys back",
        paragraphs: [
          "Your lease end date, key handover and final inspection are fixed, so plan the move around them rather than the other way round. If you can, book the move a few days before the lease ends. That leaves time for cleaning and any small repairs before the keys go back.",
          "If your new lease starts the same day the old one ends, tell us your preferred start time when you get your quote, so we can plan the day around picking up your new keys.",
        ],
      },
      {
        heading: "Looking after the place on the way out",
        paragraphs: [
          "Scuffed walls and chipped doorframes on moving day are the last thing you want before an inspection. Tell us about anything tight, fragile or awkward before we start, and we'll plan how each piece comes out.",
          "Once a room is empty, take photos of it before the cleaners go in. They're useful to have at the final inspection.",
          "We don't do end-of-lease cleaning. Book your cleaner for after we've finished, so they're cleaning an empty home.",
        ],
      },
      {
        heading: "The last week before you move",
        paragraphs: ["A short list that makes moving day and the handover go smoothly:"],
        list: [
          "Confirm the key handover time with your agent or landlord.",
          "Book the lift or loading bay if you're leaving an apartment.",
          "Pack everything except what you need day to day, and label boxes by room.",
          "Set up mail redirection and update your address.",
          "Tell us about stairs, lifts and parking at both ends when you get your quote.",
        ],
      },
    ],
    priceExample: {
      heading: "2 bedroom unit, first floor with no lift",
      description:
        "One flight of stairs at the old place, ground floor at the new one, about 25 minutes' drive between them.",
      input: {
        propertySize: "2bed",
        pickupAccess: { flightsOfStairsNoLift: 1, longCarry: false },
        dropoffAccess: { flightsOfStairsNoLift: 0, longCarry: false },
        travelMinutes: 25,
      },
    },
    faqs: [
      {
        question: "Can you move me on the day my lease ends?",
        answer:
          "Often, if a truck and crew are free that day. Book as early as you can, and tell us about any key handover time you need to work around.",
      },
      {
        question: "Do you clean the property after the move?",
        answer:
          "No, we're removalists, not cleaners. Book an end-of-lease cleaner for after we've emptied the place.",
      },
      {
        question: "What if the move takes longer than the estimate?",
        answer:
          "You pay for the actual time at the hourly rate. If something on the day changes the job, like more furniture than expected or a lift that's out of action, we'll tell you before it affects the price.",
      },
    ],
  },
};
