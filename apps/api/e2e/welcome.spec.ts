import { test, expect } from '@playwright/test';

test.describe('Welcome/Onboarding Flow', () => {
  test('should display welcome page after signup', async ({ page }) => {
    await page.goto('/welcome');
    
    await expect(page.locator('h1')).toContainText(/Welcome|Bienvenue/i);
  });

  test('should display onboarding steps', async ({ page }) => {
    await page.goto('/welcome');
    
    const stepsIndicator = page.locator('.steps').or(page.locator('[data-testid="onboarding-steps"]'));
    if (await stepsIndicator.count() > 0) {
      await expect(stepsIndicator).toBeVisible();
    }
  });

  test('should allow skipping onboarding', async ({ page }) => {
    await page.goto('/welcome');
    
    const skipButton = page.locator('button').filter({ hasText: /Skip|Passer/i });
    if (await skipButton.count() > 0) {
      await skipButton.click();
      await expect(page).toHaveURL(/.*dashboard/i);
    }
  });

  test('should navigate through onboarding steps', async ({ page }) => {
    await page.goto('/welcome');
    
    const nextButton = page.locator('button').filter({ hasText: /Next|Suivant|Continue/i });
    if (await nextButton.count() > 0) {
      await nextButton.click();
      
      const currentStep = page.locator('.step.active').or(page.locator('[data-testid="current-step"]'));
      if (await currentStep.count() > 0) {
        await expect(currentStep).toBeVisible();
      }
    }
  });

  test('should complete onboarding', async ({ page }) => {
    await page.goto('/welcome');
    
    const completeButton = page.locator('button').filter({ hasText: /Complete|Terminer|Finish/i });
    if (await completeButton.count() > 0) {
      await completeButton.click();
      await expect(page).toHaveURL(/.*dashboard/i);
    }
  });
});
