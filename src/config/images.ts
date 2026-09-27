/**
 * Every photo slot on the public site, in one place. To add a real photo: drop the file in
 * public/photos/, set `src` to its path, check `alt` describes the actual photo, and adjust
 * `focal` if the subject isn't centred. Nothing else changes: the layout already reserves the
 * slot at the right aspect ratio. The shot list for these is docs/photo-shot-list.md.
 *
 * While `src` is null, the slot renders an illustrated, labelled placeholder
 * (src/components/brand/photo.tsx), never an empty box and never a stock photo of someone
 * else's truck or crew (owner decision, 26 Sep 2026).
 */

export type PlaceholderScene = "truck" | "load" | "street" | "gear" | "office";

export interface SiteImage {
  /** Path under /public, e.g. "/photos/hero-10t-truck.jpg". Null until the real photo exists. */
  src: string | null;
  /** Describes what's actually in the photo. Written for the real photo, used as-is once set. */
  alt: string;
  /** Intrinsic size of the file (for next/image and to prevent layout shift). */
  width: number;
  height: number;
  /** CSS object-position, so the subject survives different crops on mobile and desktop. */
  focal: string;
  /** What the photo is for, shown on the placeholder label and in the shot list. */
  purpose: string;
  scene: PlaceholderScene;
}

function slot(
  purpose: string,
  alt: string,
  scene: PlaceholderScene,
  size: { width: number; height: number } = { width: 1600, height: 1200 },
  focal = "50% 50%",
): SiteImage {
  return { src: null, alt, purpose, scene, focal, ...size };
}

const WIDE = { width: 2400, height: 1350 }; // 16:9
const LANDSCAPE = { width: 1800, height: 1200 }; // 3:2

export const images = {
  heroTruck: slot(
    "10 tonne truck on a Cranbourne street, crew loading",
    "The Vic Cameleers 10 tonne truck parked on a Cranbourne street while the crew loads a couch",
    "street",
    WIDE,
    "60% 55%",
  ),
  serviceHouse: slot(
    "Crew carrying furniture out of a family home",
    "Two movers carrying a wrapped couch down a driveway to the truck",
    "street",
  ),
  serviceApartment: slot(
    "Loading through an apartment lift or foyer",
    "A mover wheeling boxes on a trolley through an apartment building foyer",
    "load",
  ),
  serviceEndOfLease: slot(
    "Empty rental after the move, keys on the bench",
    "An empty lounge room after a move, with a set of keys left on the kitchen bench",
    "load",
  ),
  serviceSameDay: slot(
    "Truck leaving the Cranbourne depot",
    "The 6 tonne truck pulling out of the Cranbourne depot",
    "truck",
  ),
  serviceOffice: slot(
    "Desks and monitors wrapped for an office move",
    "Office desks and wrapped monitors lined up ready to load",
    "office",
  ),
  serviceFurniture: slot(
    "Single item strapped in the truck",
    "A single wardrobe strapped upright inside the truck",
    "load",
  ),
  serviceMarketplace: slot(
    "Picking up a second-hand couch from a seller",
    "Two movers lifting a second-hand couch out of a seller's front door",
    "street",
  ),
  servicePacking: slot(
    "Boxes packed and labelled by room",
    "Packed moving boxes labelled by room, stacked beside rolls of packing paper",
    "gear",
  ),
  fleet6t: slot(
    "The 6 tonne truck, side view",
    "The Vic Cameleers 6 tonne truck, side view",
    "truck",
    LANDSCAPE,
  ),
  fleet10t: slot(
    "The 10 tonne truck, side view",
    "The Vic Cameleers 10 tonne truck, side view",
    "truck",
    LANDSCAPE,
  ),
  gear: slot(
    "Blankets, straps and trolleys ready for a job",
    "Folded furniture blankets, ratchet straps and a hand trolley in the back of the truck",
    "gear",
    LANDSCAPE,
  ),
  aboutCrew: slot(
    "The crew beside the trucks at the depot",
    "The Vic Cameleers crew standing beside the 6 and 10 tonne trucks at the Cranbourne depot",
    "street",
    LANDSCAPE,
  ),
} satisfies Record<string, SiteImage>;

export type ImageId = keyof typeof images;
