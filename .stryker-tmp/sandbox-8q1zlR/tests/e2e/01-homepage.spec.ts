// @ts-nocheck
import { test, expect } from "@playwright/test";

test.describe("Public & Auth Routes Audit", () => {
  test("landing page should load and have correct title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/StudioEntretien/);
    await expect(page.locator("h1")).toContainText(
      /La plupart des candidats échouent/,
    );
  });

  test("pricing page should be accessible", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.locator("h2")).toContainText(
      /Investissez dans votre mutation/,
    );
  });

  test("login page should be accessible", async ({ page }) => {
    await page.goto("/auth/login");
    await expect(page.locator("form")).toBeVisible();
  });
});
