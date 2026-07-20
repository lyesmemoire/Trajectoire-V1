import { test, expect } from "@playwright/test";

test("Mobile routes are accessible", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Trajectoire/);
});
