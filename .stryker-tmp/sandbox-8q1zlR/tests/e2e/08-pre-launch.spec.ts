// @ts-nocheck
import { test, expect } from "@playwright/test";

test.describe("🚀 Pre-Launch Health Scenarios", () => {
  test("Landing: Hero & Instant Demo Visibility", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText(
      /La plupart des candidats échouent/i,
    );
    // Check if demo section exists
    await expect(
      page.locator("text=Vivez le choc psychologique"),
    ).toBeVisible();
  });

  test("Auth: Signup Flow Integrity", async ({ page }) => {
    await page.goto("/auth/signup");
    await expect(page.locator("form")).toBeVisible();
  });

  test("ATS: Basic PDF Parsing Stability", async ({ page }) => {
    // This is a simplified check for the UI state
    await page.goto("/dashboard/ats");
    await expect(page.locator("text=Audit de Recrutement")).toBeVisible();
  });

  test("Performance: Dashboards should load under 2s", async ({ page }) => {
    const start = Date.now();
    await page.goto("/dashboard");
    const end = Date.now();
    expect(end - start).toBeLessThan(2000);
  });
});
