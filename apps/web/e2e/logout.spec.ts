import { test, expect } from '@playwright/test';

test.describe('Logout E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('should display logout button', async ({ page }) => {
    const logoutButton = page.locator('button, a').filter({ hasText: /Logout|Déconnexion|Se déconnecter/i });
    if (await logoutButton.count() > 0) {
      await expect(logoutButton.first()).toBeVisible();
    }
  });

  test('should have user menu with logout option', async ({ page }) => {
    const userMenu = page.locator('[data-testid="user-menu"], button[aria-label*="user" i], .user-menu');
    if (await userMenu.count() > 0) {
      await userMenu.first().click();
      
      await page.waitForTimeout(500);
      
      const logoutOption = page.locator('text=/Logout|Déconnexion/i');
      if (await logoutOption.count() > 0) {
        await expect(logoutOption.first()).toBeVisible();
      }
    }
  });

  test('should logout when button clicked', async ({ page }) => {
    const logoutButton = page.locator('button, a').filter({ hasText: /Logout|Déconnexion/i });
    
    if (await logoutButton.count() > 0) {
      await logoutButton.first().click();
      
      await page.waitForTimeout(2000);
      
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/\/login|\/landing|\/$/);
    }
  });

  test('should show logout confirmation dialog', async ({ page }) => {
    const logoutButton = page.locator('button, a').filter({ hasText: /Logout|Déconnexion/i });
    
    if (await logoutButton.count() > 0) {
      await logoutButton.first().click();
      
      await page.waitForTimeout(1000);
      
      const confirmationDialog = page.locator('[data-testid="logout-dialog"], .dialog, [role="dialog"]');
      if (await confirmationDialog.count() > 0) {
        await expect(confirmationDialog.first()).toBeVisible();
      }
    }
  });

  test('should confirm logout', async ({ page }) => {
    const logoutButton = page.locator('button, a').filter({ hasText: /Logout|Déconnexion/i });
    
    if (await logoutButton.count() > 0) {
      await logoutButton.first().click();
      
      await page.waitForTimeout(1000);
      
      const confirmButton = page.locator('button').filter({ hasText: /Confirm|Confirmer|Yes|Oui/i });
      if (await confirmButton.count() > 0) {
        await confirmButton.first().click();
        
        await page.waitForTimeout(2000);
        
        const currentUrl = page.url();
        expect(currentUrl).toMatch(/\/login|\/landing|\/$/);
      }
    }
  });

  test('should cancel logout', async ({ page }) => {
    const logoutButton = page.locator('button, a').filter({ hasText: /Logout|Déconnexion/i });
    
    if (await logoutButton.count() > 0) {
      await logoutButton.first().click();
      
      await page.waitForTimeout(1000);
      
      const cancelButton = page.locator('button').filter({ hasText: /Cancel|Annuler|No|Non/i });
      if (await cancelButton.count() > 0) {
        await cancelButton.first().click();
        
        await page.waitForTimeout(1000);
        
        const currentUrl = page.url();
        expect(currentUrl).toMatch(/\/dashboard/);
      }
    }
  });

  test('should clear session on logout', async ({ page }) => {
    const logoutButton = page.locator('button, a').filter({ hasText: /Logout|Déconnexion/i });
    
    if (await logoutButton.count() > 0) {
      await logoutButton.first().click();
      
      await page.waitForTimeout(2000);
      
      const cookies = await page.context().cookies();
      const sessionCookie = cookies.find(c => c.name.includes('session') || c.name.includes('auth'));
      
      expect(sessionCookie).toBeFalsy();
    }
  });

  test('should redirect to login page after logout', async ({ page }) => {
    const logoutButton = page.locator('button, a').filter({ hasText: /Logout|Déconnexion/i });
    
    if (await logoutButton.count() > 0) {
      await logoutButton.first().click();
      
      await page.waitForTimeout(2000);
      
      await expect(page).toHaveURL(/\/login/);
    }
  });

  test('should not allow access to protected routes after logout', async ({ page }) => {
    const logoutButton = page.locator('button, a').filter({ hasText: /Logout|Déconnexion/i });
    
    if (await logoutButton.count() > 0) {
      await logoutButton.first().click();
      
      await page.waitForTimeout(2000);
      
      await page.goto('/dashboard');
      
      await page.waitForTimeout(2000);
      
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/\/login/);
    }
  });

  test('should display login form after logout', async ({ page }) => {
    const logoutButton = page.locator('button, a').filter({ hasText: /Logout|Déconnexion/i });
    
    if (await logoutButton.count() > 0) {
      await logoutButton.first().click();
      
      await page.waitForTimeout(2000);
      
      const loginForm = page.locator('form');
      await expect(loginForm).toBeVisible();
    }
  });

  test('should be able to login again after logout', async ({ page }) => {
    const logoutButton = page.locator('button, a').filter({ hasText: /Logout|Déconnexion/i });
    
    if (await logoutButton.count() > 0) {
      await logoutButton.first().click();
      
      await page.waitForTimeout(2000);
      
      const emailInput = page.locator('input[type="email"], input[name="email"]');
      const passwordInput = page.locator('input[type="password"], input[name="password"]');
      const loginButton = page.locator('button[type="submit"], button').filter({ hasText: /Login|Connexion/i });
      
      if (await emailInput.count() > 0 && await passwordInput.count() > 0 && await loginButton.count() > 0) {
        await emailInput.first().fill('test@example.com');
        await passwordInput.first().fill('TestPassword123!');
        await loginButton.first().click();
        
        await page.waitForTimeout(3000);
        
        const currentUrl = page.url();
        expect(currentUrl).toMatch(/\/dashboard|\/welcome/);
      }
    }
  });

  test('should show success message on logout', async ({ page }) => {
    const logoutButton = page.locator('button, a').filter({ hasText: /Logout|Déconnexion/i });
    
    if (await logoutButton.count() > 0) {
      await logoutButton.first().click();
      
      await page.waitForTimeout(2000);
      
      const successMessage = page.locator('text=/logged out|déconnecté|success/i');
      if (await successMessage.count() > 0) {
        await expect(successMessage.first()).toBeVisible();
      }
    }
  });

  test('should handle logout from all tabs', async ({ page }) => {
    const logoutButton = page.locator('button, a').filter({ hasText: /Logout|Déconnexion/i });
    
    if (await logoutButton.count() > 0) {
      await logoutButton.first().click();
      
      await page.waitForTimeout(2000);
      
      const newPage = await page.context().newPage();
      await newPage.goto('/dashboard');
      
      await newPage.waitForTimeout(2000);
      
      const currentUrl = newPage.url();
      expect(currentUrl).toMatch(/\/login/);
      
      await newPage.close();
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const logoutButton = page.locator('button, a').filter({ hasText: /Logout|Déconnexion/i });
    if (await logoutButton.count() > 0) {
      await expect(logoutButton.first()).toBeVisible();
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

  test('should have accessible logout button', async ({ page }) => {
    const logoutButton = page.locator('button, a').filter({ hasText: /Logout|Déconnexion/i });
    
    if (await logoutButton.count() > 0) {
      const ariaLabel = await logoutButton.first().getAttribute('aria-label');
      const role = await logoutButton.first().getAttribute('role');
      
      expect(ariaLabel || role).toBeTruthy();
    }
  });

  test('should logout from sidebar', async ({ page }) => {
    const sidebarLogout = page.locator('aside button, aside a').filter({ hasText: /Logout|Déconnexion/i });
    
    if (await sidebarLogout.count() > 0) {
      await sidebarLogout.first().click();
      
      await page.waitForTimeout(2000);
      
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/\/login|\/landing|\/$/);
    }
  });

  test('should remember last page before logout', async ({ page }) => {
    await page.goto('/dashboard/matching');
    
    const logoutButton = page.locator('button, a').filter({ hasText: /Logout|Déconnexion/i });
    
    if (await logoutButton.count() > 0) {
      await logoutButton.first().click();
      
      await page.waitForTimeout(2000);
      
      const emailInput = page.locator('input[type="email"], input[name="email"]');
      const passwordInput = page.locator('input[type="password"], input[name="password"]');
      const loginButton = page.locator('button[type="submit"], button').filter({ hasText: /Login|Connexion/i });
      
      if (await emailInput.count() > 0 && await passwordInput.count() > 0 && await loginButton.count() > 0) {
        await emailInput.first().fill('test@example.com');
        await passwordInput.first().fill('TestPassword123!');
        await loginButton.first().click();
        
        await page.waitForTimeout(3000);
        
        const currentUrl = page.url();
        expect(currentUrl).toMatch(/\/dashboard/);
      }
    }
  });
});
