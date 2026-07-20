/**
 * AI Models Configuration
 * Centralized model names for all AI operations
 * All model references should use this file
 */
export const AI_MODELS = {
  CV_ANALYSIS: "gpt-4o",
  INTERVIEW: "gpt-4o",
  REPORT: "gpt-4o", // Will upgrade to gpt-5 when available
  SUMMARY: "gpt-4o-mini",
  SPEECH_TO_TEXT: "gpt-4o-audio-transcribe", // Using GPT-4o audio transcription
  TEXT_TO_SPEECH: "gpt-4o-audio-tts", // Using GPT-4o audio TTS
} as const;

export type AIModel = typeof AI_MODELS[keyof typeof AI_MODELS];
