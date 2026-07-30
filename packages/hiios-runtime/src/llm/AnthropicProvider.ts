/**
 * HIIOS v4 Enterprise — Anthropic Provider
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

export class AnthropicProvider implements LLMProvider {

  readonly name = "anthropic";

  readonly models: ModelInfo[] = [
    {
      id:                "claude-3-5-sonnet-20241022",
      provider:          "anthropic",
      contextWindow:     200000,
      maxOutput:         8192,
      supportsFunctions: true,
      supportsVision:    true,
      costPer1kInput:    0.003,
      costPer1kOutput:   0.015,
    },
    {
      id:                "claude-3-5-haiku-20241022",
      provider:          "anthropic",
      contextWindow:     200000,
      maxOutput:         8192,
      supportsFunctions: true,
      supportsVision:    true,
      costPer1kInput:    0.0008,
      costPer1kOutput:   0.004,
    },
  ];

  private config:  LLMProviderConfig;
  private baseUrl: string;

  constructor(config: LLMProviderConfig) {
    this.config  = config;
    this.baseUrl = config.baseUrl ?? "https://api.anthropic.com/v1";
  }

  async generate(request: LLMRequest): Promise<LLMResponse> {
    const start = Date.now();

    // Anthropic sépare system et messages
    const systemMessage = request.messages.find(m => m.role === "system");
    const userMessages  = request.messages.filter(m => m.role !== "system");

    const body = {
      model:      this.config.model,
      max_tokens: request.maxTokens,
      temperature: request.temperature,
      system:     systemMessage?.content,
      messages:   userMessages,
    };

    const response = await fetch(`${this.baseUrl}/messages`, {
      method:  "POST",
      headers: {
        "Content-Type":      "application/json",
        "x-api-key":         this.config.apiKey ?? "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json() as unknown;

    if (!response.ok) {
      throw new LLMError(
        data?.error?.message ?? "Anthropic error",
        "anthropic",
        response.status === 429 ? "RATE_LIMIT" : "SERVER_ERROR",
        response.status === 429 || response.status >= 500
      );
    }

    return {
      content:      data.content[0].text,
      model:        data.model,
      provider:     "anthropic",
      usage: {
        promptTokens:     data.usage.input_tokens,
        completionTokens: data.usage.output_tokens,
        totalTokens:      data.usage.input_tokens + data.usage.output_tokens,
      },
      latencyMs:    Date.now() - start,
      finishReason: data.stop_reason === "end_turn" ? "stop" : "length",
      raw:          data,
    };
  }

  async stream(
    request: LLMRequest,
    onChunk: (chunk: LLMStreamChunk) => void
  ): Promise<LLMResponse> {
    const start         = Date.now();
    const systemMessage = request.messages.find(m => m.role === "system");
    const userMessages  = request.messages.filter(m => m.role !== "system");

    const response = await fetch(`${this.baseUrl}/messages`, {
      method: "POST",
      headers: {
        "Content-Type":      "application/json",
        "x-api-key":         this.config.apiKey ?? "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model:       this.config.model,
        max_tokens:  request.maxTokens,
        temperature: request.temperature,
        system:      systemMessage?.content,
        messages:    userMessages,
        stream:      true,
      }),
    });

    const reader      = response.body!.getReader();
    const decoder     = new TextDecoder();
    let fullContent   = "";
    let inputTokens   = 0;
    let outputTokens  = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text  = decoder.decode(value, { stream: true });
      const lines = text.split("\n").filter(l => l.startsWith("data: "));

      for (const line of lines) {
        try {
          const parsed = JSON.parse(line.slice(6)) as unknown;

          if (parsed.type === "content_block_delta") {
            const delta = parsed.delta?.text ?? "";
            fullContent += delta;
            onChunk({ delta, finished: false });
          }

          if (parsed.type === "message_delta" && parsed.usage) {
            outputTokens = parsed.usage.output_tokens;
          }

          if (parsed.type === "message_start" && parsed.message?.usage) {
            inputTokens = parsed.message.usage.input_tokens;
          }
        } catch { /* skip */ }
      }
    }

    onChunk({ delta: "", finished: true });

    return {
      content:      fullContent,
      model:        this.config.model,
      provider:     "anthropic",
      usage: {
        promptTokens:     inputTokens,
        completionTokens: outputTokens,
        totalTokens:      inputTokens + outputTokens,
      },
      latencyMs:    Date.now() - start,
      finishReason: "stop",
    };
  }

  async embed(_text: string): Promise<EmbeddingResponse> {
    // Anthropic ne propose pas d'embeddings natifs
    throw new LLMError(
      "Anthropic does not support embeddings — use OpenAI or a dedicated embedding model",
      "anthropic",
      "INVALID_REQUEST",
      false
    );
  }

  async moderate(_text: string): Promise<ModerationResponse> {
    // Anthropic intègre la modération dans le modèle
    return { flagged: false, categories: {}, scores: {} };
  }

  tokenCount(text: string): number {
    return Math.ceil(text.length / 4);
  }

  async isAvailable(): Promise<boolean> {
    try {
      const r = await fetch(`${this.baseUrl}/models`, {
        headers: {
          "x-api-key":         this.config.apiKey ?? "",
          "anthropic-version": "2023-06-01",
        },
      });
      return r.ok;
    } catch {
      return false;
    }
  }
}
