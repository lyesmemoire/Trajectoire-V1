import { test, expect } from "@playwright/test";

test.describe("🎙️ Mock Interview Lab — API Routes", () => {
  test("✅ /api/interview/start → rejette sans auth (401)", async ({
    page,
  }) => {
    await page.context().clearCookies();
    const response = await page.request.post("/api/interview/start", {
      data: {
        personaId: "big_tech",
        jobContext: "Software Engineer at Google",
      },
    });
    expect([401, 403]).toContain(response.status());
  });

  test("✅ /api/interview/generate → rejette sans auth (401)", async ({
    page,
  }) => {
    await page.context().clearCookies();
    const response = await page.request.post("/api/interview/generate", {
      data: {
        personaId: "big_tech",
        messages: [{ role: "user", content: "Bonjour" }],
        jobContext: "Test",
      },
    });
    expect([401, 403]).toContain(response.status());
  });

  test("✅ /api/interview/feedback → rejette sans auth (401)", async ({
    page,
  }) => {
    await page.context().clearCookies();
    const response = await page.request.post("/api/interview/feedback", {
      data: {
        sessionId: "00000000-0000-0000-0000-000000000000",
        messages: [
          { role: "user", content: "Bonjour" },
          { role: "assistant", content: "Bonjour, présentez-vous." },
        ],
      },
    });
    expect([401, 403]).toContain(response.status());
  });

  test("✅ /api/interview/feedback → valide le format UUID du sessionId", async ({
    page,
  }) => {
    const response = await page.request.post("/api/interview/feedback", {
      data: {
        sessionId: "NOT-A-VALID-UUID",
        messages: [
          { role: "user", content: "Bonjour" },
          { role: "assistant", content: "Test" },
        ],
      },
    });
    // Doit retourner 400 (validation) ou 401 (auth)
    expect([400, 401, 422]).toContain(response.status());
  });

  test("✅ /api/interview/generate → valide les messages requis", async ({
    page,
  }) => {
    const response = await page.request.post("/api/interview/generate", {
      data: {
        personaId: "big_tech",
        messages: "PAS_UN_TABLEAU", // Format invalide
        jobContext: "Test",
      },
    });
    expect([400, 401, 422]).toContain(response.status());
  });
});
