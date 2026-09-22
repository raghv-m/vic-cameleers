import { business } from "@/config/business";

/**
 * Single source of truth for FAQ content, shared by the homepage FAQ
 * section, the dedicated /faq page, and the FAQPage JSON-LD (CLAUDE.md
 * section 13). Plain strings only, no JSX, so the same array can serialize
 * straight into structured data.
 */
export const faqs = [
  {
    question: "What's your minimum charge?",
    answer: `Every job has a ${business.minimumHours} hour minimum at ${business.hourlyRateDisplay}, plus the call-out fee below.`,
  },
  {
    question: "What's the call-out fee?",
    answer:
      "We charge a 45 minute call-out at our hourly rate to cover getting the truck and crew to your job. It's included in every estimate, not an extra surprise on the day.",
  },
  {
    question: "What's included in the hourly rate?",
    answer:
      "Our crew and truck, ready to load and unload. Packing, unpacking, and furniture disassembly are optional extras, shown separately when you get your estimate.",
  },
  {
    question: "Do you charge more for stairs or a lift?",
    answer:
      "There's no separate stair fee, but access affects how long a job takes, which affects the total. Tell us about stairs and lifts when you get your estimate so the range is accurate.",
  },
  {
    question: "Do I need to sort out parking?",
    answer:
      "Where you can, a clear space for the truck close to the door saves time and keeps your job on the lower end of the estimate. A long carry from the truck can add to the job.",
  },
  {
    question: "What's your cancellation policy?",
    answer:
      "Plans change, we get it. Call us as soon as you can if your date needs to move. See our cancellation policy page for the details.",
  },
  {
    question: "What don't you move?",
    answer:
      "We don't currently handle pianos, safes, or other extremely heavy specialty items. If you're not sure whether we can help with something, give us a call.",
  },
  {
    question: "How do I pay?",
    answer:
      "We'll confirm payment options when we book your job. Let us know if you have a preference.",
  },
] as const;
