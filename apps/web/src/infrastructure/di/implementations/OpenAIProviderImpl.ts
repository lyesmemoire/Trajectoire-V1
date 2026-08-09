/**
 * OpenAIProvider Implementation
 * Implements IAIProvider interface for OpenAI
 */

import { IAIProvider, ChatCompletionParams, ChatCompletionResponse, AudioTranscriptionParams, AudioTranscriptionResponse, AudioSpeechParams, AudioSpeechResponse } from "@/core/interfaces";
import { InfrastructureError, ExternalServiceError, TimeoutError } from "@/core/errors";
import { withTimeout, TIMEOUT_CONFIG } from "@/lib/timeout/withTimeout";
import OpenAI from 'openai';

export class OpenAIProviderImpl implements IAIProvider {
  private client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'dummy' });

  constructor() {
    // Client is now managed by resilience layer
  }

  async chatCompletion(params: ChatCompletionParams): Promise<ChatCompletionResponse> {
    try {
      const response = await withTimeout(
        this.client.chat.completions.create({
          model: params.model,
          messages: params.messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          temperature: params.temperature,
          max_tokens: params.maxTokens,
          response_format: params.responseFormat,
        }),
        TIMEOUT_CONFIG.OPENAI,
        "OpenAI.chatCompletion"
      );

      const choice = response.choices[0];
      if (!choice) {
        throw new ExternalServiceError("No response from AI", "OpenAI");
      }

      return {
        content: choice.message.content || "",
        promptTokens: response.usage?.prompt_tokens || 0,
        completionTokens: response.usage?.completion_tokens || 0,
        totalTokens: response.usage?.total_tokens || 0,
      };
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw error;
      }
      throw new ExternalServiceError(
        `OpenAI chat completion failed: ${error instanceof Error ? error.message : String(error)}`,
        "OpenAI"
      );
    }
  }

  async transcribeAudio(params: AudioTranscriptionParams): Promise<AudioTranscriptionResponse> {
    try {
      const response = await withTimeout(
        this.client.audio.transcriptions.create({
          file: params.file as File,
          model: params.model,
          language: params.language,
        }),
        TIMEOUT_CONFIG.OPENAI,
        "OpenAI.transcribeAudio"
      );

      return {
        text: response.text,
        duration: 0, // OpenAI API doesn't return duration in the response
      };
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw error;
      }
      throw new ExternalServiceError(
        `OpenAI audio transcription failed: ${error instanceof Error ? error.message : String(error)}`,
        "OpenAI"
      );
    }
  }

  async synthesizeSpeech(params: AudioSpeechParams): Promise<AudioSpeechResponse> {
    try {
      const response = await withTimeout(
        this.client.audio.speech.create({
          model: params.model,
          voice: (params.voice  as any) || "alloy",
          input: params.text,
        }),
        TIMEOUT_CONFIG.OPENAI,
        "OpenAI.synthesizeSpeech"
      );

      const buffer = Buffer.from(await response.arrayBuffer());

      return {
        audio: buffer,
      };
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw error;
      }
      throw new ExternalServiceError(
        `OpenAI speech synthesis failed: ${error instanceof Error ? error.message : String(error)}`,
        "OpenAI"
      );
    }
  }
}
