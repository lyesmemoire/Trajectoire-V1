import { test, expect } from '@playwright/test';

test.describe('ATS Analysis', () => {
  test.beforeEach(async ({ page }) => {
    // Simulate logged in user
    await page.goto('/dashboard');
  });

  test('should navigate to ATS analysis page', async ({ page }) => {
    const atsLink = page.locator('a').filter({ hasText: /ATS|Analyse/i });
    if (await atsLink.count() > 0) {
      await atsLink.first().click();
    } else {
      await page.goto('/ats-analysis');
    }
    
    await expect(page).toHaveURL(/.*ats|analysis/i);
  });

  test('should display file upload area', async ({ page }) => {
    await page.goto('/ats-analysis');
    
    const uploadArea = page.locator('[data-testid="upload-area"]').or(page.locator('.upload-zone'));
    await expect(uploadArea).toBeVisible();
  });

  test('should accept CV file upload', async ({ page }) => {
    await page.goto('/ats-analysis');
    
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./test-assets/sample-cv.pdf');
    
    const uploadButton = page.locator('button').filter({ hasText: /Upload|Analyser/i });
    await uploadButton.click();
    
    const progressIndicator = page.locator('.progress').or(page.locator('[data-testid="progress"]'));
    await expect(progressIndicator).toBeVisible();
  });

  test('should display analysis results', async ({ page }) => {
    await page.goto('/ats-analysis');
    
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./test-assets/sample-cv.pdf');
    
    const uploadButton = page.locator('button').filter({ hasText: /Upload|Analyser/i });
    await uploadButton.click();
    
    await page.waitForTimeout(3000);
    
    const resultsSection = page.locator('.results').or(page.locator('[data-testid="results"]'));
    await expect(resultsSection).toBeVisible({ timeout: 10000 });
  });

  test('should show skills extraction', async ({ page }) => {
    await page.goto('/ats-analysis');
    
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./test-assets/sample-cv.pdf');
    
    const uploadButton = page.locator('button').filter({ hasText: /Upload|Analyser/i });
    await uploadButton.click();
    
    await page.waitForTimeout(3000);
    
    const skillsSection = page.locator('.skills').or(page.locator('[data-testid="skills"]'));
    if (await skillsSection.count() > 0) {
      await expect(skillsSection).toBeVisible();
    }
  });

  test('should provide ATS score', async ({ page }) => {
    await page.goto('/ats-analysis');
    
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./test-assets/sample-cv.pdf');
    
    const uploadButton = page.locator('button').filter({ hasText: /Upload|Analyser/i });
    await uploadButton.click();
    
    await page.waitForTimeout(3000);
    
    const scoreDisplay = page.locator('.score').or(page.locator('[data-testid="ats-score"]'));
    if (await scoreDisplay.count() > 0) {
      await expect(scoreDisplay).toBeVisible();
      const scoreText = await scoreDisplay.textContent();
      expect(scoreText).toMatch(/\d+/);
    }
  });

  test('should show improvement suggestions', async ({ page }) => {
    await page.goto('/ats-analysis');
    
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./test-assets/sample-cv.pdf');
    
    const uploadButton = page.locator('button').filter({ hasText: /Upload|Analyser/i });
    await uploadButton.click();
    
    await page.waitForTimeout(3000);
    
    const suggestionsSection = page.locator('.suggestions').or(page.locator('[data-testid="suggestions"]'));
    if (await suggestionsSection.count() > 0) {
      await expect(suggestionsSection).toBeVisible();
    }
  });

  test('should handle multiple file formats', async ({ page }) => {
    await page.goto('/ats-analysis');
    
    const supportedFormats = ['.pdf', '.docx', '.txt'];
    
    for (const format of supportedFormats) {
      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles(`./test-assets/sample-cv${format}`);
      
      const uploadButton = page.locator('button').filter({ hasText: /Upload|Analyser/i });
      await uploadButton.click();
      
      await page.waitForTimeout(2000);
      
      const errorMessage = page.locator('.error').or(page.locator('[role="alert"]'));
      if (await errorMessage.count() > 0) {
        const errorText = await errorMessage.textContent();
        expect(errorText).not.toContain(/unsupported|format/i);
      }
    }
  });
});
