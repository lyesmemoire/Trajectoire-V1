// lib/openai.ts
// Lazy-loaded OpenAI client — jamais instancié au build time.
import { envServer } from "@/lib/env.server";
import OpenAI from 'openai';

export interface AIResponse<T = string> {
  data: T;
  tokensUsed: { prompt: number; completion: number; total: number };
  estimatedCostEur: number;
}

// Tarifs gpt-4o-mini (mai 2025)
const COST_PER_1K_INPUT = 0.000_150;
const COST_PER_1K_OUTPUT = 0.000_600;

function calculateCost(prompt: number, completion: number): number {
  return (
    ((prompt / 1000) * COST_PER_1K_INPUT +
      (completion / 1000) * COST_PER_1K_OUTPUT) *
    0.92
  );
}

export async function generateText(prompt: string, maxTokens = 1000, ): Promise<AIResponse<string>> {
  const openai = new OpenAI({ apiKey: envServer.OPENAI_API_KEY });
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: maxTokens,
    temperature: 0.7,
  });

  const content = res.choices[0]?.message?.content ?? "";
  const u = res.usage!;

  return {
    data: content,
    tokensUsed: {
      prompt: u.prompt_tokens,
      completion: u.completion_tokens,
      total: u.total_tokens,
    },
    estimatedCostEur: calculateCost(u.prompt_tokens, u.completion_tokens),
  };
}

export async function generateJSON<T>(
  prompt: string,
  maxTokens = 1500,
): Promise<AIResponse<T>> {
  const openai = new OpenAI({ apiKey: envServer.OPENAI_API_KEY });
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant. Always respond with valid JSON only.",
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
    max_tokens: maxTokens,
    temperature: 0.3,
  });

  const raw = res.choices[0]?.message?.content ?? "{}";
  const u = res.usage!;

  let parsed: T;
  try {
    parsed = JSON.parse(raw) as T;
  } catch {
    throw new Error(
      "AI_JSON_PARSE_ERROR: Invalid JSON despite json_object mode",
    );
  }

  return {
    data: parsed,
    tokensUsed: {
      prompt: u.prompt_tokens,
      completion: u.completion_tokens,
      total: u.total_tokens,
    },
    estimatedCostEur: calculateCost(u.prompt_tokens, u.completion_tokens),
  };
}
