import { describe, it, expect, beforeEach, vi } from "vitest";
import { RateLimiter } from "@/lib/core/security/rate-limiter";

describe("RateLimiter", () => {
  let rateLimiter: RateLimiter;

  beforeEach(() => {
    // Create a rate limiter with a short window for testing
    rateLimiter = new RateLimiter({
      windowMs: 1000, // 1 second
      maxRequests: 3, // 3 requests per second
    });
  });

  describe("checkLimit", () => {
    it("should allow requests within limit", async () => {
      const result1 = await rateLimiter.checkLimit("127.0.0.1");
      expect(result1.allowed).toBe(true);
      expect(result1.remaining).toBe(2);

      const result2 = await rateLimiter.checkLimit("127.0.0.1");
      expect(result2.allowed).toBe(true);
      expect(result2.remaining).toBe(1);

      const result3 = await rateLimiter.checkLimit("127.0.0.1");
      expect(result3.allowed).toBe(true);
      expect(result3.remaining).toBe(0);
    });

    it("should block requests exceeding limit", async () => {
      // Make 3 requests (at limit)
      await rateLimiter.checkLimit("127.0.0.1");
      await rateLimiter.checkLimit("127.0.0.1");
      await rateLimiter.checkLimit("127.0.0.1");

      // 4th request should be blocked
      const result = await rateLimiter.checkLimit("127.0.0.1");
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it("should reset after window expires", async () => {
      // Make 3 requests (at limit)
      await rateLimiter.checkLimit("127.0.0.1");
      await rateLimiter.checkLimit("127.0.0.1");
      await rateLimiter.checkLimit("127.0.0.1");

      // 4th request should be blocked
      const result1 = await rateLimiter.checkLimit("127.0.0.1");
      expect(result1.allowed).toBe(false);

      // Wait for window to expire
      await new Promise(resolve => setTimeout(resolve, 1100));

      // Should allow new request
      const result2 = await rateLimiter.checkLimit("127.0.0.1");
      expect(result2.allowed).toBe(true);
      expect(result2.remaining).toBe(2);
    });

    it("should track different IPs separately", async () => {
      // IP1 makes 3 requests
      await rateLimiter.checkLimit("127.0.0.1");
      await rateLimiter.checkLimit("127.0.0.1");
      await rateLimiter.checkLimit("127.0.0.1");

      // IP1 should be blocked
      const result1 = await rateLimiter.checkLimit("127.0.0.1");
      expect(result1.allowed).toBe(false);

      // IP2 should still be allowed
      const result2 = await rateLimiter.checkLimit("192.168.1.1");
      expect(result2.allowed).toBe(true);
      expect(result2.remaining).toBe(2);
    });

    it("should include user agent in identifier", async () => {
      const userAgent1 = "Mozilla/5.0";
      const userAgent2 = "Chrome/1.0";

      // Same IP, different user agents
      await rateLimiter.checkLimit("127.0.0.1", userAgent1);
      await rateLimiter.checkLimit("127.0.0.1", userAgent1);
      await rateLimiter.checkLimit("127.0.0.1", userAgent1);

      // Should be blocked for userAgent1
      const result1 = await rateLimiter.checkLimit("127.0.0.1", userAgent1);
      expect(result1.allowed).toBe(false);

      // Should still be allowed for userAgent2
      const result2 = await rateLimiter.checkLimit("127.0.0.1", userAgent2);
      expect(result2.allowed).toBe(true);
    });

    it("should return reset time", async () => {
      const result = await rateLimiter.checkLimit("127.0.0.1");
      expect(result.resetTime).toBeDefined();
      expect(result.resetTime).toBeGreaterThan(Date.now());
    });
  });

  describe("reset", () => {
    it("should reset rate limit for specific identifier", async () => {
      // Make 3 requests (at limit)
      await rateLimiter.checkLimit("127.0.0.1");
      await rateLimiter.checkLimit("127.0.0.1");
      await rateLimiter.checkLimit("127.0.0.1");

      // Should be blocked
      const result1 = await rateLimiter.checkLimit("127.0.0.1");
      expect(result1.allowed).toBe(false);

      // Reset
      rateLimiter.reset("127.0.0.1");

      // Should be allowed again
      const result2 = await rateLimiter.checkLimit("127.0.0.1");
      expect(result2.allowed).toBe(true);
      expect(result2.remaining).toBe(2);
    });
  });
});
