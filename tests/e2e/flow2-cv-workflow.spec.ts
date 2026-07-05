import { test, expect } from "@playwright/test";

test.describe("Flow 2: CV Workflow", () => {
  test("Create CV → Edit → Export PDF → Download", async ({ page }) => {
    // Login first (assuming user exists or using test credentials)
    await page.goto("/auth/login");
    await page.fill('#login-email', "test@example.com");
    await page.fill('#login-password', "TestPassword123!");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
    
    // Step 1: Create CV
    await page.goto("/cv/create");
    
    // Fill CV form
    await page.fill('input[name="fullName"]', "John Doe");
    await page.fill('input[name="email"]', "john.doe@example.com");
    await page.fill('input[name="phone"]', "+1234567890");
    await page.fill('textarea[name="summary"]', "Experienced software developer with expertise in full-stack development.");
    
    // Add experience
    const addExperienceButton = page.locator('button:has-text("Add Experience"), button:has-text("Ajouter expérience")');
    if (await addExperienceButton.isVisible()) {
      await addExperienceButton.click();
      await page.fill('input[name="company"]', "Tech Corp");
      await page.fill('input[name="position"]', "Senior Developer");
      await page.fill('input[name="startDate"]', "2020-01-01");
      await page.fill('textarea[name="description"]', "Led development of multiple projects.");
    }
    
    // Add education
    const addEducationButton = page.locator('button:has-text("Add Education"), button:has-text("Ajouter formation")');
    if (await addEducationButton.isVisible()) {
      await addEducationButton.click();
      await page.fill('input[name="school"]', "University of Tech");
      await page.fill('input[name="degree"]', "Computer Science");
      await page.fill('input[name="graduationYear"]', "2019");
    }
    
    // Save CV
    await page.click('button:has-text("Save"), button:has-text("Sauvegarder")');
    await expect(page.locator('text=/CV saved|Success/i')).toBeVisible({ timeout: 10000 });
    
    // Step 2: Edit CV
    await page.goto("/cv/edit");
    
    // Modify some fields
    await page.fill('textarea[name="summary"]', "Updated summary with additional skills in cloud architecture.");
    
    // Save changes
    await page.click('button:has-text("Save"), button:has-text("Sauvegarder")');
    await expect(page.locator('text=/CV updated|Changes saved/i')).toBeVisible({ timeout: 10000 });
    
    // Step 3: Export PDF
    await page.goto("/cv/export");
    
    // Select PDF format
    await page.selectOption('select[name="format"]', "pdf");
    
    // Click export button
    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("Export"), button:has-text("Exporter")');
    
    // Step 4: Download
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.pdf$/);
    
    // Verify download completed
    await expect(page.locator('text=/Export complete|Download ready/i')).toBeVisible({ timeout: 15000 });
  });
});
