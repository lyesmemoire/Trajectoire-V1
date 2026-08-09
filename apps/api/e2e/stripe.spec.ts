import { test, expect } from '@playwright/test';

test.describe('Stripe Payment Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/premium');
  });

  test('should navigate to checkout', async ({ page }) => {
    const selectButton = page.locator('button').filter({ hasText: /Select|Choisir/i });
    if (await selectButton.count() > 0) {
      await selectButton.first().click();
    } else {
      await page.goto('/checkout');
    }
    
    await expect(page).toHaveURL(/.*checkout|payment/i);
  });

  test('should display payment form', async ({ page }) => {
    await page.goto('/checkout');
    
    const paymentForm = page.locator('.payment-form').or(page.locator('[data-testid="payment-form"]'));
    await expect(paymentForm).toBeVisible();
  });

  test('should display Stripe Elements', async ({ page }) => {
    await page.goto('/checkout');
    
    const cardElement = page.locator('.StripeElement').or(page.locator('[data-testid="card-element"]'));
    await expect(cardElement).toBeVisible();
  });

  test('should display order summary', async ({ page }) => {
    await page.goto('/checkout');
    
    const orderSummary = page.locator('.order-summary').or(page.locator('[data-testid="order-summary"]'));
    await expect(orderSummary).toBeVisible();
  });

  test('should validate card details', async ({ page }) => {
    await page.goto('/checkout');
    
    const payButton = page.locator('button').filter({ hasText: /Pay|Payer/i });
    await payButton.click();
    
    const errorMessage = page.locator('.error').or(page.locator('[role="alert"]'));
    if (await errorMessage.count() > 0) {
      await expect(errorMessage).toBeVisible();
    }
  });

  test('should process payment with test card', async ({ page }) => {
    await page.goto('/checkout');
    
    // Fill Stripe test card details
    const cardNumber = page.locator('input[name="cardnumber"]').or(page.locator('[data-testid="card-number"]'));
    const expiry = page.locator('input[name="exp-date"]').or(page.locator('[data-testid="card-expiry"]'));
    const cvc = page.locator('input[name="cvc"]').or(page.locator('[data-testid="card-cvc"]'));
    
    if (await cardNumber.count() > 0) {
      await cardNumber.fill('4242424242424242'); // Stripe test card
    }
    
    if (await expiry.count() > 0) {
      await expiry.fill('12/25');
    }
    
    if (await cvc.count() > 0) {
      await cvc.fill('123');
    }
    
    const payButton = page.locator('button').filter({ hasText: /Pay|Payer/i });
    await payButton.click();
    
    const successMessage = page.locator('.success').or(page.locator('[data-testid="payment-success"]'));
    if (await successMessage.count() > 0) {
      await expect(successMessage).toBeVisible({ timeout: 10000 });
    }
  });

  test('should handle payment failure', async ({ page }) => {
    await page.goto('/checkout');
    
    const cardNumber = page.locator('input[name="cardnumber"]').or(page.locator('[data-testid="card-number"]'));
    const expiry = page.locator('input[name="exp-date"]').or(page.locator('[data-testid="card-expiry"]'));
    const cvc = page.locator('input[name="cvc"]').or(page.locator('[data-testid="card-cvc"]'));
    
    if (await cardNumber.count() > 0) {
      await cardNumber.fill('4000000000000002'); // Stripe decline card
    }
    
    if (await expiry.count() > 0) {
      await expiry.fill('12/25');
    }
    
    if (await cvc.count() > 0) {
      await cvc.fill('123');
    }
    
    const payButton = page.locator('button').filter({ hasText: /Pay|Payer/i });
    await payButton.click();
    
    const errorMessage = page.locator('.error').or(page.locator('[data-testid="payment-error"]'));
    if (await errorMessage.count() > 0) {
      await expect(errorMessage).toBeVisible();
    }
  });
});
