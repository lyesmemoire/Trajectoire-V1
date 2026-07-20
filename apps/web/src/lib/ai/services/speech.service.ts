import AIClient from "../client";
import { AI_MODELS } from "../models";
import { RetryManager } from "../retry/RetryManager";
import { ExternalServiceError } from "@/core/errors";

/**
 * Speech Service
 * Handles Speech-to-Text and Text-to-Speech operations
 * Uses dedicated OpenAI audio models
 */

export interface SpeechToTextInput {
  audioFile: File;
  language?: string;
  sessionId?: string;
  userId?: string;
}

export interface TextToSpeechInput {
  text: string;
  voice?: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer";
  language?: string;
  sessionId?: string;
  userId?: string;
}

export class SpeechService {
  /**
   * Convert audio to text (Speech-to-Text)
   * @param input - Audio file and optional language
   * @returns Transcribed text
   */
  public static async speechToText(input: SpeechToTextInput): Promise<string> {
    const client = AIClient.getInstance();
    const sessionId = input.sessionId || "default";
    const userId = input.userId;

    const startTime = Date.now();

    const result = await RetryManager.execute(
      async () => {
        const response = await client.audioTranscription({
          file: input.audioFile,
          model: AI_MODELS.SPEECH_TO_TEXT,
          language: input.language || "fr",
        });

        return response.text;
      },
      { maxRetries: 3, initialDelay: 2000 }
    );

    if (!result.success || !result.data) {
      throw new ExternalServiceError(result.error || "Speech-to-text failed", "SpeechService");
    }

    return result.data;
  }

  /**
   * Convert text to audio (Text-to-Speech)
   * @param input - Text and optional voice/language
   * @returns Audio buffer
   */
  public static async textToSpeech(input: TextToSpeechInput): Promise<Buffer> {
    const client = AIClient.getInstance();
    const sessionId = input.sessionId || "default";
    const userId = input.userId;

    const startTime = Date.now();

    const result = await RetryManager.execute(
      async () => {
        const response = await client.audioSpeech({
          model: AI_MODELS.TEXT_TO_SPEECH,
          voice: input.voice || "alloy",
          input: input.text,
        });

        return response.audioBuffer;
      },
      { maxRetries: 3, initialDelay: 2000 }
    );

    if (!result.success || !result.data) {
      throw new ExternalServiceError(result.error || "Text-to-speech failed", "SpeechService");
    }

    return result.data;
  }

  /**
   * Get available voices for TTS
   * @returns List of available voices
   */
  public static getAvailableVoices(): Array<{ id: string; name: string }> {
    return [
      { id: "alloy", name: "Alloy" },
      { id: "echo", name: "Echo" },
      { id: "fable", name: "Fable" },
      { id: "onyx", name: "Onyx" },
      { id: "nova", name: "Nova" },
      { id: "shimmer", name: "Shimmer" },
    ];
  }
}
