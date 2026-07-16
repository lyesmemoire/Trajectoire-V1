import { AIProvider, AICompletionRequest, AIChatCompletionRequest, AICompletionResponse, AIProviderError } from "./AIProvider";

/**
 * OpenAI Provider Implementation
 *
 * Implements AIProvider interface for OpenAI API.
 */

export class OpenAIProvider implements AIProvider {
  readonly provider = "openai";
  private apiKey: string;
  private baseURL = "https://api.openai.com/v1";

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || "";
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }

  async generateCompletion(request: AICompletionRequest): Promise<AICompletionResponse> {
    const startTime = Date.now();

    try {
      const response = await fetch(`${this.baseURL}/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: request.model,
          prompt: request.prompt,
          temperature: request.temperature ?? 0.7,
          max_tokens: request.maxTokens ?? 1000,
          top_p: request.topP,
          frequency_penalty: request.frequencyPenalty,
          presence_penalty: request.presencePenalty,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw this.createError(error.error?.message || "OpenAI API error", error.error?.type, response.status);
      }

      const data = await response.json();
      const latency = Date.now() - startTime;

      return {
        content: data.choices[0].text,
        model: data.model,
        usage: {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens,
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

  async generateChatCompletion(request: AIChatCompletionRequest): Promise<AICompletionResponse> {
    const startTime = Date.now();

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: request.model,
          messages: request.messages,
          temperature: request.temperature ?? 0.7,
          max_tokens: request.maxTokens ?? 1000,
          top_p: request.topP,
          frequency_penalty: request.frequencyPenalty,
          presence_penalty: request.presencePenalty,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw this.createError(error.error?.message || "OpenAI API error", error.error?.type, response.status);
      }

      const data = await response.json();
      const latency = Date.now() - startTime;

      return {
        content: data.choices[0].message.content,
        model: data.model,
        usage: {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens,
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
