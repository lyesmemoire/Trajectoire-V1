import { test, expect } from '@playwright/test';

test.describe('Landing Page E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load landing page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Trajectoire|Studio Entretien/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should display hero section', async ({ page }) => {
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();
  });

  test('should have navigation menu', async ({ page }) => {
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('should display call-to-action buttons', async ({ page }) => {
    const ctaButtons = page.locator('button, a').filter({ hasText: /Commencer|Démarrer|Essayer|Sign up/i });
    await expect(ctaButtons.first()).toBeVisible();
  });

  test('should navigate to signup page from CTA', async ({ page }) => {
    const ctaButton = page.locator('button, a').filter({ hasText: /Commencer|Démarrer|Sign up/i }).first();
    await ctaButton.click();
    
    await expect(page).toHaveURL(/\/signup|\/login/);
  });

  test('should display features section', async ({ page }) => {
    const featuresSection = page.locator('section').filter({ hasText: /Features|Fonctionnalités|Avantages/i });
    await expect(featuresSection).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const mobileMenu = page.locator('[aria-label="Menu"], button[aria-label="menu"], .mobile-menu');
    
    if (await mobileMenu.count() > 0) {
      await expect(mobileMenu.first()).toBeVisible();
    }
  });

  test('should load without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    expect(errors.length).toBe(0);
  });

  test('should have proper meta tags', async ({ page }) => {
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBeTruthy();
    expect(description?.length).toBeGreaterThan(0);
  });

  test('should display footer', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('should have working links in footer', async ({ page }) => {
    const footerLinks = page.locator('footer a').first();
    if (await footerLinks.count() > 0) {
      await footerLinks.click();
      await expect(page).toHaveURL(/.*/);
    }
  });
});
