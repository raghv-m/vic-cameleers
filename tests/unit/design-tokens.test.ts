import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { approvedPairs, contrastRatio, palette } from "@/config/design-tokens";

const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

describe("design tokens", () => {
  it.each(approvedPairs)("$fg on $bg meets $min:1 ($use)", ({ fg, bg, min }) => {
    expect(contrastRatio(palette[fg], palette[bg])).toBeGreaterThanOrEqual(min);
  });

  it("keeps globals.css in sync with the palette", () => {
    for (const [name, hex] of Object.entries(palette)) {
      expect(css.toLowerCase()).toContain(`--color-${name}: ${hex.toLowerCase()}`);
    }
  });

  it("computes known contrast ratios", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 1);
    expect(contrastRatio("#ffffff", "#ffffff")).toBeCloseTo(1, 5);
  });
});
