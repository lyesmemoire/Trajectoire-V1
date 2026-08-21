/**
 * AI Streaming Service
 *
 * Provides streaming capabilities for AI responses.
 *
 * No-key behavior:
 * - never creates an OpenAI client with a placeholder key
 * - never performs a remote request without valid AI configuration
 * - returns a deterministic fallback stream instead
 */

import OpenAI from "openai";

import {
  getOptionalAIConfig,
  hasValidOpenAIKey,
} from "@/lib/ai/config/ai.config";

export interface StreamingOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  onToken?: (token: string) => void;
  onComplete?: (fullResponse: string) => void;
  onError?: (error: Error) => void;
}

export interface StreamingResult {
  fullResponse: string;
  tokenCount: number;
  duration: number;
}

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

const LOCAL_FALLBACK_RESPONSE =
  "Analyse IA distante indisponible. Le mode local reste actif.";

export class AIStreamingService {
  private readonly openai: OpenAI | null;

  constructor(apiKey?: string) {
    const explicitKey =
      apiKey?.trim();

    if (
      explicitKey &&
      hasValidOpenAIKey(explicitKey)
    ) {
      this.openai =
        new OpenAI({
          apiKey:
            explicitKey,
        });

      return;
    }

    const config =
      getOptionalAIConfig();

    if (!config) {
      this.openai =
        null;

      return;
    }

    this.openai =
      new OpenAI({
        apiKey:
          config.openaiApiKey,

        organization:
          config.openaiOrganization,

        project:
          config.openaiProject,
      });
  }

  async streamResponse(
    messages: ChatMessage[],
    options: StreamingOptions = {},
  ): Promise<StreamingResult> {
    const {
      model = "gpt-4o-mini",
      temperature = 0.7,
      maxTokens = 2000,
      onToken,
      onComplete,
      onError,
    } = options;

    const startTime =
      Date.now();

    if (!this.openai) {
      return this.streamLocalFallback(
        startTime,
        onToken,
        onComplete,
      );
    }

    let fullResponse =
      "";

    let tokenCount =
      0;

    try {
      const stream =
        await this.openai.chat.completions.create({
          model,

          messages:
            messages as OpenAI.Chat.ChatCompletionMessageParam[],

          temperature,

          max_tokens:
            maxTokens,

          stream:
            true,
        });

      for await (
        const chunk of stream
      ) {
        const token =
          chunk.choices[0]
            ?.delta
            ?.content ?? "";

        if (!token) {
          continue;
        }

        fullResponse +=
          token;

        tokenCount += 1;

        onToken?.(
          token,
        );
      }

      const duration =
        Date.now() -
        startTime;

      onComplete?.(
        fullResponse,
      );

      return {
        fullResponse,
        tokenCount,
        duration,
      };
    } catch (error) {
      const normalizedError =
        error instanceof Error
          ? error
          : new Error(
              "Unknown AI streaming error",
            );

      onError?.(
        normalizedError,
      );

      return this.streamLocalFallback(
        startTime,
        onToken,
        onComplete,
      );
    }
  }

  async streamToWritable(
    messages: ChatMessage[],
    writableStream: NodeJS.WritableStream,
    options: StreamingOptions = {},
  ): Promise<StreamingResult> {
    const originalOnToken =
      options.onToken;

    const result =
      await this.streamResponse(
        messages,
        {
          ...options,

          onToken: (
            token: string,
          ) => {
            writableStream.write(
              token,
            );

            originalOnToken?.(
              token,
            );
          },
        },
      );

    writableStream.end();

    return result;
  }

  async streamToWebResponse(
    messages: ChatMessage[],
    options: StreamingOptions = {},
  ): Promise<Response> {
    const encoder =
      new TextEncoder();

    const self =
      this;

    const stream =
      new ReadableStream<Uint8Array>({
        async start(
          controller,
        ) {
          try {
            await self.streamResponse(
              messages,
              {
                ...options,

                onToken: (
                  token: string,
                ) => {
                  controller.enqueue(
                    encoder.encode(
                      token,
                    ),
                  );

                  options.onToken?.(
                    token,
                  );
                },

                onComplete: (
                  fullResponse,
                ) => {
                  options.onComplete?.(
                    fullResponse,
                  );
                },
              },
            );

            controller.close();
          } catch (error) {
            const normalizedError =
              error instanceof Error
                ? error
                : new Error(
                    "Unknown AI streaming error",
                  );

            options.onError?.(
              normalizedError,
            );

            controller.error(
              normalizedError,
            );
          }
        },
      });

    return new Response(
      stream,
      {
        headers: {
          "Content-Type":
            "text/event-stream; charset=utf-8",

          "Cache-Control":
            "no-cache, no-transform",

          Connection:
            "keep-alive",
        },
      },
    );
  }

  private streamLocalFallback(
    startTime: number,
    onToken?: (
      token: string,
    ) => void,
    onComplete?: (
      fullResponse: string,
    ) => void,
  ): StreamingResult {
    const response =
      LOCAL_FALLBACK_RESPONSE;

    onToken?.(
      response,
    );

    onComplete?.(
      response,
    );

    return {
      fullResponse:
        response,

      tokenCount:
        0,

      duration:
        Date.now() -
        startTime,
    };
  }
}

export async function createStreamingResponse(
  messages: ChatMessage[],
  apiKey?: string,
  options?: StreamingOptions,
): Promise<Response> {
  const service =
    new AIStreamingService(
      apiKey,
    );

  return service.streamToWebResponse(
    messages,
    options,
  );
}