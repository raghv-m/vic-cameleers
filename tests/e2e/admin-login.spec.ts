import { expect, test } from "@playwright/test";

/**
 * The full "sign in, then complete mandatory 2FA" flow needs a real staff
 * account (see scripts/seed-admin.ts) in a live database, which isn't
 * provisioned yet (TODO-OWNER.md). These tests cover what's verifiable
 * without one: the login form itself, its validation, and that every
 * protected admin route correctly bounces an unauthenticated visitor to
 * login rather than leaking a page. ADMIN_PATH here matches the value in
 * .env for local dev; update it if that changes.
 */
const ADMIN_PATH = process.env.ADMIN_PATH ?? "ops-dev-7f3k";

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

test("a direct guess at the literal /admin path 404s", async ({ page }) => {
  const response = await page.goto("/admin");
  expect(response?.status()).toBe(404);
});

for (const path of ["", "/leads", "/bookings", "/trucks", "/crew", "/settings", "/staff"]) {
  test(`unauthenticated visitor to /${ADMIN_PATH}${path} is redirected to login`, async ({
    page,
  }) => {
    await page.goto(`/${ADMIN_PATH}${path}`);
    await expect(page).toHaveURL(new RegExp(`/${ADMIN_PATH}/login$`));
  });
}
