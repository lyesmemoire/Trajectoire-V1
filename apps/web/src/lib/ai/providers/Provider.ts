/**
 * AI Provider Interface
 * Abstract interface for AI providers (OpenAI, Anthropic, Gemini, Mistral, etc.)
 * Allows switching between providers without modifying services
 */

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatCompletionParams {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  responseFormat?: { type: "json_object" | "text" };
  signal?: AbortSignal;
}

export interface ChatCompletionResponse {
  content: string;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  model?: string;
  latency?: number;
}

export interface AudioTranscriptionParams {
  file: File;
  model: string;
  language?: string;
}

export interface AudioTranscriptionResponse {
  text: string;
  duration?: number;
}

export interface AudioSpeechParams {
  model: string;
  voice?: string;
  input: string;
}

export interface AudioSpeechResponse {
  audioBuffer: Buffer;
}

export interface AIProvider {
  /**
   * Get provider name
   */
  getName(): string;

  /**
   * Chat completion
   */
  chatCompletion(params: ChatCompletionParams): Promise<ChatCompletionResponse>;

  /**
   * Audio transcription (speech-to-text)
   */
  audioTranscription(params: AudioTranscriptionParams): Promise<AudioTranscriptionResponse>;

  /**
   * Audio speech (text-to-speech)
   */
  audioSpeech(params: AudioSpeechParams): Promise<AudioSpeechResponse>;
}
