import {
  AIProvider,
  ChatCompletionParams,
  ChatCompletionResponse,
  AudioTranscriptionParams,
  AudioTranscriptionResponse,
  AudioSpeechParams,
  AudioSpeechResponse,
} from "./Provider";
import { ExternalServiceError } from "@/core/errors";
import { recordAIRequest, recordError } from "@/lib/monitoring/metricsSupabase";
import OpenAI from 'openai';

/**
 * OpenAI Provider Implementation
 * Implements the AIProvider interface for OpenAI with resilience patterns
 */
export class OpenAIProvider implements AIProvider {
  private client: OpenAI;

  constructor(apiKey: string, organization?: string) {
    this.client = new OpenAI({ apiKey, organization });
    // API key is loaded from environment by resilient client
  }

  public getName(): string {
    return "OpenAI";
  }

  public async chatCompletion(params: ChatCompletionParams): Promise<ChatCompletionResponse> {
    const startTime = Date.now();

    try {
      const response = await this.client.chat.completions.create({
        model: params.model,
        messages: params.messages as any,
        temperature: params.temperature,
        max_tokens: params.maxTokens,
        response_format: params.responseFormat as any,
      });

      const latency = Date.now() - startTime;

      // Record metrics
      recordAIRequest(
        latency,
        response.usage?.prompt_tokens || 0,
        response.usage?.completion_tokens || 0,
        response.usage?.total_tokens || 0,
        response.model
      );

      return {
        content: response.choices[0]?.message?.content || "",
        promptTokens: response.usage?.prompt_tokens,
        completionTokens: response.usage?.completion_tokens,
        totalTokens: response.usage?.total_tokens,
        model: response.model,
        latency,
      };
    } catch (error) {
      // Record error
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      recordError("ai_request", errorMessage, "chat_completion");
      throw new ExternalServiceError(`OpenAI chat completion failed: ${errorMessage}`, "OpenAI");
    }
  }

  public async audioTranscription(params: AudioTranscriptionParams): Promise<AudioTranscriptionResponse> {
    try {
      const transcription = await this.client.audio.transcriptions.create({
        file: params.file,
        model: params.model,
        language: params.language,
      });

      return {
        text: transcription.text,
      };
    } catch (error) {
      throw new ExternalServiceError(`OpenAI audio transcription failed: ${error instanceof Error ? error.message : "Unknown error"}`, "OpenAI");
    }
  }

  public async audioSpeech(params: AudioSpeechParams): Promise<AudioSpeechResponse> {
    try {
      const mp3 = await this.client.audio.speech.create({
        model: params.model,
        voice: params.voice as "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer",
        input: params.input,
      });

      const buffer = Buffer.from(await mp3.arrayBuffer());
      return {
        audioBuffer: buffer,
      };
    } catch (error) {
      throw new ExternalServiceError(`OpenAI audio speech failed: ${error instanceof Error ? error.message : "Unknown error"}`, "OpenAI");
    }
  }
}
