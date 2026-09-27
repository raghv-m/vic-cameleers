import { suburbData as cranbourne } from "./cranbourne";
import { suburbData as cranbourneEast } from "./cranbourne-east";
import { suburbData as cranbourneNorth } from "./cranbourne-north";
import { suburbData as cranbourneWest } from "./cranbourne-west";
import { suburbData as clyde } from "./clyde";
import { suburbData as clydeNorth } from "./clyde-north";
import { suburbData as berwick } from "./berwick";
import { suburbData as narreWarren } from "./narre-warren";
import { suburbData as narreWarrenSouth } from "./narre-warren-south";
import { suburbData as hamptonPark } from "./hampton-park";
import { suburbData as lynbrook } from "./lynbrook";
import { suburbData as lyndhurst } from "./lyndhurst";
import { suburbData as officer } from "./officer";
import { suburbData as pakenham } from "./pakenham";
import { suburbData as dandenong } from "./dandenong";
import { suburbData as keysborough } from "./keysborough";
import { suburbData as frankston } from "./frankston";
import { suburbData as carrumDowns } from "./carrum-downs";
import { suburbData as skye } from "./skye";
import { suburbData as botanicRidge } from "./botanic-ridge";
import { suburbData as langwarrin } from "./langwarrin";
import type { Suburb } from "./types";

export type { FeaturedJob, LocalFaq, Review, Suburb, SuburbData, SuburbPhoto } from "./types";

/**
 * Every suburb we have a data file for, in launch order (Cranbourne area first). The slug is
 * the file name. Add a suburb by creating `<slug>.ts` exporting `suburbData`, then listing it
 * here. Most callers want `publishedSuburbs`: unpublished ones build no page and appear nowhere.
 */
export const allSuburbs: Suburb[] = [
  { slug: "cranbourne", ...cranbourne },
  { slug: "cranbourne-east", ...cranbourneEast },
  { slug: "cranbourne-north", ...cranbourneNorth },
  { slug: "cranbourne-west", ...cranbourneWest },
  { slug: "clyde", ...clyde },
  { slug: "clyde-north", ...clydeNorth },
  { slug: "berwick", ...berwick },
  { slug: "narre-warren", ...narreWarren },
  { slug: "narre-warren-south", ...narreWarrenSouth },
  { slug: "hampton-park", ...hamptonPark },
  { slug: "lynbrook", ...lynbrook },
  { slug: "lyndhurst", ...lyndhurst },
  { slug: "officer", ...officer },
  { slug: "pakenham", ...pakenham },
  { slug: "dandenong", ...dandenong },
  { slug: "keysborough", ...keysborough },
  { slug: "frankston", ...frankston },
  { slug: "carrum-downs", ...carrumDowns },
  { slug: "skye", ...skye },
  { slug: "botanic-ridge", ...botanicRidge },
  { slug: "langwarrin", ...langwarrin },
];

/** Suburbs with a live page: built, linked, in the sitemap and in structured data. */
export const publishedSuburbs: Suburb[] = allSuburbs.filter((suburb) => suburb.published);

/** A published suburb by slug, or undefined (unpublished suburbs behave as if they don't exist). */
export function getPublishedSuburb(slug: string): Suburb | undefined {
  return publishedSuburbs.find((suburb) => suburb.slug === slug);
}

/** Published neighbours of a suburb, in the order its data file lists them. */
export function getPublishedNearby(suburb: Suburb): Suburb[] {
  return (suburb.nearbySuburbs ?? [])
    .map((slug) => getPublishedSuburb(slug))
    .filter((nearby): nearby is Suburb => Boolean(nearby));
}
