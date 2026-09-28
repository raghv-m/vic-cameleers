# Images still needed

Every image slot on the site currently shows a labelled placeholder (never stock photos of someone
else's truck or crew). Shoot these, save them with **exactly** these names, and the site picks them
up once the path is set in `src/config/images.ts` (one line each, shown at the bottom).

**General rules for every photo**

- Your own trucks, crew and jobs only. Get the customer's OK before photographing their home or
  belongings, and keep house numbers, number plates you don't own, and faces of the public out.
- JPG, sRGB, long edge at the size listed (bigger is fine, the site resizes). Under ~1.5 MB each.
- Landscape, daylight, level horizon. Leave room around the subject: the site crops differently on
  phones and desktops.

## 1. Page photos (13) — save to `public/photos/`

| #   | File name                  | Size               | What to shoot                                                          | Where it appears                           |
| --- | -------------------------- | ------------------ | ---------------------------------------------------------------------- | ------------------------------------------ |
| 1   | `hero-10t-truck.jpg`       | 2400 × 1350 (16:9) | The 10 tonne truck on a Cranbourne street, crew loading a couch        | Homepage hero (the first thing people see) |
| 2   | `service-house.jpg`        | 1600 × 1200 (4:3)  | Two movers carrying a wrapped couch down a driveway to the truck       | House removals page                        |
| 3   | `service-apartment.jpg`    | 1600 × 1200        | A mover wheeling boxes on a trolley through an apartment foyer or lift | Apartment removals page                    |
| 4   | `service-end-of-lease.jpg` | 1600 × 1200        | An empty rental after the move, keys on the kitchen bench              | End-of-lease page                          |
| 5   | `service-same-day.jpg`     | 1600 × 1200        | A truck pulling out of the Cranbourne depot                            | Same-day removals page                     |
| 6   | `service-office.jpg`       | 1600 × 1200        | Desks and monitors wrapped and ready for an office move                | Office removals page                       |
| 7   | `service-furniture.jpg`    | 1600 × 1200        | A single item (e.g. a fridge or dresser) strapped in the truck         | Furniture removals page                    |
| 8   | `service-marketplace.jpg`  | 1600 × 1200        | Picking up a second-hand couch from a seller's front door              | Marketplace pickups page                   |
| 9   | `service-packing.jpg`      | 1600 × 1200        | Boxes packed and labelled by room                                      | Packing page                               |
| 10  | `fleet-6t.jpg`             | 1800 × 1200 (3:2)  | The 6 tonne truck, clean side view                                     | Services directory, fleet                  |
| 11  | `fleet-10t.jpg`            | 1800 × 1200        | The 10 tonne truck, clean side view                                    | Services directory, fleet                  |
| 12  | `gear.jpg`                 | 1800 × 1200        | Blankets, straps and trolleys laid out ready for a job                 | Homepage "Before you book"                 |
| 13  | `about-crew.jpg`           | 1800 × 1200        | The crew beside the trucks at the depot                                | About page                                 |

## 2. Fleet 360° spin sets (48) — save to `public/photos/fleet/`

Two sets of 24 photos, one per truck, for the drag-to-rotate viewer. Until these exist it shows a
labelled line drawing.

- **How to shoot:** truck parked on flat open ground, doors shut. Walk a full circle around it
  **clockwise**, taking a photo every 15° (24 stops, about one step apart). Same distance, same camera
  height (about chest height), same zoom for every shot. Frame 00 faces the cab straight on. A tripod
  or chalk marks on the ground make it smooth.
- **Size:** 1600 × 1200 (4:3), truck centred, same framing in every frame.

| Truck    | Files                                      |
| -------- | ------------------------------------------ |
| 6 tonne  | `6t-00.jpg`, `6t-01.jpg`, … `6t-23.jpg`    |
| 10 tonne | `10t-00.jpg`, `10t-01.jpg`, … `10t-23.jpg` |

## 3. Social share image (1) — replace `public/og/default.jpg`

| File name               | Size       | What to shoot                                                                                                                                                           |
| ----------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `public/og/default.jpg` | 1200 × 630 | Your best truck photo, subject centred (edges get cropped in some apps). This is the preview when someone shares the site on Facebook, Messenger, LinkedIn or iMessage. |

## 4. Optional: suburb page photos — save to `public/photos/suburbs/`

One real photo per published suburb page makes each page feel local (a street or landmark you've
actually worked in, no private homes). 1600 × 1200.

`cranbourne.jpg`, `cranbourne-east.jpg`, `cranbourne-north.jpg`, `clyde-north.jpg`, `berwick.jpg`,
`narre-warren.jpg`, `officer.jpg`, `pakenham.jpg`

## 5. Optional: logo

The camel mark is a placeholder (`src/components/brand/camel-mark.tsx`). If you commission a logo, ask
for an **SVG** of the mark on its own (single colour) plus the full wordmark.

---

## Plugging them in

**Page photos:** in `src/config/images.ts`, each slot has `src: null` set by `slot(...)`. Give it the
path, e.g. for the hero:

```ts
heroTruck: { ...slot("10 tonne truck on a Cranbourne street, crew loading", "…", "street", WIDE, "60% 55%"), src: "/photos/hero-10t-truck.jpg" },
```

Check the `alt` text still describes the actual photo, and adjust the focal point (`"60% 55%"`) if the
subject isn't centred. Or just drop the files in and ask Claude Code: _"Hook up the photos in
public/photos using docs/image-list.md."_

**360° sets:** in `src/config/images.ts`, fill `fleetSpinFrames`:

```ts
export const fleetSpinFrames = {
  six: Array.from({ length: 24 }, (_, i) => `/photos/fleet/6t-${String(i).padStart(2, "0")}.jpg`),
  ten: Array.from({ length: 24 }, (_, i) => `/photos/fleet/10t-${String(i).padStart(2, "0")}.jpg`),
};
```

**Total:** 13 page photos + 48 spin frames + 1 share image = **62 required**, plus up to 8 suburb
photos and a logo if you want them.
