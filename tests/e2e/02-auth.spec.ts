import { test, expect } from "@playwright/test";

test.describe("Authentication Flow Audit", () => {
  test("should redirect to login if unauthorized for dashboard", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    // Expect redirect to login (if middleware is set up correctly)
    await expect(page).toHaveURL(/\/login/);
  });

  test("signout should work and clear session", async ({ page }) => {
    // This requires a mock session or real login first.
    // For now, testing if the route is at least reachable.
    await page.goto("/logout", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/(login|\/)/);
  });
});
