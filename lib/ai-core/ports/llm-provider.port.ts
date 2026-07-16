/**
 * AI Domain Standard - LLM Provider Port
 * 
 * Common LLM provider interface for all AI domains.
 * Extracted from Career Copilot and Interview (Rule of Three).
 */

export interface LLMCompletionInput {
  systemInstruction?: string;
  messages: Array<{ role: string; content: string }>;
  temperature?: number;
  maximumOutputTokens?: number;
}

export interface LLMCompletionOutput {
  text: string;
  inputTokens: number;
  outputTokens: number;
}

export interface LLMStreamChunk {
  type: "text" | "metadata";
  text?: string;
  inputTokens?: number;
  outputTokens?: number;
}

export interface LLMEmbeddingInput {
  text: string;
}

export interface LLMEmbeddingOutput {
  embedding: number[];
}

export interface LLMTokenCountInput {
  text: string;
}

export interface LLMTokenCountOutput {
  count: number;
}

export interface LLMProviderPort {
  complete(input: LLMCompletionInput): Promise<LLMCompletionOutput>;
  stream(input: LLMCompletionInput): AsyncGenerator<LLMStreamChunk, void, unknown>;
  embed(input: LLMEmbeddingInput): Promise<LLMEmbeddingOutput>;
  countTokens(input: LLMTokenCountInput): Promise<LLMTokenCountOutput>;
}
