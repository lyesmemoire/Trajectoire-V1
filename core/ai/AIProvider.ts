/**
 * AI Provider Interface
 *
 * Abstract interface for AI providers (OpenAI, Anthropic, etc.)
 * All providers must implement this interface for consistency.
 */

export interface AIProvider {
  /**
   * Provider name (openai, anthropic, etc.)
   */
  readonly provider: string;

  /**
   * Generate completion from prompt
   */
  generateCompletion(request: AICompletionRequest): Promise<AICompletionResponse>;

  /**
   * Generate chat completion from messages
   */
  generateChatCompletion(request: AIChatCompletionRequest): Promise<AICompletionResponse>;

  /**
   * Check if provider is available (API key configured)
   */
  isAvailable(): boolean;
}

export interface AICompletionRequest {
  prompt: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export interface AIChatCompletionRequest {
  messages: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }>;
  model: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export interface AICompletionResponse {
  content: string;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  latency: number; // in milliseconds
  provider: string;
}

export interface AIProviderError extends Error {
  provider: string;
  code?: string;
  isRetryable?: boolean;
}
