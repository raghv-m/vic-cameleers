import { test } from "@playwright/test";

/**
 * Converting a lead to a booking needs a live, seeded database (a real
 * staff session, a real lead with no existing booking, and at least one
 * active truck). Neon isn't provisioned yet (TODO-OWNER.md), so this is
 * written against the real UI but skipped until PLAYWRIGHT_SEEDED_DB is
 * set by a test environment that has one. See lead-status-change.spec.ts
 * for what else needs seeding.
 */
test.skip(!process.env.PLAYWRIGHT_SEEDED_DB, "Needs a live, seeded database - see file comment");

test("converting a lead to a booking creates a Booking and Job, and moves the lead to Booked", async ({
  page,
}) => {
  const adminPath = process.env.ADMIN_PATH ?? "ops-dev-7f3k";
  const leadId = process.env.PLAYWRIGHT_LEAD_ID;

  await page.goto(`/${adminPath}/leads/${leadId}`);

  await page.locator("#book-date").fill("2027-04-01");
  await page.getByRole("button", { name: "Convert to booking" }).click();

  await page.getByText("Booking created").waitFor();
});
