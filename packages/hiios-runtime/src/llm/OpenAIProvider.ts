/**
 * HIIOS v4 Enterprise — OpenAI Provider
 */

import type {
  LLMProvider,
  LLMRequest,
  LLMResponse,
  LLMStreamChunk,
  EmbeddingResponse,
  ModerationResponse,
  ModelInfo,
  LLMProviderConfig,
} from "./LLMProvider";
import { LLMError } from "./LLMProvider";

export class OpenAIProvider implements LLMProvider {

  readonly name = "openai";

  readonly models: ModelInfo[] = [
    {
      id:                  "gpt-4o",
      provider:            "openai",
      contextWindow:       128000,
      maxOutput:           16384,
      supportsFunctions:   true,
      supportsVision:      true,
      costPer1kInput:      0.0025,
      costPer1kOutput:     0.010,
    },
    {
      id:                  "gpt-4o-mini",
      provider:            "openai",
      contextWindow:       128000,
      maxOutput:           16384,
      supportsFunctions:   true,
      supportsVision:      true,
      costPer1kInput:      0.00015,
      costPer1kOutput:     0.0006,
    },
  ];

  private config:    LLMProviderConfig;
  private baseUrl:   string;
  private startTime: number = 0;

  constructor(config: LLMProviderConfig) {
    this.config  = config;
    this.baseUrl = config.baseUrl ?? "https://api.openai.com/v1";
  }

  // ── Generate ───────────────────────────────

  async generate(request: LLMRequest): Promise<LLMResponse> {
    this.startTime = Date.now();

    const body = {
      model:       this.config.model,
      messages:    request.messages,
      temperature: request.temperature,
      max_tokens:  request.maxTokens,
      top_p:       request.topP ?? 1,
      seed:        request.seed,
      response_format: request.responseFormat === "json"
        ? { type: "json_object" }
        : undefined,
      stop: request.stopSequences,
    };

    const response = await this.fetchWithRetry(
      `${this.baseUrl}/chat/completions`,
      {
        method:  "POST",
        headers: this.buildHeaders(),
        body:    JSON.stringify(body),
      }
    );

    const data = await response.json() as unknown;

    if (!response.ok) {
      throw this.mapError(data, response.status);
    }

    return {
      content:      data.choices[0].message.content,
      model:        data.model,
      provider:     "openai",
      usage: {
        promptTokens:     data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens:      data.usage.total_tokens,
      },
      latencyMs:    Date.now() - this.startTime,
      finishReason: data.choices[0].finish_reason === "stop" ? "stop" : "length",
      raw:          data,
    };
  }

  // ── Stream ─────────────────────────────────

  async stream(
    request: LLMRequest,
    onChunk: (chunk: LLMStreamChunk) => void
  ): Promise<LLMResponse> {
    this.startTime = Date.now();

    const body = {
      model:       this.config.model,
      messages:    request.messages,
      temperature: request.temperature,
      max_tokens:  request.maxTokens,
      stream:      true,
      stream_options: { include_usage: true },
    };

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method:  "POST",
      headers: this.buildHeaders(),
      body:    JSON.stringify(body),
    });

    if (!response.ok) {
      const data = await response.json();
      throw this.mapError(data, response.status);
    }

    const reader  = response.body!.getReader();
    const decoder = new TextDecoder();
    let fullContent  = "";
    let finalUsage: LLMResponse["usage"] | undefined;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text  = decoder.decode(value, { stream: true });
      const lines = text.split("\n").filter(l => l.startsWith("data: "));

      for (const line of lines) {
        const data = line.slice(6);
        if (data === "[DONE]") continue;

        try {
          const parsed = JSON.parse(data) as unknown;
          const delta  = parsed.choices?.[0]?.delta?.content ?? "";

          if (delta) {
            fullContent += delta;
            onChunk({ delta, finished: false });
          }

          if (parsed.usage) {
            finalUsage = {
              promptTokens:     parsed.usage.prompt_tokens,
              completionTokens: parsed.usage.completion_tokens,
              totalTokens:      parsed.usage.total_tokens,
            };
          }
        } catch {
          // Ignorer les lignes non-JSON
        }
      }
    }

    onChunk({ delta: "", finished: true, usage: finalUsage });

    return {
      content:      fullContent,
      model:        this.config.model,
      provider:     "openai",
      usage:        finalUsage ?? { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
      latencyMs:    Date.now() - this.startTime,
      finishReason: "stop",
    };
  }

  // ── Embed ──────────────────────────────────

  async embed(text: string): Promise<EmbeddingResponse> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/embeddings`,
      {
        method:  "POST",
        headers: this.buildHeaders(),
        body:    JSON.stringify({
          model: "text-embedding-3-small",
          input: text,
        }),
      }
    );

    const data = await response.json() as unknown;

    return {
      embedding: data.data[0].embedding,
      model:     data.model,
      usage: {
        promptTokens: data.usage.prompt_tokens,
      },
    };
  }

  // ── Moderate ───────────────────────────────

  async moderate(text: string): Promise<ModerationResponse> {
    const response = await fetch(`${this.baseUrl}/moderations`, {
      method:  "POST",
      headers: this.buildHeaders(),
      body:    JSON.stringify({ input: text }),
    });

    const data = await response.json() as unknown;
    const result = data.results[0];

    return {
      flagged:    result.flagged,
      categories: result.categories,
      scores:     result.category_scores,
    };
  }

  // ── Token Count ────────────────────────────

  tokenCount(text: string): number {
    // Approximation : 1 token ≈ 4 chars
    // En production : utiliser tiktoken
    return Math.ceil(text.length / 4);
  }

  // ── Availability ───────────────────────────

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: this.buildHeaders(),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  // ── Helpers ────────────────────────────────

  private buildHeaders(): Record<string, string> {
    return {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${this.config.apiKey}`,
    };
  }

  private async fetchWithRetry(
    url:     string,
    init:    RequestInit,
    attempt: number = 0
  ): Promise<Response> {
    const maxRetries = this.config.maxRetries ?? 3;
    const retryDelay = this.config.retryDelay ?? 1000;

    try {
      const controller = new AbortController();
      const timeoutId  = setTimeout(
        () => controller.abort(),
        this.config.timeout ?? 30000
      );

      const response = await fetch(url, {
        ...init,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Rate limit — retry avec backoff
      if (response.status === 429 && attempt < maxRetries) {
        const retryAfter = parseInt(
          response.headers.get("retry-after") ?? "1"
        ) * 1000;
        await this.sleep(Math.max(retryAfter, retryDelay * Math.pow(2, attempt)));
        return this.fetchWithRetry(url, init, attempt + 1);
      }

      return response;

    } catch (error: unknown) {
      if (error.name === "AbortError") {
        throw new LLMError("Request timeout", "openai", "TIMEOUT", true);
      }
      if (attempt < maxRetries) {
        await this.sleep(retryDelay * Math.pow(2, attempt));
        return this.fetchWithRetry(url, init, attempt + 1);
      }
      throw error;
    }
  }

  private mapError(data: unknown, status: number): LLMError {
    const message = data?.error?.message ?? "Unknown error";
    const code    = data?.error?.code    ?? "unknown";

    const errorMap: Record<number, [string, boolean]> = {
      401: ["AUTHENTICATION",   false],
      429: ["RATE_LIMIT",       true],
      400: ["INVALID_REQUEST",  false],
      413: ["CONTEXT_TOO_LONG", false],
      500: ["SERVER_ERROR",     true],
      503: ["SERVER_ERROR",     true],
    };

    const [errorCode, retryable] = errorMap[status] ?? ["UNKNOWN", false];

    return new LLMError(message, "openai", errorCode as unknown, retryable, data);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
