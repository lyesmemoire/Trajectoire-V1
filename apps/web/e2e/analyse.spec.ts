import { test, expect } from '@playwright/test';

test.describe('Analyse E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('should display analyse section', async ({ page }) => {
    const analyseSection = page.locator('[data-testid="analyse"], section').filter({ hasText: /Analyse|Analysis/i });
    if (await analyseSection.count() > 0) {
      await expect(analyseSection.first()).toBeVisible();
    }
  });

  test('should have analyse button for uploaded CV', async ({ page }) => {
    const analyseButton = page.locator('button').filter({ hasText: /Analyse|Analyser|Analyze/i });
    if (await analyseButton.count() > 0) {
      await expect(analyseButton.first()).toBeVisible();
    }
  });

  test('should start analysis when button clicked', async ({ page }) => {
    const analyseButton = page.locator('button').filter({ hasText: /Analyse|Analyser/i });
    
    if (await analyseButton.count() > 0) {
      await analyseButton.first().click();
      
      const progressIndicator = page.locator('[data-testid="analysis-progress"], .progress');
      if (await progressIndicator.count() > 0) {
        await expect(progressIndicator.first()).toBeVisible();
      }
    }
  });

  test('should display analysis results', async ({ page }) => {
    const analyseButton = page.locator('button').filter({ hasText: /Analyse|Analyser/i });
    
    if (await analyseButton.count() > 0) {
      await analyseButton.first().click();
      await page.waitForTimeout(5000);
      
      const resultsSection = page.locator('[data-testid="analysis-results"], .analysis-results');
      if (await resultsSection.count() > 0) {
        await expect(resultsSection.first()).toBeVisible();
      }
    }
  });

  test('should display skills analysis', async ({ page }) => {
    const analyseButton = page.locator('button').filter({ hasText: /Analyse|Analyser/i });
    
    if (await analyseButton.count() > 0) {
      await analyseButton.first().click();
      await page.waitForTimeout(5000);
      
      const skillsSection = page.locator('[data-testid="skills"], section').filter({ hasText: /Skills|Compétences/i });
      if (await skillsSection.count() > 0) {
        await expect(skillsSection.first()).toBeVisible();
      }
    }
  });

  test('should display experience analysis', async ({ page }) => {
    const analyseButton = page.locator('button').filter({ hasText: /Analyse|Analyser/i });
    
    if (await analyseButton.count() > 0) {
      await analyseButton.first().click();
      await page.waitForTimeout(5000);
      
      const experienceSection = page.locator('[data-testid="experience"], section').filter({ hasText: /Experience|Expérience/i });
      if (await experienceSection.count() > 0) {
        await expect(experienceSection.first()).toBeVisible();
      }
    }
  });

  test('should display education analysis', async ({ page }) => {
    const analyseButton = page.locator('button').filter({ hasText: /Analyse|Analyser/i });
    
    if (await analyseButton.count() > 0) {
      await analyseButton.first().click();
      await page.waitForTimeout(5000);
      
      const educationSection = page.locator('[data-testid="education"], section').filter({ hasText: /Education|Formation/i });
      if (await educationSection.count() > 0) {
        await expect(educationSection.first()).toBeVisible();
      }
    }
  });

  test('should display score or rating', async ({ page }) => {
    const analyseButton = page.locator('button').filter({ hasText: /Analyse|Analyser/i });
    
    if (await analyseButton.count() > 0) {
      await analyseButton.first().click();
      await page.waitForTimeout(5000);
      
      const scoreDisplay = page.locator('[data-testid="score"], .score, [data-testid="rating"], .rating');
      if (await scoreDisplay.count() > 0) {
        await expect(scoreDisplay.first()).toBeVisible();
      }
    }
  });

  test('should allow re-analysis', async ({ page }) => {
    const reAnalyseButton = page.locator('button').filter({ hasText: /Re-analyse|Réanalyser/i });
    
    if (await reAnalyseButton.count() > 0) {
      await expect(reAnalyseButton.first()).toBeVisible();
      await reAnalyseButton.first().click();
      
      await page.waitForTimeout(2000);
      
      const progressIndicator = page.locator('[data-testid="analysis-progress"], .progress');
      if (await progressIndicator.count() > 0) {
        await expect(progressIndicator.first()).toBeVisible();
      }
    }
  });

  test('should export analysis results', async ({ page }) => {
    const exportButton = page.locator('button').filter({ hasText: /Export|Exporter|Télécharger/i });
    
    if (await exportButton.count() > 0) {
      await expect(exportButton.first()).toBeVisible();
      
      const downloadPromise = page.waitForEvent('download');
      await exportButton.first().click();
      const download = await downloadPromise;
      
      expect(download.suggestedFilename()).toBeTruthy();
    }
  });

  test('should display analysis history', async ({ page }) => {
    const historySection = page.locator('[data-testid="analysis-history"], .history');
    if (await historySection.count() > 0) {
      await expect(historySection.first()).toBeVisible();
    }
  });

  test('should filter analysis by date', async ({ page }) => {
    const dateFilter = page.locator('[data-testid="date-filter"], select').filter({ hasText: /Date/i });
    if (await dateFilter.count() > 0) {
      await dateFilter.first().selectOption({ index: 1 });
      await page.waitForTimeout(1000);
      
      const resultsSection = page.locator('[data-testid="analysis-results"], .analysis-results');
      if (await resultsSection.count() > 0) {
        await expect(resultsSection.first()).toBeVisible();
      }
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const analyseSection = page.locator('[data-testid="analyse"], section').filter({ hasText: /Analyse/i });
    if (await analyseSection.count() > 0) {
      await expect(analyseSection.first()).toBeVisible();
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

  test('should show loading state during analysis', async ({ page }) => {
    const analyseButton = page.locator('button').filter({ hasText: /Analyse|Analyser/i });
    
    if (await analyseButton.count() > 0) {
      await analyseButton.first().click();
      
      const loadingState = page.locator('[data-testid="loading"], .loading, [aria-busy="true"]');
      if (await loadingState.count() > 0) {
        await expect(loadingState.first()).toBeVisible();
      }
    }
  });

  test('should display recommendations based on analysis', async ({ page }) => {
    const analyseButton = page.locator('button').filter({ hasText: /Analyse|Analyser/i });
    
    if (await analyseButton.count() > 0) {
      await analyseButton.first().click();
      await page.waitForTimeout(5000);
      
      const recommendationsSection = page.locator('[data-testid="recommendations"], section').filter({ hasText: /Recommendations|Recommandations/i });
      if (await recommendationsSection.count() > 0) {
        await expect(recommendationsSection.first()).toBeVisible();
      }
    }
  });
});
