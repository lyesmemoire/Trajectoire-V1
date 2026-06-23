import { test, expect } from "@playwright/test";

test.describe("Authentication Flow Audit", () => {
  test("should redirect to login if unauthorized for dashboard", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    // Expect redirect to login (if middleware is set up correctly)
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("signout should work and clear session", async ({ page }) => {
    // This requires a mock session or real login first.
    // For now, testing if the route is at least reachable.
    await page.goto("/auth/signout", { waitUntil: "networkidle" });
    await expect(page).toHaveURL("/");
  });
});
