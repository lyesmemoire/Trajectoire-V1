/**
 * OpenAI GPT-4o Realtime Authentication Manager
 *
 * Responsibilities:
 * - Manage API key authentication
 * - Validate API keys from environment variables
 * - Handle authentication errors (401/403)
 * - Rotate API keys if multiple are configured
 * - Handle key expiration and refresh
 * - NO business logic, NO reasoning, NO analysis
 * - ONLY authentication management
 */
// @ts-nocheck


import { OpenAIRealtimeConfiguration } from "./OpenAIRealtimeConversationProvider";

// ============================================================================
// AUTHENTICATION CONFIG
// ============================================================================

export interface AuthConfig {
  apiKeys: string[];
  validateOnStartup: boolean;
  cacheValidation: boolean;
  keyRotationEnabled: boolean;
  rotationThreshold: number;
  refreshInterval: number;
}

// ============================================================================
// AUTHENTICATION ERROR
// ============================================================================

export class AuthenticationError extends Error {
  constructor(message: string, public code: string, public statusCode?: number) {
    super(message);
    this.name = "AuthenticationError";
  }
}

// ============================================================================
// API KEY METADATA
// ============================================================================

interface ApiKeyMetadata {
  key: string;
  lastUsed: number;
  failureCount: number;
  lastFailure: number;
  isExpired: boolean;
  expiresAt?: number;
}

// ============================================================================
// AUTHENTICATION MANAGER INTERFACE
// ============================================================================

export interface OpenAIRealtimeAuthManager {
  validateApiKey(apiKey: string): Promise<boolean>;
  getApiKey(): string;
  setApiKey(apiKey: string): void;
  loadApiKeyFromEnv(): string[];
  validateConfiguration(config: OpenAIRealtimeConfiguration): Promise<void>;
  handleAuthError(error: Error): void;
  rotateApiKey(): string;
  refreshApiKey(): Promise<void>;
  getKeyMetadata(): ApiKeyMetadata[];
}

// ============================================================================
// AUTHENTICATION MANAGER IMPLEMENTATION
// ============================================================================

export class OpenAIRealtimeAuthManagerImpl implements OpenAIRealtimeAuthManager {
  private config: AuthConfig;
  private cachedValidation: Map<string, boolean> = new Map();
  private currentApiKeyIndex: number = 0;
  private keyMetadata: Map<string, ApiKeyMetadata> = new Map();
  private refreshInterval: NodeJS.Timeout | null = null;

  constructor(config: AuthConfig = {
    apiKeys: [],
    validateOnStartup: true,
    cacheValidation: true,
    keyRotationEnabled: true,
    rotationThreshold: 3,
    refreshInterval: 3600000 // 1 hour
  }) {
    this.config = config;
    this.initializeKeys();
    this.startRefreshInterval();
  }

  private initializeKeys(): void {
    const envKeys = this.loadApiKeyFromEnv();
    if (envKeys.length > 0) {
      this.config.apiKeys = envKeys;
    }
    
    // Initialize metadata for each key
    for (const key of this.config.apiKeys) {
      this.keyMetadata.set(key, {
        key,
        lastUsed: 0,
        failureCount: 0,
        lastFailure: 0,
        isExpired: false
      });
    }
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    if (!apiKey) {
      throw new AuthenticationError("API key is required", "MISSING_API_KEY");
    }

    const metadata = this.keyMetadata.get(apiKey);
    if (metadata?.isExpired) {
      throw new AuthenticationError("API key has expired", "KEY_EXPIRED");
    }

    // Check cache
    if (this.config.cacheValidation && this.cachedValidation.has(apiKey)) {
      return this.cachedValidation.get(apiKey)!;
    }

    // Validate format (OpenAI API keys start with "sk-")
    const isValidFormat = this.validateApiKeyFormat(apiKey);
    
    if (!isValidFormat) {
      throw new AuthenticationError("Invalid API key format", "INVALID_FORMAT");
    }

    // Perform real validation by making a test request
    const isValid = await this.validateApiKeyWithOpenAI(apiKey);
    
    if (!isValid) {
      throw new AuthenticationError("Invalid API key", "INVALID_API_KEY", 401);
    }

    // Cache validation result
    if (this.config.cacheValidation) {
      this.cachedValidation.set(apiKey, true);
    }

    return true;
  }

  getApiKey(): string {
    if (this.config.apiKeys.length === 0) {
      throw new AuthenticationError("No API keys configured", "NO_KEYS_CONFIGURED");
    }

    const currentKey = this.config.apiKeys[this.currentApiKeyIndex];
    const metadata = this.keyMetadata.get(currentKey);
    
    // Rotate if current key has too many failures
    if (metadata && metadata.failureCount >= this.config.rotationThreshold) {
      return this.rotateApiKey();
    }

    return currentKey;
  }

  setApiKey(apiKey: string): void {
    this.config.apiKeys = [apiKey];
    this.currentApiKeyIndex = 0;
    this.keyMetadata.set(apiKey, {
      key: apiKey,
      lastUsed: 0,
      failureCount: 0,
      lastFailure: 0,
      isExpired: false
    });
  }

  loadApiKeyFromEnv(): string[] {
    // Try to load from environment variable (support multiple keys separated by comma)
    const envVar = process.env.OPENAI_API_KEY || "";
    
    if (!envVar) {
      throw new AuthenticationError("OPENAI_API_KEY environment variable not set", "MISSING_ENV_VAR");
    }

    // Split by comma to support multiple keys
    const keys = envVar.split(',').map(k => k.trim()).filter(k => k.length > 0);
    
    if (keys.length === 0) {
      throw new AuthenticationError("No valid API keys found in environment variable", "NO_VALID_KEYS");
    }

    return keys;
  }

  async validateConfiguration(config: OpenAIRealtimeConfiguration): Promise<void> {
    if (!config.apiKey) {
      throw new AuthenticationError("API key is required in configuration", "MISSING_API_KEY");
    }

    const isValid = await this.validateApiKey(config.apiKey);
    if (!isValid) {
      throw new AuthenticationError("Invalid API key", "INVALID_API_KEY");
    }
  }

  handleAuthError(error: Error): void {
    const currentKey = this.config.apiKeys[this.currentApiKeyIndex];
    const metadata = this.keyMetadata.get(currentKey);

    if (error instanceof AuthenticationError) {
      // Handle 401/403 errors
      if (error.statusCode === 401 || error.statusCode === 403) {
        if (metadata) {
          metadata.failureCount++;
          metadata.lastFailure = Date.now();
          
          // Mark as expired if it's a 403 error
          if (error.statusCode === 403) {
            metadata.isExpired = true;
          }
        }

        // Rotate to next key if enabled
        if (this.config.keyRotationEnabled) {
          this.rotateApiKey();
        }
      }
    }
  }

  rotateApiKey(): string {
    if (this.config.apiKeys.length <= 1) {
      throw new AuthenticationError("No alternative API keys available for rotation", "NO_ROTATION_KEYS");
    }

    // Move to next key
    this.currentApiKeyIndex = (this.currentApiKeyIndex + 1) % this.config.apiKeys.length;
    
    const newKey = this.config.apiKeys[this.currentApiKeyIndex];
    const metadata = this.keyMetadata.get(newKey);
    
    if (metadata && metadata.isExpired) {
      // Skip expired keys
      return this.rotateApiKey();
    }

    return newKey;
  }

  async refreshApiKey(): Promise<void> {
    // Reload keys from environment
    const envKeys = this.loadApiKeyFromEnv();
    
    // Update configuration with new keys
    this.config.apiKeys = envKeys;
    
    // Reset current index
    this.currentApiKeyIndex = 0;
    
    // Clear cache
    this.cachedValidation.clear();
    
    // Reinitialize metadata
    this.keyMetadata.clear();
    for (const key of this.config.apiKeys) {
      this.keyMetadata.set(key, {
        key,
        lastUsed: 0,
        failureCount: 0,
        lastFailure: 0,
        isExpired: false
      });
    }
  }

  getKeyMetadata(): ApiKeyMetadata[] {
    return Array.from(this.keyMetadata.values());
  }

  private startRefreshInterval(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }

    this.refreshInterval = setInterval(() => {
      this.refreshApiKey().catch(error => {
        console.error("Failed to refresh API keys:", error);
      });
    }, this.config.refreshInterval);
  }

  private stopRefreshInterval(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  private validateApiKeyFormat(apiKey: string): boolean {
    // OpenAI API keys start with "sk-" and are typically 51 characters
    // Newer keys may have different lengths, so we use a more flexible pattern
    const openAIKeyPattern = /^sk-[a-zA-Z0-9_-]{20,}$/;
    return openAIKeyPattern.test(apiKey);
  }

  private async validateApiKeyWithOpenAI(apiKey: string): Promise<boolean> {
    try {
      // Make a simple request to OpenAI API to validate the key
      const response = await fetch("https://api.openai.com/v1/models", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      });

      if (response.status === 401) {
        throw new AuthenticationError("Invalid API key", "INVALID_API_KEY", 401);
      }

      if (response.status === 403) {
        throw new AuthenticationError("API key does not have required permissions", "INSUFFICIENT_PERMISSIONS", 403);
      }

      return response.ok;
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }
      console.error("Failed to validate API key with OpenAI:", error);
      return false;
    }
  }

  clearCache(): void {
    this.cachedValidation.clear();
  }

  destroy(): void {
    this.stopRefreshInterval();
    this.cachedValidation.clear();
    this.keyMetadata.clear();
  }
}
