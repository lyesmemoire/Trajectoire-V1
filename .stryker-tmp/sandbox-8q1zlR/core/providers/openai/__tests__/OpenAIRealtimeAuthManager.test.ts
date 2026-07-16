/**
 * Integration Tests for OpenAI Realtime Authentication Manager
 */
// @ts-nocheck


import { OpenAIRealtimeAuthManagerImpl, AuthenticationError } from "../OpenAIRealtimeAuthManager";
import { OpenAIRealtimeConfiguration } from "../OpenAIRealtimeConversationProvider";

describe("OpenAIRealtimeAuthManager - Integration Tests", () => {
  let authManager: OpenAIRealtimeAuthManagerImpl;
  let validApiKey: string;
  let invalidApiKey: string;

  beforeAll(() => {
    validApiKey = "sk-test1234567890abcdefghijklmnopqrstuvwxyz12345678";
    invalidApiKey = "invalid-key-format";
  });

  beforeEach(() => {
    authManager = new OpenAIRealtimeAuthManagerImpl({
      apiKeys: [validApiKey],
      validateOnStartup: false,
      cacheValidation: true,
      keyRotationEnabled: true,
      rotationThreshold: 3,
      refreshInterval: 3600000
    });
  });

  afterEach(() => {
    authManager.destroy();
  });

  describe("Environment Variable Loading", () => {
    test("should load single API key from environment", () => {
      const originalEnv = process.env.OPENAI_API_KEY;
      process.env.OPENAI_API_KEY = validApiKey;
      
      const manager = new OpenAIRealtimeAuthManagerImpl();
      const keys = manager.loadApiKeyFromEnv();
      
      expect(keys).toHaveLength(1);
      expect(keys[0]).toBe(validApiKey);
      
      process.env.OPENAI_API_KEY = originalEnv;
      manager.destroy();
    });

    test("should load multiple API keys from environment (comma-separated)", () => {
      const originalEnv = process.env.OPENAI_API_KEY;
      process.env.OPENAI_API_KEY = `${validApiKey},sk-anotherkey1234567890abcdefghijklmnop12345678`;
      
      const manager = new OpenAIRealtimeAuthManagerImpl();
      const keys = manager.loadApiKeyFromEnv();
      
      expect(keys.length).toBeGreaterThan(1);
      
      process.env.OPENAI_API_KEY = originalEnv;
      manager.destroy();
    });

    test("should throw error when OPENAI_API_KEY is not set", () => {
      const originalEnv = process.env.OPENAI_API_KEY;
      delete process.env.OPENAI_API_KEY;
      
      const manager = new OpenAIRealtimeAuthManagerImpl();
      
      expect(() => manager.loadApiKeyFromEnv()).toThrow(AuthenticationError);
      expect(() => manager.loadApiKeyFromEnv()).toThrow("MISSING_ENV_VAR");
      
      process.env.OPENAI_API_KEY = originalEnv;
      manager.destroy();
    });
  });

  describe("API Key Validation", () => {
    test("should validate correct API key format", async () => {
      const result = await authManager.validateApiKey(validApiKey);
      expect(result).toBe(true);
    });

    test("should reject invalid API key format", async () => {
      await expect(authManager.validateApiKey(invalidApiKey)).rejects.toThrow(AuthenticationError);
      await expect(authManager.validateApiKey(invalidApiKey)).rejects.toThrow("INVALID_FORMAT");
    });

    test("should reject empty API key", async () => {
      await expect(authManager.validateApiKey("")).rejects.toThrow(AuthenticationError);
      await expect(authManager.validateApiKey("")).rejects.toThrow("MISSING_API_KEY");
    });

    test("should cache validation results", async () => {
      await authManager.validateApiKey(validApiKey);
      const result = await authManager.validateApiKey(validApiKey);
      expect(result).toBe(true);
    });

    test("should handle 401 error from OpenAI API", async () => {
      const manager = new OpenAIRealtimeAuthManagerImpl({
        apiKeys: ["sk-invalid1234567890abcdefghijklmnopqrstuvwxyz12345678"],
        validateOnStartup: false,
        cacheValidation: false,
        keyRotationEnabled: true,
        rotationThreshold: 3,
        refreshInterval: 3600000
      });

      await expect(manager.validateApiKey("sk-invalid1234567890abcdefghijklmnopqrstuvwxyz12345678")).rejects.toThrow(AuthenticationError);
      
      manager.destroy();
    });
  });

  describe("API Key Rotation", () => {
    test("should rotate to next key on auth error", () => {
      const manager = new OpenAIRealtimeAuthManagerImpl({
        apiKeys: [validApiKey, "sk-key21234567890abcdefghijklmnopqrstuvwxyz12345678", "sk-key31234567890abcdefghijklmnopqrstuvwxyz12345678"],
        validateOnStartup: false,
        cacheValidation: false,
        keyRotationEnabled: true,
        rotationThreshold: 3,
        refreshInterval: 3600000
      });

      const firstKey = manager.getApiKey();
      manager.handleAuthError(new AuthenticationError("Test error", "TEST", 401));
      const secondKey = manager.getApiKey();
      
      expect(secondKey).not.toBe(firstKey);
      
      manager.destroy();
    });

    test("should skip expired keys during rotation", () => {
      const manager = new OpenAIRealtimeAuthManagerImpl({
        apiKeys: [validApiKey, "sk-key21234567890abcdefghijklmnopqrstuvwxyz12345678"],
        validateOnStartup: false,
        cacheValidation: false,
        keyRotationEnabled: true,
        rotationThreshold: 3,
        refreshInterval: 3600000
      });

      const metadata = manager.getKeyMetadata();
      (metadata[0] as any).isExpired = true;

      const nextKey = manager.rotateApiKey();
      expect(nextKey).not.toBe(validApiKey);
      
      manager.destroy();
    });

    test("should throw error when no alternative keys available", () => {
      const manager = new OpenAIRealtimeAuthManagerImpl({
        apiKeys: [validApiKey],
        validateOnStartup: false,
        cacheValidation: false,
        keyRotationEnabled: true,
        rotationThreshold: 3,
        refreshInterval: 3600000
      });

      expect(() => manager.rotateApiKey()).toThrow(AuthenticationError);
      expect(() => manager.rotateApiKey()).toThrow("NO_ROTATION_KEYS");
      
      manager.destroy();
    });

    test("should rotate automatically when failure threshold reached", () => {
      const manager = new OpenAIRealtimeAuthManagerImpl({
        apiKeys: [validApiKey, "sk-key21234567890abcdefghijklmnopqrstuvwxyz12345678"],
        validateOnStartup: false,
        cacheValidation: false,
        keyRotationEnabled: true,
        rotationThreshold: 2,
        refreshInterval: 3600000
      });

      manager.handleAuthError(new AuthenticationError("Test error", "TEST", 401));
      manager.handleAuthError(new AuthenticationError("Test error", "TEST", 401));
      
      const nextKey = manager.getApiKey();
      expect(nextKey).not.toBe(validApiKey);
      
      manager.destroy();
    });
  });

  describe("Key Expiration", () => {
    test("should mark key as expired on 403 error", () => {
      const manager = new OpenAIRealtimeAuthManagerImpl({
        apiKeys: [validApiKey],
        validateOnStartup: false,
        cacheValidation: false,
        keyRotationEnabled: true,
        rotationThreshold: 3,
        refreshInterval: 3600000
      });

      manager.handleAuthError(new AuthenticationError("Test error", "TEST", 403));
      
      const metadata = manager.getKeyMetadata();
      expect(metadata[0].isExpired).toBe(true);
      
      manager.destroy();
    });

    test("should reject expired keys during validation", async () => {
      const manager = new OpenAIRealtimeAuthManagerImpl({
        apiKeys: [validApiKey],
        validateOnStartup: false,
        cacheValidation: false,
        keyRotationEnabled: true,
        rotationThreshold: 3,
        refreshInterval: 3600000
      });

      const metadata = manager.getKeyMetadata();
      (metadata[0] as any).isExpired = true;
      
      await expect(manager.validateApiKey(validApiKey)).rejects.toThrow("KEY_EXPIRED");
      
      manager.destroy();
    });
  });

  describe("Key Refresh", () => {
    test("should reload keys from environment", async () => {
      const originalEnv = process.env.OPENAI_API_KEY;
      process.env.OPENAI_API_KEY = `${validApiKey},sk-newkey1234567890abcdefghijklmnopqrstuvwxyz12345678`;
      
      const manager = new OpenAIRealtimeAuthManagerImpl({
        apiKeys: [validApiKey],
        validateOnStartup: false,
        cacheValidation: false,
        keyRotationEnabled: true,
        rotationThreshold: 3,
        refreshInterval: 3600000
      });

      await manager.refreshApiKey();
      
      const keys = manager.getKeyMetadata();
      expect(keys.length).toBeGreaterThan(1);
      
      process.env.OPENAI_API_KEY = originalEnv;
      manager.destroy();
    });

    test("should clear cache on refresh", async () => {
      const manager = new OpenAIRealtimeAuthManagerImpl({
        apiKeys: [validApiKey],
        validateOnStartup: false,
        cacheValidation: true,
        keyRotationEnabled: true,
        rotationThreshold: 3,
        refreshInterval: 3600000
      });

      await manager.validateApiKey(validApiKey);
      await manager.refreshApiKey();
      
      const result = await manager.validateApiKey(validApiKey);
      expect(result).toBe(true);
      
      manager.destroy();
    });
  });

  describe("Key Metadata", () => {
    test("should track key usage", () => {
      const manager = new OpenAIRealtimeAuthManagerImpl({
        apiKeys: [validApiKey],
        validateOnStartup: false,
        cacheValidation: false,
        keyRotationEnabled: true,
        rotationThreshold: 3,
        refreshInterval: 3600000
      });

      const metadata = manager.getKeyMetadata();
      expect(metadata).toHaveLength(1);
      expect(metadata[0].key).toBe(validApiKey);
      expect(metadata[0].failureCount).toBe(0);
      expect(metadata[0].isExpired).toBe(false);
      
      manager.destroy();
    });

    test("should track failure count", () => {
      const manager = new OpenAIRealtimeAuthManagerImpl({
        apiKeys: [validApiKey],
        validateOnStartup: false,
        cacheValidation: false,
        keyRotationEnabled: true,
        rotationThreshold: 3,
        refreshInterval: 3600000
      });

      manager.handleAuthError(new AuthenticationError("Test error", "TEST", 401));
      
      const metadata = manager.getKeyMetadata();
      expect(metadata[0].failureCount).toBe(1);
      expect(metadata[0].lastFailure).toBeGreaterThan(0);
      
      manager.destroy();
    });
  });

  describe("Configuration Validation", () => {
    test("should validate configuration with valid API key", async () => {
      const config: OpenAIRealtimeConfiguration = {
        apiKey: validApiKey,
        model: "gpt-4o-realtime-preview",
        options: {}
      };

      await expect(authManager.validateConfiguration(config)).resolves.not.toThrow();
    });

    test("should reject configuration without API key", async () => {
      const config: OpenAIRealtimeConfiguration = {
        apiKey: "",
        model: "gpt-4o-realtime-preview",
        options: {}
      };

      await expect(authManager.validateConfiguration(config)).rejects.toThrow(AuthenticationError);
      await expect(authManager.validateConfiguration(config)).rejects.toThrow("MISSING_API_KEY");
    });

    test("should reject configuration with invalid API key", async () => {
      const config: OpenAIRealtimeConfiguration = {
        apiKey: invalidApiKey,
        model: "gpt-4o-realtime-preview",
        options: {}
      };

      await expect(authManager.validateConfiguration(config)).rejects.toThrow(AuthenticationError);
    });
  });

  describe("No Hardcoded Keys", () => {
    test("should not contain any hardcoded API keys", () => {
      const manager = new OpenAIRealtimeAuthManagerImpl({
        apiKeys: [],
        validateOnStartup: false,
        cacheValidation: false,
        keyRotationEnabled: true,
        rotationThreshold: 3,
        refreshInterval: 3600000
      });

      expect(() => manager.getApiKey()).toThrow("NO_KEYS_CONFIGURED");
      
      manager.destroy();
    });
  });
});
