import type { ImageId } from "@/config/images";
import type { ServiceSlug } from "@/config/services";

/**
 * How services are grouped for people browsing, not how they're stored. Every entry points at a
 * real, enabled service page or at the quote form (for add-ons that don't need their own page).
 * Nothing here is a service the business hasn't confirmed: no interstate (Victoria only), no
 * pianos or pool tables (owner decision, 26 Sep 2026).
 */

export interface DirectoryEntry {
  name: string;
  /** Short line under the name in the directory. */
  line: string;
  /** A real service page, or null for an add-on booked through the quote form. */
  slug: ServiceSlug | null;
}

export interface DirectoryCategory {
  id: "residential" | "commercial" | "items" | "extras";
  index: string;
  label: string;
  title: string;
  summary: string;
  /** Which truck and crew this category usually needs, from the pricing engine's rules. */
  typicalSetup: string;
  image: ImageId;
  entries: DirectoryEntry[];
}

export const serviceDirectory: DirectoryCategory[] = [
  {
    id: "residential",
    index: "01",
    label: "Residential",
    title: "Home moves",
    summary: "Houses, units and apartments, from a one-bedroom flat to a four-bedroom family home.",
    typicalSetup: "6 tonne truck for up to 2 bedrooms, 10 tonne for 3 and up",
    image: "serviceHouse",
    entries: [
      {
        name: "House removals",
        line: "Any number of bedrooms, one trip where possible.",
        slug: "house-removals",
      },
      {
        name: "Apartment removals",
        line: "Lifts, stairs, loading bays and building rules.",
        slug: "apartment-removals",
      },
      {
        name: "End-of-lease moves",
        line: "Planned around your key handover.",
        slug: "end-of-lease-moves",
      },
      {
        name: "Same-day removals",
        line: "Mover cancelled? Call us, we can often go today.",
        slug: "same-day-removals",
      },
    ],
  },
  {
    id: "commercial",
    index: "02",
    label: "Commercial",
    title: "Office moves",
    summary: "Desks, chairs, filing cabinets and equipment, timed to keep your downtime short.",
    typicalSetup: "Truck and crew matched to the size of the office",
    image: "serviceOffice",
    entries: [
      {
        name: "Office removals",
        line: "After-hours and weekend moves on request.",
        slug: "office-removals",
      },
    ],
  },
  {
    id: "items",
    index: "03",
    label: "Single items",
    title: "Furniture and marketplace pickups",
    summary: "One couch, a fridge, or a Facebook Marketplace find. No full move needed.",
    typicalSetup: "Usually the 6 tonne truck with 2 movers",
    image: "serviceMarketplace",
    entries: [
      {
        name: "Furniture removals",
        line: "Single items and small loads.",
        slug: "furniture-removals",
      },
      {
        name: "Marketplace pickups",
        line: "Facebook Marketplace and Gumtree, picked up and brought home.",
        slug: "marketplace-pickups",
      },
    ],
  },
  {
    id: "extras",
    index: "04",
    label: "Packing and extras",
    title: "Packing, unpacking and assembly",
    summary: "Add them to any move. Each one shows up separately in your estimate.",
    typicalSetup: "Added to your move at the same hourly rate",
    image: "servicePacking",
    entries: [
      {
        name: "Packing",
        line: "Full or partial packing, boxes and materials supplied.",
        slug: "packing",
      },
      {
        name: "Unpacking",
        line: "Boxes unpacked into the right rooms at the other end.",
        slug: null,
      },
      {
        name: "Disassembly and reassembly",
        line: "Beds, wardrobes and flat-pack, taken apart and rebuilt.",
        slug: null,
      },
      { name: "Boxes and materials", line: "Supplied for your own packing.", slug: null },
    ],
  },
];
