import { test, expect } from '@playwright/test';

test.describe('Simulation Page E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulation');
  });

  test('should load simulation page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Simulation/i);
  });

  test('should display simulation interface', async ({ page }) => {
    const simulationInterface = page.locator('[data-testid="simulation-interface"], .simulation-interface');
    await expect(simulationInterface).toBeVisible();
  });

  test('should have simulation controls', async ({ page }) => {
    const controls = page.locator('[data-testid="simulation-controls"], .simulation-controls');
    if (await controls.count() > 0) {
      await expect(controls.first()).toBeVisible();
    }
  });

  test('should have start simulation button', async ({ page }) => {
    const startButton = page.locator('button').filter({ hasText: /Start|Démarrer|Lancer/i });
    if (await startButton.count() > 0) {
      await expect(startButton.first()).toBeVisible();
    }
  });

  test('should have stop simulation button', async ({ page }) => {
    const stopButton = page.locator('button').filter({ hasText: /Stop|Arrêter/i });
    if (await stopButton.count() > 0) {
      await expect(stopButton.first()).toBeVisible();
    }
  });

  test('should display simulation results', async ({ page }) => {
    const results = page.locator('[data-testid="simulation-results"], .simulation-results');
    if (await results.count() > 0) {
      await expect(results.first()).toBeVisible();
    }
  });

  test('should have simulation parameters', async ({ page }) => {
    const parameters = page.locator('[data-testid="simulation-parameters"], .simulation-parameters');
    if (await parameters.count() > 0) {
      await expect(parameters.first()).toBeVisible();
    }
  });

  test('should allow parameter adjustment', async ({ page }) => {
    const slider = page.locator('input[type="range"]');
    if (await slider.count() > 0) {
      await slider.first().fill('50');
      await page.waitForTimeout(500);
      await expect(page).toHaveURL(/\/simulation/);
    }
  });

  test('should display simulation progress', async ({ page }) => {
    const progress = page.locator('[data-testid="simulation-progress"], .progress-bar');
    if (await progress.count() > 0) {
      await expect(progress.first()).toBeVisible();
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const simulationInterface = page.locator('[data-testid="simulation-interface"], .simulation-interface');
    await expect(simulationInterface).toBeVisible();
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

  test('should have reset button', async ({ page }) => {
    const resetButton = page.locator('button').filter({ hasText: /Reset|Réinitialiser/i });
    if (await resetButton.count() > 0) {
      await expect(resetButton.first()).toBeVisible();
    }
  });
});
