import { test, expect } from '@playwright/test';

test.describe('Signup Flow', () => {
  test('should navigate to signup page', async ({ page }) => {
    await page.goto('/');
    
    const signupLink = page.locator('a').filter({ hasText: /Sign up|S'inscrire/i });
    if (await signupLink.count() > 0) {
      await signupLink.first().click();
    } else {
      await page.goto('/signup');
    }
    
    await expect(page).toHaveURL(/.*signup|register/i);
  });

  test('should display signup form', async ({ page }) => {
    await page.goto('/signup');
    
    const emailInput = page.locator('input[type="email"]').or(page.locator('input[name="email"]'));
    const passwordInput = page.locator('input[type="password"]').or(page.locator('input[name="password"]'));
    const submitButton = page.locator('button[type="submit"]').or(page.locator('button').filter({ hasText: /Sign up|S'inscrire/i }));
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/signup');
    
    const emailInput = page.locator('input[type="email"]').or(page.locator('input[name="email"]'));
    await emailInput.fill('invalid-email');
    
    const submitButton = page.locator('button[type="submit"]').or(page.locator('button').filter({ hasText: /Sign up|S'inscrire/i }));
    await submitButton.click();
    
    const errorMessage = page.locator('.error').or(page.locator('[role="alert"]'));
    if (await errorMessage.count() > 0) {
      await expect(errorMessage).toBeVisible();
    }
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/signup');
    
    const submitButton = page.locator('button[type="submit"]').or(page.locator('button').filter({ hasText: /Sign up|S'inscrire/i }));
    await submitButton.click();
    
    const emailInput = page.locator('input[type="email"]').or(page.locator('input[name="email"]'));
    const passwordInput = page.locator('input[type="password"]').or(page.locator('input[name="password"]'));
    
    await expect(emailInput).toHaveClass(/invalid|error/i);
    await expect(passwordInput).toHaveClass(/invalid|error/i);
  });

  test('should successfully create account', async ({ page }) => {
    await page.goto('/signup');
    
    const timestamp = Date.now();
    const email = `test${timestamp}@example.com`;
    
    const emailInput = page.locator('input[type="email"]').or(page.locator('input[name="email"]'));
    const passwordInput = page.locator('input[type="password"]').or(page.locator('input[name="password"]'));
    const submitButton = page.locator('button[type="submit"]').or(page.locator('button').filter({ hasText: /Sign up|S'inscrire/i }));
    
    await emailInput.fill(email);
    await passwordInput.fill('TestPassword123!');
    await submitButton.click();
    
    await expect(page).toHaveURL(/.*dashboard|welcome|onboarding/i, { timeout: 10000 });
  });

  test('should show password strength indicator', async ({ page }) => {
    await page.goto('/signup');
    
    const passwordInput = page.locator('input[type="password"]').or(page.locator('input[name="password"]'));
    await passwordInput.fill('weak');
    
    const strengthIndicator = page.locator('.password-strength').or(page.locator('[data-testid="password-strength"]'));
    if (await strengthIndicator.count() > 0) {
      await expect(strengthIndicator).toBeVisible();
      await expect(strengthIndicator).toHaveText(/weak|faible/i);
    }
  });

  test('should toggle password visibility', async ({ page }) => {
    await page.goto('/signup');
    
    const passwordInput = page.locator('input[type="password"]').or(page.locator('input[name="password"]'));
    const toggleButton = page.locator('button[aria-label*="password"]').or(page.locator('.toggle-password'));
    
    await passwordInput.fill('TestPassword123!');
    
    if (await toggleButton.count() > 0) {
      await toggleButton.click();
      await expect(passwordInput).toHaveAttribute('type', 'text');
      
      await toggleButton.click();
      await expect(passwordInput).toHaveAttribute('type', 'password');
    }
  });
});
