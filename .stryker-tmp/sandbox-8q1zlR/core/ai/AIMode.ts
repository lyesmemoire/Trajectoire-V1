/**
 * AI Mode Configuration
 *
 * Controls whether AI operations use real providers or mock responses.
 * Allows testing without API keys and cost-free development.
 */
// @ts-nocheck


export type AIMode = "real" | "mock";

/**
 * Get the current AI mode from environment variable
 * Defaults to "real" if not set
 */
export function getAIMode(): AIMode {
  const mode = process.env.AI_MODE || process.env.NEXT_PUBLIC_AI_MODE || "real";
  return mode === "mock" ? "mock" : "real";
}

/**
 * Set the AI mode (for testing purposes)
 */
export function setAIMode(mode: AIMode): void {
  if (typeof process !== "undefined") {
    process.env.AI_MODE = mode;
  }
}

/**
 * Check if AI is in mock mode
 */
export function isMockMode(): boolean {
  return getAIMode() === "mock";
}

/**
 * Check if AI is in real mode
 */
export function isRealMode(): boolean {
  return getAIMode() === "real";
}
