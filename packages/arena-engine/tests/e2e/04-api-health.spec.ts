import { test, expect } from "@playwright/test";

test.describe("🩺 API Health & Performance Audit", () => {
  test("API routes should respond in less than 3000ms", async ({ request }) => {
    const start = Date.now();
    const response = await request.get("/api/health"); // Assuming health check route
    const duration = Date.now() - start;

    expect(response.ok()).toBeTruthy();
    expect(duration).toBeLessThan(3000);
  });

  test("Critical services connectivity check", async ({ request }) => {
    // Test if Supabase/Mistral health check passes via internal API
    const response = await request.get("/api/admin/system-health");
    const data = await response.json();

    expect(data.supabase).toBe("connected");
    expect(data.mistral).toBe("connected");
    expect(data.redis).toBe("connected");
  });
});
