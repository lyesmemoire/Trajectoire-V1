/**
 * Anthropic Provider
 *
 * Implementation of IntelligenceProviderPort for Anthropic Claude API.
 * This provider handles Anthropic-specific API calls, authentication, and error handling.
 */

import type { IntelligenceProviderPort, ProviderResult, ProviderMetrics } from "../../domain/ports/intelligence-provider.port";
import { ProviderError, TimeoutError, RateLimitError, AuthenticationError } from "../../domain/contracts/intelligence-errors";

/**
 * Anthropic Provider
 *
 * Implements IntelligenceProviderPort for Anthropic Claude API.
 */
export class AnthropicProvider implements IntelligenceProviderPort {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.ANTHROPIC_API_KEY || "";
    this.baseUrl = "https://api.anthropic.com/v1/messages";
    
    if (!this.apiKey) {
      throw new AuthenticationError("ANTHROPIC_API_KEY is required");
    }
  }

  async execute<TOutput>(
    prompt: string,
    variables: Record<string, unknown>,
    options: { provider?: string; model?: string; temperature?: number; maxTokens?: number }
  ): Promise<ProviderResult<TOutput>> {
    const startTime = Date.now();
    
    try {
      const model = options.model || "claude-3-5-sonnet-20241022";
      const temperature = options.temperature ?? 0.7;
      const maxTokens = options.maxTokens ?? 1500;

      // Build the message from prompt and variables
      const systemMessage = this.buildSystemMessage(prompt, variables);
      const userMessage = this.buildUserMessage(variables);

      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model,
          max_tokens: maxTokens,
          system: systemMessage,
          messages: [
            {
              role: "user",
              content: userMessage,
            },
          ],
          temperature,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        
        if (response.status === 401) {
          throw new AuthenticationError("Anthropic API authentication failed");
        }
        
        if (response.status === 429) {
          throw new RateLimitError("Anthropic API rate limit exceeded");
        }
        
        throw new ProviderError(`Anthropic API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const content = data.content[0]?.text || "";
      
      const endTime = Date.now();
      const latency = endTime - startTime;

      const inputTokens = data.usage?.input_tokens || 0;
      const outputTokens = data.usage?.output_tokens || 0;
      
      const metrics: ProviderMetrics = {
        latency,
        totalTokens: inputTokens + outputTokens,
        promptTokens: inputTokens,
        completionTokens: outputTokens,
        cost: this.calculateCost(inputTokens, outputTokens, model),
      };

      // Parse the response as JSON if possible, otherwise return as string
      let output: TOutput;
      try {
        output = JSON.parse(content) as TOutput;
      } catch {
        output = content as unknown as TOutput;
      }

      return {
        success: true,
        data: output,
        metrics,
      };
    } catch (error) {
      const endTime = Date.now();
      const latency = endTime - startTime;

      if (error instanceof ProviderError || error instanceof AuthenticationError || error instanceof RateLimitError) {
        throw error;
      }

      if (error instanceof Error && error.name === "AbortError") {
        throw new TimeoutError("Anthropic API request timed out");
      }

      throw new ProviderError(`Anthropic provider error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private buildSystemMessage(prompt: string, variables: Record<string, unknown>): string {
    // Replace variables in prompt
    let systemMessage = prompt;
    for (const [key, value] of Object.entries(variables)) {
      systemMessage = systemMessage.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), String(value));
    }
    return systemMessage;
  }

  private buildUserMessage(variables: Record<string, unknown>): string {
    // Build user message from variables
    const entries = Object.entries(variables)
      .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
      .join("\n");
    return entries || "Please process the system prompt.";
  }

  private calculateCost(inputTokens: number, outputTokens: number, model: string): number {
    // Anthropic pricing (approximate)
    const pricing: Record<string, { input: number; output: number }> = {
      "claude-3-5-sonnet-20241022": { input: 0.000003, output: 0.000015 },
      "claude-3-opus-20240229": { input: 0.000015, output: 0.000075 },
      "claude-3-sonnet-20240229": { input: 0.000003, output: 0.000015 },
      "claude-3-haiku-20240307": { input: 0.00000025, output: 0.00000125 },
    };

    const modelPricing = pricing[model] || pricing["claude-3-5-sonnet-20241022"];
    
    if (!modelPricing) {
      return 0; // Fallback if pricing not found
    }
    
    return (inputTokens * modelPricing.input) + (outputTokens * modelPricing.output);
  }
}
