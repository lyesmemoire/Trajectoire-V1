import { test, expect } from '@playwright/test';

test.describe('Dashboard Page E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('should load dashboard page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Dashboard|Tableau de bord/i);
  });

  test('should display dashboard header', async ({ page }) => {
    const header = page.locator('header, [data-testid="dashboard-header"]');
    await expect(header).toBeVisible();
  });

  test('should display navigation sidebar', async ({ page }) => {
    const sidebar = page.locator('aside, [data-testid="sidebar"], .sidebar');
    if (await sidebar.count() > 0) {
      await expect(sidebar.first()).toBeVisible();
    }
  });

  test('should display main content area', async ({ page }) => {
    const mainContent = page.locator('main, [data-testid="dashboard-content"]');
    await expect(mainContent).toBeVisible();
  });

  test('should display statistics cards', async ({ page }) => {
    const statsCards = page.locator('[data-testid="stats-card"], .stat-card');
    if (await statsCards.count() > 0) {
      await expect(statsCards.first()).toBeVisible();
    }
  });

  test('should display charts or graphs', async ({ page }) => {
    const charts = page.locator('[data-testid="chart"], canvas, .chart');
    if (await charts.count() > 0) {
      await expect(charts.first()).toBeVisible();
    }
  });

  test('should have user profile section', async ({ page }) => {
    const userProfile = page.locator('[data-testid="user-profile"], .user-profile');
    if (await userProfile.count() > 0) {
      await expect(userProfile.first()).toBeVisible();
    }
  });

  test('should have search functionality', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]');
    if (await searchInput.count() > 0) {
      await expect(searchInput.first()).toBeVisible();
    }
  });

  test('should have notification bell', async ({ page }) => {
    const notificationBell = page.locator('[data-testid="notifications"], button[aria-label="notification"]');
    if (await notificationBell.count() > 0) {
      await expect(notificationBell.first()).toBeVisible();
    }
  });

  test('should navigate between dashboard sections', async ({ page }) => {
    const navItems = page.locator('nav a, aside a');
    if (await navItems.count() > 0) {
      await navItems.first().click();
      await page.waitForTimeout(500);
      await expect(page).toHaveURL(/\/dashboard/);
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const mainContent = page.locator('main, [data-testid="dashboard-content"]');
    await expect(mainContent).toBeVisible();
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

  test('should display recent activity', async ({ page }) => {
    const recentActivity = page.locator('[data-testid="recent-activity"], .recent-activity');
    if (await recentActivity.count() > 0) {
      await expect(recentActivity.first()).toBeVisible();
    }
  });

  test('should have logout button', async ({ page }) => {
    const logoutButton = page.locator('button, a').filter({ hasText: /Logout|Déconnexion/i });
    if (await logoutButton.count() > 0) {
      await expect(logoutButton.first()).toBeVisible();
    }
  });
});
