/**
 * Mistral Provider
 *
 * Implementation of IntelligenceProviderPort that delegates to existing Mistral infrastructure.
 * This is an adapter that bridges IntelligenceProviderPort to the existing MistralAdapter.
 *
 * This provider does NOT duplicate Mistral SDK logic - it reuses the existing MistralAdapter
 * from lib/ai/infrastructure/adapters/mistral.adapter.ts which already handles API calls,
 * authentication, and error handling.
 */

import type { IntelligenceProviderPort, ProviderResult, ProviderMetrics } from "../../domain/ports/intelligence-provider.port";
import { ProviderError, TimeoutError, RateLimitError, AuthenticationError } from "../../domain/contracts/intelligence-errors";
import { MistralAdapter } from "@/lib/ai/infrastructure/adapters/mistral.adapter";
import { Prompt } from "@/lib/ai/domain/value-objects/prompt.vo";
import { ModelConfiguration } from "@/lib/ai/domain/value-objects/model-configuration.vo";
import { envServer } from "@/lib/env.server";

/**
 * Mistral Provider
 *
 * Implements IntelligenceProviderPort by delegating to MistralAdapter.
 * This reuses the existing Mistral infrastructure without duplication.
 */
export class MistralProvider implements IntelligenceProviderPort {
  private mistralAdapter: MistralAdapter;

  constructor(apiKey?: string) {
    // Reuse existing MistralAdapter which handles API key configuration
    // If apiKey is provided, use it; otherwise MistralAdapter will use envServer.MISTRAL_API_KEY
    this.mistralAdapter = new MistralAdapter();
  }

  async execute<TOutput>(
    prompt: string,
    variables: Record<string, unknown>,
    options: { provider: string; model: string; temperature?: number; maxTokens?: number; timeout?: number; streaming?: boolean }
  ): Promise<ProviderResult<TOutput>> {
    const startTime = Date.now();

    try {
      // Check if API key is configured
      if (!envServer.MISTRAL_API_KEY) {
        throw new Error("Mistral provider is not available (missing MISTRAL_API_KEY)");
      }

      // Convert prompt template to Prompt VO
      const promptVO = this.convertPromptToVO(prompt, variables);

      // Convert options to ModelConfiguration VO
      const modelConfig = ModelConfiguration.create(
        options.model || "mistral-large-latest",
        options.temperature ?? 0.7,
        options.maxTokens,
        undefined // topP not used in current implementation
      );

      // Delegate to existing MistralAdapter
      const result = await this.mistralAdapter.generate(promptVO, modelConfig);

      if (result.isFailure()) {
        throw new Error(result.unwrapError().message);
      }

      // Parse response as JSON (IntelligenceCore expects structured output)
      const completion = result.unwrap();
      const parsedData = this.parseResponse<TOutput>(completion.content);

      const metrics: ProviderMetrics = {
        latency: Date.now() - startTime,
        totalTokens: completion.tokenUsage?.totalTokens || 0,
        promptTokens: completion.tokenUsage?.promptTokens || 0,
        completionTokens: completion.tokenUsage?.completionTokens || 0,
        cost: this.calculateCost(completion.tokenUsage?.totalTokens || 0, options.model),
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

  private convertPromptToVO(prompt: string, variables: Record<string, unknown>): Prompt {
    // Replace variables in prompt
    let renderedPrompt = prompt;
    for (const [key, value] of Object.entries(variables)) {
      renderedPrompt = renderedPrompt.replace(new RegExp(`\\{${key}\\}`, "g"), String(value));
    }

    // Convert to Prompt VO (expects messages array)
    return Prompt.create([
      { role: "system", content: "You are a helpful assistant that responds in JSON format." },
      { role: "user", content: renderedPrompt },
    ]);
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
    const costPer1kTokens = model.includes("large") ? 0.004 : 0.002;
    return (tokens / 1000) * costPer1kTokens;
  }

  private handleError(error: Error, startTime: number): ProviderResult<never> {
    const metrics: ProviderMetrics = {
      latency: Date.now() - startTime,
      totalTokens: 0,
      cost: 0,
    };

    // Map error to domain error
    if (error.message.includes("timeout") || error.message.includes("ETIMEDOUT")) {
      return {
        success: false,
        error: new TimeoutError(error.message),
        metrics,
      };
    }

    if (error.message.includes("rate limit") || error.message.includes("429")) {
      return {
        success: false,
        error: new RateLimitError(error.message),
        metrics,
      };
    }

    if (error.message.includes("authentication") || error.message.includes("unauthorized") || error.message.includes("401")) {
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
