import { test, expect, devices } from "@playwright/test";

/**
 * 📱 MOBILE RESILIENCE & RECOVERY AUDIT
 * Scenario: iPhone Safari + Background/Foreground + Session Restore.
 */

test.use({
  ...devices["iPhone 13"],
  permissions: ["microphone"],
});

test("Scenario: Session survives backgrounding and recovery", async ({
  page,
}) => {
  console.log("🚀 Testing: Mobile Background Recovery...");

  // 1. Enter Session
  await page.goto("/dashboard/interview/session");

  // 2. Start Session
  await page.fill(
    'input[placeholder="Titre du poste visé"]',
    "Senior Product Manager",
  );
  await page.click('button:has-text("Lancer l\'entraînement")');

  // Wait for session to be active
  await expect(page.locator("text=Question 1")).toBeVisible();

  // 3. Simulate Backgrounding (App switch / Call)
  console.log("📡 Simulating: App Switch (Background)");
  await page.evaluate(() => {
    Object.defineProperty(document, "visibilityState", {
      value: "hidden",
      writable: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });

  // 4. Wait & Return to Foreground
  await page.waitForTimeout(2000);
  console.log("📡 Simulating: Return to App (Foreground)");
  await page.evaluate(() => {
    Object.defineProperty(document, "visibilityState", {
      value: "visible",
      writable: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });

  // 5. Check if Connection Restored banner or state is stable
  await expect(page.locator("text=Connexion Restaurée")).toBeVisible();

  // 6. Simulate Page Refresh (Crash Recovery)
  console.log("📡 Simulating: Browser Crash / Refresh");
  await page.reload();

  // 7. Check if "Reprise disponible" banner appears
  await expect(page.locator("text=Reprise disponible")).toBeVisible();

  // 8. Click Resume and verify we are back at Question 1
  await page.click('button:has-text("Reprendre")');
  await expect(page.locator("text=Question 1")).toBeVisible();

  console.log("✅ Success: Mobile Session Continuity Validated.");
});
