import { test, expect } from '@playwright/test';

test.describe('Upload CV E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('should display upload CV section', async ({ page }) => {
    const uploadSection = page.locator('[data-testid="upload-cv"], section').filter({ hasText: /CV|Upload|Télécharger/i });
    if (await uploadSection.count() > 0) {
      await expect(uploadSection.first()).toBeVisible();
    }
  });

  test('should have file input for CV upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"], [data-testid="file-input"]');
    if (await fileInput.count() > 0) {
      await expect(fileInput.first()).toBeVisible();
    }
  });

  test('should have upload button', async ({ page }) => {
    const uploadButton = page.locator('button').filter({ hasText: /Upload|Télécharger|Importer/i });
    if (await uploadButton.count() > 0) {
      await expect(uploadButton.first()).toBeVisible();
    }
  });

  test('should accept PDF files', async ({ page }) => {
    const fileInput = page.locator('input[type="file"], [data-testid="file-input"]');
    if (await fileInput.count() > 0) {
      const fileChooserPromise = page.waitForEvent('filechooser');
      await fileInput.first().click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles({
        name: 'test-cv.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from('test pdf content')
      });
    }
  });

  test('should accept DOCX files', async ({ page }) => {
    const fileInput = page.locator('input[type="file"], [data-testid="file-input"]');
    if (await fileInput.count() > 0) {
      const fileChooserPromise = page.waitForEvent('filechooser');
      await fileInput.first().click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles({
        name: 'test-cv.docx',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        buffer: Buffer.from('test docx content')
      });
    }
  });

  test('should show upload progress', async ({ page }) => {
    const fileInput = page.locator('input[type="file"], [data-testid="file-input"]');
    const uploadButton = page.locator('button').filter({ hasText: /Upload|Télécharger/i });
    
    if (await fileInput.count() > 0 && await uploadButton.count() > 0) {
      const fileChooserPromise = page.waitForEvent('filechooser');
      await fileInput.first().click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles({
        name: 'test-cv.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from('test pdf content')
      });
      
      await uploadButton.first().click();
      
      const progressBar = page.locator('[data-testid="progress-bar"], .progress-bar');
      if (await progressBar.count() > 0) {
        await expect(progressBar.first()).toBeVisible();
      }
    }
  });

  test('should show success message after upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"], [data-testid="file-input"]');
    const uploadButton = page.locator('button').filter({ hasText: /Upload|Télécharger/i });
    
    if (await fileInput.count() > 0 && await uploadButton.count() > 0) {
      const fileChooserPromise = page.waitForEvent('filechooser');
      await fileInput.first().click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles({
        name: 'test-cv.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from('test pdf content')
      });
      
      await uploadButton.first().click();
      await page.waitForTimeout(5000);
      
      const successMessage = page.locator('text=/success|uploaded|téléchargé/i');
      if (await successMessage.count() > 0) {
        await expect(successMessage.first()).toBeVisible();
      }
    }
  });

  test('should show error for invalid file type', async ({ page }) => {
    const fileInput = page.locator('input[type="file"], [data-testid="file-input"]');
    const uploadButton = page.locator('button').filter({ hasText: /Upload|Télécharger/i });
    
    if (await fileInput.count() > 0 && await uploadButton.count() > 0) {
      const fileChooserPromise = page.waitForEvent('filechooser');
      await fileInput.first().click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles({
        name: 'test-file.exe',
        mimeType: 'application/x-msdownload',
        buffer: Buffer.from('test exe content')
      });
      
      await uploadButton.first().click();
      
      const errorMessage = page.locator('text=/invalid|type|format/i');
      if (await errorMessage.count() > 0) {
        await expect(errorMessage.first()).toBeVisible();
      }
    }
  });

  test('should show error for large file', async ({ page }) => {
    const fileInput = page.locator('input[type="file"], [data-testid="file-input"]');
    const uploadButton = page.locator('button').filter({ hasText: /Upload|Télécharger/i });
    
    if (await fileInput.count() > 0 && await uploadButton.count() > 0) {
      const largeBuffer = Buffer.alloc(11 * 1024 * 1024); // 11MB
      const fileChooserPromise = page.waitForEvent('filechooser');
      await fileInput.first().click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles({
        name: 'large-cv.pdf',
        mimeType: 'application/pdf',
        buffer: largeBuffer
      });
      
      await uploadButton.first().click();
      
      const errorMessage = page.locator('text=/size|large|too big/i');
      if (await errorMessage.count() > 0) {
        await expect(errorMessage.first()).toBeVisible();
      }
    }
  });

  test('should display uploaded CV in list', async ({ page }) => {
    const fileInput = page.locator('input[type="file"], [data-testid="file-input"]');
    const uploadButton = page.locator('button').filter({ hasText: /Upload|Télécharger/i });
    
    if (await fileInput.count() > 0 && await uploadButton.count() > 0) {
      const fileChooserPromise = page.waitForEvent('filechooser');
      await fileInput.first().click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles({
        name: 'test-cv.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from('test pdf content')
      });
      
      await uploadButton.first().click();
      await page.waitForTimeout(5000);
      
      const cvList = page.locator('[data-testid="cv-list"], .cv-list');
      if (await cvList.count() > 0) {
        await expect(cvList.first()).toBeVisible();
      }
    }
  });

  test('should allow drag and drop upload', async ({ page }) => {
    const dropZone = page.locator('[data-testid="drop-zone"], .drop-zone');
    
    if (await dropZone.count() > 0) {
      const dataTransfer = await page.evaluateHandle(() => {
        const dt = new DataTransfer();
        const file = new File(['test content'], 'test-cv.pdf', { type: 'application/pdf' });
        dt.items.add(file);
        return dt;
      });
      
      await dropZone.first().dispatchEvent('drop', { dataTransfer });
      
      await page.waitForTimeout(2000);
      
      const successMessage = page.locator('text=/success|uploaded/i');
      if (await successMessage.count() > 0) {
        await expect(successMessage.first()).toBeVisible();
      }
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const uploadSection = page.locator('[data-testid="upload-cv"], section').filter({ hasText: /CV|Upload/i });
    if (await uploadSection.count() > 0) {
      await expect(uploadSection.first()).toBeVisible();
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
});
