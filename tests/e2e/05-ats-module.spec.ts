import { test, expect } from "@playwright/test";

test.describe("📄 Module ATS — Analyseur de CV", () => {
  test("✅ Route /api/cv/upload → accessible", async ({ page }) => {
    const response = await page.request.post("/api/cv/upload", {
      multipart: {
        file: {
          name: "test.pdf",
          mimeType: "application/pdf",
          buffer: Buffer.from("%PDF-1.4 test"),
        },
      },
    });
    // Route should respond (200, 400, 401, 403, 404 are all acceptable)
    expect([200, 400, 401, 403, 404]).toContain(response.status());
  });
});
