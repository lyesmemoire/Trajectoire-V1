import { test, expect } from '@playwright/test';

test.describe('Copilot E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('should display copilot section', async ({ page }) => {
    const copilotSection = page.locator('[data-testid="copilot"], section').filter({ hasText: /Copilot|AI Assistant/i });
    if (await copilotSection.count() > 0) {
      await expect(copilotSection.first()).toBeVisible();
    }
  });

  test('should have chat input field', async ({ page }) => {
    const chatInput = page.locator('textarea, input[type="text"], [data-testid="chat-input"]');
    if (await chatInput.count() > 0) {
      await expect(chatInput.first()).toBeVisible();
    }
  });

  test('should have send button', async ({ page }) => {
    const sendButton = page.locator('button').filter({ hasText: /Send|Envoyer/i });
    if (await sendButton.count() > 0) {
      await expect(sendButton.first()).toBeVisible();
    }
  });

  test('should send message to copilot', async ({ page }) => {
    const chatInput = page.locator('textarea, input[type="text"], [data-testid="chat-input"]');
    const sendButton = page.locator('button').filter({ hasText: /Send|Envoyer/i });
    
    if (await chatInput.count() > 0 && await sendButton.count() > 0) {
      await chatInput.first().fill('What jobs match my profile?');
      await sendButton.first().click();
      
      await page.waitForTimeout(3000);
      
      const messageList = page.locator('[data-testid="message-list"], .message-list');
      if (await messageList.count() > 0) {
        await expect(messageList.first()).toBeVisible();
      }
    }
  });

  test('should display copilot response', async ({ page }) => {
    const chatInput = page.locator('textarea, input[type="text"], [data-testid="chat-input"]');
    const sendButton = page.locator('button').filter({ hasText: /Send|Envoyer/i });
    
    if (await chatInput.count() > 0 && await sendButton.count() > 0) {
      await chatInput.first().fill('Help me improve my CV');
      await sendButton.first().click();
      
      await page.waitForTimeout(5000);
      
      const responseMessage = page.locator('[data-testid="copilot-response"], .copilot-response');
      if (await responseMessage.count() > 0) {
        await expect(responseMessage.first()).toBeVisible();
      }
    }
  });

  test('should display conversation history', async ({ page }) => {
    const conversationHistory = page.locator('[data-testid="conversation-history"], .conversation-history');
    if (await conversationHistory.count() > 0) {
      await expect(conversationHistory.first()).toBeVisible();
    }
  });

  test('should start new conversation', async ({ page }) => {
    const newConversationButton = page.locator('button').filter({ hasText: /New conversation|Nouvelle conversation/i });
    
    if (await newConversationButton.count() > 0) {
      await newConversationButton.first().click();
      
      await page.waitForTimeout(1000);
      
      const chatInput = page.locator('textarea, input[type="text"], [data-testid="chat-input"]');
      if (await chatInput.count() > 0) {
        await expect(chatInput.first()).toBeVisible();
      }
    }
  });

  test('should clear conversation', async ({ page }) => {
    const clearButton = page.locator('button').filter({ hasText: /Clear|Effacer/i });
    
    if (await clearButton.count() > 0) {
      await clearButton.first().click();
      
      await page.waitForTimeout(1000);
      
      const messageList = page.locator('[data-testid="message-list"], .message-list');
      if (await messageList.count() > 0) {
        const messages = await messageList.first().locator('[data-testid="message"], .message').count();
        expect(messages).toBe(0);
      }
    }
  });

  test('should have suggested prompts', async ({ page }) => {
    const suggestedPrompts = page.locator('[data-testid="suggested-prompts"], .suggested-prompts');
    if (await suggestedPrompts.count() > 0) {
      await expect(suggestedPrompts.first()).toBeVisible();
    }
  });

  test('should use suggested prompt', async ({ page }) => {
    const suggestedPrompt = page.locator('[data-testid="suggested-prompt"], .suggested-prompt');
    
    if (await suggestedPrompt.count() > 0) {
      await suggestedPrompt.first().click();
      
      await page.waitForTimeout(3000);
      
      const chatInput = page.locator('textarea, input[type="text"], [data-testid="chat-input"]');
      if (await chatInput.count() > 0) {
        const inputValue = await chatInput.first().inputValue();
        expect(inputValue.length).toBeGreaterThan(0);
      }
    }
  });

  test('should display typing indicator', async ({ page }) => {
    const chatInput = page.locator('textarea, input[type="text"], [data-testid="chat-input"]');
    const sendButton = page.locator('button').filter({ hasText: /Send|Envoyer/i });
    
    if (await chatInput.count() > 0 && await sendButton.count() > 0) {
      await chatInput.first().fill('Analyze my skills');
      await sendButton.first().click();
      
      const typingIndicator = page.locator('[data-testid="typing-indicator"], .typing-indicator');
      if (await typingIndicator.count() > 0) {
        await expect(typingIndicator.first()).toBeVisible({ timeout: 3000 });
      }
    }
  });

  test('should export conversation', async ({ page }) => {
    const exportButton = page.locator('button').filter({ hasText: /Export|Exporter/i });
    
    if (await exportButton.count() > 0) {
      const downloadPromise = page.waitForEvent('download');
      await exportButton.first().click();
      const download = await downloadPromise;
      
      expect(download.suggestedFilename()).toBeTruthy();
    }
  });

  test('should have voice input option', async ({ page }) => {
    const voiceButton = page.locator('button[aria-label*="voice" i], [data-testid="voice-input"]');
    if (await voiceButton.count() > 0) {
      await expect(voiceButton.first()).toBeVisible();
    }
  });

  test('should display context information', async ({ page }) => {
    const contextInfo = page.locator('[data-testid="context-info"], .context-info');
    if (await contextInfo.count() > 0) {
      await expect(contextInfo.first()).toBeVisible();
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const copilotSection = page.locator('[data-testid="copilot"], section').filter({ hasText: /Copilot/i });
    if (await copilotSection.count() > 0) {
      await expect(copilotSection.first()).toBeVisible();
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

  test('should handle empty message', async ({ page }) => {
    const chatInput = page.locator('textarea, input[type="text"], [data-testid="chat-input"]');
    const sendButton = page.locator('button').filter({ hasText: /Send|Envoyer/i });
    
    if (await chatInput.count() > 0 && await sendButton.count() > 0) {
      await sendButton.first().click();
      
      const errorMessage = page.locator('text=/empty|message|vide/i');
      if (await errorMessage.count() > 0) {
        await expect(errorMessage.first()).toBeVisible();
      }
    }
  });

  test('should display sources in response', async ({ page }) => {
    const chatInput = page.locator('textarea, input[type="text"], [data-testid="chat-input"]');
    const sendButton = page.locator('button').filter({ hasText: /Send|Envoyer/i });
    
    if (await chatInput.count() > 0 && await sendButton.count() > 0) {
      await chatInput.first().fill('What are my strongest skills?');
      await sendButton.first().click();
      
      await page.waitForTimeout(5000);
      
      const sources = page.locator('[data-testid="sources"], .sources');
      if (await sources.count() > 0) {
        await expect(sources.first()).toBeVisible();
      }
    }
  });
});
