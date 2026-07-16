/**
 * Intelligence Provider Port
 * 
 * Port interface for LLM provider interactions.
 * Encapsulates all LLM provider calls without concrete implementations.
 */

import type { IntelligenceError } from "../contracts/intelligence-errors";

export interface IntelligenceProviderPort {
  /**
   * Execute an intelligence request against the LLM provider
   * 
   * @param prompt - The prompt template to execute
   * @param variables - Variables to inject into the prompt
   * @param options - Provider options (provider, model, temperature, etc.)
   * @returns Promise with the provider result
   */
  execute<TOutput>(
    prompt: string,
    variables: Record<string, unknown>,
    options: ProviderOptions
  ): Promise<ProviderResult<TOutput>>;
}

export type ProviderId = string;

export interface ProviderOptions {
  /**
   * LLM provider to use (e.g., "openai", "anthropic", "mistral", "gemini", "azure-openai", "ollama", "bedrock")
   */
  readonly provider: ProviderId;

  /**
   * Model to use
   */
  readonly model: string;

  /**
   * Temperature for LLM (0-1)
   */
  readonly temperature?: number;

  /**
   * Maximum tokens for LLM
   */
  readonly maxTokens?: number;

  /**
   * Timeout in milliseconds
   */
  readonly timeout?: number;

  /**
   * Whether to use streaming responses
   */
  readonly streaming?: boolean;
}

export interface ProviderResult<TOutput> {
  /**
   * Whether the request was successful
   */
  readonly success: boolean;

  /**
   * Output data if successful
   */
  readonly data?: TOutput;

  /**
   * Error if failed
   */
  readonly error?: IntelligenceError;

  /**
   * Metrics about the request
   */
  readonly metrics?: ProviderMetrics;
}

export interface ProviderMetrics {
  /**
   * Duration in milliseconds
   */
  readonly latency: number;

  /**
   * Total tokens used
   */
  readonly totalTokens: number;

  /**
   * Prompt tokens used
   */
  readonly promptTokens?: number;

  /**
   * Completion tokens used
   */
  readonly completionTokens?: number;

  /**
   * Estimated cost in USD
   */
  readonly cost: number;
}
