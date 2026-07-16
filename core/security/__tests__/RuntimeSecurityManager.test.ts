/**
 * Integration Tests for Runtime Security Manager
 */

import { RuntimeSecurityManagerImpl, SecurityViolation } from "../RuntimeSecurityManager";

describe("RuntimeSecurityManager - Integration Tests", () => {
  let securityManager: RuntimeSecurityManagerImpl;

  beforeEach(() => {
    securityManager = new RuntimeSecurityManagerImpl();
  });

  afterEach(async () => {
    await securityManager.stop();
  });

  describe("Payload Validation", () => {
    test("should validate valid payload", async () => {
      await securityManager.start();
      
      const payload = { message: "test", data: 123 };
      const result = securityManager.validatePayload(payload);
      
      expect(result.isValid).toBe(true);
      expect(result.violations).toHaveLength(0);
    });

    test("should reject null payload", async () => {
      await securityManager.start();
      
      const result = securityManager.validatePayload(null);
      
      expect(result.isValid).toBe(false);
      expect(result.violations).toHaveLength(1);
      expect(result.violations[0].type).toBe("payload_invalid");
    });

    test("should reject non-object payload", async () => {
      await securityManager.start();
      
      const result = securityManager.validatePayload("string");
      
      expect(result.isValid).toBe(false);
      expect(result.violations[0].type).toBe("payload_invalid");
    });

    test("should reject oversized payload", async () => {
      await securityManager.start();
      
      const largePayload = { data: "x".repeat(11 * 1024 * 1024) };
      const result = securityManager.validatePayload(largePayload);
      
      expect(result.isValid).toBe(false);
      expect(result.violations[0].type).toBe("payload_invalid");
      expect(result.violations[0].message).toContain("size exceeds");
    });

    test("should detect script injection", async () => {
      await securityManager.start();
      
      const maliciousPayload = { message: "<script>alert('xss')</script>" };
      const result = securityManager.validatePayload(maliciousPayload);
      
      expect(result.isValid).toBe(false);
      expect(result.violations[0].severity).toBe("critical");
    });

    test("should detect javascript: protocol", async () => {
      await securityManager.start();
      
      const maliciousPayload = { url: "javascript:alert('xss')" };
      const result = securityManager.validatePayload(maliciousPayload);
      
      expect(result.isValid).toBe(false);
      expect(result.violations[0].severity).toBe("critical");
    });

    test("should detect eval function", async () => {
      await securityManager.start();
      
      const maliciousPayload = { code: "eval('malicious')" };
      const result = securityManager.validatePayload(maliciousPayload);
      
      expect(result.isValid).toBe(false);
      expect(result.violations[0].severity).toBe("critical");
    });

    test("should detect prototype pollution", async () => {
      await securityManager.start();
      
      const maliciousPayload = JSON.parse('{"__proto__": {"admin": true}}');
      const result = securityManager.validatePayload(maliciousPayload);
      
      expect(result.isValid).toBe(false);
      expect(result.violations[0].type).toBe("payload_invalid");
      expect(result.violations[0].message).toContain("prototype pollution");
    });

    test("should skip validation when disabled", async () => {
      await securityManager.start();
      
      const manager = securityManager as unknown as { defaultOptions: { enablePayloadValidation: boolean } };
      manager.defaultOptions.enablePayloadValidation = false;
      
      const maliciousPayload = { message: "<script>alert('xss')</script>" };
      const result = securityManager.validatePayload(maliciousPayload);
      
      expect(result.isValid).toBe(true);
    });
  });

  describe("Audio Validation", () => {
    test("should validate valid audio data", async () => {
      await securityManager.start();
      
      const audioData = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
      const result = securityManager.validateAudio(audioData);
      
      expect(result.isValid).toBe(true);
      expect(result.violations).toHaveLength(0);
    });

    test("should reject oversized audio chunk", async () => {
      await securityManager.start();
      
      const largeAudio = new Uint8Array(6 * 1024 * 1024);
      const result = securityManager.validateAudio(largeAudio);
      
      expect(result.isValid).toBe(false);
      expect(result.violations[0].type).toBe("audio_invalid");
      expect(result.violations[0].message).toContain("size exceeds");
    });

    test("should reject odd-length audio data (invalid PCM16)", async () => {
      await securityManager.start();
      
      const oddLengthAudio = new Uint8Array([1, 2, 3]);
      const result = securityManager.validateAudio(oddLengthAudio);
      
      expect(result.isValid).toBe(false);
      expect(result.violations[0].type).toBe("audio_invalid");
      expect(result.violations[0].message).toContain("PCM16");
    });

    test("should detect silence attack (all zeros)", async () => {
      await securityManager.start();
      
      const silentAudio = new Uint8Array(1000);
      const result = securityManager.validateAudio(silentAudio);
      
      expect(result.isValid).toBe(false);
      expect(result.violations[0].type).toBe("audio_invalid");
      expect(result.violations[0].message).toContain("silence attack");
    });

    test("should skip audio validation when disabled", async () => {
      await securityManager.start();
      
      const manager = securityManager as unknown as { defaultOptions: { enableAudioValidation: boolean } };
      manager.defaultOptions.enableAudioValidation = false;
      
      const silentAudio = new Uint8Array(1000);
      const result = securityManager.validateAudio(silentAudio);
      
      expect(result.isValid).toBe(true);
    });
  });

  describe("Quotas", () => {
    test("should enforce payload quota", async () => {
      await securityManager.start();
      
      const manager = securityManager as unknown as { defaultOptions: { quotas: { maxPayloadSize: number } } };
      manager.defaultOptions.quotas.maxPayloadSize = 5;
      
      for (let i = 0; i < 5; i++) {
        expect(securityManager.checkQuota("user1", "payload")).toBe(true);
      }
      
      expect(securityManager.checkQuota("user1", "payload")).toBe(false);
      
      const metrics = securityManager.getSecurityMetrics();
      expect(metrics.quotaExceeded).toBe(1);
    });

    test("should enforce audio quota", async () => {
      await securityManager.start();
      
      const manager = securityManager as unknown as { defaultOptions: { quotas: { maxAudioChunkSize: number } } };
      manager.defaultOptions.quotas.maxAudioChunkSize = 3;
      
      for (let i = 0; i < 3; i++) {
        expect(securityManager.checkQuota("user1", "audio")).toBe(true);
      }
      
      expect(securityManager.checkQuota("user1", "audio")).toBe(false);
    });

    test("should enforce request quota", async () => {
      await securityManager.start();
      
      const manager = securityManager as unknown as { defaultOptions: { quotas: { maxRequestsPerMinute: number } } };
      manager.defaultOptions.quotas.maxRequestsPerMinute = 5;
      
      for (let i = 0; i < 5; i++) {
        expect(securityManager.checkQuota("user1", "request")).toBe(true);
      }
      
      expect(securityManager.checkQuota("user1", "request")).toBe(false);
    });

    test("should track quota per user", async () => {
      await securityManager.start();
      
      const manager = securityManager as unknown as { defaultOptions: { quotas: { maxPayloadSize: number } } };
      manager.defaultOptions.quotas.maxPayloadSize = 3;
      
      // User 1 exceeds quota
      for (let i = 0; i < 4; i++) {
        securityManager.checkQuota("user1", "payload");
      }
      
      // User 2 should still be allowed
      expect(securityManager.checkQuota("user2", "payload")).toBe(true);
    });

    test("should skip quota check when disabled", async () => {
      await securityManager.start();
      
      const manager = securityManager as unknown as { defaultOptions: { enableQuotas: boolean; quotas: { maxPayloadSize: number } } };
      manager.defaultOptions.enableQuotas = false;
      manager.defaultOptions.quotas.maxPayloadSize = 1;
      
      for (let i = 0; i < 10; i++) {
        expect(securityManager.checkQuota("user1", "payload")).toBe(true);
      }
    });
  });

  describe("Rate Limiting", () => {
    test("should enforce rate limit", async () => {
      await securityManager.start();
      
      const manager = securityManager as unknown as { defaultOptions: { quotas: { maxRequestsPerMinute: number } } };
      manager.defaultOptions.quotas.maxRequestsPerMinute = 5;
      
      for (let i = 0; i < 5; i++) {
        expect(securityManager.checkRateLimit("user1")).toBe(true);
      }
      
      expect(securityManager.checkRateLimit("user1")).toBe(false);
      
      const metrics = securityManager.getSecurityMetrics();
      expect(metrics.rateLimitHits).toBe(1);
    });

    test("should reset rate limit after time window", async () => {
      await securityManager.start();
      
      const manager = securityManager as unknown as { defaultOptions: { quotas: { maxRequestsPerMinute: number } } };
      manager.defaultOptions.quotas.maxRequestsPerMinute = 5;
      
      for (let i = 0; i < 5; i++) {
        securityManager.checkRateLimit("user1");
      }
      
      expect(securityManager.checkRateLimit("user1")).toBe(false);
      
      // Manually clear old timestamps to simulate time passing
      const timestamps = (securityManager as unknown as { requestCounters: Map<string, number[]> }).requestCounters;
      timestamps.set("user1", []);
      
      expect(securityManager.checkRateLimit("user1")).toBe(true);
    });

    test("should track rate limit per user", async () => {
      await securityManager.start();
      
      const manager = securityManager as unknown as { defaultOptions: { quotas: { maxRequestsPerMinute: number } } };
      manager.defaultOptions.quotas.maxRequestsPerMinute = 5;
      
      // User 1 exceeds rate limit
      for (let i = 0; i < 6; i++) {
        securityManager.checkRateLimit("user1");
      }
      
      // User 2 should still be allowed
      expect(securityManager.checkRateLimit("user2")).toBe(true);
    });

    test("should skip rate limiting when disabled", async () => {
      await securityManager.start();
      
      const manager = securityManager as unknown as { defaultOptions: { enableRateLimiting: boolean; quotas: { maxRequestsPerMinute: number } } };
      manager.defaultOptions.enableRateLimiting = false;
      manager.defaultOptions.quotas.maxRequestsPerMinute = 5;
      
      for (let i = 0; i < 10; i++) {
        expect(securityManager.checkRateLimit("user1")).toBe(true);
      }
    });
  });

  describe("Memory Limits", () => {
    test("should enforce memory limit", async () => {
      await securityManager.start();
      
      const manager = securityManager as unknown as { defaultOptions: { quotas: { maxMemoryUsage: number } } };
      manager.defaultOptions.quotas.maxMemoryUsage = 1000;
      
      expect(securityManager.checkMemoryLimit(500)).toBe(true);
      expect(securityManager.checkMemoryLimit(1500)).toBe(false);
      
      const metrics = securityManager.getSecurityMetrics();
      expect(metrics.memoryLimitHits).toBe(1);
    });

    test("should skip memory limit check when disabled", async () => {
      await securityManager.start();
      
      const manager = securityManager as unknown as { defaultOptions: { enableMemoryLimits: boolean; quotas: { maxMemoryUsage: number } } };
      manager.defaultOptions.enableMemoryLimits = false;
      manager.defaultOptions.quotas.maxMemoryUsage = 1000;
      
      expect(securityManager.checkMemoryLimit(10000)).toBe(true);
    });
  });

  describe("WebSocket Protection", () => {
    test("should enforce concurrent connection limit", async () => {
      await securityManager.start();
      
      const manager = securityManager as unknown as { defaultOptions: { quotas: { maxConcurrentConnections: number } } };
      manager.defaultOptions.quotas.maxConcurrentConnections = 3;
      
      expect(securityManager.protectWebSocket("conn1")).toBe(true);
      expect(securityManager.protectWebSocket("conn2")).toBe(true);
      expect(securityManager.protectWebSocket("conn3")).toBe(true);
      expect(securityManager.protectWebSocket("conn4")).toBe(false);
    });

    test("should allow reconnection from same identifier", async () => {
      await securityManager.start();
      
      const manager = securityManager as unknown as { defaultOptions: { quotas: { maxConcurrentConnections: number } } };
      manager.defaultOptions.quotas.maxConcurrentConnections = 2;
      
      expect(securityManager.protectWebSocket("conn1")).toBe(true);
      expect(securityManager.protectWebSocket("conn1")).toBe(true); // Same connection
    });

    test("should skip WebSocket protection when disabled", async () => {
      await securityManager.start();
      
      const manager = securityManager as unknown as { defaultOptions: { enableWebSocketProtection: boolean; quotas: { maxConcurrentConnections: number } } };
      manager.defaultOptions.enableWebSocketProtection = false;
      manager.defaultOptions.quotas.maxConcurrentConnections = 1;
      
      expect(securityManager.protectWebSocket("conn1")).toBe(true);
      expect(securityManager.protectWebSocket("conn2")).toBe(true);
    });
  });

  describe("Security Metrics", () => {
    test("should track validation metrics", async () => {
      await securityManager.start();
      
      securityManager.validatePayload({ test: "data" });
      securityManager.validateAudio(new Uint8Array([1, 2, 3, 4]));
      
      const metrics = securityManager.getSecurityMetrics();
      expect(metrics.totalValidations).toBe(2);
    });

    test("should track violations by type", async () => {
      await securityManager.start();
      
      securityManager.validatePayload("<script>alert('xss')</script>");
      securityManager.validatePayload(null);
      
      const metrics = securityManager.getSecurityMetrics();
      expect(metrics.violationsByType.get("payload_invalid")).toBe(2);
    });

    test("should track blocked requests", async () => {
      await securityManager.start();
      
      securityManager.validatePayload("<script>alert('xss')</script>");
      securityManager.validateAudio(new Uint8Array(6 * 1024 * 1024));
      
      const metrics = securityManager.getSecurityMetrics();
      expect(metrics.blockedRequests).toBe(2);
    });

    test("should reset metrics on stop", async () => {
      await securityManager.start();
      
      securityManager.validatePayload("<script>alert('xss')</script>");
      
      let metrics = securityManager.getSecurityMetrics();
      expect(metrics.totalViolations).toBe(1);
      
      await securityManager.stop();
      await securityManager.start();
      
      metrics = securityManager.getSecurityMetrics();
      expect(metrics.totalViolations).toBe(0);
    });
  });

  describe("Violation Callbacks", () => {
    test("should emit violation events", async () => {
      await securityManager.start();
      
      const violations: SecurityViolation[] = [];
      securityManager.subscribeToViolations((violation) => {
        violations.push(violation);
      });
      
      securityManager.validatePayload("<script>alert('xss')</script>");
      
      expect(violations).toHaveLength(1);
      expect(violations[0].type).toBe("payload_invalid");
      expect(violations[0].severity).toBe("critical");
    });

    test("should handle callback errors gracefully", async () => {
      await securityManager.start();
      
      securityManager.subscribeToViolations(() => {
        throw new Error("Test error");
      });
      
      securityManager.subscribeToViolations((violation) => {
        expect(violation).toBeDefined();
      });
      
      // Should not throw
      securityManager.validatePayload("<script>alert('xss')</script>");
    });
  });

  describe("Lifecycle", () => {
    test("should start and stop correctly", async () => {
      await securityManager.start();
      
      const result = securityManager.validatePayload({ test: "data" });
      expect(result.isValid).toBe(true);
      
      await securityManager.stop();
      
      const resultAfterStop = securityManager.validatePayload({ test: "data" });
      expect(resultAfterStop.isValid).toBe(true); // Should skip validation when not running
    });

    test("should handle multiple start/stop cycles", async () => {
      for (let i = 0; i < 3; i++) {
        await securityManager.start();
        const result = securityManager.validatePayload({ test: "data" });
        expect(result.isValid).toBe(true);
        await securityManager.stop();
      }
    });
  });

  describe("Invalid Payload Protection", () => {
    test("should block multiple attack vectors", async () => {
      await securityManager.start();
      
      const attacks = [
        { message: "<script>alert('xss')</script>" },
        { url: "javascript:alert('xss')" },
        { code: "eval('malicious')" },
        { handler: "onerror=alert('xss')" },
        { loader: "onload=alert('xss')" }
      ];
      
      for (const attack of attacks) {
        const result = securityManager.validatePayload(attack);
        expect(result.isValid).toBe(false);
      }
      
      const metrics = securityManager.getSecurityMetrics();
      expect(metrics.blockedRequests).toBe(5);
    });

    test("should allow safe payloads", async () => {
      await securityManager.start();
      
      const safePayloads = [
        { message: "Hello, world!" },
        { data: { nested: { value: 123 } } },
        { items: [1, 2, 3, 4, 5] },
        { config: { setting: "value" } }
      ];
      
      for (const payload of safePayloads) {
        const result = securityManager.validatePayload(payload);
        expect(result.isValid).toBe(true);
      }
    });
  });
});
