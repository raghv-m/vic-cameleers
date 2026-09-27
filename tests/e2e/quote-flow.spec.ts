import { expect, test } from "@playwright/test";

/**
 * The 3-step quote form end to end, including the Turnstile dev bypass
 * (src/components/forms/turnstile-widget.tsx supplies a token when NEXT_PUBLIC_TURNSTILE_SITE_KEY
 * isn't set) and a real POST to /api/quote. Without a live database (see TODO-OWNER.md) the API
 * answers with its graceful error, so that's what the happy path asserts on. Once Neon is
 * provisioned, change the last assertion to expect the "RECEIVED" result screen.
 */
test("fills all three steps and submits", async ({ page }) => {
  await page.goto("/quote");

  // Step 1: your move
  await page.getByLabel("Pickup address").fill("10 Sample Street, Cranbourne VIC 3977");
  await page.getByLabel("Drop-off address").fill("20 Example Road, Berwick VIC 3806");
  await page.getByLabel("Moving date").fill("2027-03-15");
  await page.getByRole("button", { name: /Next: What's moving/ }).click();

  // Step 2: what's moving
  await expect(page.getByRole("heading", { name: "What's moving" })).toBeFocused();
  await page.getByRole("radio", { name: "House" }).check({ force: true });
  await page.getByRole("radio", { name: "3 bed" }).check({ force: true });
  await page.getByRole("button", { name: /Next: Your details/ }).click();

  // Step 3: your details
  await page.getByLabel("Your name").fill("Test Customer");
  await page.getByLabel("Mobile").fill("0412345678");
  await page.getByLabel("Email").fill("test.customer@example.com");
  await page.locator("#consentGiven").check();
  await page.getByRole("button", { name: /Request my quote/ }).click();

  await expect(page.getByText(/didn't go through|RECEIVED/)).toBeVisible({ timeout: 15000 });
});

test("blocks step 1 with linked, specific errors", async ({ page }) => {
  await page.goto("/quote");
  await page.getByRole("button", { name: /Next: What's moving/ }).click();

  const pickup = page.getByLabel("Pickup address");
  await expect(pickup).toBeFocused();
  await expect(pickup).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator("#pickupAddress-error")).toHaveText(/street and suburb/);
  await expect(page.locator("#moveDate-error")).toHaveText(/Pick a moving date/);
});

test("rejects an address outside Victoria and a past date", async ({ page }) => {
  await page.goto("/quote");
  await page.getByLabel("Pickup address").fill("1 George St, Sydney NSW 2000");
  await page.getByLabel("Drop-off address").fill("4 High St, Berwick VIC 3806");
  await page.getByLabel("Moving date").fill("2020-01-01");
  await page.getByRole("button", { name: /Next: What's moving/ }).click();
  await expect(page.locator("#pickupAddress-error")).toHaveText(/outside Victoria/);
  await expect(page.locator("#moveDate-error")).toHaveText(/later date/);
});

test("pre-fills from the homepage estimator link", async ({ page }) => {
  await page.goto("/quote?type=home&size=3bed&stairs=1&from=Berwick&to=Officer&date=2027-02-01");
  await expect(page.getByLabel("Pickup address")).toHaveValue("Berwick");
  await expect(page.getByLabel("Drop-off address")).toHaveValue("Officer");
  await expect(page.getByLabel("Moving date")).toHaveValue("2027-02-01");
});
