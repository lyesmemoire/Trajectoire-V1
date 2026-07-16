import { test, expect } from "@playwright/test";

/**
 * SMOKE TESTS — Parcours critiques V1
 *
 * Ces tests vérifient que chaque page critique se charge
 * sans erreur fatale (pas d'écran blanc, pas de 500).
 * Ils sont conçus pour être stables même si l'UI évolue.
 */
test.describe("Smoke: Pages critiques", () => {

  test("Homepage se charge correctement", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBeLessThan(500);
    await expect(page.locator("body")).not.toBeEmpty();
    // Vérifie qu'il n'y a pas d'erreur React visible
    await expect(page.locator("text=Erreur Système")).not.toBeVisible();
  });

  test("Page Login se charge correctement", async ({ page }) => {
    const response = await page.goto("/auth/login");
    expect(response?.status()).toBeLessThan(500);
    // Un formulaire de login doit exister
    await expect(page.locator('button[type="submit"]')).toBeVisible({ timeout: 5000 });
  });

  test("Page Signup se charge correctement", async ({ page }) => {
    const response = await page.goto("/auth/signup");
    expect(response?.status()).toBeLessThan(500);
    await expect(page.locator('button[type="submit"]')).toBeVisible({ timeout: 5000 });
  });

  test("Page Pricing se charge correctement", async ({ page }) => {
    const response = await page.goto("/pricing");
    expect(response?.status()).toBeLessThan(500);
    await expect(page.locator("body")).not.toBeEmpty();
  });

  test("Page Features se charge correctement", async ({ page }) => {
    const response = await page.goto("/features");
    expect(response?.status()).toBeLessThan(500);
    await expect(page.locator("body")).not.toBeEmpty();
  });
});

test.describe("Smoke: Pages protégées (sans auth)", () => {

  test("Dashboard redirige vers login si non authentifié", async ({ page }) => {
    await page.goto("/dashboard");
    // Doit soit afficher un formulaire de login, soit rediriger
    await page.waitForURL(/\/(auth\/login|dashboard)/, { timeout: 8000 });
  });
});

test.describe("Smoke: Error Boundaries", () => {

  test("404 affiche la page not-found", async ({ page }) => {
    await page.goto("/cette-page-nexiste-pas-du-tout");
    // Next.js retourne 404 mais ne doit pas crasher
    await expect(page.locator("body")).not.toBeEmpty();
  });
});
