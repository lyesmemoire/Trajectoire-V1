import { test, expect } from "@playwright/test";

test.describe("Flow 1: Full User Journey", () => {
  test("Register → Login → Upload CV → Analyse → Career → Interview → Logout", async ({
    page,
  }) => {
    // Step 1: Register
    await page.goto("/auth/signup");
    
    // Fill registration form
    const randomEmail = `test-${Date.now()}@example.com`;
    await page.fill('#signup-email', randomEmail);
    await page.fill('#signup-fullname', "Test User");
    await page.fill('#signup-password', "TestPassword123!");
    await page.fill('#signup-confirm-password', "TestPassword123!");
    
    // Accept terms (required)
    await page.check('input[type="checkbox"]:has-text("conditions")');
    
    // Submit registration
    await page.click('button[type="submit"]');
    
    // Wait for success message or redirect
    await expect(page).toHaveURL(/\/auth\/login|\/dashboard/, { timeout: 10000 });
    
    // Step 2: Login
    await page.goto("/auth/login");
    await page.fill('#login-email', randomEmail);
    await page.fill('#login-password', "TestPassword123!");
    await page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
    
    // Step 3: Upload CV
    await page.goto("/cv/upload");
    
    // Upload CV file (assuming file input exists)
    const fileInput = page.locator('input[type="file"]');
    if (await fileInput.isVisible()) {
      await fileInput.setInputFiles("./tests/fixtures/sample-cv.pdf");
      await page.click('button:has-text("Upload")');
      
      // Wait for upload completion
      await expect(page.locator('text=/CV uploaded|Upload successful/i')).toBeVisible({ timeout: 30000 });
    }
    
    // Step 4: Analyse CV
    await page.goto("/cv/analyze");
    
    // Click analyze button
    const analyzeButton = page.locator('button:has-text("Analyser"), button:has-text("Analyze")');
    if (await analyzeButton.isVisible()) {
      await analyzeButton.click();
      
      // Wait for analysis completion
      await expect(page.locator('text=/Analysis complete|Score|Recommendations/i')).toBeVisible({ timeout: 60000 });
    }
    
    // Step 5: Career
    await page.goto("/career");
    
    // Check career predictions are loaded
    await expect(page.locator('text=/Career|Prediction|Skills/i')).toBeVisible({ timeout: 10000 });
    
    // Step 6: Interview
    await page.goto("/interview");
    
    // Start interview
    const startButton = page.locator('button:has-text("Start"), button:has-text("Commencer")');
    if (await startButton.isVisible()) {
      await startButton.click();
      
      // Fill job details
      await page.fill('input[name="jobTitle"]', "Software Engineer");
      await page.fill('textarea[name="jobDescription"]', "Full stack developer position");
      
      // Submit to start interview
      await page.click('button:has-text("Start Interview"), button:has-text("Démarrer")');
      
      // Wait for interview to load
      await expect(page.locator('text=/Question|Interview/i')).toBeVisible({ timeout: 30000 });
      
      // Answer a question (if present)
      const answerInput = page.locator('textarea, input[type="text"]');
      if (await answerInput.isVisible()) {
        await answerInput.fill("This is a test answer for the interview question.");
        await page.click('button:has-text("Submit"), button:has-text("Envoyer")');
      }
      
      // End interview
      const endButton = page.locator('button:has-text("End"), button:has-text("Terminer")');
      if (await endButton.isVisible()) {
        await endButton.click();
      }
    }
    
    // Step 7: Logout
    await page.goto("/auth/signout");
    
    // Wait for redirect to home
    await expect(page).toHaveURL("/", { timeout: 10000 });
    
    // Verify user is logged out (redirect to login when accessing protected route)
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 5000 });
  });
});
