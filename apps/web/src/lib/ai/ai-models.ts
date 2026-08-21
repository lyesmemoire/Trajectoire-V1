/**
 * Trajectoire AI Model Gateway
 *
 * Central point for selecting remote AI models.
 *
 * Goals:
 * - business modules never depend directly on a vendor
 * - OpenAI is the preferred remote provider
 * - application can detect when remote AI is unavailable
 * - no dummy API keys
 * - no provider initialization when no API key exists
 */

import { createOpenAI } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";

export type AIModelTier =
  | "fast"
  | "reasoning";

export type AIProviderName =
  | "openai"
  | "local";

export interface AIAvailability {
  available: boolean;
  provider: AIProviderName;
  reason?: string;
}

function normalizeSecret(
  value: string | undefined,
): string {
  return value?.trim() ?? "";
}

function isPlaceholderSecret(
  value: string,
): boolean {
  if (!value) {
    return true;
  }

  const normalized =
    value.toLowerCase();

  return (
    normalized === "dummy" ||
    normalized === "sk-dummy" ||
    normalized === "test" ||
    normalized === "sk-test" ||
    normalized === "placeholder" ||
    normalized === "changeme" ||
    normalized === "change-me" ||
    normalized.startsWith("your-") ||
    normalized.includes("placeholder")
  );
}

export function getOpenAIKey():
  string | null {
  const apiKey =
    normalizeSecret(
      process.env.OPENAI_API_KEY,
    );

  if (
    isPlaceholderSecret(
      apiKey,
    )
  ) {
    return null;
  }

  return apiKey;
}

export function getAIAvailability():
  AIAvailability {
  const apiKey =
    getOpenAIKey();

  if (!apiKey) {
    return {
      available: false,
      provider: "local",
      reason:
        "OPENAI_API_KEY is not configured",
    };
  }

  return {
    available: true,
    provider: "openai",
  };
}

export function isRemoteAIAvailable():
  boolean {
  return getAIAvailability()
    .available;
}

function createOpenAIProvider() {
  const apiKey =
    getOpenAIKey();

  if (!apiKey) {
    throw new Error(
      "Remote AI is unavailable because OPENAI_API_KEY is not configured.",
    );
  }

  return createOpenAI({
    apiKey,
  });
}

export function getAIModel(
  tier: AIModelTier = "fast",
): LanguageModel {
  const openai =
    createOpenAIProvider();

  if (
    tier === "reasoning"
  ) {
    return openai(
      "gpt-4o",
    ) as unknown as LanguageModel;
  }

  return openai(
    "gpt-4o-mini",
  ) as unknown as LanguageModel;
}

export function getFastAIModel():
  LanguageModel {
  return getAIModel(
    "fast",
  );
}

export function getReasoningAIModel():
  LanguageModel {
  return getAIModel(
    "reasoning",
  );
}