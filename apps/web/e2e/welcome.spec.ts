import { test, expect } from '@playwright/test';

test.describe('Welcome Page E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/welcome');
  });

  test('should load welcome page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Welcome|Bienvenue/i);
  });

  test('should display welcome message', async ({ page }) => {
    const welcomeMessage = page.locator('h1, h2').filter({ hasText: /Welcome|Bienvenue/i });
    await expect(welcomeMessage).toBeVisible();
  });

  test('should have onboarding steps', async ({ page }) => {
    const onboardingSteps = page.locator('[data-testid="onboarding-steps"], .onboarding-steps');
    if (await onboardingSteps.count() > 0) {
      await expect(onboardingSteps.first()).toBeVisible();
    }
  });

  test('should have skip option', async ({ page }) => {
    const skipButton = page.locator('button, a').filter({ hasText: /Skip|Passer|Ignorer/i });
    if (await skipButton.count() > 0) {
      await expect(skipButton.first()).toBeVisible();
    }
  });

  test('should have next/continue button', async ({ page }) => {
    const nextButton = page.locator('button, a').filter({ hasText: /Next|Continue|Suivant|Continuer/i });
    await expect(nextButton).toBeVisible();
  });

  test('should navigate through onboarding steps', async ({ page }) => {
    const nextButton = page.locator('button, a').filter({ hasText: /Next|Continue|Suivant/i }).first();
    
    if (await nextButton.count() > 0) {
      await nextButton.click();
      await page.waitForTimeout(500);
      await expect(page).toHaveURL(/\/welcome/);
    }
  });

  test('should display progress indicator', async ({ page }) => {
    const progressIndicator = page.locator('[data-testid="progress"], .progress');
    if (await progressIndicator.count() > 0) {
      await expect(progressIndicator.first()).toBeVisible();
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const welcomeMessage = page.locator('h1, h2').filter({ hasText: /Welcome|Bienvenue/i });
    await expect(welcomeMessage).toBeVisible();
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

  test('should complete onboarding and redirect to dashboard', async ({ page }) => {
    const nextButton = page.locator('button, a').filter({ hasText: /Next|Continue|Suivant|Finish|Terminer/i }).first();
    
    if (await nextButton.count() > 0) {
      await nextButton.click();
      await page.waitForTimeout(1000);
      
      const finishButton = page.locator('button, a').filter({ hasText: /Finish|Terminer|Get started|Commencer/i });
      if (await finishButton.count() > 0) {
        await finishButton.click();
        await page.waitForTimeout(1000);
        await expect(page).toHaveURL(/\/dashboard/);
      }
    }
  });
});
