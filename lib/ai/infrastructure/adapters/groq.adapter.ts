import OpenAI from "openai";
import { LlmProviderPort } from "../../ports/llm-provider.port";
import { StreamingProviderPort } from "../../ports/streaming-provider.port";
import { Prompt } from "../../domain/value-objects/prompt.vo";
import { ModelConfiguration } from "../../domain/value-objects/model-configuration.vo";
import { Completion } from "../../domain/value-objects/completion.vo";
import { TokenUsage } from "../../domain/value-objects/token-usage.vo";
import { Result, ok, fail } from "@/lib/core/result";
import { ExternalServiceError } from "@/lib/core/errors";
import { envServer } from "@/lib/env.server";

export class GroqAdapter implements LlmProviderPort, StreamingProviderPort {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({ 
      apiKey: envServer.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1"
    });
  }

  async generate(prompt: Prompt, config: ModelConfiguration): Promise<Result<Completion>> {
    try {
      const response = await this.client.chat.completions.create({
        model: config.model || "llama3-8b-8192",
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
      return fail(new ExternalServiceError(`Groq API Error: ${error.message}`));
    }
  }

  async stream(prompt: Prompt, config: ModelConfiguration, onToken: (token: string) => void): Promise<Result<void>> {
    try {
      const stream = await this.client.chat.completions.create({
        model: config.model || "llama3-8b-8192",
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
      return fail(new ExternalServiceError(`Groq Stream Error: ${error.message}`));
    }
  }
}
