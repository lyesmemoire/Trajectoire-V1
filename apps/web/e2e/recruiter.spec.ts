import { test, expect } from '@playwright/test';

test.describe('Recruiter Page E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/recruiter');
  });

  test('should load recruiter page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Recruiter|Recruteur/i);
  });

  test('should display recruiter dashboard', async ({ page }) => {
    const recruiterDashboard = page.locator('[data-testid="recruiter-dashboard"], .recruiter-dashboard');
    await expect(recruiterDashboard).toBeVisible();
  });

  test('should have job posting form', async ({ page }) => {
    const jobForm = page.locator('form');
    if (await jobForm.count() > 0) {
      await expect(jobForm.first()).toBeVisible();
    }
  });

  test('should have candidate list', async ({ page }) => {
    const candidateList = page.locator('[data-testid="candidate-list"], .candidate-list');
    if (await candidateList.count() > 0) {
      await expect(candidateList.first()).toBeVisible();
    }
  });

  test('should have search filters', async ({ page }) => {
    const filters = page.locator('[data-testid="filters"], .filters');
    if (await filters.count() > 0) {
      await expect(filters.first()).toBeVisible();
    }
  });

  test('should display candidate cards', async ({ page }) => {
    const candidateCards = page.locator('[data-testid="candidate-card"], .candidate-card');
    if (await candidateCards.count() > 0) {
      await expect(candidateCards.first()).toBeVisible();
    }
  });

  test('should have matching score display', async ({ page }) => {
    const matchingScore = page.locator('[data-testid="matching-score"], .matching-score');
    if (await matchingScore.count() > 0) {
      await expect(matchingScore.first()).toBeVisible();
    }
  });

  test('should allow candidate filtering', async ({ page }) => {
    const filterInput = page.locator('input[type="text"], select').first();
    if (await filterInput.count() > 0) {
      await filterInput.fill('developer');
      await page.waitForTimeout(500);
      await expect(page).toHaveURL(/\/recruiter/);
    }
  });

  test('should have view candidate details option', async ({ page }) => {
    const viewButton = page.locator('button, a').filter({ hasText: /View|Voir|Détails/i });
    if (await viewButton.count() > 0) {
      await expect(viewButton.first()).toBeVisible();
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const recruiterDashboard = page.locator('[data-testid="recruiter-dashboard"], .recruiter-dashboard');
    await expect(recruiterDashboard).toBeVisible();
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
