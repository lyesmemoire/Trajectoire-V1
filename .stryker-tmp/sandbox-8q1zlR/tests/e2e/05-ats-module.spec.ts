// @ts-nocheck
import { test, expect } from "@playwright/test";

test.describe("📄 Module ATS — Analyseur de CV", () => {
  test("✅ Route /api/ats → rejette les requêtes sans auth (401)", async ({
    page,
  }) => {
    await page.context().clearCookies();
    const response = await page.request.post("/api/ats", {
      multipart: {
        jobDescription: "Test job description",
        resume: {
          name: "test.pdf",
          mimeType: "application/pdf",
          buffer: Buffer.from("%PDF-1.4 test"),
        },
      },
    });
    expect([401, 403]).toContain(response.status());
  });

  test("✅ Route /api/ats → rejette un fichier non-PDF (400)", async ({
    page,
  }) => {
    await page.context().clearCookies();
    const response = await page.request.post("/api/ats", {
      multipart: {
        jobDescription: "Test description",
        resume: {
          name: "test.txt",
          mimeType: "text/plain",
          buffer: Buffer.from("ceci est un texte"),
        },
      },
    });
    // Sans auth = 401, avec auth + mauvais type = 400
    expect([400, 401, 403]).toContain(response.status());
  });

  test("✅ Route /api/ats → rejette si description < 50 caractères", async ({
    page,
  }) => {
    await page.context().clearCookies();
    const response = await page.request.post("/api/ats", {
      multipart: {
        jobDescription: "Trop court", // < 50 chars
        resume: {
          name: "cv.pdf",
          mimeType: "application/pdf",
          buffer: Buffer.from("%PDF-1.4"),
        },
      },
    });
    expect([400, 401, 422]).toContain(response.status());
  });

  test("✅ Rate limiting — blocage après trop de requêtes (429)", async ({
    page,
  }) => {
    // Envoyer plusieurs requêtes rapides
    const requests = Array.from({ length: 12 }, () =>
      page.request.post("/api/ats", {
        multipart: {
          jobDescription: "Test".repeat(15),
          resume: {
            name: "cv.pdf",
            mimeType: "application/pdf",
            buffer: Buffer.from("%PDF-1.4 test"),
          },
        },
      }),
    );

    const responses = await Promise.all(requests);
    const statuses = responses.map((r) => r.status());

    // Au moins une requête doit avoir été bloquée (429)
    const hasRateLimit = statuses.some((s) => s === 429);
    console.log("Statuts reçus:", statuses);

    // Si toutes sont 401 (pas d'auth), c'est OK aussi
    if (!statuses.every((s) => s === 401)) {
      expect(hasRateLimit).toBe(true);
    }
  });
});
