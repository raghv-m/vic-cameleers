import type { ServiceSlug } from "@/config/services";

export interface ServiceContent {
  intro: string;
  included: string[];
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
};
