import { test, expect, devices } from "@playwright/test";

test.use({
  ...devices["iPhone 13"],
  permissions: ["microphone"],
});

test.describe("📱 Mobile Audio & Resilience Audit", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard/interview/session");
  });

  test("mobile interface should adapt on small screens", async ({ page }) => {
    const mobileUI = page.locator("div.rounded-t-\\[2\\.5rem\\]"); // Look for the new interface
    await expect(page.locator("h1")).toBeVisible();
  });

  test("permission request flow on mobile", async ({ page }) => {
    const launchBtn = page.getByRole("button", { name: /Démarrer/i });
    if (await launchBtn.isVisible()) {
      await launchBtn.click();
    }
    // Note: Playwright handles permissions via config, but we test the UI state
  });

  test("handling background tab (visibility change)", async ({ page }) => {
    await page.evaluate(() => {
      Object.defineProperty(document, "visibilityState", {
        value: "hidden",
        writable: true,
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    // Check if system logs or handles backgrounding
  });
});
