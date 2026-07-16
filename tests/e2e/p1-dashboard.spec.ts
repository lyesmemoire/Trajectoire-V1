import { test, expect } from "@playwright/test";

/**
 * P1 — Dashboard & Features
 *
 * Vérifie que les pages dashboard (protégées) renvoient bien
 * une redirection vers /auth/login quand l'utilisateur n'est pas connecté,
 * et que les pages marketing liées au dashboard sont accessibles.
 */

const dashboardRoutes = [
  "/dashboard",
  "/dashboard/cvs",
  "/dashboard/billing",
  "/dashboard/profile",
  "/dashboard/optimize",
  "/dashboard/career-copilot",
  "/dashboard/interview-prep",
  "/dashboard/interview-simulation",
  "/dashboard/progress-plan",
  "/dashboard/history",
  "/dashboard/export",
];

test.describe("P1 — Dashboard Routes (sans auth)", () => {
  for (const route of dashboardRoutes) {
    test(`${route} → redirige vers login`, async ({ page }) => {
      await page.goto(route);
      // Toutes les routes protégées doivent rediriger vers login
      await expect(page).toHaveURL(/\/auth\/login/, { timeout: 15000 });
    });
  }
});

test.describe("P1 — Pricing CTA", () => {
  test("Pricing page charge et CTA plans visibles", async ({ page }) => {
    const response = await page.goto("/pricing");
    expect(response?.status()).toBeLessThan(400);

    // Au moins un CTA de plan (lien vers /auth/signup)
    const planCTAs = page.locator('a[href="/auth/signup"]');
    const count = await planCTAs.count();
    expect(count).toBeGreaterThan(0);
  });

  test("Pricing - tous les CTA de plans sont cliquables", async ({ page }) => {
    await page.goto("/pricing");
    const planCTAs = page.locator('a[href="/auth/signup"]');
    const count = await planCTAs.count();

    for (let i = 0; i < count; i++) {
      const cta = planCTAs.nth(i);
      await expect(cta).toBeVisible();
      // Vérifier que le lien n'est pas disabled
      const isDisabled = await cta.getAttribute("aria-disabled");
      expect(isDisabled).not.toBe("true");
    }
  });
});

test.describe("P1 — Footer Links", () => {
  test("Footer logo link pointe vers /", async ({ page }) => {
    await page.goto("/");
    const footerLogo = page.locator('footer a[href="/"]').first();
    if (await footerLogo.isVisible()) {
      await expect(footerLogo).toHaveAttribute("href", "/");
    }
  });
});

test.describe("P1 — Auth Links Cross-Navigation", () => {
  test("Login → Signup → Login round-trip", async ({ page }) => {
    await page.goto("/auth/login");
    await page.waitForLoadState("networkidle");
    // Click "Créer mon espace"
    await page.click('a[href*="/auth/signup"]', { force: true });
    await page.waitForURL(/\/auth\/signup/);

    // Go back to login from signup (if link exists)
    const loginLink = page.locator('a[href*="/auth/login"]');
    if (await loginLink.isVisible()) {
      await loginLink.click();
      await expect(page).toHaveURL(/\/auth\/login/);
    }
  });
});
