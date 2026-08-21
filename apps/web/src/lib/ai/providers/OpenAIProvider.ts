import OpenAI from "openai";

import {
  AIProvider,
  ChatCompletionParams,
  ChatCompletionResponse,
  AudioTranscriptionParams,
  AudioTranscriptionResponse,
  AudioSpeechParams,
  AudioSpeechResponse,
} from "./Provider";

import {
  ExternalServiceError,
} from "@/core/errors";

import {
  recordAIRequest,
  recordError,
} from "@/lib/monitoring/metricsSupabase";

import {
  hasValidOpenAIKey,
} from "@/lib/ai/config/ai.config";

export interface OpenAIProviderOptions {
  apiKey: string;
  organization?: string;
  baseURL?: string;
}

function normalizeOptionalString(
  value?: string,
): string | undefined {
  const normalized =
    value?.trim();

  return normalized || undefined;
}

function getErrorMessage(
  error: unknown,
): string {
  if (
    error instanceof Error
  ) {
    return error.message;
  }

  return "Unknown error";
}

function isAbortError(
  error: unknown,
): boolean {
  return (
    error instanceof Error &&
    error.name === "AbortError"
  );
}

export class OpenAIProvider
  implements AIProvider
{
  private readonly client: OpenAI;

  public constructor(
    options: OpenAIProviderOptions,
  ) {
    const apiKey =
      options.apiKey.trim();

    if (
      !hasValidOpenAIKey(
        apiKey,
      )
    ) {
      throw new ExternalServiceError(
        "OpenAI provider cannot start without a valid non-placeholder API key",
        "OpenAI",
      );
    }

    this.client =
      new OpenAI({
        apiKey,

        organization:
          normalizeOptionalString(
            options.organization,
          ),

        baseURL:
          normalizeOptionalString(
            options.baseURL,
          ),
      });
  }

  public getName(): string {
    return "OpenAI";
  }

  public async chatCompletion(
    params: ChatCompletionParams,
  ): Promise<ChatCompletionResponse> {
    const startTime =
      Date.now();

    try {
      const response =
        await this.client.chat.completions.create(
          {
            model:
              params.model,

            messages:
              params.messages as OpenAI.Chat.ChatCompletionMessageParam[],

            temperature:
              params.temperature,

            max_tokens:
              params.maxTokens,

            response_format:
              params.responseFormat,
          },
          {
            signal:
              params.signal,
          },
        );

      const latency =
        Date.now() -
        startTime;

      const promptTokens =
        response.usage
          ?.prompt_tokens ?? 0;

      const completionTokens =
        response.usage
          ?.completion_tokens ?? 0;

      const totalTokens =
        response.usage
          ?.total_tokens ?? 0;

      recordAIRequest(
        latency,
        promptTokens,
        completionTokens,
        totalTokens,
        response.model,
      );

      return {
        content:
          response.choices[0]
            ?.message
            ?.content ?? "",

        promptTokens,
        completionTokens,
        totalTokens,

        model:
          response.model,

        latency,
      };
    } catch (error) {
      const errorMessage =
        getErrorMessage(
          error,
        );

      if (
        isAbortError(
          error,
        ) ||
        params.signal
          ?.aborted
      ) {
        recordError(
          "ai_request",
          "OpenAI request aborted",
          "chat_completion",
        );

        throw new ExternalServiceError(
          "OpenAI chat completion timed out or was aborted",
          "OpenAI",
        );
      }

      recordError(
        "ai_request",
        errorMessage,
        "chat_completion",
      );

      throw new ExternalServiceError(
        `OpenAI chat completion failed: ${errorMessage}`,
        "OpenAI",
      );
    }
  }

  public async audioTranscription(
    params: AudioTranscriptionParams,
  ): Promise<AudioTranscriptionResponse> {
    try {
      const transcription =
        await this.client.audio.transcriptions.create({
          file:
            params.file,

          model:
            params.model,

          language:
            params.language,
        });

      return {
        text:
          transcription.text,
      };
    } catch (error) {
      throw new ExternalServiceError(
        `OpenAI audio transcription failed: ${getErrorMessage(error)}`,
        "OpenAI",
      );
    }
  }

  public async audioSpeech(
    params: AudioSpeechParams,
  ): Promise<AudioSpeechResponse> {
    try {
      const mp3 =
        await this.client.audio.speech.create({
          model:
            params.model,

          voice:
            params.voice as
              | "alloy"
              | "echo"
              | "fable"
              | "onyx"
              | "nova"
              | "shimmer",

          input:
            params.input,
        });

      const buffer =
        Buffer.from(
          await mp3.arrayBuffer(),
        );

      return {
        audioBuffer:
          buffer,
      };
    } catch (error) {
      throw new ExternalServiceError(
        `OpenAI audio speech failed: ${getErrorMessage(error)}`,
        "OpenAI",
      );
    }
  }
}