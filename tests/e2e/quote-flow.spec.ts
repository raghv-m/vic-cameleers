import { expect, test } from "@playwright/test";

/**
 * Exercises the full 5-step quote form end to end, including the real
 * Turnstile dev-bypass (src/components/forms/turnstile-widget.tsx auto-
 * supplies a token when NEXT_PUBLIC_TURNSTILE_SITE_KEY isn't set) and a
 * real POST to /api/quote. Without a live database (see TODO-OWNER.md)
 * the API responds with its graceful "something went wrong" error rather
 * than a result screen, so that's what this asserts on. Once Neon is
 * provisioned, update the final assertion to expect the result screen
 * (reference number, estimate range) instead.
 */
test("fills every step and submits, server gracefully reports no database yet", async ({
  page,
}) => {
  await page.goto("/quote");

  // Step 1: location and date
  await page.getByLabel("Pickup address").fill("10 Sample Street, Cranbourne VIC");
  await page.getByLabel("Drop-off address").fill("20 Example Road, Berwick VIC");
  await page.locator("#moveDate").fill("2027-03-15");
  await page.getByRole("button", { name: "Next" }).click();

  // Step 2: property and access
  await page.getByLabel("Property type").click();
  await page.getByRole("option", { name: "House" }).click();
  await page.getByLabel("Bedrooms").click();
  await page.getByRole("option", { name: "3 bedroom" }).click();
  await page.getByRole("button", { name: "Next" }).click();

  // Step 3: special items, nothing required
  await page.getByRole("button", { name: "Next" }).click();

  // Step 4: extras, nothing required
  await page.getByRole("button", { name: "Next" }).click();

  // Step 5: contact details
  await page.getByLabel("Name").fill("Test Customer");
  await page.getByLabel("Mobile number").fill("0412345678");
  await page.getByLabel("Email").fill("test.customer@example.com");
  await page.locator("#consentGiven").click();

  await page.getByRole("button", { name: "Get my estimate" }).click();

  await expect(page.getByText(/something went wrong|please call us instead/i)).toBeVisible({
    timeout: 15000,
  });
});

test("blocks step 1 from advancing until required fields are filled", async ({ page }) => {
  await page.goto("/quote");
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.getByText(/required|enter|pick a date/i).first()).toBeVisible();
});
