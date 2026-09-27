import { describe, expect, it } from "vitest";

import { pageMetadata, seoTitle, TITLE_MAX_LENGTH } from "@/lib/seo";

describe("seoTitle", () => {
  it("uses the keyword | From $120/hr | brand format when it fits", () => {
    expect(seoTitle("Removalists Clyde North", { price: true })).toBe(
      "Removalists Clyde North | From $120/hr | Vic Cameleers",
    );
  });

  it("drops the price, never the length budget, for long keywords", () => {
    const title = seoTitle("Removalists Narre Warren South", { price: true });
    expect(title).toBe("Removalists Narre Warren South | Vic Cameleers");
    expect(title.length).toBeLessThanOrEqual(TITLE_MAX_LENGTH);
  });

  it("falls back to the bare keyword when even the brand won't fit", () => {
    const keyword = "How much does a removalist cost in Melbourne?";
    expect(seoTitle(keyword)).toBe(keyword);
  });

  it("never includes the brand twice", () => {
    const title = seoTitle("Removalists Cranbourne", { price: true });
    expect(title.match(/Vic Cameleers/g)).toHaveLength(1);
  });
});

describe("pageMetadata", () => {
  it("sets a self-referencing canonical and matching share tags", () => {
    const metadata = pageMetadata({
      title: "Removalist prices Melbourne",
      description: "Test description",
      path: "/pricing",
      price: true,
    });

    expect(metadata.alternates?.canonical).toBe("/pricing");
    expect(metadata.title).toEqual({
      absolute: "Removalist prices Melbourne | From $120/hr | Vic Cameleers",
    });
    expect(metadata.openGraph?.url).toBe("/pricing");
    expect(metadata.openGraph?.images).toEqual([
      expect.objectContaining({ url: "/og/default.jpg", width: 1200, height: 630 }),
    ]);
    expect(metadata.twitter).toEqual(expect.objectContaining({ card: "summary_large_image" }));
  });
});
