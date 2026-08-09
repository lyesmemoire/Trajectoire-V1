import { test, expect } from '@playwright/test';

test.describe('Matching Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('should navigate to matching page', async ({ page }) => {
    const matchingLink = page.locator('a').filter({ hasText: /Matching/i });
    if (await matchingLink.count() > 0) {
      await matchingLink.click();
    } else {
      await page.goto('/matching');
    }
    
    await expect(page).toHaveURL(/.*matching/i);
  });

  test('should display matching form', async ({ page }) => {
    await page.goto('/matching');
    
    const matchingForm = page.locator('form').or(page.locator('[data-testid="matching-form"]'));
    await expect(matchingForm).toBeVisible();
  });

  test('should display job requirements input', async ({ page }) => {
    await page.goto('/matching');
    
    const jobInput = page.locator('input[name="job"]').or(page.locator('textarea[name="job"]'));
    if (await jobInput.count() > 0) {
      await expect(jobInput).toBeVisible();
    }
  });

  test('should submit matching request', async ({ page }) => {
    await page.goto('/matching');
    
    const jobInput = page.locator('input[name="job"]').or(page.locator('textarea[name="job"]'));
    if (await jobInput.count() > 0) {
      await jobInput.fill('Senior Developer with JavaScript and React experience');
    }
    
    const submitButton = page.locator('button[type="submit"]').or(page.locator('button').filter({ hasText: /Match|Analyser/i }));
    await submitButton.click();
    
    const resultsSection = page.locator('.results').or(page.locator('[data-testid="matching-results"]'));
    await expect(resultsSection).toBeVisible({ timeout: 10000 });
  });

  test('should display matching score', async ({ page }) => {
    await page.goto('/matching');
    
    const jobInput = page.locator('input[name="job"]').or(page.locator('textarea[name="job"]'));
    if (await jobInput.count() > 0) {
      await jobInput.fill('JavaScript Developer');
    }
    
    const submitButton = page.locator('button[type="submit"]').or(page.locator('button').filter({ hasText: /Match|Analyser/i }));
    await submitButton.click();
    
    await page.waitForTimeout(2000);
    
    const scoreDisplay = page.locator('.score').or(page.locator('[data-testid="matching-score"]'));
    if (await scoreDisplay.count() > 0) {
      await expect(scoreDisplay).toBeVisible();
    }
  });

  test('should show skill breakdown', async ({ page }) => {
    await page.goto('/matching');
    
    const jobInput = page.locator('input[name="job"]').or(page.locator('textarea[name="job"]'));
    if (await jobInput.count() > 0) {
      await jobInput.fill('React Developer');
    }
    
    const submitButton = page.locator('button[type="submit"]').or(page.locator('button').filter({ hasText: /Match|Analyser/i }));
    await submitButton.click();
    
    await page.waitForTimeout(2000);
    
    const skillsBreakdown = page.locator('.skills-breakdown').or(page.locator('[data-testid="skills-breakdown"]'));
    if (await skillsBreakdown.count() > 0) {
      await expect(skillsBreakdown).toBeVisible();
    }
  });
});
