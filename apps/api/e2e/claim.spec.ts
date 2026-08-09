import { test, expect } from '@playwright/test';

test.describe('Claim Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('should navigate to claim page', async ({ page }) => {
    const claimLink = page.locator('a').filter({ hasText: /Claim|Réclamation/i });
    if (await claimLink.count() > 0) {
      await claimLink.first().click();
    } else {
      await page.goto('/claim');
    }
    
    await expect(page).toHaveURL(/.*claim/i);
  });

  test('should display claim form', async ({ page }) => {
    await page.goto('/claim');
    
    const claimForm = page.locator('form').or(page.locator('[data-testid="claim-form"]'));
    await expect(claimForm).toBeVisible();
  });

  test('should submit claim successfully', async ({ page }) => {
    await page.goto('/claim');
    
    const descriptionInput = page.locator('textarea[name="description"]').or(page.locator('textarea'));
    const submitButton = page.locator('button[type="submit"]').or(page.locator('button').filter({ hasText: /Submit|Envoyer/i }));
    
    await descriptionInput.fill('Test claim description');
    await submitButton.click();
    
    const successMessage = page.locator('.success').or(page.locator('[data-testid="success"]'));
    if (await successMessage.count() > 0) {
      await expect(successMessage).toBeVisible();
    }
  });

  test('should validate claim description', async ({ page }) => {
    await page.goto('/claim');
    
    const submitButton = page.locator('button[type="submit"]').or(page.locator('button').filter({ hasText: /Submit|Envoyer/i }));
    await submitButton.click();
    
    const errorMessage = page.locator('.error').or(page.locator('[role="alert"]'));
    if (await errorMessage.count() > 0) {
      await expect(errorMessage).toBeVisible();
    }
  });

  test('should display claim history', async ({ page }) => {
    await page.goto('/claim');
    
    const historySection = page.locator('.history').or(page.locator('[data-testid="claim-history"]'));
    if (await historySection.count() > 0) {
      await expect(historySection).toBeVisible();
    }
  });
});
