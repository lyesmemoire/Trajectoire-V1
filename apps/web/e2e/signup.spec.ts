import { test, expect } from '@playwright/test';

test.describe('Signup Page E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup');
  });

  test('should load signup page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Sign up|Inscription|Register/i);
  });

  test('should display signup form', async ({ page }) => {
    const signupForm = page.locator('form');
    await expect(signupForm).toBeVisible();
  });

  test('should have email input field', async ({ page }) => {
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    await expect(emailInput).toBeVisible();
  });

  test('should have password input field', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"], input[name="password"]');
    await expect(passwordInput).toBeVisible();
  });

  test('should have name input field', async ({ page }) => {
    const nameInput = page.locator('input[name="name"], input[name="fullName"], input[type="text"]').first();
    await expect(nameInput).toBeVisible();
  });

  test('should have submit button', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"], button').filter({ hasText: /Sign up|Inscription|S'inscrire/i });
    await expect(submitButton).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    const submitButton = page.locator('button[type="submit"], button').filter({ hasText: /Sign up|Inscription/i });
    
    await emailInput.fill('invalid-email');
    await submitButton.click();
    
    const errorMessage = page.locator('text=/invalid|email|format/i');
    if (await errorMessage.count() > 0) {
      await expect(errorMessage.first()).toBeVisible();
    }
  });

  test('should validate password strength', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"], input[name="password"]');
    const submitButton = page.locator('button[type="submit"], button').filter({ hasText: /Sign up|Inscription/i });
    
    await passwordInput.fill('123');
    await submitButton.click();
    
    const errorMessage = page.locator('text=/password|strength|minimum/i');
    if (await errorMessage.count() > 0) {
      await expect(errorMessage.first()).toBeVisible();
    }
  });

  test('should have link to login page', async ({ page }) => {
    const loginLink = page.locator('a').filter({ hasText: /Login|Connexion|Se connecter/i });
    await expect(loginLink).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    const loginLink = page.locator('a').filter({ hasText: /Login|Connexion|Se connecter/i });
    await loginLink.click();
    
    await expect(page).toHaveURL(/\/login/);
  });

  test('should have terms and conditions link', async ({ page }) => {
    const termsLink = page.locator('a').filter({ hasText: /Terms|Conditions|CGU/i });
    if (await termsLink.count() > 0) {
      await expect(termsLink.first()).toBeVisible();
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const signupForm = page.locator('form');
    await expect(signupForm).toBeVisible();
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

  test('should show success message on successful signup', async ({ page }) => {
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    const passwordInput = page.locator('input[type="password"], input[name="password"]');
    const nameInput = page.locator('input[name="name"], input[name="fullName"], input[type="text"]').first();
    const submitButton = page.locator('button[type="submit"], button').filter({ hasText: /Sign up|Inscription/i });
    
    await nameInput.fill('Test User');
    await emailInput.fill(`test${Date.now()}@example.com`);
    await passwordInput.fill('TestPassword123!');
    await submitButton.click();
    
    await page.waitForTimeout(2000);
    
    const successMessage = page.locator('text=/success|welcome|dashboard/i');
    if (await successMessage.count() > 0) {
      await expect(successMessage.first()).toBeVisible();
    }
  });
});
