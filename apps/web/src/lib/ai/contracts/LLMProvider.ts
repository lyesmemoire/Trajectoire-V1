import { z } from "zod";

// ===================================================================
// LLM PROVIDER — Provider Interfaces Contract
// ===================================================================

export interface TextChunk {
  content: string;
  isComplete: boolean;
}

export interface GenerateObjectParams<T> {
  system: string;
  prompt: string;
  schema: z.ZodSchema<T>;
  schemaName: string;
  schemaDescription: string;
}

export interface GenerateObjectResult<T> {
  object: T;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface GenerateTextParams {
  system: string;
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}

export interface GenerateTextResult {
  text: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface StructuredLLMProvider {
  generateObject<T>(params: GenerateObjectParams<T>): Promise<GenerateObjectResult<T>>;
  generateText(params: GenerateTextParams): Promise<GenerateTextResult>;
  streamText(params: GenerateTextParams): AsyncIterable<TextChunk>;
}
