// @ts-nocheck
import { describe, it, expect, vi } from "vitest";

// Mock environment and Redis dependencies
vi.mock("../../lib/env.server", () => ({
  envServer: {
    UPSTASH_REDIS_REST_URL: null,
    UPSTASH_REDIS_REST_TOKEN: null,
    NODE_ENV: "test",
  },
}));

vi.mock("@upstash/redis", () => ({
  Redis: vi.fn(),
}));

vi.mock("../../lib/core/observability/logger", () => ({
  LoggerProvider: {
    getLogger: () => ({
      warn: vi.fn(),
    }),
  },
}));

import { createRateLimiter } from "../../lib/security/rate-limit";

describe("Rate Limiter", () => {
  it("should return success when Redis is not configured", async () => {
    const limiter = createRateLimiter(5, "1 m");
    const result = await limiter.limit("test-key");

    expect(result.success).toBe(true);
    expect(result.limit).toBe(5);
    expect(result.remaining).toBe(5);
    expect(result.reset).toBe(0);
  });

  it("should allow multiple calls when Redis is not configured", async () => {
    const limiter = createRateLimiter(5, "1 m");
    
    const result1 = await limiter.limit("test-key");
    const result2 = await limiter.limit("test-key");
    const result3 = await limiter.limit("test-key");

    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);
    expect(result3.success).toBe(true);
  });

  it("should respect different limits", async () => {
    const limiter5 = createRateLimiter(5, "1 m");
    const limiter10 = createRateLimiter(10, "1 m");

    const result5 = await limiter5.limit("test-key");
    const result10 = await limiter10.limit("test-key");

    expect(result5.limit).toBe(5);
    expect(result10.limit).toBe(10);
  });

  it("should handle different keys independently", async () => {
    const limiter = createRateLimiter(5, "1 m");

    const result1 = await limiter.limit("user-1");
    const result2 = await limiter.limit("user-2");

    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);
  });
});
