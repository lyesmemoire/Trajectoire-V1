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
    // Test if database health check passes via health API
    const response = await request.get("/api/health");
    const data = await response.json();

    expect(data.database).toBe("ok");
    expect(data.status).toBe("ok");
  });
});
