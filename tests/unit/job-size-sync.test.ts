import { describe, expect, it } from "vitest";

import { bandFor, choiceForBand } from "@/lib/job-size-sync";

describe("job size sync", () => {
  it("maps estimator choices to fleet bands", () => {
    expect(bandFor("item", "2bed")).toBe(0);
    expect(bandFor("home", "studio")).toBe(1);
    expect(bandFor("home", "2bed")).toBe(1);
    expect(bandFor("home", "3bed")).toBe(2);
    expect(bandFor("home", "4plus")).toBe(2);
    expect(bandFor("office", "2bed")).toBe(2);
  });

  it("keeps the current choice when it's already in the band (no ping-pong)", () => {
    const current = { kind: "home" as const, homeSize: "1bed" as const };
    expect(choiceForBand(1, current)).toBe(current);
    expect(choiceForBand(2, { kind: "office", homeSize: "2bed" })).toEqual({
      kind: "office",
      homeSize: "2bed",
    });
  });

  it("picks a sensible choice when the band changes", () => {
    expect(choiceForBand(0, { kind: "home", homeSize: "2bed" }).kind).toBe("item");
    expect(choiceForBand(2, { kind: "home", homeSize: "1bed" })).toEqual({
      kind: "home",
      homeSize: "3bed",
    });
  });
});
