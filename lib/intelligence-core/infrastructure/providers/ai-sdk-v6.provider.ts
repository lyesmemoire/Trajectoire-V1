/**
 * AI SDK v6 Provider
 *
 * Implementation of IntelligenceProviderPort that delegates to existing AI infrastructure.
 * This is an adapter that bridges IntelligenceProviderPort to the existing OpenAIProvider.
 *
 * This provider does NOT duplicate AI SDK logic - it reuses the existing OpenAIProvider
 * from core/ai/OpenAIProvider.ts which already handles API calls, authentication, and error handling.
 */

import type { IntelligenceProviderPort, ProviderResult, ProviderMetrics } from "../../domain/ports/intelligence-provider.port";
import { ProviderError, TimeoutError, RateLimitError, AuthenticationError } from "../../domain/contracts/intelligence-errors";
import { OpenAIProvider } from "@/core/ai/OpenAIProvider";

/**
 * AI SDK v6 Provider
 *
 * Implements IntelligenceProviderPort by delegating to OpenAIProvider.
 * This reuses the existing AI infrastructure without duplication.
 */
export class AISDKV6Provider implements IntelligenceProviderPort {
  private openAIProvider: OpenAIProvider;

  constructor(apiKey?: string) {
    // Reuse existing OpenAIProvider which handles API key configuration
    this.openAIProvider = new OpenAIProvider(apiKey);
  }

  async execute<TOutput>(
    prompt: string,
    variables: Record<string, unknown>,
    options: { provider: string; model: string; temperature?: number; maxTokens?: number; timeout?: number; streaming?: boolean }
  ): Promise<ProviderResult<TOutput>> {
    const startTime = Date.now();

    try {
      // Check if provider is available
      if (!this.openAIProvider.isAvailable()) {
        throw new Error("OpenAI provider is not available (missing API key)");
      }

      // Convert prompt template to chat messages
      // IntelligenceCore uses simple string prompts, convert to chat format
      const messages = this.convertPromptToMessages(prompt, variables);

      // Delegate to existing OpenAIProvider
      const response = await this.openAIProvider.generateChatCompletion({
        messages,
        model: options.model,
        temperature: options.temperature,
        maxTokens: options.maxTokens,
      });

      // Parse response as JSON (IntelligenceCore expects structured output)
      const parsedData = this.parseResponse<TOutput>(response.content);

      const metrics: ProviderMetrics = {
        latency: response.latency,
        totalTokens: response.usage.totalTokens,
        promptTokens: response.usage.promptTokens,
        completionTokens: response.usage.completionTokens,
        cost: this.calculateCost(response.usage.totalTokens, options.model),
      };

      return {
        success: true,
        data: parsedData,
        metrics,
      };
    } catch (error) {
      return this.handleError(error as Error, startTime);
    }
  }

  private convertPromptToMessages(prompt: string, variables: Record<string, unknown>): Array<{ role: "system" | "user" | "assistant"; content: string }> {
    // Replace variables in prompt
    let renderedPrompt = prompt;
    for (const [key, value] of Object.entries(variables)) {
      renderedPrompt = renderedPrompt.replace(new RegExp(`\\{${key}\\}`, "g"), String(value));
    }

    // Convert to chat format
    return [
      { role: "system", content: "You are a helpful assistant that responds in JSON format." },
      { role: "user", content: renderedPrompt },
    ];
  }

  private parseResponse<TOutput>(content: string): TOutput {
    try {
      // Try to parse as JSON
      return JSON.parse(content) as TOutput;
    } catch {
      // If not JSON, return as string (will be cast to TOutput)
      return content as unknown as TOutput;
    }
  }

  private calculateCost(tokens: number, model: string): number {
    // Simple cost calculation based on token count and model
    // This is a simplified calculation - in production, use actual pricing
    const costPer1kTokens = model.includes("gpt-4") ? 0.03 : 0.002;
    return (tokens / 1000) * costPer1kTokens;
  }

  private handleError(error: Error, startTime: number): ProviderResult<never> {
    const metrics: ProviderMetrics = {
      latency: Date.now() - startTime,
      totalTokens: 0,
      cost: 0,
    };

    const message = error.message.toLowerCase();
    
    if (message.includes("timeout") || message.includes("etimedout")) {
      return {
        success: false,
        error: new TimeoutError(error.message),
        metrics,
      };
    }

    if (message.includes("rate limit") || message.includes("429")) {
      return {
        success: false,
        error: new RateLimitError(error.message),
        metrics,
      };
    }

    if (message.includes("authentication") || message.includes("unauthorized") || message.includes("401")) {
      return {
        success: false,
        error: new AuthenticationError(error.message),
        metrics,
      };
    }

    return {
      success: false,
      error: new ProviderError(error.message),
      metrics,
    };
  }
}
