// lib/rate-limiting/__tests__/centralized-rate-limit.service.test.ts
//
// TESTS FOR CENTRALIZED RATE LIMITING SERVICE
// Comprehensive test coverage for all rate limiting functionality

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { CentralizedRateLimitService, RateLimitScope, RouteType } from "../centralized-rate-limit.service";

// Mock Redis
vi.mock("@upstash/redis", () => ({
  Redis: vi.fn().mockImplementation(() => ({
    zremrangebyscore: vi.fn().mockResolvedValue(0),
    zcount: vi.fn().mockResolvedValue(0),
    zadd: vi.fn().mockResolvedValue(1),
    expire: vi.fn().mockResolvedValue(1),
    zrange: vi.fn().mockResolvedValue([]),
    del: vi.fn().mockResolvedValue(1),
  })),
}));

describe("CentralizedRateLimitService", () => {
  let service: CentralizedRateLimitService;

  beforeEach(() => {
    service = new CentralizedRateLimitService();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("checkRateLimit", () => {
    it("should allow requests within limit", async () => {
      const result = await service.checkRateLimit(
        RateLimitScope.IP,
        "127.0.0.1",
        RouteType.API
      );

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBeGreaterThanOrEqual(0);
      expect(result.scope).toBe(RateLimitScope.IP);
      expect(result.identifier).toBe("127.0.0.1");
    });

    it("should block requests exceeding limit", async () => {
      // Mock Redis to return count exceeding limit
      const mockRedis = (service as any).redis;
      mockRedis.zcount.mockResolvedValue(150); // Exceeds limit of 100
      mockRedis.zrange.mockResolvedValue([["1234567890", 1234567890]]);

      const result = await service.checkRateLimit(
        RateLimitScope.IP,
        "127.0.0.1",
        RouteType.API
      );

      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
      expect(result.retryAfter).toBeDefined();
    });

    it("should use burst capacity when configured", async () => {
      const result = await service.checkRateLimit(
        RateLimitScope.IP,
        "127.0.0.1",
        RouteType.API
      );

      expect(result.allowed).toBe(true);
    });

    it("should fail-open when Redis is unavailable", async () => {
      // Create service without Redis
      const serviceNoRedis = new CentralizedRateLimitService();
      (serviceNoRedis as any).redis = null;

      const result = await serviceNoRedis.checkRateLimit(
        RateLimitScope.IP,
        "127.0.0.1",
        RouteType.API
      );

      expect(result.allowed).toBe(true);
    });

    it("should handle different scopes correctly", async () => {
      const scopes = [
        RateLimitScope.IP,
        RateLimitScope.USER,
        RateLimitScope.SESSION,
        RateLimitScope.ORGANISATION,
      ];

      for (const scope of scopes) {
        const result = await service.checkRateLimit(
          scope,
          "test-identifier",
          RouteType.API
        );
        expect(result.scope).toBe(scope);
      }
    });

    it("should handle different route types with correct limits", async () => {
      const routeTypes = [
        RouteType.API,
        RouteType.AUTH,
        RouteType.UPLOAD,
        RouteType.GRAPH,
        RouteType.COPILOT,
      ];

      for (const routeType of routeTypes) {
        const result = await service.checkRateLimit(
          RateLimitScope.IP,
          "127.0.0.1",
          routeType
        );
        expect(result.allowed).toBe(true);
      }
    });
  });

  describe("getHeaders", () => {
    it("should generate correct rate limit headers", () => {
      const result = {
        allowed: true,
        remaining: 50,
        resetTime: new Date("2026-08-06T12:00:00Z"),
        scope: RateLimitScope.IP,
        identifier: "127.0.0.1",
      };

      const headers = service.getHeaders(result, RouteType.API);

      expect(headers["X-RateLimit-Limit"]).toBe("100");
      expect(headers["X-RateLimit-Remaining"]).toBe("50");
      expect(headers["X-RateLimit-Reset"]).toBeDefined();
      expect(headers["X-RateLimit-Scope"]).toBe("IP");
      expect(headers["Retry-After"]).toBeUndefined();
    });

    it("should include Retry-After header when not allowed", () => {
      const result = {
        allowed: false,
        remaining: 0,
        resetTime: new Date(Date.now() + 30000),
        retryAfter: 30,
        scope: RateLimitScope.IP,
        identifier: "127.0.0.1",
      };

      const headers = service.getHeaders(result, RouteType.API);

      expect(headers["Retry-After"]).toBe("30");
    });
  });

  describe("resetRateLimit", () => {
    it("should reset rate limit for identifier", async () => {
      const mockRedis = (service as any).redis;
      mockRedis.del.mockResolvedValue(1);

      await service.resetRateLimit(RateLimitScope.IP, "127.0.0.1", RouteType.API);

      expect(mockRedis.del).toHaveBeenCalled();
    });

    it("should handle Redis unavailability gracefully", async () => {
      const serviceNoRedis = new CentralizedRateLimitService();
      (serviceNoRedis as any).redis = null;

      await expect(
        serviceNoRedis.resetRateLimit(RateLimitScope.IP, "127.0.0.1", RouteType.API)
      ).resolves.not.toThrow();
    });
  });

  describe("getUsageStats", () => {
    it("should return current usage statistics", async () => {
      const mockRedis = (service as any).redis;
      mockRedis.zcount.mockResolvedValue(45);

      const stats = await service.getUsageStats(
        RateLimitScope.IP,
        "127.0.0.1",
        RouteType.API
      );

      expect(stats.current).toBe(45);
      expect(stats.limit).toBe(100);
      expect(stats.window).toBe(60);
    });

    it("should return zero stats when Redis is unavailable", async () => {
      const serviceNoRedis = new CentralizedRateLimitService();
      (serviceNoRedis as any).redis = null;

      const stats = await serviceNoRedis.getUsageStats(
        RateLimitScope.IP,
        "127.0.0.1",
        RouteType.API
      );

      expect(stats.current).toBe(0);
      expect(stats.limit).toBe(100);
    });
  });

  describe("sliding window algorithm", () => {
    it("should use sliding window for accurate rate limiting", async () => {
      const mockRedis = (service as any).redis;
      mockRedis.zcount.mockResolvedValue(50); // Within limit

      const result = await service.checkRateLimit(
        RateLimitScope.IP,
        "127.0.0.1",
        RouteType.API
      );

      expect(result.allowed).toBe(true);
      expect(mockRedis.zremrangebyscore).toHaveBeenCalled(); // Cleanup expired
      expect(mockRedis.zadd).toHaveBeenCalled(); // Add current request
    });

    it("should clean up expired entries", async () => {
      const mockRedis = (service as any).redis;
      mockRedis.zcount.mockResolvedValue(0);

      await service.checkRateLimit(
        RateLimitScope.IP,
        "127.0.0.1",
        RouteType.API
      );

      expect(mockRedis.zremrangebyscore).toHaveBeenCalled();
    });
  });

  describe("burst capability", () => {
    it("should allow burst requests within burst window", async () => {
      const mockRedis = (service as any).redis;
      // Main window: 95/100 (within limit)
      // Burst window: 70/75 (within burst limit)
      mockRedis.zcount
        .mockResolvedValueOnce(95) // Main window count
        .mockResolvedValueOnce(70); // Burst window count

      const result = await service.checkRateLimit(
        RateLimitScope.IP,
        "127.0.0.1",
        RouteType.API
      );

      expect(result.allowed).toBe(true);
    });

    it("should block when burst capacity is exceeded", async () => {
      const mockRedis = (service as any).redis;
      // Main window: 95/100 (within limit)
      // Burst window: 75/75 (at burst limit)
      mockRedis.zcount
        .mockResolvedValueOnce(95) // Main window count
        .mockResolvedValueOnce(75); // Burst window count

      const result = await service.checkRateLimit(
        RateLimitScope.IP,
        "127.0.0.1",
        RouteType.API
      );

      expect(result.allowed).toBe(false);
    });
  });

  describe("error handling", () => {
    it("should handle Redis errors gracefully", async () => {
      const mockRedis = (service as any).redis;
      mockRedis.zcount.mockRejectedValue(new Error("Redis connection failed"));

      const result = await service.checkRateLimit(
        RateLimitScope.IP,
        "127.0.0.1",
        RouteType.API
      );

      expect(result.allowed).toBe(true); // Fail-open
    });

    it("should log errors when Redis fails", async () => {
      const mockRedis = (service as any).redis;
      mockRedis.zcount.mockRejectedValue(new Error("Redis connection failed"));

      const loggerSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      await service.checkRateLimit(
        RateLimitScope.IP,
        "127.0.0.1",
        RouteType.API
      );

      expect(loggerSpy).toHaveBeenCalled();
      loggerSpy.mockRestore();
    });
  });

  describe("key generation", () => {
    it("should generate unique keys for different scopes", () => {
      const key1 = (service as any).buildKey(RateLimitScope.IP, "127.0.0.1", RouteType.API);
      const key2 = (service as any).buildKey(RateLimitScope.USER, "user123", RouteType.API);
      const key3 = (service as any).buildKey(RateLimitScope.IP, "127.0.0.1", RouteType.AUTH);

      expect(key1).not.toBe(key2);
      expect(key1).not.toBe(key3);
      expect(key2).not.toBe(key3);
    });

    it("should include all components in key", () => {
      const key = (service as any).buildKey(RateLimitScope.IP, "127.0.0.1", RouteType.API);
      
      expect(key).toContain("IP");
      expect(key).toContain("127.0.0.1");
      expect(key).toContain("api");
    });
  });
});
