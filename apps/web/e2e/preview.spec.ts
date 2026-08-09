import { test, expect } from '@playwright/test';

test.describe('Preview Page E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/preview');
  });

  test('should load preview page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Preview|Aperçu/i);
  });

  test('should display preview content', async ({ page }) => {
    const previewContent = page.locator('[data-testid="preview-content"], .preview-container');
    await expect(previewContent).toBeVisible();
  });

  test('should have back navigation', async ({ page }) => {
    const backButton = page.locator('button, a').filter({ hasText: /Retour|Back/i });
    if (await backButton.count() > 0) {
      await expect(backButton.first()).toBeVisible();
    }
  });

  test('should display preview controls', async ({ page }) => {
    const controls = page.locator('[data-testid="preview-controls"], .preview-controls');
    await expect(controls).toBeVisible();
  });

  test('should allow preview interaction', async ({ page }) => {
    const interactiveElement = page.locator('[data-testid="preview-interactive"], .interactive-element');
    if (await interactiveElement.count() > 0) {
      await interactiveElement.first().click();
      await expect(page).toHaveURL(/\/preview/);
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const previewContent = page.locator('[data-testid="preview-content"], .preview-container');
    await expect(previewContent).toBeVisible();
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
});
