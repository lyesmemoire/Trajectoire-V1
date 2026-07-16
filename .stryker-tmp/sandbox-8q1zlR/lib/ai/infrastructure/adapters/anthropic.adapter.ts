// @ts-nocheck
import { LlmProviderPort } from "../../ports/llm-provider.port";
import { StreamingProviderPort } from "../../ports/streaming-provider.port";
import { Prompt } from "../../domain/value-objects/prompt.vo";
import { ModelConfiguration } from "../../domain/value-objects/model-configuration.vo";
import { Completion } from "../../domain/value-objects/completion.vo";
import { TokenUsage } from "../../domain/value-objects/token-usage.vo";
import { Result, ok, fail } from "@/lib/core/result";
import { ExternalServiceError } from "@/lib/core/errors";
import { envServer } from "@/lib/env.server";

export class AnthropicAdapter implements LlmProviderPort, StreamingProviderPort {
  private apiKey: string;
  private endpoint = "https://api.anthropic.com/v1/messages";

  constructor() {
    this.apiKey = envServer.ANTHROPIC_API_KEY || "";
  }

  private mapPrompt(prompt: Prompt) {
    const systemMessage = prompt.messages.find(m => m.role === "system")?.content;
    const messages = prompt.messages
      .filter(m => m.role !== "system")
      .map(m => ({ role: m.role, content: m.content }));
    return { system: systemMessage, messages };
  }

  async generate(prompt: Prompt, config: ModelConfiguration): Promise<Result<Completion>> {
    try {
      const { system, messages } = this.mapPrompt(prompt);
      
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: config.model || "claude-3-5-sonnet-20241022",
          system,
          messages,
          temperature: config.temperature,
          max_tokens: config.maxTokens || 1024,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return fail(new ExternalServiceError(`Anthropic API Error: ${errorText}`));
      }

      const data = await response.json();
      const content = data.content?.[0]?.text || "";
      
      let tokenUsage: TokenUsage | undefined;
      if (data.usage) {
        tokenUsage = TokenUsage.create(
          data.usage.input_tokens,
          data.usage.output_tokens,
          data.usage.input_tokens + data.usage.output_tokens
        );
      }

      return ok(Completion.create(content, tokenUsage));
    } catch (error: any) {
      return fail(new ExternalServiceError(`Anthropic Network Error: ${error.message}`));
    }
  }

  async stream(prompt: Prompt, config: ModelConfiguration, onToken: (token: string) => void): Promise<Result<void>> {
    try {
      const { system, messages } = this.mapPrompt(prompt);
      
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: config.model || "claude-3-5-sonnet-20241022",
          system,
          messages,
          temperature: config.temperature,
          max_tokens: config.maxTokens || 1024,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return fail(new ExternalServiceError(`Anthropic Stream API Error: ${errorText}`));
      }

      if (!response.body) {
         return fail(new ExternalServiceError(`No response body in stream`));
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (dataStr === '[DONE]') continue;
            
            try {
              const data = JSON.parse(dataStr);
              if (data.type === 'content_block_delta' && data.delta?.text) {
                onToken(data.delta.text);
              }
            } catch (e) {
              // Ignore parse errors on partial chunks
            }
          }
        }
      }

      return ok(undefined);
    } catch (error: any) {
      return fail(new ExternalServiceError(`Anthropic Stream Network Error: ${error.message}`));
    }
  }
}
