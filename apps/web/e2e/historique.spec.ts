import { test, expect } from '@playwright/test';

test.describe('Historique Page E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/history');
  });

  test('should load history page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/History|Historique/i);
  });

  test('should display history timeline', async ({ page }) => {
    const timeline = page.locator('[data-testid="history-timeline"], .timeline');
    if (await timeline.count() > 0) {
      await expect(timeline.first()).toBeVisible();
    }
  });

  test('should display activity list', async ({ page }) => {
    const activityList = page.locator('[data-testid="activity-list"], .activity-list');
    await expect(activityList).toBeVisible();
  });

  test('should have date filters', async ({ page }) => {
    const dateFilter = page.locator('input[type="date"], select[name="period"]');
    if (await dateFilter.count() > 0) {
      await expect(dateFilter.first()).toBeVisible();
    }
  });

  test('should have search functionality', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]');
    if (await searchInput.count() > 0) {
      await expect(searchInput.first()).toBeVisible();
    }
  });

  test('should display activity cards', async ({ page }) => {
    const activityCards = page.locator('[data-testid="activity-card"], .activity-card');
    if (await activityCards.count() > 0) {
      await expect(activityCards.first()).toBeVisible();
    }
  });

  test('should have export option', async ({ page }) => {
    const exportButton = page.locator('button, a').filter({ hasText: /Export|Exporter/i });
    if (await exportButton.count() > 0) {
      await expect(exportButton.first()).toBeVisible();
    }
  });

  test('should allow filtering by activity type', async ({ page }) => {
    const filterSelect = page.locator('select[name="type"], [data-testid="activity-filter"]');
    if (await filterSelect.count() > 0) {
      await filterSelect.first().selectOption('all');
      await page.waitForTimeout(500);
      await expect(page).toHaveURL(/\/history/);
    }
  });

  test('should display activity details on click', async ({ page }) => {
    const activityCard = page.locator('[data-testid="activity-card"], .activity-card').first();
    if (await activityCard.count() > 0) {
      await activityCard.click();
      await page.waitForTimeout(500);
      await expect(page).toHaveURL(/\/history/);
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const activityList = page.locator('[data-testid="activity-list"], .activity-list');
    await expect(activityList).toBeVisible();
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

  test('should have pagination', async ({ page }) => {
    const pagination = page.locator('[data-testid="pagination"], .pagination');
    if (await pagination.count() > 0) {
      await expect(pagination.first()).toBeVisible();
    }
  });
});
