import OpenAI from "openai";
import { LlmProviderPort } from "../../ports/llm-provider.port";
import { EmbeddingProviderPort } from "../../ports/embedding-provider.port";
import { StreamingProviderPort } from "../../ports/streaming-provider.port";
import { Prompt } from "../../domain/value-objects/prompt.vo";
import { ModelConfiguration } from "../../domain/value-objects/model-configuration.vo";
import { Completion } from "../../domain/value-objects/completion.vo";
import { TokenUsage } from "../../domain/value-objects/token-usage.vo";
import { Result, ok, fail } from "@/lib/core/result";
import { ExternalServiceError } from "@/lib/core/errors";
import { envServer } from "@/lib/env.server";

export class OpenAiAdapter implements LlmProviderPort, EmbeddingProviderPort, StreamingProviderPort {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({ apiKey: envServer.OPENAI_API_KEY });
  }

  async generate(prompt: Prompt, config: ModelConfiguration): Promise<Result<Completion>> {
    try {
      const response = await this.client.chat.completions.create({
        model: config.model || "gpt-4o",
        messages: prompt.messages,
        temperature: config.temperature,
        max_tokens: config.maxTokens,
        top_p: config.topP,
      });

      const content = response.choices[0]?.message?.content || "";
      let tokenUsage: TokenUsage | undefined;
      
      if (response.usage) {
        tokenUsage = TokenUsage.create(
          response.usage.prompt_tokens,
          response.usage.completion_tokens,
          response.usage.total_tokens
        );
      }

      return ok(Completion.create(content, tokenUsage));
    } catch (error: any) {
      return fail(new ExternalServiceError(`OpenAI API Error: ${error.message}`));
    }
  }

  async stream(prompt: Prompt, config: ModelConfiguration, onToken: (token: string) => void): Promise<Result<void>> {
    try {
      const stream = await this.client.chat.completions.create({
        model: config.model || "gpt-4o",
        messages: prompt.messages,
        temperature: config.temperature,
        max_tokens: config.maxTokens,
        top_p: config.topP,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          onToken(content);
        }
      }

      return ok(undefined);
    } catch (error: any) {
      return fail(new ExternalServiceError(`OpenAI Stream Error: ${error.message}`));
    }
  }

  async createEmbedding(text: string): Promise<Result<number[]>> {
    try {
      const response = await this.client.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
      });
      return ok(response.data[0]!.embedding);
    } catch (error: any) {
      return fail(new ExternalServiceError(`OpenAI Embedding Error: ${error.message}`));
    }
  }

  async createEmbeddings(texts: string[]): Promise<Result<number[][]>> {
    try {
      const response = await this.client.embeddings.create({
        model: "text-embedding-3-small",
        input: texts,
      });
      return ok(response.data.map(d => d.embedding));
    } catch (error: any) {
      return fail(new ExternalServiceError(`OpenAI Embeddings Error: ${error.message}`));
    }
  }
}
