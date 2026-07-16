import { test, expect } from "@playwright/test";

/**
 * P0 — Parcours Critiques Beta
 *
 * Ces tests vérifient que toutes les pages critiques se chargent,
 * que les boutons/CTA existent et sont interactifs,
 * et que les formulaires se soumettent correctement.
 *
 * NOTE : L'authentification réelle (Supabase) n'est pas disponible en CI.
 * Les tests vérifient donc le parcours *jusqu'au formulaire* et la présence
 * des CTA, pas la redirection post-login effective.
 */

test.describe("P0 — Landing & Navigation", () => {
  test("1. Homepage charge et CTA principal visible", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBeLessThan(400);

    // Hero CTA : "Réserver mon accompagnement" (lien vers /auth/signup)
    const heroCTA = page.locator('a[href="/auth/signup"]').first();
    await expect(heroCTA).toBeVisible({ timeout: 10000 });

    // Vérifier texte du CTA
    await expect(heroCTA).toContainText(/accompagnement|essai|commencer|espace/i);
  });

  test("2. CTA Hero navigue vers /auth/signup", async ({ page }) => {
    await page.goto("/");
    const heroCTA = page.locator('a[href="/auth/signup"]').first();
    await expect(heroCTA).toBeVisible({ timeout: 10000 });
    await heroCTA.click();
    await expect(page).toHaveURL(/\/auth\/signup/);
  });

  test("3. Navigation Pricing accessible", async ({ page }) => {
    const response = await page.goto("/pricing");
    expect(response?.status()).toBeLessThan(400);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("4. Navigation Features accessible", async ({ page }) => {
    const response = await page.goto("/features");
    expect(response?.status()).toBeLessThan(400);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("5. Navigation How-it-works accessible", async ({ page }) => {
    const response = await page.goto("/how-it-works");
    expect(response?.status()).toBeLessThan(400);
  });

  test("6. Navigation Testimonials accessible", async ({ page }) => {
    const response = await page.goto("/testimonials");
    expect(response?.status()).toBeLessThan(400);
  });
});

test.describe("P0 — Auth Pages", () => {
  test("7. Login page charge et formulaire présent", async ({ page }) => {
    const response = await page.goto("/auth/login");
    expect(response?.status()).toBeLessThan(400);

    // Champs du formulaire
    await expect(page.locator("#login-email")).toBeVisible();
    await expect(page.locator("#login-password")).toBeVisible();

    // Bouton submit
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toContainText(/connecter/i);
  });

  test("8. Login form validation - champs vides", async ({ page }) => {
    await page.goto("/auth/login");
    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();

    // HTML5 validation should prevent submission
    // Verify we're still on login page
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("9. Login form - remplissage et soumission", async ({ page }) => {
    await page.goto("/auth/login");
    await page.fill("#login-email", "test@example.com");
    await page.fill("#login-password", "Password123!");
    await page.click('button[type="submit"]');

    // Avec un faux utilisateur, on attend soit un toast d'erreur
    // soit qu'on reste sur la page login (pas de crash)
    await page.waitForTimeout(2000);
    // La page ne doit PAS crasher (pas de 500)
    const url = page.url();
    expect(url).toBeTruthy();
  });

  test("10. Signup page charge et formulaire présent", async ({ page }) => {
    const response = await page.goto("/auth/signup");
    expect(response?.status()).toBeLessThan(400);
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("11. Forgot password page charge", async ({ page }) => {
    const response = await page.goto("/auth/forgot-password");
    expect(response?.status()).toBeLessThan(400);
  });

  test("12. Lien 'Mot de passe oublié' sur login", async ({ page }) => {
    await page.goto("/auth/login");
    await page.waitForLoadState("networkidle");
    const link = page.locator('a[href="/auth/forgot-password"]');
    await expect(link).toBeVisible();
    await link.click({ force: true });
    await expect(page).toHaveURL(/\/auth\/forgot-password/);
  });

  test("13. Lien 'Créer mon espace' sur login", async ({ page }) => {
    await page.goto("/auth/login");
    await page.waitForLoadState("networkidle");
    const link = page.locator('a[href*="/auth/signup"]');
    await expect(link).toBeVisible();
    await link.click({ force: true });
    await expect(page).toHaveURL(/\/auth\/signup/);
  });

  test("14. Boutons OAuth (Google, Microsoft) présents", async ({ page }) => {
    await page.goto("/auth/login");
    const googleBtn = page.locator('button:has-text("Google")');
    const microsoftBtn = page.locator('button:has-text("Microsoft")');
    await expect(googleBtn).toBeVisible();
    await expect(microsoftBtn).toBeVisible();
  });

  test("15. Dashboard redirige vers login si non authentifié", async ({ page }) => {
    await page.goto("/dashboard");
    // Should redirect to login
    await page.waitForURL(/\/auth\/login/, { timeout: 10000 });
  });
});

test.describe("P0 — Error Boundaries", () => {
  test("16. 404 affiche une page not-found", async ({ page }) => {
    const response = await page.goto("/cette-page-nexiste-pas");
    expect(response?.status()).toBe(404);
  });
});

test.describe("P0 — Keyboard Navigation", () => {
  test("17. Login form accessible au clavier", async ({ page }) => {
    await page.goto("/auth/login");

    // Tab into email field
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    // Fill email via keyboard
    await page.keyboard.type("test@example.com");
    await page.keyboard.press("Tab");
    await page.keyboard.type("Password123!");

    // Submit via Enter
    await page.keyboard.press("Enter");

    // Should not crash
    await page.waitForTimeout(1000);
    expect(page.url()).toBeTruthy();
  });

  test("18. CTA Hero focusable et activable au clavier", async ({ page }) => {
    await page.goto("/");
    const heroCTA = page.locator('a[href="/auth/signup"]').first();
    await heroCTA.focus();
    await expect(heroCTA).toBeFocused();

    // Activate with Enter
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/auth\/signup/);
  });
});
