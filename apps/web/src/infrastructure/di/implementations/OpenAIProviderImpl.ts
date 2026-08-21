/**
 * OpenAIProvider Implementation
 *
 * Infrastructure adapter implementing IAIProvider.
 *
 * IMPORTANT:
 * - Never reads OPENAI_API_KEY directly.
 * - Never creates a client with a dummy/placeholder key.
 * - AI configuration comes from the centralized AI config layer.
 * - Fails fast when AI configuration is invalid.
 */

import OpenAI from "openai";

import type {
  IAIProvider,
  ChatCompletionParams,
  ChatCompletionResponse,
  AudioTranscriptionParams,
  AudioTranscriptionResponse,
  AudioSpeechParams,
  AudioSpeechResponse,
} from "@/core/interfaces";

import {
  ExternalServiceError,
  TimeoutError,
} from "@/core/errors";

import {
  getAIConfig,
} from "@/lib/ai/config/ai.config";

import {
  withTimeout,
  TIMEOUT_CONFIG,
} from "@/lib/timeout/withTimeout";

export class OpenAIProviderImpl
  implements IAIProvider
{
  private readonly client: OpenAI;

  constructor(
    client?: OpenAI,
  ) {
    if (client) {
      this.client =
        client;

      return;
    }

    const aiConfig =
      getAIConfig();

    this.client =
      new OpenAI({
        apiKey:
          aiConfig.openaiApiKey,

        organization:
          aiConfig.openaiOrganization,

        project:
          aiConfig.openaiProject,
      });
  }

  async chatCompletion(
    params: ChatCompletionParams,
  ): Promise<ChatCompletionResponse> {
    try {
      const response =
        await withTimeout(
          this.client.chat.completions.create({
            model:
              params.model,

            messages:
              params.messages.map(
                (message) => ({
                  role:
                    message.role,

                  content:
                    message.content,
                }),
              ),

            temperature:
              params.temperature,

            max_tokens:
              params.maxTokens,

            response_format:
              params.responseFormat,
          }),

          TIMEOUT_CONFIG.OPENAI,

          "OpenAI.chatCompletion",
        );

      const choice =
        response.choices[0];

      if (!choice) {
        throw new ExternalServiceError(
          "OpenAI returned no completion choice",
          "OpenAI",
        );
      }

      return {
        content:
          choice.message.content ?? "",

        promptTokens:
          response.usage
            ?.prompt_tokens ?? 0,

        completionTokens:
          response.usage
            ?.completion_tokens ?? 0,

        totalTokens:
          response.usage
            ?.total_tokens ?? 0,
      };
    } catch (error) {
      if (
        error instanceof TimeoutError
      ) {
        throw error;
      }

      if (
        error instanceof ExternalServiceError
      ) {
        throw error;
      }

      throw new ExternalServiceError(
        `OpenAI chat completion failed: ${this.getErrorMessage(error)}`,
        "OpenAI",
      );
    }
  }

  async transcribeAudio(
    params: AudioTranscriptionParams,
  ): Promise<AudioTranscriptionResponse> {
    try {
      const response =
        await withTimeout(
          this.client.audio.transcriptions.create({
            file:
              params.file as File,

            model:
              params.model,

            language:
              params.language,
          }),

          TIMEOUT_CONFIG.OPENAI,

          "OpenAI.transcribeAudio",
        );

      return {
        text:
          response.text,

        duration: 0,
      };
    } catch (error) {
      if (
        error instanceof TimeoutError
      ) {
        throw error;
      }

      if (
        error instanceof ExternalServiceError
      ) {
        throw error;
      }

      throw new ExternalServiceError(
        `OpenAI audio transcription failed: ${this.getErrorMessage(error)}`,
        "OpenAI",
      );
    }
  }

  async synthesizeSpeech(
    params: AudioSpeechParams,
  ): Promise<AudioSpeechResponse> {
    try {
      const response =
        await withTimeout(
          this.client.audio.speech.create({
            model:
              params.model,

            voice:
              this.normalizeVoice(
                params.voice,
              ),

            input:
              params.text,
          }),

          TIMEOUT_CONFIG.OPENAI,

          "OpenAI.synthesizeSpeech",
        );

      const arrayBuffer =
        await response.arrayBuffer();

      const audio =
        Buffer.from(
          arrayBuffer,
        );

      return {
        audio,
      };
    } catch (error) {
      if (
        error instanceof TimeoutError
      ) {
        throw error;
      }

      if (
        error instanceof ExternalServiceError
      ) {
        throw error;
      }

      throw new ExternalServiceError(
        `OpenAI speech synthesis failed: ${this.getErrorMessage(error)}`,
        "OpenAI",
      );
    }
  }

  private normalizeVoice(
    voice?: string,
  ): OpenAI.Audio.Speech.SpeechCreateParams["voice"] {
    const normalized =
      voice?.trim();

    if (!normalized) {
      return "alloy";
    }

    return normalized as OpenAI.Audio.Speech.SpeechCreateParams["voice"];
  }

  private getErrorMessage(
    error: unknown,
  ): string {
    if (
      error instanceof Error
    ) {
      return error.message;
    }

    if (
      typeof error ===
      "string"
    ) {
      return error;
    }

    try {
      return JSON.stringify(
        error,
      );
    } catch {
      return "Unknown OpenAI error";
    }
  }
}