/**
 * ConfigurationService
 *
 * Infrastructure configuration service.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY configuration management.
 */

export interface OpenAIConfig {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

export interface TelemetryConfig {
  enabled: boolean;
  endpoint?: string;
  apiKey?: string;
  samplingRate: number;
}

export interface AnalyticsConfig {
  enabled: boolean;
  endpoint?: string;
  apiKey?: string;
  flushInterval: number;
}

export interface LoggingConfig {
  level: string;
  format: string;
  output: string;
}

export interface InfrastructureConfig {
  openai: OpenAIConfig;
  supabase: SupabaseConfig;
  telemetry: TelemetryConfig;
  analytics: AnalyticsConfig;
  logging: LoggingConfig;
}

export class ConfigurationService {
  private static instance: ConfigurationService;
  private config: InfrastructureConfig;

  private constructor() {
    this.config = this.loadConfiguration();
  }

  static getInstance(): ConfigurationService {
    if (!ConfigurationService.instance) {
      ConfigurationService.instance = new ConfigurationService();
    }
    return ConfigurationService.instance;
  }

  getOpenAIConfig(): OpenAIConfig {
    return this.config.openai;
  }

  getSupabaseConfig(): SupabaseConfig {
    return this.config.supabase;
  }

  getTelemetryConfig(): TelemetryConfig {
    return this.config.telemetry;
  }

  getAnalyticsConfig(): AnalyticsConfig {
    return this.config.analytics;
  }

  getLoggingConfig(): LoggingConfig {
    return this.config.logging;
  }

  private loadConfiguration(): InfrastructureConfig {
    return {
      openai: {
        apiKey: process.env.OPENAI_API_KEY || "",
        model: process.env.OPENAI_MODEL || "gpt-4",
        temperature: parseFloat(process.env.OPENAI_TEMPERATURE || "0.7"),
        maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || "2000"),
        timeout: parseInt(process.env.OPENAI_TIMEOUT || "30000"),
        retryAttempts: parseInt(process.env.OPENAI_RETRY_ATTEMPTS || "3"),
        retryDelay: parseInt(process.env.OPENAI_RETRY_DELAY || "1000"),
      },
      supabase: {
        url: process.env.SUPABASE_URL || "",
        anonKey: process.env.SUPABASE_ANON_KEY || "",
        serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
        timeout: parseInt(process.env.SUPABASE_TIMEOUT || "30000"),
        retryAttempts: parseInt(process.env.SUPABASE_RETRY_ATTEMPTS || "3"),
        retryDelay: parseInt(process.env.SUPABASE_RETRY_DELAY || "1000"),
      },
      telemetry: {
        enabled: process.env.TELEMETRY_ENABLED === "true",
        endpoint: process.env.TELEMETRY_ENDPOINT,
        apiKey: process.env.TELEMETRY_API_KEY,
        samplingRate: parseFloat(process.env.TELEMETRY_SAMPLING_RATE || "1.0"),
      },
      analytics: {
        enabled: process.env.ANALYTICS_ENABLED === "true",
        endpoint: process.env.ANALYTICS_ENDPOINT,
        apiKey: process.env.ANALYTICS_API_KEY,
        flushInterval: parseInt(process.env.ANALYTICS_FLUSH_INTERVAL || "60000"),
      },
      logging: {
        level: process.env.LOG_LEVEL || "INFO",
        format: process.env.LOG_FORMAT || "JSON",
        output: process.env.LOG_OUTPUT || "CONSOLE",
      },
    };
  }

  validate(): boolean {
    const errors: string[] = [];

    if (!this.config.openai.apiKey) {
      errors.push("OPENAI_API_KEY is required");
    }

    if (!this.config.supabase.url) {
      errors.push("SUPABASE_URL is required");
    }

    if (!this.config.supabase.anonKey) {
      errors.push("SUPABASE_ANON_KEY is required");
    }

    if (errors.length > 0) {
      console.error("Configuration validation failed:", errors);
      return false;
    }

    return true;
  }
}
