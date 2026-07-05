import { Mistral } from "@mistralai/mistralai";
import { LlmProviderPort } from "../../ports/llm-provider.port";
import { StreamingProviderPort } from "../../ports/streaming-provider.port";
import { Prompt } from "../../domain/value-objects/prompt.vo";
import { ModelConfiguration } from "../../domain/value-objects/model-configuration.vo";
import { Completion } from "../../domain/value-objects/completion.vo";
import { TokenUsage } from "../../domain/value-objects/token-usage.vo";
import { Result, ok, fail } from "@/lib/core/result";
import { ExternalServiceError } from "@/lib/core/errors";
import { envServer } from "@/lib/env.server";

export class MistralAdapter implements LlmProviderPort, StreamingProviderPort {
  private client: Mistral;

  constructor() {
    this.client = new Mistral({ apiKey: envServer.MISTRAL_API_KEY });
  }

  async generate(prompt: Prompt, config: ModelConfiguration): Promise<Result<Completion>> {
    try {
      const response = await this.client.chat.complete({
        model: config.model || "mistral-large-latest",
        messages: prompt.messages as any,
        temperature: config.temperature,
        maxTokens: config.maxTokens,
        topP: config.topP,
      });

      const content = response.choices?.[0]?.message?.content;
      if (typeof content !== 'string') {
          return fail(new ExternalServiceError(`Mistral API Error: Invalid response format`));
      }

      let tokenUsage: TokenUsage | undefined;
      
      if (response.usage) {
        tokenUsage = TokenUsage.create(
          response.usage.promptTokens || 0,
          response.usage.completionTokens || 0,
          response.usage.totalTokens || 0
        );
      }

      return ok(Completion.create(content, tokenUsage));
    } catch (error: any) {
      return fail(new ExternalServiceError(`Mistral API Error: ${error.message}`));
    }
  }

  async stream(prompt: Prompt, config: ModelConfiguration, onToken: (token: string) => void): Promise<Result<void>> {
    try {
      const stream = await this.client.chat.stream({
        model: config.model || "mistral-large-latest",
        messages: prompt.messages as any,
        temperature: config.temperature,
        maxTokens: config.maxTokens,
        topP: config.topP,
      });

      for await (const chunk of stream) {
        const content = chunk.data.choices[0]?.delta?.content;
        if (typeof content === 'string' && content) {
          onToken(content);
        }
      }

      return ok(undefined);
    } catch (error: any) {
      return fail(new ExternalServiceError(`Mistral Stream Error: ${error.message}`));
    }
  }
}
