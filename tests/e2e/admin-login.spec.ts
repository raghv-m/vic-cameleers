import { expect, test } from "@playwright/test";

/**
 * The full "sign in, then complete mandatory 2FA" flow needs a real staff
 * account (see scripts/seed-admin.ts) in a live database, which isn't
 * provisioned yet (TODO-OWNER.md). These tests cover what's verifiable
 * without one: the login form itself, its validation, and that every
 * protected admin route returns a plain 404 to a signed-out visitor, so it
 * never confirms an admin console exists there. ADMIN_PATH comes from the
 * same env var the app reads; there's deliberately no hardcoded fallback.
 */
const ADMIN_PATH = process.env.ADMIN_PATH;

test.skip(!ADMIN_PATH, "Set ADMIN_PATH to the value in .env to run the admin specs");

test("renders the login form", async ({ page }) => {
  await page.goto(`/${ADMIN_PATH}/login`);
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
});

test("rejects an invalid email before hitting the server", async ({ page }) => {
  await page.goto(`/${ADMIN_PATH}/login`);
  await page.getByLabel("Email").fill("not-an-email");
  await page.getByLabel("Password").fill("whatever-password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByText(/valid email/i)).toBeVisible();
});

test("the login page is noindexed", async ({ page }) => {
  const response = await page.goto(`/${ADMIN_PATH}/login`);
  expect(response?.headers()["x-robots-tag"]).toBe("noindex, nofollow");
});

test("a direct guess at the literal /admin path 404s", async ({ page }) => {
  const response = await page.goto("/admin");
  expect(response?.status()).toBe(404);
});

test("the old leaked admin path 404s", async ({ page }) => {
  const response = await page.goto("/ops-dev-7f3k");
  expect(response?.status()).toBe(404);
});

for (const path of [
  "",
  "/leads",
  "/bookings",
  "/trucks",
  "/crew",
  "/settings",
  "/staff",
  "/setup-2fa",
]) {
  test(`signed-out visitor to /${ADMIN_PATH}${path} gets a 404`, async ({ page }) => {
    const response = await page.goto(`/${ADMIN_PATH}${path}`);
    expect(response?.status()).toBe(404);
    expect(response?.headers()["x-robots-tag"]).toBe("noindex, nofollow");
  });
}
