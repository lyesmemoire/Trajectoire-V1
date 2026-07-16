/**
 * Intelligence Factory
 * 
 * Factory for creating intelligence use cases with stub dependencies.
 * Only stub implementations - no branching to existing engines.
 * 
 * @deprecated Use intelligenceCoreModule from container.ts instead
 */

import { intelligenceCoreModule } from "./container";

/**
 * Factory for creating intelligence use cases
 */
export class IntelligenceFactory {
  /**
   * Create an intelligence use case with stub provider
   * 
   * @param promptTemplate - The prompt template to use
   * @returns Intelligence use case instance
   */
  static createUseCase<TInput = unknown, TOutput = unknown>(
    promptTemplate: string
  ) {
    return intelligenceCoreModule.createUseCase<TInput, TOutput>(promptTemplate);
  }

  /**
   * Create an intelligence use case with AI SDK v6 provider
   * 
   * @param apiKey - AI SDK v6 API key
   * @param promptTemplate - The prompt template to use
   * @returns Intelligence use case instance
   */
  static createUseCaseWithAISDKV6<TInput = unknown, TOutput = unknown>(
    apiKey: string,
    promptTemplate: string
  ) {
    return intelligenceCoreModule.createUseCaseWithAISDKV6<TInput, TOutput>(apiKey, promptTemplate);
  }

  /**
   * Create an intelligence use case with Mistral provider
   * 
   * @param apiKey - Mistral API key
   * @param promptTemplate - The prompt template to use
   * @returns Intelligence use case instance
   */
  static createUseCaseWithMistral<TInput = unknown, TOutput = unknown>(
    apiKey: string,
    promptTemplate: string
  ) {
    return intelligenceCoreModule.createUseCaseWithMistral<TInput, TOutput>(apiKey, promptTemplate);
  }

  /**
   * Create an intelligence use case with custom provider
   * 
   * @param provider - Custom provider implementation
   * @param promptTemplate - The prompt template to use
   * @returns Intelligence use case instance
   */
  static createUseCaseWithProvider<TInput = unknown, TOutput = unknown>(
    provider: unknown,
    promptTemplate: string
  ) {
    return intelligenceCoreModule.createUseCaseWithProvider<TInput, TOutput>(provider, promptTemplate);
  }
}
