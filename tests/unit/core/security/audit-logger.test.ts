import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { auditLogger, AuditEventType } from "../../../../lib/core/security/audit-logger";

describe("AuditLogger", () => {
  let consoleLogSpy: any;

  beforeEach(() => {
    // Clear console.log mock before each test
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  describe("logLoginSuccess", () => {
    it("should log successful login", () => {
      consoleLogSpy.mockClear();
      
      auditLogger.logLoginSuccess("user-123", "test@example.com", "127.0.0.1", "Mozilla/5.0", "corr-123");

      expect(consoleLogSpy).toHaveBeenCalled();
      const logCall = consoleLogSpy.mock.calls[consoleLogSpy.mock.calls.length - 1][0];
      const logData = JSON.parse(logCall);
      
      expect(logData.level).toBe("AUDIT");
      expect(logData.event).toBe(AuditEventType.LOGIN_SUCCESS);
      expect(logData.userId).toBe("user-123");
      expect(logData.email).toMatch(/te\*\*\*@example\.com/); // Email should be sanitized
      expect(logData.ip).toBe("127.0.0.1");
      expect(logData.userAgent).toBe("Mozilla/5.0");
      expect(logData.correlationId).toBe("corr-123");
    });

    it("should sanitize email in login success log", () => {
      consoleLogSpy.mockClear();
      
      auditLogger.logLoginSuccess("user-123", "verylongemailaddress@domain.com");

      const logCall = consoleLogSpy.mock.calls[consoleLogSpy.mock.calls.length - 1][0];
      const logData = JSON.parse(logCall);
      
      expect(logData.email).toMatch(/ve\*\*\*@domain\.com/);
      expect(logData.email).not.toBe("verylongemailaddress@domain.com");
    });
  });

  describe("logLoginFailed", () => {
    it("should log failed login", () => {
      consoleLogSpy.mockClear();
      
      auditLogger.logLoginFailed("test@example.com", "127.0.0.1", "Mozilla/5.0", "corr-123", "Invalid credentials");

      expect(consoleLogSpy).toHaveBeenCalled();
      const logCall = consoleLogSpy.mock.calls[consoleLogSpy.mock.calls.length - 1][0];
      const logData = JSON.parse(logCall);
      
      expect(logData.level).toBe("AUDIT");
      expect(logData.event).toBe(AuditEventType.LOGIN_FAILED);
      expect(logData.userId).toBe("anonymous");
      expect(logData.email).toMatch(/te\*\*\*@example\.com/);
      expect(logData.metadata).toEqual({ reason: "Invalid credentials" });
    });
  });

  describe("logRegisterSuccess", () => {
    it("should log successful registration", () => {
      consoleLogSpy.mockClear();
      
      auditLogger.logRegisterSuccess("user-456", "newuser@example.com", "127.0.0.1", "Mozilla/5.0", "corr-456");

      expect(consoleLogSpy).toHaveBeenCalled();
      const logCall = consoleLogSpy.mock.calls[consoleLogSpy.mock.calls.length - 1][0];
      const logData = JSON.parse(logCall);
      
      expect(logData.level).toBe("AUDIT");
      expect(logData.event).toBe(AuditEventType.REGISTER_SUCCESS);
      expect(logData.userId).toBe("user-456");
      expect(logData.email).toMatch(/ne\*\*\*@example\.com/);
    });
  });

  describe("logRegisterFailed", () => {
    it("should log failed registration", () => {
      consoleLogSpy.mockClear();
      
      auditLogger.logRegisterFailed("existing@example.com", "127.0.0.1", "Mozilla/5.0", "corr-789", "Email already exists");

      expect(consoleLogSpy).toHaveBeenCalled();
      const logCall = consoleLogSpy.mock.calls[consoleLogSpy.mock.calls.length - 1][0];
      const logData = JSON.parse(logCall);
      
      expect(logData.level).toBe("AUDIT");
      expect(logData.event).toBe(AuditEventType.REGISTER_FAILED);
      expect(logData.metadata).toEqual({ reason: "Email already exists" });
    });
  });

  describe("logLogout", () => {
    it("should log logout", () => {
      consoleLogSpy.mockClear();
      
      auditLogger.logLogout("user-123", "test@example.com", "127.0.0.1", "Mozilla/5.0", "corr-123");

      expect(consoleLogSpy).toHaveBeenCalled();
      const logCall = consoleLogSpy.mock.calls[consoleLogSpy.mock.calls.length - 1][0];
      const logData = JSON.parse(logCall);
      
      expect(logData.level).toBe("AUDIT");
      expect(logData.event).toBe(AuditEventType.LOGOUT);
      expect(logData.userId).toBe("user-123");
    });

    it("should log logout without email", () => {
      consoleLogSpy.mockClear();
      
      auditLogger.logLogout("user-123");

      expect(consoleLogSpy).toHaveBeenCalled();
      const logCall = consoleLogSpy.mock.calls[consoleLogSpy.mock.calls.length - 1][0];
      const logData = JSON.parse(logCall);
      
      expect(logData.email).toBeUndefined();
    });
  });

  describe("logPasswordResetRequest", () => {
    it("should log password reset request", () => {
      consoleLogSpy.mockClear();
      
      auditLogger.logPasswordResetRequest("user@example.com", "127.0.0.1", "Mozilla/5.0", "corr-123");

      expect(consoleLogSpy).toHaveBeenCalled();
      const logCall = consoleLogSpy.mock.calls[consoleLogSpy.mock.calls.length - 1][0];
      const logData = JSON.parse(logCall);
      
      expect(logData.level).toBe("AUDIT");
      expect(logData.event).toBe(AuditEventType.PASSWORD_RESET_REQUEST);
      expect(logData.email).toMatch(/us\*\*\*@example\.com/);
    });
  });

  describe("logPasswordResetSuccess", () => {
    it("should log successful password reset", () => {
      consoleLogSpy.mockClear();
      
      auditLogger.logPasswordResetSuccess("user-123", "user@example.com", "127.0.0.1", "Mozilla/5.0", "corr-123");

      expect(consoleLogSpy).toHaveBeenCalled();
      const logCall = consoleLogSpy.mock.calls[consoleLogSpy.mock.calls.length - 1][0];
      const logData = JSON.parse(logCall);
      
      expect(logData.level).toBe("AUDIT");
      expect(logData.event).toBe(AuditEventType.PASSWORD_RESET_SUCCESS);
      expect(logData.userId).toBe("user-123");
    });
  });

  describe("logEmailVerificationSent", () => {
    it("should log email verification sent", () => {
      consoleLogSpy.mockClear();
      
      auditLogger.logEmailVerificationSent("user@example.com", "127.0.0.1", "Mozilla/5.0", "corr-123");

      expect(consoleLogSpy).toHaveBeenCalled();
      const logCall = consoleLogSpy.mock.calls[consoleLogSpy.mock.calls.length - 1][0];
      const logData = JSON.parse(logCall);
      
      expect(logData.level).toBe("AUDIT");
      expect(logData.event).toBe(AuditEventType.EMAIL_VERIFICATION_SENT);
      expect(logData.email).toMatch(/us\*\*\*@example\.com/);
    });
  });

  describe("sanitizeEmail", () => {
    it("should handle invalid email", () => {
      consoleLogSpy.mockClear();
      
      auditLogger.logLoginSuccess("user-123", "invalid-email");

      const logCall = consoleLogSpy.mock.calls[consoleLogSpy.mock.calls.length - 1][0];
      const logData = JSON.parse(logCall);
      
      expect(logData.email).toBe("***@***");
    });

    it("should handle undefined email", () => {
      consoleLogSpy.mockClear();
      
      auditLogger.logLogout("user-123");

      const logCall = consoleLogSpy.mock.calls[consoleLogSpy.mock.calls.length - 1][0];
      const logData = JSON.parse(logCall);
      
      expect(logData.email).toBeUndefined();
    });
  });

  describe("sanitizeUserAgent", () => {
    it("should truncate long user agent", () => {
      consoleLogSpy.mockClear();
      
      const longUserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 " + "x".repeat(200);
      
      auditLogger.logLoginSuccess("user-123", "test@example.com", "127.0.0.1", longUserAgent);

      const logCall = consoleLogSpy.mock.calls[consoleLogSpy.mock.calls.length - 1][0];
      const logData = JSON.parse(logCall);
      
      expect(logData.userAgent).toBeDefined();
      expect(logData.userAgent?.length).toBeLessThanOrEqual(100);
    });

    it("should handle undefined user agent", () => {
      consoleLogSpy.mockClear();
      
      auditLogger.logLoginSuccess("user-123", "test@example.com", "127.0.0.1");

      const logCall = consoleLogSpy.mock.calls[consoleLogSpy.mock.calls.length - 1][0];
      const logData = JSON.parse(logCall);
      
      expect(logData.userAgent).toBeUndefined();
    });
  });
});
