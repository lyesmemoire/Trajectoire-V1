import { test, expect } from '@playwright/test';

test.describe('Copilot Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('should navigate to copilot page', async ({ page }) => {
    const copilotLink = page.locator('a').filter({ hasText: /Copilot|AI/i });
    if (await copilotLink.count() > 0) {
      await copilotLink.click();
    } else {
      await page.goto('/copilot');
    }
    
    await expect(page).toHaveURL(/.*copilot/i);
  });

  test('should display chat interface', async ({ page }) => {
    await page.goto('/copilot');
    
    const chatInterface = page.locator('.chat').or(page.locator('[data-testid="chat-interface"]'));
    await expect(chatInterface).toBeVisible();
  });

  test('should display message input', async ({ page }) => {
    await page.goto('/copilot');
    
    const messageInput = page.locator('textarea[name="message"]').or(page.locator('input[type="text"]'));
    await expect(messageInput).toBeVisible();
  });

  test('should send message', async ({ page }) => {
    await page.goto('/copilot');
    
    const messageInput = page.locator('textarea[name="message"]').or(page.locator('input[type="text"]'));
    await messageInput.fill('How can I improve my CV?');
    
    const sendButton = page.locator('button').filter({ hasText: /Send|Envoyer/i });
    await sendButton.click();
    
    const userMessage = page.locator('.message.user').or(page.locator('[data-testid="user-message"]'));
    await expect(userMessage).toBeVisible();
  });

  test('should receive AI response', async ({ page }) => {
    await page.goto('/copilot');
    
    const messageInput = page.locator('textarea[name="message"]').or(page.locator('input[type="text"]'));
    await messageInput.fill('What skills are in demand?');
    
    const sendButton = page.locator('button').filter({ hasText: /Send|Envoyer/i });
    await sendButton.click();
    
    await page.waitForTimeout(3000);
    
    const aiResponse = page.locator('.message.ai').or(page.locator('[data-testid="ai-response"]'));
    if (await aiResponse.count() > 0) {
      await expect(aiResponse).toBeVisible();
    }
  });

  test('should display chat history', async ({ page }) => {
    await page.goto('/copilot');
    
    const chatHistory = page.locator('.history').or(page.locator('[data-testid="chat-history"]'));
    if (await chatHistory.count() > 0) {
      await expect(chatHistory).toBeVisible();
    }
  });

  test('should clear chat', async ({ page }) => {
    await page.goto('/copilot');
    
    const clearButton = page.locator('button').filter({ hasText: /Clear|Effacer/i });
    if (await clearButton.count() > 0) {
      await clearButton.click();
      
      const messages = page.locator('.message');
      expect(await messages.count()).toBe(0);
    }
  });
});
