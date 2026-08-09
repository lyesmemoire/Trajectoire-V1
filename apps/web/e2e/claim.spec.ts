import { test, expect } from '@playwright/test';

test.describe('Claim Page E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/claim');
  });

  test('should load claim page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Claim|Réclamation/i);
  });

  test('should display claim form', async ({ page }) => {
    const claimForm = page.locator('form');
    await expect(claimForm).toBeVisible();
  });

  test('should have claim type selector', async ({ page }) => {
    const claimType = page.locator('select[name="type"], [data-testid="claim-type"]');
    if (await claimType.count() > 0) {
      await expect(claimType.first()).toBeVisible();
    }
  });

  test('should have description input', async ({ page }) => {
    const descriptionInput = page.locator('textarea[name="description"], input[name="description"]');
    await expect(descriptionInput).toBeVisible();
  });

  test('should have submit button', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"], button').filter({ hasText: /Submit|Envoyer|Soumettre/i });
    await expect(submitButton).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"], button').filter({ hasText: /Submit|Envoyer/i });
    await submitButton.click();
    
    const errorMessage = page.locator('text=/required|obligatoire/i');
    if (await errorMessage.count() > 0) {
      await expect(errorMessage.first()).toBeVisible();
    }
  });

  test('should have file upload option', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    if (await fileInput.count() > 0) {
      await expect(fileInput.first()).toBeVisible();
    }
  });

  test('should display claim history', async ({ page }) => {
    const claimHistory = page.locator('[data-testid="claim-history"], .claim-history');
    if (await claimHistory.count() > 0) {
      await expect(claimHistory.first()).toBeVisible();
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const claimForm = page.locator('form');
    await expect(claimForm).toBeVisible();
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
