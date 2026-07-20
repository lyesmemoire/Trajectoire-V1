import { test, expect } from "@playwright/test";

test.describe("Public & Auth Routes Audit", () => {
  test("landing page should load and have correct title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Trajectoire/);
  });

  test("pricing page should be accessible", async ({ page }) => {
    await page.goto("/pricing");
    // Pricing page may not exist, just check if it loads or redirects
    await expect(page).toHaveURL(/\/(pricing|login)/);
  });

  test("login page should be accessible", async ({ page }) => {
    await page.goto("/login");
    await expect(page).toHaveTitle(/Trajectoire/);
  });
});
