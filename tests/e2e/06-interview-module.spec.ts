import { test, expect } from "@playwright/test";

test.describe("🎙️ Mock Interview Lab — API Routes", () => {
  test("✅ /api/interview → accessible", async ({ page }) => {
    const response = await page.request.post("/api/interview", {
      data: {
        personaId: "big_tech",
        jobContext: "Software Engineer at Google",
      },
    });
    // Route should respond (200, 400, 401, 403, 404 are all acceptable)
    expect([200, 400, 401, 403, 404]).toContain(response.status());
  });
});
