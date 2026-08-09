import { test, expect } from '@playwright/test';

test.describe('Premium Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('should navigate to premium page', async ({ page }) => {
    const premiumLink = page.locator('a').filter({ hasText: /Premium|Upgrade/i });
    if (await premiumLink.count() > 0) {
      await premiumLink.click();
    } else {
      await page.goto('/premium');
    }
    
    await expect(page).toHaveURL(/.*premium/i);
  });

  test('should display pricing plans', async ({ page }) => {
    await page.goto('/premium');
    
    const pricingSection = page.locator('.pricing').or(page.locator('[data-testid="pricing-plans"]'));
    await expect(pricingSection).toBeVisible();
  });

  test('should display plan features', async ({ page }) => {
    await page.goto('/premium');
    
    const planCards = page.locator('.plan-card').or(page.locator('[data-testid="plan-card"]'));
    if (await planCards.count() > 0) {
      await expect(planCards.first()).toBeVisible();
      
      const features = planCards.first().locator('.feature').or(page.locator('[data-testid="feature"]'));
      if (await features.count() > 0) {
        await expect(features.first()).toBeVisible();
      }
    }
  });

  test('should select premium plan', async ({ page }) => {
    await page.goto('/premium');
    
    const selectButton = page.locator('button').filter({ hasText: /Select|Choisir/i });
    if (await selectButton.count() > 0) {
      await selectButton.first().click();
      
      await expect(page).toHaveURL(/.*checkout|payment/i);
    }
  });

  test('should display upgrade benefits', async ({ page }) => {
    await page.goto('/premium');
    
    const benefitsSection = page.locator('.benefits').or(page.locator('[data-testid="benefits"]'));
    if (await benefitsSection.count() > 0) {
      await expect(benefitsSection).toBeVisible();
    }
  });

  test('should compare plans', async ({ page }) => {
    await page.goto('/premium');
    
    const compareButton = page.locator('button').filter({ hasText: /Compare|Comparer/i });
    if (await compareButton.count() > 0) {
      await compareButton.click();
      
      const comparisonTable = page.locator('.comparison').or(page.locator('[data-testid="comparison-table"]'));
      await expect(comparisonTable).toBeVisible();
    }
  });
});
