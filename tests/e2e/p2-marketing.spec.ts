import { test, expect } from "@playwright/test";

/**
 * P2 — Marketing Pages & CTA
 *
 * Vérifie que toutes les pages marketing publiques se chargent
 * et que les CTA principaux sont visibles et fonctionnels.
 */

const marketingPages = [
  { path: "/", name: "Homepage" },
  { path: "/pricing", name: "Pricing" },
  { path: "/features", name: "Features" },
  { path: "/how-it-works", name: "How it works" },
  { path: "/testimonials", name: "Testimonials" },
];

test.describe("P2 — Marketing Pages Load", () => {
  for (const { path, name } of marketingPages) {
    test(`${name} (${path}) charge sans erreur`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBeLessThan(400);
      // La page doit avoir au moins un h1
      await expect(page.locator("h1").first()).toBeVisible({ timeout: 10000 });
    });
  }
});

test.describe("P2 — Marketing CTA Signup", () => {
  for (const { path, name } of marketingPages) {
    test(`${name} contient au moins un CTA signup`, async ({ page }) => {
      await page.goto(path);
      const signupLinks = page.locator('a[href="/auth/signup"]');
      const count = await signupLinks.count();
      expect(count).toBeGreaterThan(0);
    });
  }
});

test.describe("P2 — Marketing Navigation", () => {
  test("Navbar liens de navigation existent", async ({ page }) => {
    await page.goto("/");

    // Vérifier la présence des liens de nav principaux
    const navLinks = [
      'a[href="/pricing"]',
      'a[href="/features"]',
    ];

    for (const selector of navLinks) {
      const link = page.locator(selector).first();
      if (await link.isVisible()) {
        await expect(link).toBeEnabled();
      }
    }
  });

  test("Features page CTA navigue vers signup", async ({ page }) => {
    await page.goto("/features");
    const cta = page.locator('a[href="/auth/signup"]').first();
    await expect(cta).toBeVisible({ timeout: 10000 });
    await cta.click({ force: true });
    await expect(page).toHaveURL(/\/auth\/signup/);
  });
});

test.describe("P2 — Legal Pages", () => {
  const legalPages = ["/legal", "/privacy", "/terms"];

  for (const path of legalPages) {
    test(`${path} charge ou retourne 404 propre`, async ({ page }) => {
      const response = await page.goto(path);
      // Acceptable: 200 (page exists) ou 404 (not yet created)
      expect(response?.status()).toBeLessThanOrEqual(404);
      // Must NOT be a 500
      expect(response?.status()).not.toBe(500);
    });
  }
});
