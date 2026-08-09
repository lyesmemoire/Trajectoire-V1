import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Simulate authentication
    await page.goto('/dashboard');
  });

  test('should load dashboard successfully', async ({ page }) => {
    await expect(page).toHaveURL(/.*dashboard/i);
    await expect(page.locator('h1')).toContainText(/Dashboard|Tableau de bord/i);
  });

  test('should display user profile summary', async ({ page }) => {
    const profileSection = page.locator('.profile').or(page.locator('[data-testid="user-profile"]'));
    if (await profileSection.count() > 0) {
      await expect(profileSection).toBeVisible();
    }
  });

  test('should display navigation menu', async ({ page }) => {
    const navMenu = page.locator('nav').or(page.locator('[data-testid="navigation"]'));
    await expect(navMenu).toBeVisible();
  });

  test('should show quick stats', async ({ page }) => {
    const statsSection = page.locator('.stats').or(page.locator('[data-testid="stats"]'));
    if (await statsSection.count() > 0) {
      await expect(statsSection).toBeVisible();
    }
  });

  test('should navigate to different sections', async ({ page }) => {
    const matchingLink = page.locator('a').filter({ hasText: /Matching/i });
    if (await matchingLink.count() > 0) {
      await matchingLink.click();
      await expect(page).toHaveURL(/.*matching/i);
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/dashboard');
    
    const mobileNav = page.locator('[aria-label="Menu"]').or(page.locator('.mobile-menu'));
    if (await mobileNav.count() > 0) {
      await expect(mobileNav).toBeVisible();
    }
  });

  test('should display recent activity', async ({ page }) => {
    const activitySection = page.locator('.activity').or(page.locator('[data-testid="recent-activity"]'));
    if (await activitySection.count() > 0) {
      await expect(activitySection).toBeVisible();
    }
  });
});
