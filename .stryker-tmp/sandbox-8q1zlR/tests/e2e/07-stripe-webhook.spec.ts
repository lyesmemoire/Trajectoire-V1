// @ts-nocheck
import { test, expect } from "@playwright/test";

test.describe("💳 Stripe Webhook — Sécurité", () => {
  test("✅ Requête sans signature Stripe → rejetée (400/401)", async ({
    page,
  }) => {
    const response = await page.request.post("/api/stripe/webhook", {
      data: { type: "checkout.session.completed", data: { object: {} } },
      headers: {
        "Content-Type": "application/json",
        // Pas de stripe-signature → doit être rejeté
      },
    });
    expect([400, 401, 403]).toContain(response.status());
  });

  test("✅ Requête avec signature invalide → rejetée (400)", async ({
    page,
  }) => {
    const response = await page.request.post("/api/stripe/webhook", {
      data: JSON.stringify({ type: "checkout.session.completed" }),
      headers: {
        "Content-Type": "application/json",
        "stripe-signature": "signature_completement_fausse",
      },
    });
    expect([400, 401, 403]).toContain(response.status());
  });

  test("✅ Méthode GET → non autorisée (405)", async ({ page }) => {
    const response = await page.request.get("/api/stripe/webhook");
    expect([404, 405]).toContain(response.status());
  });
});
