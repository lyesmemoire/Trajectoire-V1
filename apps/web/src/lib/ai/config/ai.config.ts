/**
 * AI Configuration
 *
 * Centralized environment variables and AI settings.
 * Single source of truth for all AI-related configuration.
 *
 * IMPORTANT:
 * - Never accepts an empty OpenAI API key.
 * - Never accepts known placeholder/dummy keys.
 * - Does not require OpenAI to exist merely because this module is imported.
 * - getAIConfig() fails fast only when a real AI operation requires configuration.
 */

import { InfrastructureError } from "@/core/errors";

export interface AIConfig {
  // OpenAI Configuration
  openaiApiKey: string;
  openaiOrganization?: string;
  openaiProject?: string;

  // Provider Selection
  aiProvider: "openai" | "anthropic" | "gemini";

  // Performance Settings
  aiTimeout: number;
  aiMaxRetries: number;

  // Cost Control
  maxCostPerSession: number;
  maxCostPerDay: number;

  // Memory Settings
  conversationWindow: number;
  summaryThreshold: number;
}

function normalizeOptionalString(
  value: string | undefined,
): string | undefined {
  const normalized = value?.trim();

  return normalized || undefined;
}

function isPlaceholderOpenAIKey(
  value: string,
): boolean {
  const normalized = value
    .trim()
    .toLowerCase();

  if (!normalized) {
    return true;
  }

  const exactPlaceholders = new Set([
    "dummy",
    "sk-dummy",
    "test",
    "sk-test",
    "placeholder",
    "changeme",
    "change-me",
    "your-api-key",
    "your-openai-api-key",
    "your_openai_api_key",
  ]);

  if (exactPlaceholders.has(normalized)) {
    return true;
  }

  return (
    normalized.includes("placeholder") ||
    normalized.includes("your-openai") ||
    normalized.includes("changeme")
  );
}

export function hasValidOpenAIKey(
  value: string | undefined = process.env.OPENAI_API_KEY,
): boolean {
  const apiKey = value?.trim();

  if (!apiKey) {
    return false;
  }

  if (isPlaceholderOpenAIKey(apiKey)) {
    return false;
  }

  return apiKey.startsWith("sk-");
}

function createConfig(): AIConfig {
  return {
    openaiApiKey:
      process.env.OPENAI_API_KEY?.trim() || "",

    openaiOrganization:
      normalizeOptionalString(
        process.env.OPENAI_ORGANIZATION,
      ),

    openaiProject:
      normalizeOptionalString(
        process.env.OPENAI_PROJECT,
      ),

    aiProvider:
      (process.env.AI_PROVIDER as AIConfig["aiProvider"]) ||
      "openai",

    aiTimeout:
      Number.parseInt(
        process.env.AI_TIMEOUT || "60000",
        10,
      ),

    aiMaxRetries:
      Number.parseInt(
        process.env.AI_MAX_RETRIES || "3",
        10,
      ),

    maxCostPerSession:
      Number.parseFloat(
        process.env.MAX_COST_PER_SESSION || "1.00",
      ),

    maxCostPerDay:
      Number.parseFloat(
        process.env.MAX_COST_PER_DAY || "10.00",
      ),

    conversationWindow:
      Number.parseInt(
        process.env.CONVERSATION_WINDOW || "10",
        10,
      ),

    summaryThreshold:
      Number.parseInt(
        process.env.SUMMARY_THRESHOLD || "15",
        10,
      ),
  };
}

/**
 * Returns AI configuration for code that actually requires
 * a configured remote AI provider.
 *
 * Throws when OPENAI_API_KEY is absent or is a known placeholder.
 */
export function getAIConfig(): AIConfig {
  const config = createConfig();

  if (!hasValidOpenAIKey(config.openaiApiKey)) {
    throw new InfrastructureError(
      "OPENAI_API_KEY is not configured with a valid non-placeholder key",
      "AIConfig",
    );
  }

  return config;
}

/**
 * Safe configuration check.
 *
 * This function never throws and does not perform any network request.
 */
export function validateAIConfig(): boolean {
  return hasValidOpenAIKey();
}

/**
 * Non-throwing configuration access.
 *
 * Useful for health checks and features capable of operating
 * without remote AI.
 */
export function getOptionalAIConfig(): AIConfig | null {
  const config = createConfig();

  if (!hasValidOpenAIKey(config.openaiApiKey)) {
    return null;
  }

  return config;
}

export default createConfig();