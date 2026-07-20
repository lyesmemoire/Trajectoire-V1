/**
 * AI Configuration
 * Centralized environment variables and AI settings
 * Single source of truth for all AI-related configuration
 */

import { InfrastructureError } from "@/core/errors";

export interface AIConfig {
  // OpenAI Configuration
  openaiApiKey: string;
  openaiOrganization?: string;
  openaiProject?: string;

  // Provider Selection
  aiProvider: "openai" | "anthropic" | "gemini" | "mistral";

  // Performance Settings
  aiTimeout: number; // milliseconds
  aiMaxRetries: number;

  // Cost Control
  maxCostPerSession: number; // USD
  maxCostPerDay: number; // USD

  // Memory Settings
  conversationWindow: number; // number of messages to keep in window
  summaryThreshold: number; // number of messages before summarizing
}

const config: AIConfig = {
  openaiApiKey: process.env.OPENAI_API_KEY || "",
  openaiOrganization: process.env.OPENAI_ORGANIZATION,
  openaiProject: process.env.OPENAI_PROJECT,
  aiProvider: (process.env.AI_PROVIDER as AIConfig["aiProvider"]) || "openai",
  aiTimeout: parseInt(process.env.AI_TIMEOUT || "60000", 10), // 60 seconds default
  aiMaxRetries: parseInt(process.env.AI_MAX_RETRIES || "3", 10),
  maxCostPerSession: parseFloat(process.env.MAX_COST_PER_SESSION || "1.00"),
  maxCostPerDay: parseFloat(process.env.MAX_COST_PER_DAY || "10.00"),
  conversationWindow: parseInt(process.env.CONVERSATION_WINDOW || "10", 10),
  summaryThreshold: parseInt(process.env.SUMMARY_THRESHOLD || "15", 10),
};

/**
 * Get AI configuration
 * @returns AI configuration object
 */
export function getAIConfig(): AIConfig {
  if (!config.openaiApiKey) {
    throw new InfrastructureError("OPENAI_API_KEY environment variable is not set", "AIConfig");
  }
  return config;
}

/**
 * Validate AI configuration
 * @returns true if configuration is valid
 */
export function validateAIConfig(): boolean {
  try {
    getAIConfig();
    return true;
  } catch {
    return false;
  }
}

export default config;
