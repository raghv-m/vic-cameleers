import { describe, expect, it } from "vitest";

import {
  allSuburbs,
  getPublishedNearby,
  getPublishedSuburb,
  publishedSuburbs,
} from "@/content/suburbs";

describe("suburb data", () => {
  it("has a unique slug per suburb", () => {
    const slugs = allSuburbs.map((suburb) => suburb.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("publishes exactly the 8 launch suburbs closest to Cranbourne", () => {
    expect(publishedSuburbs.map((suburb) => suburb.slug)).toEqual([
      "cranbourne",
      "cranbourne-east",
      "cranbourne-north",
      "clyde-north",
      "berwick",
      "narre-warren",
      "officer",
      "pakenham",
    ]);
  });

  it("gives every published suburb its own local content, not just a swapped name", () => {
    for (const suburb of publishedSuburbs) {
      const notes = [suburb.housingNotes, suburb.accessNotes, suburb.parkingNotes].filter(Boolean);
      expect(suburb.intro, suburb.slug).toBeTruthy();
      expect(notes.length, suburb.slug).toBeGreaterThanOrEqual(2);
      expect(suburb.localFaqs?.length ?? 0, suburb.slug).toBeGreaterThanOrEqual(2);
    }
  });

  it("only lists nearby suburbs that have a data file", () => {
    const known = new Set(allSuburbs.map((suburb) => suburb.slug));
    for (const suburb of allSuburbs) {
      for (const slug of suburb.nearbySuburbs ?? []) {
        expect(known.has(slug), `${suburb.slug} -> ${slug}`).toBe(true);
      }
    }
  });

  it("links every published suburb to at least 2 published neighbours", () => {
    for (const suburb of publishedSuburbs) {
      expect(getPublishedNearby(suburb).length, suburb.slug).toBeGreaterThanOrEqual(2);
    }
  });

  it("treats unpublished suburbs as not found", () => {
    expect(getPublishedSuburb("frankston")).toBeUndefined();
    expect(getPublishedSuburb("clyde-north")?.name).toBe("Clyde North");
  });

  it("has no em dashes in any suburb copy", () => {
    expect(JSON.stringify(allSuburbs)).not.toMatch(/—/);
  });
});
