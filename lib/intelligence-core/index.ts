/**
 * Intelligence Core Module
 * 
 * Shared framework for Intelligence Engines.
 * Server-only - no client-side usage.
 */

// Domain contracts
export type {
  IntelligenceRequest,
  IntelligenceContext,
  IntelligenceOptions,
} from "./domain/contracts/intelligence-request";

export type {
  IntelligenceResponse,
  IntelligenceMetadata,
  IntelligenceError as IntelligenceErrorContract,
} from "./domain/contracts/intelligence-response";

export {
  IntelligenceError,
  ValidationError,
  ProviderError,
  EngineExecutionError,
  TimeoutError,
  RateLimitError,
  AuthenticationError,
  ConfigurationError,
} from "./domain/contracts/intelligence-errors";

// Domain ports
export type {
  IntelligenceProviderPort,
  ProviderOptions,
  ProviderResult,
  ProviderMetrics,
  ProviderId,
} from "./domain/ports/intelligence-provider.port";

// Application
export { IntelligenceUseCase } from "./application/intelligence.use-case";

// Infrastructure adapters
export { ResultAdapter } from "./infrastructure/adapters/result.adapter";
export { ErrorAdapter } from "./infrastructure/adapters/error.adapter";

// Infrastructure providers
export { AISDKV6Provider } from "./infrastructure/providers/ai-sdk-v6.provider";
export { MistralProvider } from "./infrastructure/providers/mistral.provider";

// Composition
export { IntelligenceFactory } from "./composition/intelligence.factory";
export { intelligenceCoreModule } from "./composition/container";
