import { test, expect } from "@playwright/test";

test.describe("Dashboard & Navigation Audit", () => {
  test.beforeEach(async ({ page }) => {
    // In a real E2E, we would use a global setup for auth
    // For this audit, we check if elements exist after landing
    await page.goto("/dashboard");
  });

  test("sidebar should be visible and functional on desktop", async ({
    page,
    isMobile,
  }) => {
    if (isMobile) return;
    await expect(page.locator("aside")).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Analyse ATS/i }),
    ).toBeVisible();
  });

  test("charts should hydrate correctly", async ({ page }) => {
    await page.goto("/dashboard/progress");
    // Check for Recharts container
    const chart = page.locator(".recharts-responsive-container");
    await expect(chart).toBeVisible();
  });

  test("responsive mobile menu toggle", async ({ page, isMobile }) => {
    if (!isMobile) return;
    const header = page.locator("header.lg\\:hidden");
    await expect(header).toBeVisible();
  });
});
