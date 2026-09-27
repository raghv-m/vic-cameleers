/**
 * The crew, in their own words (SEO report: "Meet the crew" with real names and photos beats
 * "professional crew" every time). The /crew page and its sitemap entry only exist once this list
 * has at least one person in it, so there's never an empty or "coming soon" page.
 *
 * TODO(owner): add each crew member who's happy to be on the site: first name (or full name if
 * they prefer), their role, a photo (see docs/photo-shot-list.md), and a couple of sentences they
 * wrote or said themselves. Never write a bio for someone.
 */

export interface CrewMember {
  name: string;
  /** e.g. "Crew lead, 10 tonne truck" */
  role: string;
  /** A short bio in their own words. */
  bio: string;
  photo?: {
    src: string;
    /** Describes the actual photo, e.g. "Sam carrying a wardrobe down a Berwick driveway". */
    alt: string;
    width: number;
    height: number;
  };
}

export const crew: CrewMember[] = [];

export function hasCrewProfiles(): boolean {
  return crew.length > 0;
}
