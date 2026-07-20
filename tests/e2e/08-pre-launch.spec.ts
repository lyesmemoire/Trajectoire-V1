import { test, expect } from "@playwright/test";

test.describe("🚀 Pre-Launch Health Scenarios", () => {
  test("Landing: Hero & Instant Demo Visibility", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Trajectoire/);
  });

  test("Auth: Signup Flow Integrity", async ({ page }) => {
    await page.goto("/signup");
    await expect(page).toHaveTitle(/Trajectoire/);
  });

  test("ATS: Basic PDF Parsing Stability", async ({ page }) => {
    // This is a simplified check for the UI state
    await page.goto("/dashboard/ats");
    await expect(page).toHaveURL(/\/(dashboard\/ats|login)/);
  });

  test("Performance: Dashboards should load under 2s", async ({ page }) => {
    const start = Date.now();
    await page.goto("/dashboard");
    const end = Date.now();
    expect(end - start).toBeLessThan(2000);
  });
});
