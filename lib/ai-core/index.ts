/**
 * AI Domain Standard - Core Abstractions
 * 
 * Common abstractions extracted from Career Copilot and Interview domains.
 * Follows the Rule of Three: only extracted when used in at least 3 domains.
 * 
 * Currently contains:
 * - Error classes (DomainError, ValidationError, ProviderError)
 * - LLM Provider Port (LLMProviderPort)
 * - Stream Adapter (StreamAdapter)
 */

export { DomainError, ValidationError, ProviderError } from "./errors/domain-error";
export type { LLMProviderPort, LLMCompletionInput, LLMCompletionOutput, LLMStreamChunk, LLMEmbeddingInput, LLMEmbeddingOutput, LLMTokenCountInput, LLMTokenCountOutput } from "./ports/llm-provider.port";
export { StreamAdapter } from "./adapters/stream.adapter";
export type { StreamEvent } from "./adapters/stream.adapter";
