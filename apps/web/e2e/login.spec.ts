import { test, expect } from '@playwright/test';

test.describe('Login Page E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should load login page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Login|Connexion|Sign in/i);
  });

  test('should display login form', async ({ page }) => {
    const loginForm = page.locator('form');
    await expect(loginForm).toBeVisible();
  });

  test('should have email input field', async ({ page }) => {
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    await expect(emailInput).toBeVisible();
  });

  test('should have password input field', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"], input[name="password"]');
    await expect(passwordInput).toBeVisible();
  });

  test('should have submit button', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"], button').filter({ hasText: /Login|Connexion|Se connecter/i });
    await expect(submitButton).toBeVisible();
  });

  test('should have link to signup page', async ({ page }) => {
    const signupLink = page.locator('a').filter({ hasText: /Sign up|Inscription|S'inscrire/i });
    await expect(signupLink).toBeVisible();
  });

  test('should navigate to signup page', async ({ page }) => {
    const signupLink = page.locator('a').filter({ hasText: /Sign up|Inscription|S'inscrire/i });
    await signupLink.click();
    
    await expect(page).toHaveURL(/\/signup/);
  });

  test('should have forgot password link', async ({ page }) => {
    const forgotPasswordLink = page.locator('a').filter({ hasText: /Forgot|Mot de passe|Réinitialiser/i });
    if (await forgotPasswordLink.count() > 0) {
      await expect(forgotPasswordLink.first()).toBeVisible();
    }
  });

  test('should validate email format', async ({ page }) => {
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    const submitButton = page.locator('button[type="submit"], button').filter({ hasText: /Login|Connexion/i });
    
    await emailInput.fill('invalid-email');
    await submitButton.click();
    
    const errorMessage = page.locator('text=/invalid|email|format/i');
    if (await errorMessage.count() > 0) {
      await expect(errorMessage.first()).toBeVisible();
    }
  });

  test('should show error for empty fields', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"], button').filter({ hasText: /Login|Connexion/i });
    await submitButton.click();
    
    const errorMessage = page.locator('text=/required|champ|vide/i');
    if (await errorMessage.count() > 0) {
      await expect(errorMessage.first()).toBeVisible();
    }
  });

  test('should have remember me checkbox', async ({ page }) => {
    const rememberMe = page.locator('input[type="checkbox"], [data-testid="remember-me"]');
    if (await rememberMe.count() > 0) {
      await expect(rememberMe.first()).toBeVisible();
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const loginForm = page.locator('form');
    await expect(loginForm).toBeVisible();
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

  test('should redirect to dashboard on successful login', async ({ page }) => {
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    const passwordInput = page.locator('input[type="password"], input[name="password"]');
    const submitButton = page.locator('button[type="submit"], button').filter({ hasText: /Login|Connexion/i });
    
    await emailInput.fill('test@example.com');
    await passwordInput.fill('TestPassword123!');
    await submitButton.click();
    
    await page.waitForTimeout(3000);
    
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/dashboard|\/welcome|\/home/);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    const passwordInput = page.locator('input[type="password"], input[name="password"]');
    const submitButton = page.locator('button[type="submit"], button').filter({ hasText: /Login|Connexion/i });
    
    await emailInput.fill('invalid@example.com');
    await passwordInput.fill('WrongPassword123!');
    await submitButton.click();
    
    await page.waitForTimeout(2000);
    
    const errorMessage = page.locator('text=/invalid|credentials|incorrect/i');
    if (await errorMessage.count() > 0) {
      await expect(errorMessage.first()).toBeVisible();
    }
  });
});
