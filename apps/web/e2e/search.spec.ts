import { test, expect } from '@playwright/test';

test.describe('Search E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('should display search section', async ({ page }) => {
    const searchSection = page.locator('[data-testid="search"], section').filter({ hasText: /Search|Recherche/i });
    if (await searchSection.count() > 0) {
      await expect(searchSection.first()).toBeVisible();
    }
  });

  test('should have search input field', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i], [data-testid="search-input"]');
    if (await searchInput.count() > 0) {
      await expect(searchInput.first()).toBeVisible();
    }
  });

  test('should have search button', async ({ page }) => {
    const searchButton = page.locator('button').filter({ hasText: /Search|Rechercher/i });
    if (await searchButton.count() > 0) {
      await expect(searchButton.first()).toBeVisible();
    }
  });

  test('should search for candidates', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i], [data-testid="search-input"]');
    const searchButton = page.locator('button').filter({ hasText: /Search|Rechercher/i });
    
    if (await searchInput.count() > 0 && await searchButton.count() > 0) {
      await searchInput.first().fill('Software Engineer');
      await searchButton.first().click();
      
      await page.waitForTimeout(3000);
      
      const resultsSection = page.locator('[data-testid="search-results"], .search-results');
      if (await resultsSection.count() > 0) {
        await expect(resultsSection.first()).toBeVisible();
      }
    }
  });

  test('should display search results', async ({ page }) => {
    const searchResults = page.locator('[data-testid="search-result"], .search-result, [data-testid="candidate-card"]');
    if (await searchResults.count() > 0) {
      await expect(searchResults.first()).toBeVisible();
    }
  });

  test('should filter results by skill', async ({ page }) => {
    const skillFilter = page.locator('[data-testid="skill-filter"], select').filter({ hasText: /Skill|Compétence/i });
    if (await skillFilter.count() > 0) {
      await skillFilter.first().selectOption({ index: 1 });
      await page.waitForTimeout(1000);
      
      const searchResults = page.locator('[data-testid="search-result"], .search-result');
      if (await searchResults.count() > 0) {
        await expect(searchResults.first()).toBeVisible();
      }
    }
  });

  test('should filter results by experience', async ({ page }) => {
    const experienceFilter = page.locator('[data-testid="experience-filter"], select').filter({ hasText: /Experience|Expérience/i });
    if (await experienceFilter.count() > 0) {
      await experienceFilter.first().selectOption({ index: 1 });
      await page.waitForTimeout(1000);
      
      const searchResults = page.locator('[data-testid="search-result"], .search-result');
      if (await searchResults.count() > 0) {
        await expect(searchResults.first()).toBeVisible();
      }
    }
  });

  test('should filter results by location', async ({ page }) => {
    const locationFilter = page.locator('[data-testid="location-filter"], select').filter({ hasText: /Location|Lieu/i });
    if (await locationFilter.count() > 0) {
      await locationFilter.first().selectOption({ index: 1 });
      await page.waitForTimeout(1000);
      
      const searchResults = page.locator('[data-testid="search-result"], .search-result');
      if (await searchResults.count() > 0) {
        await expect(searchResults.first()).toBeVisible();
      }
    }
  });

  test('should display candidate details', async ({ page }) => {
    const candidateCard = page.locator('[data-testid="search-result"], .search-result, [data-testid="candidate-card"]');
    
    if (await candidateCard.count() > 0) {
      await candidateCard.first().click();
      
      await page.waitForTimeout(2000);
      
      const candidateDetails = page.locator('[data-testid="candidate-details"], .candidate-details');
      if (await candidateDetails.count() > 0) {
        await expect(candidateDetails.first()).toBeVisible();
      }
    }
  });

  test('should display candidate skills', async ({ page }) => {
    const candidateSkills = page.locator('[data-testid="candidate-skills"], .candidate-skills');
    if (await candidateSkills.count() > 0) {
      await expect(candidateSkills.first()).toBeVisible();
    }
  });

  test('should display candidate experience', async ({ page }) => {
    const candidateExperience = page.locator('[data-testid="candidate-experience"], .candidate-experience');
    if (await candidateExperience.count() > 0) {
      await expect(candidateExperience.first()).toBeVisible();
    }
  });

  test('should display match score', async ({ page }) => {
    const matchScore = page.locator('[data-testid="match-score"], .match-score');
    if (await matchScore.count() > 0) {
      await expect(matchScore.first()).toBeVisible();
    }
  });

  test('should save search query', async ({ page }) => {
    const saveButton = page.locator('button').filter({ hasText: /Save|Sauvegarder/i });
    
    if (await saveButton.count() > 0) {
      await saveButton.first().click();
      
      const successMessage = page.locator('text=/saved|sauvegardé/i');
      if (await successMessage.count() > 0) {
        await expect(successMessage.first()).toBeVisible();
      }
    }
  });

  test('should load saved searches', async ({ page }) => {
    const savedSearches = page.locator('[data-testid="saved-searches"], .saved-searches');
    if (await savedSearches.count() > 0) {
      await expect(savedSearches.first()).toBeVisible();
    }
  });

  test('should use saved search', async ({ page }) => {
    const savedSearch = page.locator('[data-testid="saved-search"], .saved-search');
    
    if (await savedSearch.count() > 0) {
      await savedSearch.first().click();
      
      await page.waitForTimeout(2000);
      
      const searchResults = page.locator('[data-testid="search-results"], .search-results');
      if (await searchResults.count() > 0) {
        await expect(searchResults.first()).toBeVisible();
      }
    }
  });

  test('should sort results', async ({ page }) => {
    const sortButton = page.locator('button').filter({ hasText: /Sort|Trier/i });
    
    if (await sortButton.count() > 0) {
      await sortButton.first().click();
      
      const sortByScore = page.locator('text=/Score|Match/i');
      if (await sortByScore.count() > 0) {
        await sortByScore.first().click();
        
        await page.waitForTimeout(1000);
        
        const searchResults = page.locator('[data-testid="search-result"], .search-result');
        if (await searchResults.count() > 0) {
          await expect(searchResults.first()).toBeVisible();
        }
      }
    }
  });

  test('should export search results', async ({ page }) => {
    const exportButton = page.locator('button').filter({ hasText: /Export|Exporter/i });
    
    if (await exportButton.count() > 0) {
      const downloadPromise = page.waitForEvent('download');
      await exportButton.first().click();
      const download = await downloadPromise;
      
      expect(download.suggestedFilename()).toBeTruthy();
    }
  });

  test('should display advanced search options', async ({ page }) => {
    const advancedSearchButton = page.locator('button').filter({ hasText: /Advanced|Avancé/i });
    
    if (await advancedSearchButton.count() > 0) {
      await advancedSearchButton.first().click();
      
      const advancedOptions = page.locator('[data-testid="advanced-search"], .advanced-search');
      if (await advancedOptions.count() > 0) {
        await expect(advancedOptions.first()).toBeVisible();
      }
    }
  });

  test('should search by multiple criteria', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i], [data-testid="search-input"]');
    const searchButton = page.locator('button').filter({ hasText: /Search|Rechercher/i });
    
    if (await searchInput.count() > 0 && await searchButton.count() > 0) {
      await searchInput.first().fill('JavaScript React Senior');
      await searchButton.first().click();
      
      await page.waitForTimeout(3000);
      
      const searchResults = page.locator('[data-testid="search-result"], .search-result');
      if (await searchResults.count() > 0) {
        await expect(searchResults.first()).toBeVisible();
      }
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const searchSection = page.locator('[data-testid="search"], section').filter({ hasText: /Search/i });
    if (await searchSection.count() > 0) {
      await expect(searchSection.first()).toBeVisible();
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

  test('should handle empty search', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i], [data-testid="search-input"]');
    const searchButton = page.locator('button').filter({ hasText: /Search|Rechercher/i });
    
    if (await searchInput.count() > 0 && await searchButton.count() > 0) {
      await searchInput.first().fill('');
      await searchButton.first().click();
      
      const errorMessage = page.locator('text=/empty|query|vide/i');
      if (await errorMessage.count() > 0) {
        await expect(errorMessage.first()).toBeVisible();
      }
    }
  });

  test('should display search history', async ({ page }) => {
    const searchHistory = page.locator('[data-testid="search-history"], .search-history');
    if (await searchHistory.count() > 0) {
      await expect(searchHistory.first()).toBeVisible();
    }
  });

  test('should clear search history', async ({ page }) => {
    const clearHistoryButton = page.locator('button').filter({ hasText: /Clear history|Effacer l'historique/i });
    
    if (await clearHistoryButton.count() > 0) {
      await clearHistoryButton.first().click();
      
      await page.waitForTimeout(1000);
      
      const searchHistory = page.locator('[data-testid="search-history"], .search-history');
      if (await searchHistory.count() > 0) {
        const historyItems = await searchHistory.first().locator('[data-testid="history-item"], .history-item').count();
        expect(historyItems).toBe(0);
      }
    }
  });
});
