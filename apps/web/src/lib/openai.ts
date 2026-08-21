// apps/web/src/lib/openai.ts
//
// Legacy OpenAI helpers.
//
// Design goals:
// - no OpenAI client is created during module import
// - placeholder / missing keys never trigger a remote request
// - public function signatures stay unchanged
// - callers receive deterministic fallback responses
// - real OpenAI usage activates automatically once a valid key exists

import OpenAI from "openai";

import {
  getOptionalAIConfig,
} from "@/lib/ai/config/ai.config";

export interface AIResponse<T = string> {
  data: T;

  tokensUsed: {
    prompt: number;
    completion: number;
    total: number;
  };

  estimatedCostEur: number;
}

const COST_PER_1K_INPUT =
  0.000_150;

const COST_PER_1K_OUTPUT =
  0.000_600;

function calculateCost(
  prompt: number,
  completion: number,
): number {
  return (
    (
      (prompt / 1000) *
        COST_PER_1K_INPUT +
      (completion / 1000) *
        COST_PER_1K_OUTPUT
    ) *
    0.92
  );
}

function createZeroUsage(): AIResponse<never>["tokensUsed"] {
  return {
    prompt: 0,
    completion: 0,
    total: 0,
  };
}

function getConfiguredOpenAI(): OpenAI | null {
  const config =
    getOptionalAIConfig();

  if (!config) {
    return null;
  }

  return new OpenAI({
    apiKey:
      config.openaiApiKey,

    organization:
      config.openaiOrganization,

    project:
      config.openaiProject,
  });
}

function buildTextFallback(
  prompt: string,
): string {
  const normalized =
    prompt
      .replace(/\s+/g, " ")
      .trim();

  if (!normalized) {
    return "";
  }

  /*
   * Safe deterministic fallback.
   *
   * This intentionally does not pretend to be an AI-generated
   * answer. It gives callers a stable non-empty response for
   * generic helper flows while remote AI is unavailable.
   */
  return [
    "Analyse IA distante indisponible.",
    "Le contenu a été conservé pour traitement local.",
  ].join(" ");
}

function buildJSONFallback<T>(): T {
  /*
   * Legacy generateJSON callers previously expected JSON data.
   * Returning an empty object preserves the historical fallback
   * behavior without fabricating domain-specific information.
   */
  return {} as T;
}

export async function generateText(
  prompt: string,
  maxTokens = 1000,
): Promise<AIResponse<string>> {
  const openai =
    getConfiguredOpenAI();

  if (!openai) {
    return {
      data:
        buildTextFallback(
          prompt,
        ),

      tokensUsed:
        createZeroUsage(),

      estimatedCostEur: 0,
    };
  }

  try {
    const res =
      await openai.chat.completions.create({
        model:
          "gpt-4o-mini",

        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],

        max_tokens:
          maxTokens,

        temperature:
          0.7,
      });

    const content =
      res.choices[0]
        ?.message
        ?.content ?? "";

    const promptTokens =
      res.usage
        ?.prompt_tokens ?? 0;

    const completionTokens =
      res.usage
        ?.completion_tokens ?? 0;

    const totalTokens =
      res.usage
        ?.total_tokens ??
      promptTokens +
        completionTokens;

    return {
      data:
        content,

      tokensUsed: {
        prompt:
          promptTokens,

        completion:
          completionTokens,

        total:
          totalTokens,
      },

      estimatedCostEur:
        calculateCost(
          promptTokens,
          completionTokens,
        ),
    };
  } catch {
    return {
      data:
        buildTextFallback(
          prompt,
        ),

      tokensUsed:
        createZeroUsage(),

      estimatedCostEur: 0,
    };
  }
}

export async function generateJSON<T>(
  prompt: string,
  maxTokens = 1500,
): Promise<AIResponse<T>> {
  const openai =
    getConfiguredOpenAI();

  if (!openai) {
    return {
      data:
        buildJSONFallback<T>(),

      tokensUsed:
        createZeroUsage(),

      estimatedCostEur: 0,
    };
  }

  try {
    const res =
      await openai.chat.completions.create({
        model:
          "gpt-4o-mini",

        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant. Always respond with valid JSON only.",
          },

          {
            role: "user",
            content: prompt,
          },
        ],

        response_format: {
          type:
            "json_object",
        },

        max_tokens:
          maxTokens,

        temperature:
          0.3,
      });

    const raw =
      res.choices[0]
        ?.message
        ?.content ?? "{}";

    const promptTokens =
      res.usage
        ?.prompt_tokens ?? 0;

    const completionTokens =
      res.usage
        ?.completion_tokens ?? 0;

    const totalTokens =
      res.usage
        ?.total_tokens ??
      promptTokens +
        completionTokens;

    let parsed: T;

    try {
      parsed =
        JSON.parse(
          raw,
        ) as T;
    } catch {
      parsed =
        buildJSONFallback<T>();
    }

    return {
      data:
        parsed,

      tokensUsed: {
        prompt:
          promptTokens,

        completion:
          completionTokens,

        total:
          totalTokens,
      },

      estimatedCostEur:
        calculateCost(
          promptTokens,
          completionTokens,
        ),
    };
  } catch {
    return {
      data:
        buildJSONFallback<T>(),

      tokensUsed:
        createZeroUsage(),

      estimatedCostEur: 0,
    };
  }
}