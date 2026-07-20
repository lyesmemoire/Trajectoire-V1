import { test, expect } from "@playwright/test";

test.describe("Dashboard & Navigation Audit", () => {
  test("dashboard route is accessible", async ({ page }) => {
    await page.goto("/dashboard");
    // Just check if the page loads (may redirect to login if not authenticated)
    await expect(page).toHaveURL(/\/(dashboard|login)/);
  });

  test("history route is accessible", async ({ page }) => {
    await page.goto("/history");
    await expect(page).toHaveURL(/\/(history|login)/);
  });
});
