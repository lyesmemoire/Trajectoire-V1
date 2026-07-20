import { OpenAIProvider } from "./providers/OpenAIProvider";
import { AIProvider } from "./providers/Provider";
import { InfrastructureError } from "@/core/errors";

/**
 * AI Client Singleton
 * Centralized AI client configuration for all AI operations
 * Uses provider abstraction for multi-provider support
 */
class AIClient {
  private static instance: AIProvider | null = null;

  private constructor() {}

  /**
   * Get or create the AI provider instance
   * @returns AI provider instance
   */
  public static getInstance(): AIProvider {
    if (!AIClient.instance) {
      const apiKey = process.env.OPENAI_API_KEY;
      const organization = process.env.OPENAI_ORGANIZATION;

      if (!apiKey) {
        throw new InfrastructureError("OPENAI_API_KEY environment variable is not set", "AIClient");
      }

      // Currently using OpenAI provider
      // Can be easily switched to Anthropic, Gemini, etc. by changing this line
      AIClient.instance = new OpenAIProvider(apiKey, organization || undefined);
    }

    return AIClient.instance;
  }

  /**
   * Reset the client instance (useful for testing)
   */
  public static reset(): void {
    AIClient.instance = null;
  }
}

export default AIClient;
