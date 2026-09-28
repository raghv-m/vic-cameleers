/**
 * Every photo slot on the public site, in one place. To add a real photo: drop the file in
 * public/photos/, set `src` to its path, check `alt` describes the actual photo, and adjust
 * `focal` if the subject isn't centred. Nothing else changes: the layout already reserves the
 * slot at the right aspect ratio. The shot list for these is docs/image-list.md.
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
  src: string | null = null,
): SiteImage {
  return { src, alt, purpose, scene, focal, ...size };
}

const WIDE = { width: 2400, height: 1350 }; // 16:9
const LANDSCAPE = { width: 1800, height: 1200 }; // 3:2

export const images = {
  heroTruck: slot(
    "10 tonne truck on a Cranbourne street, crew loading",
    "The Vic Cameleers truck parked on a suburban street while the crew wheels a wrapped couch up the loading ramp",
    "street",
    WIDE,
    "50% 50%",
    "/photos/hero-10t-truck.jpg",
  ),
  serviceHouse: slot(
    "Crew carrying furniture out of a family home",
    "Two movers carrying a plastic-wrapped couch down a driveway to the truck",
    "street",
    { width: 1600, height: 1200 },
    "60% 50%",
    "/photos/service-house.jpg",
  ),
  serviceApartment: slot(
    "Loading through an apartment lift or foyer",
    "A mover wheeling a stack of boxes on a hand trolley through an apartment building foyer",
    "load",
    { width: 1600, height: 1200 },
    "55% 50%",
    "/photos/service-apartment.jpg",
  ),
  serviceEndOfLease: slot(
    "Empty rental after the move, keys on the bench",
    "An empty, clean kitchen after a move, with a set of keys left on the benchtop",
    "load",
    { width: 1600, height: 1200 },
    "50% 50%",
    "/photos/service-end-of-lease.jpg",
  ),
  serviceSameDay: slot(
    "Truck leaving the Cranbourne depot",
    "A Vic Cameleers truck pulling out of the Cranbourne depot gate",
    "truck",
    { width: 1600, height: 1200 },
    "55% 50%",
    "/photos/service-same-day.jpg",
  ),
  serviceOffice: slot(
    "Desks and monitors wrapped for an office move",
    "Office desks, chairs and monitors wrapped in plastic, with labelled boxes on trolleys ready to load",
    "office",
    { width: 1600, height: 1200 },
    "50% 50%",
    "/photos/service-office.jpg",
  ),
  serviceFurniture: slot(
    "Single item strapped in the truck",
    "A fridge wrapped in furniture blankets and strapped upright inside the truck",
    "load",
    { width: 1600, height: 1200 },
    "50% 50%",
    "/photos/service-furniture.jpg",
  ),
  serviceMarketplace: slot(
    "Picking up a second-hand couch from a seller",
    "Two movers lifting a second-hand leather couch from a seller's front step, with the truck waiting on the street",
    "street",
    { width: 1600, height: 1200 },
    "40% 50%",
    "/photos/service-marketplace.jpg",
  ),
  servicePacking: slot(
    "Boxes packed and labelled by room",
    "Moving boxes labelled by room stacked in a lounge room, with a packer working in the background",
    "gear",
    { width: 1600, height: 1200 },
    "50% 50%",
    "/photos/service-packing.jpg",
  ),
  fleet6t: slot(
    "The 6 tonne truck, side view",
    "The Vic Cameleers 6 tonne truck, side view",
    "truck",
    LANDSCAPE,
    "50% 50%",
    "/photos/fleet-6t.jpg",
  ),
  fleet10t: slot(
    "The 10 tonne truck, side view",
    "The Vic Cameleers 10 tonne truck, side view",
    "truck",
    LANDSCAPE,
    "52% 50%",
    "/photos/fleet-10t.jpg",
  ),
  gear: slot(
    "Blankets, straps and trolleys ready for a job",
    "Folded furniture blankets, ratchet straps and hand trolleys laid out in the back of the truck",
    "gear",
    LANDSCAPE,
    "50% 50%",
    "/photos/gear.jpg",
  ),
  aboutCrew: slot(
    "The crew beside the trucks at the depot",
    "The Vic Cameleers crew standing in front of the trucks at the Cranbourne depot",
    "street",
    LANDSCAPE,
    "50% 50%",
    "/photos/about-crew.jpg",
  ),
} satisfies Record<string, SiteImage>;

export type ImageId = keyof typeof images;

/**
 * 360° spin sets for the fleet viewer (src/components/home/fleet-360.tsx): 24 photos per truck,
 * shot every 15° walking clockwise around it from the front, same height and distance for every
 * frame. Frame 0 faces the cab. Leave empty until the real set exists: the viewer then draws a
 * labelled line-art placeholder instead (never a stock truck).
 * e.g. six: Array.from({ length: 24 }, (_, i) => `/photos/fleet/6t-${String(i).padStart(2, "0")}.jpg`)
 */
export const fleetSpinFrames: Record<"six" | "ten", string[]> = {
  six: [],
  ten: [],
};
