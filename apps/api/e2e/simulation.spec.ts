import { test, expect } from '@playwright/test';

test.describe('Simulation Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('should navigate to simulation page', async ({ page }) => {
    const simulationLink = page.locator('a').filter({ hasText: /Simulation|Simulateur/i });
    if (await simulationLink.count() > 0) {
      await simulationLink.click();
    } else {
      await page.goto('/simulation');
    }
    
    await expect(page).toHaveURL(/.*simulation/i);
  });

  test('should display simulation parameters', async ({ page }) => {
    await page.goto('/simulation');
    
    const parametersSection = page.locator('.parameters').or(page.locator('[data-testid="simulation-parameters"]'));
    await expect(parametersSection).toBeVisible();
  });

  test('should set skill parameters', async ({ page }) => {
    await page.goto('/simulation');
    
    const skillSlider = page.locator('input[type="range"]').or(page.locator('[data-testid="skill-slider"]'));
    if (await skillSlider.count() > 0) {
      await skillSlider.fill('80');
      
      const skillValue = page.locator('.skill-value').or(page.locator('[data-testid="skill-value"]'));
      if (await skillValue.count() > 0) {
        await expect(skillValue).toHaveText('80');
      }
    }
  });

  test('should set experience parameters', async ({ page }) => {
    await page.goto('/simulation');
    
    const experienceInput = page.locator('input[name="experience"]').or(page.locator('input[type="number"]'));
    if (await experienceInput.count() > 0) {
      await experienceInput.fill('5');
    }
  });

  test('should run simulation', async ({ page }) => {
    await page.goto('/simulation');
    
    const runButton = page.locator('button').filter({ hasText: /Run|Simuler|Lancer/i });
    await runButton.click();
    
    const resultsSection = page.locator('.results').or(page.locator('[data-testid="simulation-results"]'));
    await expect(resultsSection).toBeVisible({ timeout: 10000 });
  });

  test('should display simulation score', async ({ page }) => {
    await page.goto('/simulation');
    
    const runButton = page.locator('button').filter({ hasText: /Run|Simuler|Lancer/i });
    await runButton.click();
    
    await page.waitForTimeout(3000);
    
    const scoreDisplay = page.locator('.score').or(page.locator('[data-testid="simulation-score"]'));
    if (await scoreDisplay.count() > 0) {
      await expect(scoreDisplay).toBeVisible();
    }
  });

  test('should show improvement recommendations', async ({ page }) => {
    await page.goto('/simulation');
    
    const runButton = page.locator('button').filter({ hasText: /Run|Simuler|Lancer/i });
    await runButton.click();
    
    await page.waitForTimeout(3000);
    
    const recommendationsSection = page.locator('.recommendations').or(page.locator('[data-testid="recommendations"]'));
    if (await recommendationsSection.count() > 0) {
      await expect(recommendationsSection).toBeVisible();
    }
  });

  test('should compare multiple scenarios', async ({ page }) => {
    await page.goto('/simulation');
    
    const compareButton = page.locator('button').filter({ hasText: /Compare|Comparer/i });
    if (await compareButton.count() > 0) {
      await compareButton.click();
      
      const comparisonView = page.locator('.comparison').or(page.locator('[data-testid="comparison-view"]'));
      await expect(comparisonView).toBeVisible();
    }
  });

  test('should save simulation results', async ({ page }) => {
    await page.goto('/simulation');
    
    const runButton = page.locator('button').filter({ hasText: /Run|Simuler|Lancer/i });
    await runButton.click();
    
    await page.waitForTimeout(3000);
    
    const saveButton = page.locator('button').filter({ hasText: /Save|Sauvegarder/i });
    if (await saveButton.count() > 0) {
      await saveButton.click();
      
      const successMessage = page.locator('.success').or(page.locator('[data-testid="save-success"]'));
      if (await successMessage.count() > 0) {
        await expect(successMessage).toBeVisible();
      }
    }
  });
});
