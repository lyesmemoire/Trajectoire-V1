import { StructuredLLMProvider } from "../contracts/LLMProvider";
import { z } from "zod";

// ===================================================================
// PROMPT RUNNER — Centralized LLM Prompt Execution
// ===================================================================

export interface PromptConfig<TOutput> {
  system: string;
  prompt: string;
  schema: z.ZodType<TOutput>;
  schemaName: string;
  schemaDescription: string;
  maxRetries?: number;
  timeoutMs?: number;
}

export interface PromptResult<TOutput> {
  success: boolean;
  data?: TOutput;
  error?: string;
  durationMs: number;
  tokens?: {
    prompt: number;
    completion: number;
    total: number;
  };
  retries: number;
}

export class PromptRunner {
  constructor(private readonly provider: StructuredLLMProvider) {}

  async run<TOutput>(config: PromptConfig<TOutput>): Promise<PromptResult<TOutput>> {
    const startTime = Date.now();
    const maxRetries = config.maxRetries ?? 3;
    let retries = 0;
    let lastError: string | undefined;

    while (retries <= maxRetries) {
      try {
        const result = await this.provider.generateObject<TOutput>({
          system: config.system,
          prompt: config.prompt,
          schema: config.schema,
          schemaName: config.schemaName,
          schemaDescription: config.schemaDescription,
        });
        const durationMs = Date.now() - startTime;

        return {
          success: true,
          data: result.object,
          durationMs,
          tokens: {
            prompt: result.usage?.promptTokens ?? 0,
            completion: result.usage?.completionTokens ?? 0,
            total: result.usage?.totalTokens ?? 0,
          },
          retries,
        };
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);
        retries++;

        if (retries > maxRetries) {
          break;
        }

        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 100));
      }
    }

    const durationMs = Date.now() - startTime;

    return {
      success: false,
      error: lastError,
      durationMs,
      retries,
    };
  }
}
