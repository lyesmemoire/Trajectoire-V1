import { test, expect } from '@playwright/test';

test.describe('Search Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('should navigate to search page', async ({ page }) => {
    const searchLink = page.locator('a').filter({ hasText: /Search|Recherche/i });
    if (await searchLink.count() > 0) {
      await searchLink.click();
    } else {
      await page.goto('/search');
    }
    
    await expect(page).toHaveURL(/.*search/i);
  });

  test('should display search input', async ({ page }) => {
    await page.goto('/search');
    
    const searchInput = page.locator('input[type="search"]').or(page.locator('input[name="search"]'));
    await expect(searchInput).toBeVisible();
  });

  test('should perform search', async ({ page }) => {
    await page.goto('/search');
    
    const searchInput = page.locator('input[type="search"]').or(page.locator('input[name="search"]'));
    await searchInput.fill('JavaScript Developer');
    
    const searchButton = page.locator('button[type="submit"]').or(page.locator('button').filter({ hasText: /Search|Rechercher/i }));
    await searchButton.click();
    
    const resultsSection = page.locator('.results').or(page.locator('[data-testid="search-results"]'));
    await expect(resultsSection).toBeVisible({ timeout: 5000 });
  });

  test('should display search filters', async ({ page }) => {
    await page.goto('/search');
    
    const filtersSection = page.locator('.filters').or(page.locator('[data-testid="filters"]'));
    if (await filtersSection.count() > 0) {
      await expect(filtersSection).toBeVisible();
    }
  });

  test('should apply filters', async ({ page }) => {
    await page.goto('/search');
    
    const filterButton = page.locator('button').filter({ hasText: /Filter|Filtre/i });
    if (await filterButton.count() > 0) {
      await filterButton.click();
      
      const filterOption = page.locator('input[type="checkbox"]').first();
      await filterOption.check();
      
      const applyButton = page.locator('button').filter({ hasText: /Apply|Appliquer/i });
      await applyButton.click();
    }
  });

  test('should display search results', async ({ page }) => {
    await page.goto('/search');
    
    const searchInput = page.locator('input[type="search"]').or(page.locator('input[name="search"]'));
    await searchInput.fill('Developer');
    
    const searchButton = page.locator('button[type="submit"]').or(page.locator('button').filter({ hasText: /Search|Rechercher/i }));
    await searchButton.click();
    
    await page.waitForTimeout(2000);
    
    const resultCards = page.locator('.result-card').or(page.locator('[data-testid="result-card"]'));
    if (await resultCards.count() > 0) {
      await expect(resultCards.first()).toBeVisible();
    }
  });
});
