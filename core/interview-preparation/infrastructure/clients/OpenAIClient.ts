/**
 * OpenAIClient
 *
 * Infrastructure OpenAI client wrapper.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY OpenAI API communication.
 */

import { OpenAIConfig } from "../configuration/ConfigurationService";
import { OpenAIError, TimeoutError, RateLimitError, NetworkError } from "../errors/InfrastructureErrors";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatCompletionRequest {
  messages: ChatMessage[];
  model: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ChatCompletionResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export class OpenAIClient {
  constructor(private readonly config: OpenAIConfig) {}

  async chatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: request.model,
          messages: request.messages,
          temperature: request.temperature ?? this.config.temperature,
          max_tokens: request.maxTokens ?? this.config.maxTokens,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new TimeoutError("OpenAI request timed out", this.config.timeout);
        }
        throw new OpenAIError(`OpenAI request failed: ${error.message}`);
      }

      throw new OpenAIError("Unknown OpenAI error");
    }
  }

  private async handleErrorResponse(response: Response): Promise<never> {
    const errorData = await response.json().catch(() => ({}));

    if (response.status === 429) {
      const retryAfter = errorData.retry_after
        ? parseInt(errorData.retry_after)
        : this.config.retryDelay;
      throw new RateLimitError("OpenAI rate limit exceeded", retryAfter);
    }

    if (response.status === 401) {
      throw new OpenAIError("OpenAI authentication failed", 401);
    }

    if (response.status >= 500) {
      throw new NetworkError("OpenAI server error", response.status);
    }

    throw new OpenAIError(
      `OpenAI API error: ${errorData.error?.message ?? response.statusText}`,
      response.status
    );
  }
}
