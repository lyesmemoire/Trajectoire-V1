import "server-only";

import { generateText, streamText } from "ai";
import { mistralModel } from "@/lib/mistral";
import { ProviderError } from "../../domain/contracts/interview.errors";
import type {
  LLMCompletionInput,
  LLMCompletionOutput,
  LLMEmbeddingInput,
  LLMEmbeddingOutput,
  LLMProviderPort,
  LLMStreamChunk,
  LLMTokenCountInput,
  LLMTokenCountOutput,
} from "../../domain/ports/llm-provider.port";

export class MistralInterviewProvider implements LLMProviderPort {
  async complete(input: LLMCompletionInput): Promise<LLMCompletionOutput> {
    try {
      const result = await generateText({
        model: mistralModel,
        system: input.systemInstruction,
        messages: [...input.messages],
        temperature: input.temperature,
        maxOutputTokens: input.maximumOutputTokens,
      });

      return {
        text: result.text,
        model: "mistral-large-latest",
        inputTokens: result.usage.inputTokens ?? 0,
        outputTokens: result.usage.outputTokens ?? 0,
      };
    } catch (error) {
      throw new ProviderError(error instanceof Error ? error.message : "LLM completion failed");
    }
  }

  async *stream(input: LLMCompletionInput): AsyncGenerator<LLMStreamChunk, void, void> {
    try {
      const result = streamText({
        model: mistralModel,
        system: input.systemInstruction,
        messages: [...input.messages],
        temperature: input.temperature,
        maxOutputTokens: input.maximumOutputTokens,
      });

      for await (const text of result.textStream) {
        yield {
          type: "text",
          text,
          model: null,
          inputTokens: null,
          outputTokens: null,
        };
      }

      const usage = await result.usage;
      yield {
        type: "completed",
        text: "",
        model: "mistral-large-latest",
        inputTokens: usage.inputTokens ?? 0,
        outputTokens: usage.outputTokens ?? 0,
      };
    } catch (error) {
      throw new ProviderError(error instanceof Error ? error.message : "LLM stream failed");
    }
  }

  async embed(_input: LLMEmbeddingInput): Promise<LLMEmbeddingOutput> {
    throw new ProviderError("Embeddings are not configured for Interview");
  }

  async countTokens(input: LLMTokenCountInput): Promise<LLMTokenCountOutput> {
    return { tokens: Math.ceil(input.text.length / 4) };
  }
}
