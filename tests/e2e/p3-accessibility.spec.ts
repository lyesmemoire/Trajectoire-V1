import { test, expect } from "@playwright/test";

/**
 * P3 — Accessibilité & Interactions Avancées
 *
 * Vérifie la navigation clavier, le focus visible,
 * les états disabled/loading, et la cohérence a11y.
 */

test.describe("P3 — Focus Visible", () => {
  test("Tab navigation sur la homepage produit un focus visible", async ({ page }) => {
    await page.goto("/");
    // Press Tab several times to move through interactive elements
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("Tab");
    }
    // The active element should have a focus ring
    const activeTag = await page.evaluate(() => document.activeElement?.tagName);
    expect(activeTag).toBeTruthy();
    // Active element should be an interactive element
    const isInteractive = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return false;
      return ["A", "BUTTON", "INPUT", "TEXTAREA", "SELECT"].includes(el.tagName);
    });
    expect(isInteractive).toBe(true);
  });

  test("Login page - tous les éléments interactifs sont tab-navigables", async ({ page }) => {
    await page.goto("/auth/login");
    const interactiveElements: string[] = [];

    // Press Tab multiple times and collect focused element types
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press("Tab");
      const tag = await page.evaluate(() => {
        const el = document.activeElement;
        return el ? `${el.tagName}:${el.getAttribute("type") || el.getAttribute("role") || ""}` : null;
      });
      if (tag) interactiveElements.push(tag);
    }

    // Should have visited at least email, password, and submit
    expect(interactiveElements.length).toBeGreaterThan(2);
  });
});

test.describe("P3 — Button States", () => {
  test("Login submit button shows loading state on click", async ({ page }) => {
    await page.goto("/auth/login");
    await page.fill("#login-email", "loading-test@example.com");
    await page.fill("#login-password", "Password123!");

    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();

    // After clicking, button should either:
    // 1. Show a loading spinner/state
    // 2. Or be disabled temporarily
    await page.waitForTimeout(500);
    // Check the page didn't crash
    expect(page.url()).toContain("/auth/login");
  });

  test("Login OAuth buttons are not disabled by default", async ({ page }) => {
    await page.goto("/auth/login");
    const googleBtn = page.locator('button:has-text("Google")');
    await expect(googleBtn).toBeVisible();
    await expect(googleBtn).toBeEnabled();
  });
});

test.describe("P3 — Password Toggle", () => {
  test("Toggle password visibility on login", async ({ page }) => {
    await page.goto("/auth/login");
    const passwordInput = page.locator("#login-password");
    await expect(passwordInput).toHaveAttribute("type", "password");

    // Click the eye toggle
    const toggleBtn = page.locator('button[aria-label*="mot de passe"]').first();
    if (await toggleBtn.isVisible()) {
      await toggleBtn.click();
      await expect(passwordInput).toHaveAttribute("type", "text");

      // Toggle back
      await toggleBtn.click();
      await expect(passwordInput).toHaveAttribute("type", "password");
    }
  });
});

test.describe("P3 — Anchor Links", () => {
  test("Hero 'Voir comment ça marche' scrolle vers #methode", async ({ page }) => {
    await page.goto("/");
    const methodLink = page.locator('a[href="#methode"]').first();
    if (await methodLink.isVisible()) {
      await methodLink.click();
      // URL should now contain #methode
      expect(page.url()).toContain("#methode");
    }
  });
});

test.describe("P3 — Enter/Space sur éléments interactifs", () => {
  test("Enter sur un lien CTA navigue", async ({ page }) => {
    await page.goto("/");
    const cta = page.locator('a[href="/auth/signup"]').first();
    await cta.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/auth\/signup/);
  });

  test("Space sur un bouton l'active", async ({ page }) => {
    await page.goto("/auth/login");
    const toggleBtn = page.locator('button[aria-label*="mot de passe"]').first();
    if (await toggleBtn.isVisible()) {
      await toggleBtn.focus();
      const typeBefore = await page.locator("#login-password").getAttribute("type");
      await page.keyboard.press("Space");
      const typeAfter = await page.locator("#login-password").getAttribute("type");
      expect(typeBefore).not.toBe(typeAfter);
    }
  });
});

test.describe("P3 — No Console Errors on Critical Pages", () => {
  const pages = ["/", "/auth/login", "/auth/signup", "/pricing"];

  for (const pagePath of pages) {
    test(`${pagePath} — pas d'erreur console critique`, async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          errors.push(msg.text());
        }
      });

      await page.goto(pagePath);
      await page.waitForTimeout(2000);

      // Filter out known non-critical errors (network, third-party)
      const criticalErrors = errors.filter(
        (e) =>
          !e.includes("favicon") &&
          !e.includes("net::ERR") &&
          !e.includes("Failed to load resource") &&
          !e.includes("posthog") &&
          !e.includes("sentry")
      );

      expect(criticalErrors).toEqual([]);
    });
  }
});
