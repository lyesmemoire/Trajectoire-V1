// @ts-nocheck
import { AIProvider, AIChatCompletionRequest, AICompletionResponse, AIProviderError } from "./AIProvider";

/**
 * Anthropic Provider Implementation
 *
 * Implements AIProvider interface for Anthropic (Claude) API.
 */

export class AnthropicProvider implements AIProvider {
  readonly provider = "anthropic";
  private apiKey: string;
  private baseURL = "https://api.anthropic.com/v1";

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.ANTHROPIC_API_KEY || "";
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }

  async generateCompletion(_request: import("./AIProvider").AICompletionRequest): Promise<AICompletionResponse> {
    throw new Error("Anthropic does not support legacy completions API. Use generateChatCompletion instead.");
  }

  async generateChatCompletion(request: AIChatCompletionRequest): Promise<AICompletionResponse> {
    const startTime = Date.now();

    try {
      const response = await fetch(`${this.baseURL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: request.model,
          messages: this.convertMessages(request.messages),
          max_tokens: request.maxTokens ?? 1000,
          temperature: request.temperature ?? 0.7,
          top_p: request.topP,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw this.createError(error.error?.message || "Anthropic API error", error.error?.type, response.status);
      }

      const data = await response.json();
      const latency = Date.now() - startTime;

      return {
        content: data.content[0].text,
        model: data.model,
        usage: {
          promptTokens: data.usage.input_tokens,
          completionTokens: data.usage.output_tokens,
          totalTokens: data.usage.input_tokens + data.usage.output_tokens,
        },
        latency,
        provider: this.provider,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw this.createError(error.message, "request_error", 500);
      }
      throw error;
    }
  }

  private convertMessages(messages: Array<{ role: string; content: string }>): Array<{ role: string; content: string }> {
    // Anthropic expects "user" and "assistant" roles
    // OpenAI also has "system" which needs to be handled differently
    const systemMessage = messages.find(m => m.role === "system");
    const otherMessages = messages.filter(m => m.role !== "system");

    // For now, prepend system message to first user message
    // In a more sophisticated implementation, we'd use the system parameter
    if (systemMessage && otherMessages.length > 0 && otherMessages[0]?.role === "user") {
      otherMessages[0]!.content = `${systemMessage.content}\n\n${otherMessages[0]!.content ?? ''}`;
    }

    return otherMessages;
  }

  private createError(message: string, code?: string, status?: number): AIProviderError {
    const error = new Error(message) as AIProviderError;
    error.provider = this.provider;
    error.code = code;
    error.isRetryable = this.isRetryableError(status);
    return error;
  }

  private isRetryableError(status?: number): boolean {
    if (!status) return false;
    return status >= 500 || status === 429;
  }
}
