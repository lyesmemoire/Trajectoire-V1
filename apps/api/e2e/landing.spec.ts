import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should load landing page successfully', async ({ page }) => {
    await page.goto('/');
    
    await expect(page).toHaveTitle(/Trajectoire/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should display hero section', async ({ page }) => {
    await page.goto('/');
    
    const hero = page.locator('.hero').or(page.locator('[data-testid="hero"]'));
    await expect(hero).toBeVisible();
  });

  test('should have working CTA buttons', async ({ page }) => {
    await page.goto('/');
    
    const ctaButton = page.locator('button').filter({ hasText: /Commencer|Start|Sign up/i });
    if (await ctaButton.count() > 0) {
      await ctaButton.first().click();
      await expect(page).toHaveURL(/.*signup|register|auth/i);
    }
  });

  test('should display features section', async ({ page }) => {
    await page.goto('/');
    
    const features = page.locator('.features').or(page.locator('[data-testid="features"]'));
    await expect(features).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    await expect(page.locator('h1')).toBeVisible();
    
    const mobileMenu = page.locator('[aria-label="Menu"]').or(page.locator('.mobile-menu'));
    if (await mobileMenu.count() > 0) {
      await expect(mobileMenu).toBeVisible();
    }
  });
});
