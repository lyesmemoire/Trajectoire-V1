/**
 * OpenAIProvider Implementation
 * Implements IAIProvider interface for OpenAI
 */

import { IAIProvider, ChatMessage, ChatCompletionParams, ChatCompletionResponse, AudioTranscriptionParams, AudioTranscriptionResponse, AudioSpeechParams, AudioSpeechResponse } from "@/core/interfaces";
import { InfrastructureError, ExternalServiceError, TimeoutError } from "@/core/errors";
import { withTimeout, TIMEOUT_CONFIG } from "@/lib/timeout/withTimeout";
import { CircuitBreaker, CircuitBreakerDefaults } from "@/lib/resilience/CircuitBreaker";
import { RetryPolicy, RetryPolicyDefaults } from "@/lib/resilience/RetryPolicy";
import OpenAI from "openai";

export class OpenAIProviderImpl implements IAIProvider {
  private client: OpenAI;
  private circuitBreaker: CircuitBreaker;
  private retryPolicy: RetryPolicy;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    const organization = process.env.OPENAI_ORGANIZATION;

    if (!apiKey) {
      throw new InfrastructureError("OPENAI_API_KEY environment variable is not set", "OpenAIProvider");
    }

    this.client = new OpenAI({
      apiKey,
      organization,
      timeout: 60000,
      maxRetries: 2,
    });

    this.circuitBreaker = new CircuitBreaker("OpenAI", CircuitBreakerDefaults.OPENAI);
    this.retryPolicy = new RetryPolicy("OpenAI", RetryPolicyDefaults.OPENAI);
  }

  async chatCompletion(params: ChatCompletionParams): Promise<ChatCompletionResponse> {
    return this.circuitBreaker.execute(async () => {
      return this.retryPolicy.execute(async () => {
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
      });
    });
  }

  async transcribeAudio(params: AudioTranscriptionParams): Promise<AudioTranscriptionResponse> {
    return this.circuitBreaker.execute(async () => {
      return this.retryPolicy.execute(async () => {
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
      });
    });
  }

  async synthesizeSpeech(params: AudioSpeechParams): Promise<AudioSpeechResponse> {
    return this.circuitBreaker.execute(async () => {
      return this.retryPolicy.execute(async () => {
        try {
          const response = await withTimeout(
            this.client.audio.speech.create({
              model: params.model,
              voice: (params.voice as any) || "alloy",
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
      });
    });
  }
}
