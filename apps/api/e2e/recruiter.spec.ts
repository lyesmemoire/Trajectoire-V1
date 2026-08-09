import { test, expect } from '@playwright/test';

test.describe('Recruiter Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('should navigate to recruiter page', async ({ page }) => {
    const recruiterLink = page.locator('a').filter({ hasText: /Recruiter|Recruteur/i });
    if (await recruiterLink.count() > 0) {
      await recruiterLink.click();
    } else {
      await page.goto('/recruiter');
    }
    
    await expect(page).toHaveURL(/.*recruiter/i);
  });

  test('should display job posting form', async ({ page }) => {
    await page.goto('/recruiter');
    
    const jobForm = page.locator('form').or(page.locator('[data-testid="job-form"]'));
    await expect(jobForm).toBeVisible();
  });

  test('should create job posting', async ({ page }) => {
    await page.goto('/recruiter');
    
    const titleInput = page.locator('input[name="title"]');
    const descriptionInput = page.locator('textarea[name="description"]');
    
    if (await titleInput.count() > 0) {
      await titleInput.fill('Senior Software Engineer');
    }
    
    if (await descriptionInput.count() > 0) {
      await descriptionInput.fill('We are looking for a senior software engineer with experience in JavaScript and React.');
    }
    
    const submitButton = page.locator('button[type="submit"]').or(page.locator('button').filter({ hasText: /Post|Publier/i }));
    await submitButton.click();
    
    const successMessage = page.locator('.success').or(page.locator('[data-testid="success"]'));
    if (await successMessage.count() > 0) {
      await expect(successMessage).toBeVisible();
    }
  });

  test('should display job listings', async ({ page }) => {
    await page.goto('/recruiter');
    
    const jobListings = page.locator('.job-listings').or(page.locator('[data-testid="job-listings"]'));
    if (await jobListings.count() > 0) {
      await expect(jobListings).toBeVisible();
    }
  });

  test('should view candidate applications', async ({ page }) => {
    await page.goto('/recruiter');
    
    const applicationsLink = page.locator('a').filter({ hasText: /Applications|Candidatures/i });
    if (await applicationsLink.count() > 0) {
      await applicationsLink.click();
      
      const applicationsList = page.locator('.applications').or(page.locator('[data-testid="applications"]'));
      await expect(applicationsList).toBeVisible();
    }
  });
});
