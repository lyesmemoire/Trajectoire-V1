export interface LLMMessage {
  readonly role: "system" | "user" | "assistant";
  readonly content: string;
}

export interface LLMCompletionInput {
  readonly systemInstruction: string;
  readonly messages: readonly LLMMessage[];
  readonly temperature: number;
  readonly maximumOutputTokens: number;
}

export interface LLMCompletionOutput {
  readonly text: string;
  readonly model: string;
  readonly inputTokens: number;
  readonly outputTokens: number;
}

export interface LLMStreamChunk {
  readonly type: "text" | "completed";
  readonly text: string;
  readonly model: string | null;
  readonly inputTokens: number | null;
  readonly outputTokens: number | null;
}

export interface LLMEmbeddingInput {
  readonly text: string;
  readonly model: string;
}

export interface LLMEmbeddingOutput {
  readonly vector: readonly number[];
  readonly model: string;
  readonly tokens: number;
}

export interface LLMTokenCountInput {
  readonly text: string;
  readonly model: string;
}

export interface LLMTokenCountOutput {
  readonly tokens: number;
}

export interface LLMProviderPort {
  complete(input: LLMCompletionInput): Promise<LLMCompletionOutput>;
  stream(input: LLMCompletionInput): AsyncGenerator<LLMStreamChunk, void, void>;
  embed(input: LLMEmbeddingInput): Promise<LLMEmbeddingOutput>;
  countTokens(input: LLMTokenCountInput): Promise<LLMTokenCountOutput>;
}

