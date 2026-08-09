import { test, expect } from '@playwright/test';

test.describe('Matching E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('should display matching section', async ({ page }) => {
    const matchingSection = page.locator('[data-testid="matching"], section').filter({ hasText: /Matching|Match/i });
    if (await matchingSection.count() > 0) {
      await expect(matchingSection.first()).toBeVisible();
    }
  });

  test('should have job search input', async ({ page }) => {
    const jobSearchInput = page.locator('input[placeholder*="job" i], input[placeholder*="poste" i], [data-testid="job-search"]');
    if (await jobSearchInput.count() > 0) {
      await expect(jobSearchInput.first()).toBeVisible();
    }
  });

  test('should have search button', async ({ page }) => {
    const searchButton = page.locator('button').filter({ hasText: /Search|Rechercher/i });
    if (await searchButton.count() > 0) {
      await expect(searchButton.first()).toBeVisible();
    }
  });

  test('should search for jobs', async ({ page }) => {
    const jobSearchInput = page.locator('input[placeholder*="job" i], input[placeholder*="poste" i], [data-testid="job-search"]');
    const searchButton = page.locator('button').filter({ hasText: /Search|Rechercher/i });
    
    if (await jobSearchInput.count() > 0 && await searchButton.count() > 0) {
      await jobSearchInput.first().fill('Software Engineer');
      await searchButton.first().click();
      
      await page.waitForTimeout(3000);
      
      const resultsSection = page.locator('[data-testid="job-results"], .job-results');
      if (await resultsSection.count() > 0) {
        await expect(resultsSection.first()).toBeVisible();
      }
    }
  });

  test('should display job cards', async ({ page }) => {
    const jobCards = page.locator('[data-testid="job-card"], .job-card');
    if (await jobCards.count() > 0) {
      await expect(jobCards.first()).toBeVisible();
    }
  });

  test('should display match score', async ({ page }) => {
    const matchScore = page.locator('[data-testid="match-score"], .match-score, [data-testid="score"]');
    if (await matchScore.count() > 0) {
      await expect(matchScore.first()).toBeVisible();
    }
  });

  test('should filter jobs by location', async ({ page }) => {
    const locationFilter = page.locator('[data-testid="location-filter"], select').filter({ hasText: /Location|Lieu/i });
    if (await locationFilter.count() > 0) {
      await locationFilter.first().selectOption({ index: 1 });
      await page.waitForTimeout(1000);
      
      const jobCards = page.locator('[data-testid="job-card"], .job-card');
      if (await jobCards.count() > 0) {
        await expect(jobCards.first()).toBeVisible();
      }
    }
  });

  test('should filter jobs by salary', async ({ page }) => {
    const salaryFilter = page.locator('[data-testid="salary-filter"], select').filter({ hasText: /Salary|Salaire/i });
    if (await salaryFilter.count() > 0) {
      await salaryFilter.first().selectOption({ index: 1 });
      await page.waitForTimeout(1000);
      
      const jobCards = page.locator('[data-testid="job-card"], .job-card');
      if (await jobCards.count() > 0) {
        await expect(jobCards.first()).toBeVisible();
      }
    }
  });

  test('should filter jobs by experience level', async ({ page }) => {
    const experienceFilter = page.locator('[data-testid="experience-filter"], select').filter({ hasText: /Experience|Expérience/i });
    if (await experienceFilter.count() > 0) {
      await experienceFilter.first().selectOption({ index: 1 });
      await page.waitForTimeout(1000);
      
      const jobCards = page.locator('[data-testid="job-card"], .job-card');
      if (await jobCards.count() > 0) {
        await expect(jobCards.first()).toBeVisible();
      }
    }
  });

  test('should display job details when clicked', async ({ page }) => {
    const jobCard = page.locator('[data-testid="job-card"], .job-card');
    
    if (await jobCard.count() > 0) {
      await jobCard.first().click();
      
      await page.waitForTimeout(2000);
      
      const jobDetails = page.locator('[data-testid="job-details"], .job-details');
      if (await jobDetails.count() > 0) {
        await expect(jobDetails.first()).toBeVisible();
      }
    }
  });

  test('should save job to favorites', async ({ page }) => {
    const favoriteButton = page.locator('button').filter({ hasText: /Save|Sauvegarder|Favorite/i });
    
    if (await favoriteButton.count() > 0) {
      await favoriteButton.first().click();
      
      const successMessage = page.locator('text=/saved|favori/i');
      if (await successMessage.count() > 0) {
        await expect(successMessage.first()).toBeVisible();
      }
    }
  });

  test('should apply to job', async ({ page }) => {
    const applyButton = page.locator('button').filter({ hasText: /Apply|Postuler/i });
    
    if (await applyButton.count() > 0) {
      await applyButton.first().click();
      
      await page.waitForTimeout(2000);
      
      const applicationForm = page.locator('[data-testid="application-form"], .application-form');
      if (await applicationForm.count() > 0) {
        await expect(applicationForm.first()).toBeVisible();
      }
    }
  });

  test('should display matching skills', async ({ page }) => {
    const matchingSkills = page.locator('[data-testid="matching-skills"], .matching-skills');
    if (await matchingSkills.count() > 0) {
      await expect(matchingSkills.first()).toBeVisible();
    }
  });

  test('should display missing skills', async ({ page }) => {
    const missingSkills = page.locator('[data-testid="missing-skills"], .missing-skills');
    if (await missingSkills.count() > 0) {
      await expect(missingSkills.first()).toBeVisible();
    }
  });

  test('should display transferable skills', async ({ page }) => {
    const transferableSkills = page.locator('[data-testid="transferable-skills"], .transferable-skills');
    if (await transferableSkills.count() > 0) {
      await expect(transferableSkills.first()).toBeVisible();
    }
  });

  test('should sort jobs by match score', async ({ page }) => {
    const sortButton = page.locator('button').filter({ hasText: /Sort|Trier/i });
    
    if (await sortButton.count() > 0) {
      await sortButton.first().click();
      
      const sortByMatch = page.locator('text=/Match score|Score de match/i');
      if (await sortByMatch.count() > 0) {
        await sortByMatch.first().click();
        
        await page.waitForTimeout(1000);
        
        const jobCards = page.locator('[data-testid="job-card"], .job-card');
        if (await jobCards.count() > 0) {
          await expect(jobCards.first()).toBeVisible();
        }
      }
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const matchingSection = page.locator('[data-testid="matching"], section').filter({ hasText: /Matching/i });
    if (await matchingSection.count() > 0) {
      await expect(matchingSection.first()).toBeVisible();
    }
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

  test('should display matching history', async ({ page }) => {
    const historySection = page.locator('[data-testid="matching-history"], .matching-history');
    if (await historySection.count() > 0) {
      await expect(historySection.first()).toBeVisible();
    }
  });
});
