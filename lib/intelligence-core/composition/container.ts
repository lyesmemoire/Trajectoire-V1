/**
 * Intelligence Core Container
 *
 * Container for intelligence-core dependencies.
 * All business class instantiation happens here.
 */

import { IntelligenceUseCase } from "../application/intelligence.use-case";
import { AISDKV6Provider } from "../infrastructure/providers/ai-sdk-v6.provider";
import { AnthropicProvider } from "../infrastructure/providers/anthropic.provider";
import { MistralProvider } from "../infrastructure/providers/mistral.provider";

/**
 * Intelligence core module
 */
export const intelligenceCoreModule = {
  /**
   * Create an intelligence use case with real provider (OpenAI via AI SDK v6)
   * Uses existing infrastructure configuration (envServer.OPENAI_API_KEY)
   *
   * @param promptTemplate - The prompt template to use
   * @returns Intelligence use case instance
   */
  createUseCase<TInput = unknown, TOutput = unknown>(promptTemplate: string): IntelligenceUseCase<TInput, TOutput> {
    // Use real provider that delegates to existing OpenAIProvider
    // OpenAIProvider will read API key from process.env.OPENAI_API_KEY
    const provider = new AISDKV6Provider();
    return new IntelligenceUseCase<TInput, TOutput>(provider, promptTemplate);
  },

  /**
   * Create an intelligence use case with AI SDK v6 provider
   *
   * @param promptTemplate - The prompt template to use
   * @param apiKey - AI SDK v6 API key (optional, uses env if not provided)
   * @returns Intelligence use case instance
   */
  createUseCaseWithAISDKV6<TInput = unknown, TOutput = unknown>(
    promptTemplate: string,
    apiKey?: string
  ): IntelligenceUseCase<TInput, TOutput> {
    const provider = new AISDKV6Provider(apiKey);
    return new IntelligenceUseCase<TInput, TOutput>(provider, promptTemplate);
  },

  /**
   * Create an intelligence use case with Anthropic provider
   *
   * @param promptTemplate - The prompt template to use
   * @param apiKey - Anthropic API key (optional, uses env if not provided)
   * @returns Intelligence use case instance
   */
  createUseCaseWithAnthropic<TInput = unknown, TOutput = unknown>(
    promptTemplate: string,
    apiKey?: string
  ): IntelligenceUseCase<TInput, TOutput> {
    const provider = new AnthropicProvider(apiKey);
    return new IntelligenceUseCase<TInput, TOutput>(provider, promptTemplate);
  },

  /**
   * Create an intelligence use case with Mistral provider
   *
   * @param promptTemplate - The prompt template to use
   * @param apiKey - Mistral API key (optional, uses env if not provided)
   * @returns Intelligence use case instance
   */
  createUseCaseWithMistral<TInput = unknown, TOutput = unknown>(
    promptTemplate: string,
    apiKey?: string
  ): IntelligenceUseCase<TInput, TOutput> {
    const provider = new MistralProvider(apiKey);
    return new IntelligenceUseCase<TInput, TOutput>(provider, promptTemplate);
  },

  /**
   * Create an intelligence use case with stub provider (for testing only)
   *
   * @param promptTemplate - The prompt template to use
   * @returns Intelligence use case instance
   */
  createUseCaseWithStub<TInput = unknown, TOutput = unknown>(promptTemplate: string): IntelligenceUseCase<TInput, TOutput> {
    const provider = {
      async execute<TOutput>(
        _prompt: string,
        _variables: Record<string, unknown>,
        _options: { provider: string; model: string; temperature?: number; maxTokens?: number; timeout?: number; streaming?: boolean }
      ) {
        // Stub implementation - returns mock data
        return {
          success: true,
          data: undefined as TOutput,
          metrics: {
            latency: 100,
            totalTokens: 100,
            cost: 0.001,
          },
        };
      },
    };
    return new IntelligenceUseCase<TInput, TOutput>(provider, promptTemplate);
  },

  /**
   * Create an intelligence use case with custom provider
   *
   * @param provider - Custom provider implementation
   * @param promptTemplate - The prompt template to use
   * @returns Intelligence use case instance
   */
  createUseCaseWithProvider<TInput = unknown, TOutput = unknown>(
    provider: unknown,
    promptTemplate: string
  ): IntelligenceUseCase<TInput, TOutput> {
    return new IntelligenceUseCase<TInput, TOutput>(provider as ConstructorParameters<typeof IntelligenceUseCase>[0], promptTemplate);
  },
};
