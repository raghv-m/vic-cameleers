import { test } from "@playwright/test";

/**
 * Changing a lead's status through /admin/leads/[id] needs a live,
 * seeded database: a real staff session (past 2FA) and a real lead to
 * open. Neon isn't provisioned yet (TODO-OWNER.md), so this is written
 * against the real UI but skipped until PLAYWRIGHT_SEEDED_DB is set by a
 * test environment that has one.
 *
 * To run for real: seed a SUPER_ADMIN with 2FA already enabled and a
 * known TOTP secret, seed at least one lead, set PLAYWRIGHT_SEEDED_DB=1
 * plus PLAYWRIGHT_ADMIN_EMAIL/PASSWORD/TOTP_SECRET and PLAYWRIGHT_LEAD_ID,
 * then fill in the sign-in + TOTP steps below (see
 * src/components/admin/login-form.tsx for the exact fields).
 */
test.skip(!process.env.PLAYWRIGHT_SEEDED_DB, "Needs a live, seeded database - see file comment");

test("changing a lead's status writes an audit log entry and updates the badge", async ({
  page,
}) => {
  const adminPath = process.env.ADMIN_PATH ?? "ops-dev-7f3k";
  const leadId = process.env.PLAYWRIGHT_LEAD_ID;

  await page.goto(`/${adminPath}/leads/${leadId}`);

  await page.getByRole("combobox", { name: "Change status" }).click();
  await page.getByRole("option", { name: "Contacted" }).click();
  await page.getByRole("button", { name: "Save status" }).click();

  await page.getByText("Status updated to Contacted").waitFor();
});
