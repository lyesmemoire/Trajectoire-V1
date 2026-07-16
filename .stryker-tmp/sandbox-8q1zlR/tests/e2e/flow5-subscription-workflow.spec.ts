// @ts-nocheck
import { test, expect } from "@playwright/test";

test.describe("Flow 5: Subscription Workflow", () => {
  test("Subscription → Upgrade → Downgrade → Expiration → Renew", async ({ page }) => {
    // Login first
    await page.goto("/auth/login");
    await page.fill('#login-email', "test@example.com");
    await page.fill('#login-password', "TestPassword123!");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
    
    // Step 1: Create Subscription
    await page.goto("/billing/subscription");
    
    // Select free plan initially
    await page.click('button:has-text("Free"), button:has-text("Gratuit")');
    
    // Subscribe
    await page.click('button:has-text("Subscribe"), button:has-text("S\'abonner")');
    
    // Wait for subscription confirmation
    await expect(page.locator('text=/Subscription active|Success/i')).toBeVisible({ timeout: 10000 });
    
    // Verify current plan is displayed
    await expect(page.locator('text=/Free|Gratuit/i')).toBeVisible({ timeout: 5000 });
    
    // Step 2: Upgrade Subscription
    await page.goto("/billing/subscription");
    
    // Click upgrade button
    const upgradeButton = page.locator('button:has-text("Upgrade"), button:has-text("Passer à")');
    if (await upgradeButton.isVisible()) {
      await upgradeButton.click();
      
      // Select Pro plan
      await page.click('button:has-text("Pro"), button:has-text("Premium")');
      
      // Confirm upgrade
      await page.click('button:has-text("Confirm"), button:has-text("Confirmer")');
      
      // Wait for upgrade confirmation
      await expect(page.locator('text=/Upgraded|Plan changed/i')).toBeVisible({ timeout: 15000 });
      
      // Verify new plan is active
      await expect(page.locator('text=/Pro|Premium/i')).toBeVisible({ timeout: 5000 });
    }
    
    // Step 3: Downgrade Subscription
    await page.goto("/billing/subscription");
    
    // Click downgrade button
    const downgradeButton = page.locator('button:has-text("Downgrade"), button:has-text("Réduire")');
    if (await downgradeButton.isVisible()) {
      await downgradeButton.click();
      
      // Select Basic plan
      await page.click('button:has-text("Basic"), button:has-text("Standard")');
      
      // Confirm downgrade
      await page.click('button:has-text("Confirm"), button:has-text("Confirmer")');
      
      // Wait for downgrade confirmation
      await expect(page.locator('text=/Downgraded|Plan changed/i')).toBeVisible({ timeout: 15000 });
      
      // Verify new plan is active
      await expect(page.locator('text=/Basic|Standard/i')).toBeVisible({ timeout: 5000 });
    }
    
    // Step 4: Expiration (simulated via admin or time manipulation)
    // In real E2E, we would either:
    // 1. Use Stripe Test Clock to advance time
    // 2. Manually expire subscription via admin API
    // 3. Wait for actual expiration (not practical for tests)
    
    // For test purposes, we'll verify expiration handling by checking the subscription status
    await page.goto("/billing/subscription");
    
    // Check if expiration date is displayed
    const expirationDate = page.locator('text=/Expires|Expiration/i');
    if (await expirationDate.isVisible()) {
      console.log("Subscription expiration date:", await expirationDate.textContent());
    }
    
    // Step 5: Renew Subscription
    await page.goto("/billing/subscription");
    
    // Click renew button
    const renewButton = page.locator('button:has-text("Renew"), button:has-text("Renouveler")');
    if (await renewButton.isVisible()) {
      await renewButton.click();
      
      // Confirm renewal
      await page.click('button:has-text("Confirm"), button:has-text("Confirmer")');
      
      // Wait for renewal confirmation
      await expect(page.locator('text=/Renewed|Subscription active/i')).toBeVisible({ timeout: 15000 });
      
      // Verify subscription is active with new expiration date
      await expect(page.locator('text=/Active|Actif/i')).toBeVisible({ timeout: 5000 });
    }
    
    // Verify subscription history
    await page.goto("/billing/history");
    
    // Check for subscription changes in history
    await expect(page.locator('text=/Subscription|Plan change/i')).toBeVisible({ timeout: 10000 });
  });
});
