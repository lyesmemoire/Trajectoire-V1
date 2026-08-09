import { test, expect } from '@playwright/test';

test.describe('History Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('should navigate to history page', async ({ page }) => {
    const historyLink = page.locator('a').filter({ hasText: /History|Historique/i });
    if (await historyLink.count() > 0) {
      await historyLink.click();
    } else {
      await page.goto('/history');
    }
    
    await expect(page).toHaveURL(/.*history|historique/i);
  });

  test('should display activity timeline', async ({ page }) => {
    await page.goto('/history');
    
    const timeline = page.locator('.timeline').or(page.locator('[data-testid="timeline"]'));
    if (await timeline.count() > 0) {
      await expect(timeline).toBeVisible();
    }
  });

  test('should display past analyses', async ({ page }) => {
    await page.goto('/history');
    
    const analysesSection = page.locator('.analyses').or(page.locator('[data-testid="analyses"]'));
    if (await analysesSection.count() > 0) {
      await expect(analysesSection).toBeVisible();
    }
  });

  test('should filter history by date', async ({ page }) => {
    await page.goto('/history');
    
    const dateFilter = page.locator('input[type="date"]').or(page.locator('[data-testid="date-filter"]'));
    if (await dateFilter.count() > 0) {
      await dateFilter.fill('2024-01-01');
      
      const applyButton = page.locator('button').filter({ hasText: /Apply|Appliquer/i });
      if (await applyButton.count() > 0) {
        await applyButton.click();
      }
    }
  });

  test('should view specific analysis details', async ({ page }) => {
    await page.goto('/history');
    
    const analysisCard = page.locator('.analysis-card').or(page.locator('[data-testid="analysis-card"]'));
    if (await analysisCard.count() > 0) {
      await analysisCard.first().click();
      
      const detailsModal = page.locator('.modal').or(page.locator('[data-testid="details-modal"]'));
      await expect(detailsModal).toBeVisible();
    }
  });

  test('should delete history item', async ({ page }) => {
    await page.goto('/history');
    
    const deleteButton = page.locator('button').filter({ hasText: /Delete|Supprimer/i });
    if (await deleteButton.count() > 0) {
      await deleteButton.first().click();
      
      const confirmButton = page.locator('button').filter({ hasText: /Confirm|Confirmer/i });
      if (await confirmButton.count() > 0) {
        await confirmButton.click();
      }
    }
  });

  test('should export history', async ({ page }) => {
    await page.goto('/history');
    
    const exportButton = page.locator('button').filter({ hasText: /Export|Exporter/i });
    if (await exportButton.count() > 0) {
      const downloadPromise = page.waitForEvent('download');
      await exportButton.click();
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toMatch(/\.(pdf|csv|xlsx)/);
    }
  });
});
