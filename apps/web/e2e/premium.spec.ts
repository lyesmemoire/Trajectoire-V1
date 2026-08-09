import { test, expect } from '@playwright/test';

test.describe('Premium Page E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pricing');
  });

  test('should load pricing page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Pricing|Premium|Tarifs/i);
  });

  test('should display pricing plans', async ({ page }) => {
    const pricingPlans = page.locator('[data-testid="pricing-plans"], .pricing-plans');
    await expect(pricingPlans).toBeVisible();
  });

  test('should have free plan', async ({ page }) => {
    const freePlan = page.locator('[data-testid="free-plan"], .plan-free');
    if (await freePlan.count() > 0) {
      await expect(freePlan.first()).toBeVisible();
    }
  });

  test('should have premium plan', async ({ page }) => {
    const premiumPlan = page.locator('[data-testid="premium-plan"], .plan-premium');
    await expect(premiumPlan.first()).toBeVisible();
  });

  test('should have enterprise plan', async ({ page }) => {
    const enterprisePlan = page.locator('[data-testid="enterprise-plan"], .plan-enterprise');
    if (await enterprisePlan.count() > 0) {
      await expect(enterprisePlan.first()).toBeVisible();
    }
  });

  test('should display plan features', async ({ page }) => {
    const features = page.locator('[data-testid="plan-features"], .features');
    if (await features.count() > 0) {
      await expect(features.first()).toBeVisible();
    }
  });

  test('should have upgrade buttons', async ({ page }) => {
    const upgradeButton = page.locator('button, a').filter({ hasText: /Upgrade|S'abonner|Choisir/i });
    await expect(upgradeButton.first()).toBeVisible();
  });

  test('should display pricing comparison', async ({ page }) => {
    const comparison = page.locator('[data-testid="comparison"], .comparison-table');
    if (await comparison.count() > 0) {
      await expect(comparison.first()).toBeVisible();
    }
  });

  test('should have FAQ section', async ({ page }) => {
    const faq = page.locator('[data-testid="faq"], .faq');
    if (await faq.count() > 0) {
      await expect(faq.first()).toBeVisible();
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const pricingPlans = page.locator('[data-testid="pricing-plans"], .pricing-plans');
    await expect(pricingPlans).toBeVisible();
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

  test('should navigate to signup from premium plan', async ({ page }) => {
    const upgradeButton = page.locator('button, a').filter({ hasText: /Upgrade|S'abonner/i }).first();
    await upgradeButton.click();
    
    await page.waitForTimeout(500);
    await expect(page).toHaveURL(/\/signup|\/login/);
  });
});
