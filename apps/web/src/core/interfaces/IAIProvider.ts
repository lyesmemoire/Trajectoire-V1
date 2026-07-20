/**
 * IAIProvider Interface
 * Defines the contract for AI provider implementations
 * Following Dependency Inversion Principle
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
}

export interface ChatCompletionResponse {
  content: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface AudioTranscriptionParams {
  file: File | Buffer;
  model: string;
  language?: string;
}

export interface AudioTranscriptionResponse {
  text: string;
  duration: number;
}

export interface AudioSpeechParams {
  text: string;
  model: string;
  voice?: string;
}

export interface AudioSpeechResponse {
  audio: Buffer;
}

export interface IAIProvider {
  /**
   * Perform a chat completion
   * @param params - Chat completion parameters
   * @returns Chat completion response
   */
  chatCompletion(params: ChatCompletionParams): Promise<ChatCompletionResponse>;

  /**
   * Transcribe audio to text
   * @param params - Transcription parameters
   * @returns Transcription response
   */
  transcribeAudio(params: AudioTranscriptionParams): Promise<AudioTranscriptionResponse>;

  /**
   * Convert text to speech
   * @param params - Speech synthesis parameters
   * @returns Speech synthesis response
   */
  synthesizeSpeech(params: AudioSpeechParams): Promise<AudioSpeechResponse>;
}
