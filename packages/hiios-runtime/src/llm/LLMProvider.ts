/**
 * HIIOS v4 Enterprise — LLM Abstraction Layer
 *
 * Le système ne dépend jamais d'un fournisseur spécifique.
 * Tout appel LLM passe par cette abstraction.
 */

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface LLMMessage {
  role:    "system" | "user" | "assistant";
  content: string;
}

export interface LLMRequest {
  messages:     LLMMessage[];
  temperature:  number;
  maxTokens:    number;
  topP?:        number;
  seed?:        number;
  responseFormat?: "text" | "json";
  stopSequences?: string[];
}

export interface LLMResponse {
  content:    string;
  model:      string;
  provider:   string;
  usage: {
    promptTokens:     number;
    completionTokens: number;
    totalTokens:      number;
  };
  latencyMs:  number;
  finishReason: "stop" | "length" | "error";
  raw?:       unknown;
}

export interface LLMStreamChunk {
  delta:    string;
  finished: boolean;
  usage?:   LLMResponse["usage"];
}

export interface EmbeddingResponse {
  embedding: number[];
  model:     string;
  usage: {
    promptTokens: number;
  };
}

export interface ModerationResponse {
  flagged:    boolean;
  categories: Record<string, boolean>;
  scores:     Record<string, number>;
}

export interface ModelInfo {
  id:           string;
  provider:     string;
  contextWindow: number;
  maxOutput:    number;
  supportsFunctions: boolean;
  supportsVision:    boolean;
  costPer1kInput:    number;
  costPer1kOutput:   number;
}

// ─────────────────────────────────────────────
// INTERFACE PRINCIPALE
// ─────────────────────────────────────────────

export interface LLMProvider {
  readonly name:     string;
  readonly models:   ModelInfo[];

  generate(request: LLMRequest): Promise<LLMResponse>;

  stream(
    request:  LLMRequest,
    onChunk:  (chunk: LLMStreamChunk) => void
  ): Promise<LLMResponse>;

  embed(text: string): Promise<EmbeddingResponse>;

  moderate(text: string): Promise<ModerationResponse>;

  tokenCount(text: string): number;

  isAvailable(): Promise<boolean>;
}

// ─────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────

export interface LLMProviderConfig {
  provider:    "openai" | "anthropic" | "azure" | "ollama" | "mock";
  model:       string;
  apiKey?:     string;
  baseUrl?:    string;
  timeout?:    number;
  maxRetries?: number;
  retryDelay?: number;
}

// ─────────────────────────────────────────────
// ERREURS
// ─────────────────────────────────────────────

export class LLMError extends Error {
  constructor(
    message:          string,
    public provider:  string,
    public code:      LLMErrorCode,
    public retryable: boolean,
    public raw?:      unknown
  ) {
    super(message);
    this.name = "LLMError";
  }
}

export type LLMErrorCode =
  | "RATE_LIMIT"
  | "CONTEXT_TOO_LONG"
  | "INVALID_REQUEST"
  | "AUTHENTICATION"
  | "SERVER_ERROR"
  | "TIMEOUT"
  | "CONTENT_FILTER"
  | "UNKNOWN";
