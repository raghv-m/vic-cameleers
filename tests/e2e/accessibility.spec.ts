import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Automated axe checks (CLAUDE.md section 15). Covers pages that render
 * without a database, or degrade gracefully without one (see the other
 * specs' comments re: TODO-OWNER.md). WCAG 2.2 A/AA rules only, matching
 * the project's target.
 */
const pages = ["/", "/quote", "/contact", "/pricing", "/faq", "/about", "/services"];

for (const path of pages) {
  test(`${path} has no automatic axe violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
      .analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });
}
