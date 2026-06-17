import OpenAI from "openai";
import { z } from "zod";

// ─── Score Tier System ─────────────────────────────────────────

export type ScoreTier = "Weak" | "Below Market" | "Competitive" | "Strong" | "Elite";

export function getScoreTier(score: number): ScoreTier {
  if (score < 5.0) return "Weak";
  if (score < 6.5) return "Below Market";
  if (score < 7.5) return "Competitive";
  if (score < 8.5) return "Strong";
  return "Elite";
}

// ─── Score Utilities ───────────────────────────────────────────

/**
 * Universal score clamper. Never let a score exceed boundaries.
 */
export function clampScore(value: number, min = 0, max = 10): number {
  if (typeof value !== "number" || Number.isNaN(value)) return min;
  if (value < min) return min;
  if (value > max) return max;
  return Math.round(value * 10) / 10; // Round to 1 decimal
}

/**
 * Maps a 0–10 score to a calibrated percentile.
 * Uses a non-linear piecewise-linear mapping so the distribution
 * is realistic and avoids central clustering:
 *   3.0 → 15th    5.0 → 40th    6.0 → 50th
 *   7.0 → 65th    8.0 → 80th    8.5 → 85th    9.0 → 92nd    10 → 99th
 */
export function scoreToPercentile(score: number): number {
  const clamped = clampScore(score, 0, 10);
  const map: [number, number][] = [
    [0, 0], [2, 5], [3, 15], [4, 28], [5, 40],
    [6, 50], [6.5, 58], [7, 65], [7.5, 73],
    [8, 80], [8.5, 85], [9, 92], [9.5, 96], [10, 99],
  ];

  for (let i = 1; i < map.length; i++) {
    const entry0 = map[i - 1];
    const entry1 = map[i];
    if (!entry0 || !entry1) continue;
    const [x0, y0] = entry0;
    const [x1, y1] = entry1;
    if (clamped <= x1) {
      const ratio = (clamped - x0) / (x1 - x0);
      return Math.round(y0 + ratio * (y1 - y0));
    }
  }
  return 99;
}

/** @deprecated Use scoreToPercentile instead for calibrated mapping. */
export function normalizeScore(score: number): number {
  return scoreToPercentile(score);
}

// ─── Provider Detection ────────────────────────────────────────

export type LlmProvider = "openai" | "mistral";

function detectProvider(): LlmProvider {
  const explicit = process.env.LLM_PROVIDER;
  if (explicit === "mistral") return "mistral";
  if (explicit === "openai") return "openai";
  // Auto-detect from OPENAI_BASE_URL
  if (process.env.OPENAI_BASE_URL?.includes("mistral")) return "mistral";
  return "openai";
}

function getLlmModel(): string {
  return process.env.OPENAI_MODEL || "gpt-4o";
}

function createLlmClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing. Strict LLM requires real API calls.");
  }

  const provider = detectProvider();
  const options: ConstructorParameters<typeof OpenAI>[0] = {
    apiKey: process.env.OPENAI_API_KEY,
  };

  if (provider === "mistral") {
    options.baseURL = process.env.OPENAI_BASE_URL || "https://api.mistral.ai/v1";
  } else if (process.env.OPENAI_BASE_URL) {
    options.baseURL = process.env.OPENAI_BASE_URL;
  }

  return new OpenAI(options);
}

// ─── Metadata / Versioning ─────────────────────────────────────

export interface EngineMetadata {
  engine_version: string;
  provider: LlmProvider;
  model: string;
  timestamp: string;
}

const ENGINE_VERSION = "v3_stable_realistic";

export function getEngineMetadata(): EngineMetadata {
  return {
    engine_version: ENGINE_VERSION,
    provider: detectProvider(),
    model: getLlmModel(),
    timestamp: new Date().toISOString(),
  };
}

// ─── Industrial-Grade Strict LLM Caller ────────────────────────

/**
 * Production-grade strict LLM caller.
 *
 * - Respects LLM_PROVIDER / OPENAI_BASE_URL for multi-provider support.
 * - Forces JSON object output.
 * - Validates response against Zod schema.
 * - Smart retry loop: feeds Zod validation errors back to the LLM.
 * - Logs provider + model at runtime (never logs API keys).
 * - Returns validated, typed data.
 */
export async function callLlmStrict<T>(
  systemPrompt: string,
  userPrompt: string,
  schema: z.ZodSchema<T>,
  schemaDescription: string,
  maxRetries = 2
): Promise<T> {
  const client = createLlmClient();
  const model = getLlmModel();
  const provider = detectProvider();
  let currentRetry = 0;
  let lastRawContent = "";
  let errorFeedback = "";

  // Log provider (never the key)
  console.log(`[llm-strict] Provider: ${provider} | Model: ${model}`);

  while (currentRetry <= maxRetries) {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: userPrompt + "\n\nReturn STRICT JSON following this schema:\n" + schemaDescription,
      },
    ];

    if (errorFeedback) {
      messages.push({
        role: "assistant",
        content: lastRawContent,
      });
      messages.push({
        role: "user",
        content: `The previous output was invalid JSON or did not match the required schema. Fix these errors and return ONLY valid JSON:\n${errorFeedback}`,
      });
    }

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("LLM_TIMEOUT")), 15000);
    });

    let response;
    try {
      response = await Promise.race([
        client.chat.completions.create({
          model,
          temperature: 0.2,
          response_format: { type: "json_object" },
          messages,
        }),
        timeoutPromise
      ]);
    } catch (err) {
      if (err instanceof Error && err.message === "LLM_TIMEOUT") {
        console.error(`[llm-strict] Timeout exceeded (15s) for model ${model}`);
        throw new Error("Evaluation temporarily unavailable"); // Let it bubble up to WS
      }
      throw err;
    }

    const rawContent = response.choices[0]?.message?.content || "{}";
    lastRawContent = rawContent;

    try {
      const parsedJson = JSON.parse(rawContent);
      const validated = schema.parse(parsedJson);
      return validated;
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        errorFeedback = err.errors.map(e => `${e.path.join(".")}: ${e.message}`).join("\n");
      } else if (err instanceof SyntaxError) {
        errorFeedback = `JSON parse error: ${err.message}`;
      } else {
        errorFeedback = String(err);
      }
      console.warn(
        `[llm-strict] Attempt ${currentRetry + 1}/${maxRetries + 1} failed (provider=${provider}, model=${model}).\nErrors:\n${errorFeedback}`
      );
      currentRetry++;
    }
  }

  // Log the failure internally but sanitize for the caller
  console.error(
    `[llm-strict] FATAL: Failed after ${maxRetries + 1} attempts (provider=${provider}, model=${model}).`
  );
  throw new Error("Evaluation temporarily unavailable");
}


