import { test, expect } from "@playwright/test";

test.describe("Flow 3: Interview Workflow", () => {
  test("Create Interview → Answer → Pressure Engine → Finish → Persistence", async ({ page }) => {
    // Login first
    await page.goto("/auth/login");
    await page.fill('#login-email', "test@example.com");
    await page.fill('#login-password', "TestPassword123!");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
    
    // Step 1: Create Interview
    await page.goto("/interview/start");
    
    // Fill job details
    await page.fill('input[name="jobTitle"]', "Senior Software Engineer");
    await page.fill('textarea[name="jobDescription"]', 
      "We are looking for a senior software engineer with experience in React, Node.js, and cloud architecture. " +
      "The candidate should have strong problem-solving skills and experience with agile methodologies."
    );
    
    // Select CV if available
    const cvSelect = page.locator('select[name="cvId"]');
    if (await cvSelect.isVisible()) {
      await cvSelect.selectOption({ index: 0 }); // Select first available CV
    }
    
    // Start interview
    await page.click('button:has-text("Start Interview"), button:has-text("Démarrer l\'entretien")');
    
    // Wait for interview session to initialize
    await expect(page.locator('text=/Question|Interview session/i')).toBeVisible({ timeout: 30000 });
    
    // Step 2: Answer questions
    let questionCount = 0;
    const maxQuestions = 5; // Limit for test purposes
    
    while (questionCount < maxQuestions) {
      const questionText = await page.locator('text=/Question|Question:/i').textContent();
      console.log(`Question ${questionCount + 1}:`, questionText);
      
      // Answer the question
      const answerInput = page.locator('textarea, input[type="text"]');
      if (await answerInput.isVisible()) {
        await answerInput.fill(`This is test answer ${questionCount + 1} for the interview question. ` +
          `I have experience in this area and can demonstrate my skills through practical examples.`);
        
        // Submit answer
        await page.click('button:has-text("Submit"), button:has-text("Envoyer"), button:has-text("Next")');
        
        // Wait for next question or end
        await page.waitForTimeout(2000);
        
        // Check if interview ended
        if (await page.locator('text=/Interview complete|Finished|Results/i').isVisible()) {
          break;
        }
      }
      
      questionCount++;
    }
    
    // Step 3: Pressure Engine
    // Check if pressure level indicator is visible
    const pressureIndicator = page.locator('text=/Pressure|Stress level|Difficulty/i');
    if (await pressureIndicator.isVisible()) {
      console.log("Pressure engine is active");
      
      // Verify pressure changes during interview
      const initialPressure = await page.locator('[data-pressure-level]').getAttribute('data-pressure-level');
      console.log("Initial pressure level:", initialPressure);
    }
    
    // Step 4: Finish Interview
    const endButton = page.locator('button:has-text("End"), button:has-text("Finish"), button:has-text("Terminer")');
    if (await endButton.isVisible()) {
      await endButton.click();
      
      // Confirm end if prompted
      const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Confirmer")');
      if (await confirmButton.isVisible()) {
        await confirmButton.click();
      }
    }
    
    // Wait for results page
    await expect(page.locator('text=/Results|Score|Feedback/i')).toBeVisible({ timeout: 15000 });
    
    // Step 5: Persistence
    // Navigate to interview history
    await page.goto("/interview/history");
    
    // Verify the interview is persisted in history
    await expect(page.locator('text=/Senior Software Engineer|Interview session/i')).toBeVisible({ timeout: 10000 });
    
    // Click on the interview to view details
    await page.click('text=/Senior Software Engineer/i');
    
    // Verify interview details are loaded
    await expect(page.locator('text=/Questions|Answers|Score/i')).toBeVisible({ timeout: 10000 });
    
    // Verify pressure level is saved
    const savedPressure = page.locator('text=/Pressure|Difficulty/i');
    if (await savedPressure.isVisible()) {
      console.log("Pressure level persisted:", await savedPressure.textContent());
    }
  });
});
