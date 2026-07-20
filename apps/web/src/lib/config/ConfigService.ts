/**
 * Config Service
 * Centralized configuration management with Zod validation
 * Single source of truth for all environment variables and configuration
 */

import { z } from "zod";

// Environment enum
export enum Environment {
  DEVELOPMENT = "development",
  STAGING = "staging",
  PRODUCTION = "production",
  TEST = "test",
}

// Database configuration schema
const DatabaseConfigSchema = z.object({
  url: z.string().url(),
  poolSize: z.number().int().positive().default(10),
  connectionTimeout: z.number().int().positive().default(5000),
});

// OpenAI configuration schema
const OpenAIConfigSchema = z.object({
  apiKey: z.string().startsWith("sk-"),
  model: z.string().default("gpt-4"),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().int().positive().default(2000),
  timeout: z.number().int().positive().default(30000),
});

// Cache configuration schema
const CacheConfigSchema = z.object({
  enabled: z.boolean().default(true),
  defaultTTL: z.number().int().positive().default(300000), // 5 minutes
  cleanupInterval: z.number().int().positive().default(60000), // 1 minute
  maxSize: z.number().int().positive().default(1000),
});

// Security configuration schema
const SecurityConfigSchema = z.object({
  rateLimitEnabled: z.boolean().default(true),
  rateLimitWindow: z.number().int().positive().default(60000), // 1 minute
  rateLimitMax: z.number().int().positive().default(100),
  corsEnabled: z.boolean().default(true),
  corsOrigins: z.array(z.string()).default(["*"]),
});

// Monitoring configuration schema
const MonitoringConfigSchema = z.object({
  sentryDsn: z.string().url().optional(),
  sentryEnvironment: z.string().default(Environment.DEVELOPMENT),
  sentryTracesSampleRate: z.number().min(0).max(1).default(0.1),
  logLevel: z.enum(["debug", "info", "warn", "error"]).default("info"),
});

// Main configuration schema
const ConfigSchema = z.object({
  environment: z.nativeEnum(Environment).default(Environment.DEVELOPMENT),
  version: z.string().default("1.0.0"),
  port: z.number().int().positive().default(3000),
  database: DatabaseConfigSchema,
  openai: OpenAIConfigSchema,
  cache: CacheConfigSchema,
  security: SecurityConfigSchema,
  monitoring: MonitoringConfigSchema,
});

export type Config = z.infer<typeof ConfigSchema>;

class ConfigService {
  private config: Config;
  private static instance: ConfigService;

  private constructor() {
    this.config = this.loadConfig();
  }

  /**
   * Load configuration from environment variables
   */
  private loadConfig(): Config {
    const environment = (process.env.NODE_ENV || Environment.DEVELOPMENT) as Environment;

    const rawConfig = {
      environment,
      version: process.env.APP_VERSION || "1.0.0",
      port: parseInt(process.env.PORT || "3000", 10),
      database: {
        url: process.env.DATABASE_URL || process.env.SUPABASE_URL || "",
        poolSize: parseInt(process.env.DATABASE_POOL_SIZE || "10", 10),
        connectionTimeout: parseInt(process.env.DATABASE_CONNECTION_TIMEOUT || "5000", 10),
      },
      openai: {
        apiKey: process.env.OPENAI_API_KEY || "",
        model: process.env.OPENAI_MODEL || "gpt-4",
        temperature: parseFloat(process.env.OPENAI_TEMPERATURE || "0.7"),
        maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || "2000", 10),
        timeout: parseInt(process.env.OPENAI_TIMEOUT || "30000", 10),
      },
      cache: {
        enabled: process.env.CACHE_ENABLED !== "false",
        defaultTTL: parseInt(process.env.CACHE_DEFAULT_TTL || "300000", 10),
        cleanupInterval: parseInt(process.env.CACHE_CLEANUP_INTERVAL || "60000", 10),
        maxSize: parseInt(process.env.CACHE_MAX_SIZE || "1000", 10),
      },
      security: {
        rateLimitEnabled: process.env.RATE_LIMIT_ENABLED !== "false",
        rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || "60000", 10),
        rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
        corsEnabled: process.env.CORS_ENABLED !== "false",
        corsOrigins: process.env.CORS_ORIGINS?.split(",") || ["*"],
      },
      monitoring: {
        sentryDsn: process.env.SENTRY_DSN,
        sentryEnvironment: process.env.SENTRY_ENVIRONMENT || environment,
        sentryTracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || "0.1"),
        logLevel: (process.env.LOG_LEVEL as any) || "info",
      },
    };

    // Validate configuration
    try {
      return ConfigSchema.parse(rawConfig);
    } catch (error) {
      console.error("Configuration validation failed:", error);
      throw new Error("Invalid configuration");
    }
  }

  /**
   * Get singleton instance
   */
  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  /**
   * Get entire configuration
   */
  getConfig(): Config {
    return this.config;
  }

  /**
   * Get specific configuration value
   */
  get<K extends keyof Config>(key: K): Config[K] {
    return this.config[key];
  }

  /**
   * Check if running in specific environment
   */
  isEnvironment(env: Environment): boolean {
    return this.config.environment === env;
  }

  /**
   * Check if running in production
   */
  isProduction(): boolean {
    return this.isEnvironment(Environment.PRODUCTION);
  }

  /**
   * Check if running in development
   */
  isDevelopment(): boolean {
    return this.isEnvironment(Environment.DEVELOPMENT);
  }

  /**
   * Check if running in staging
   */
  isStaging(): boolean {
    return this.isEnvironment(Environment.STAGING);
  }

  /**
   * Get configuration as JSON (for debugging, exclude secrets)
   */
  toJSON(): Record<string, any> {
    return {
      environment: this.config.environment,
      version: this.config.version,
      port: this.config.port,
      database: {
        url: this.config.database.url.replace(/:[^:@]+@/, ":****@"), // Hide password
        poolSize: this.config.database.poolSize,
        connectionTimeout: this.config.database.connectionTimeout,
      },
      openai: {
        apiKey: this.config.openai.apiKey ? "****" : "",
        model: this.config.openai.model,
        temperature: this.config.openai.temperature,
        maxTokens: this.config.openai.maxTokens,
        timeout: this.config.openai.timeout,
      },
      cache: this.config.cache,
      security: this.config.security,
      monitoring: {
        sentryDsn: this.config.monitoring.sentryDsn ? "****" : "",
        sentryEnvironment: this.config.monitoring.sentryEnvironment,
        sentryTracesSampleRate: this.config.monitoring.sentryTracesSampleRate,
        logLevel: this.config.monitoring.logLevel,
      },
    };
  }
}

// Export singleton instance
export const config = ConfigService.getInstance();
