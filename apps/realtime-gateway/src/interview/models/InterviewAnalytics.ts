// apps/realtime-gateway/src/interview/models/InterviewAnalytics.ts

export interface InterviewAnalytics {
  totalTokens: number;
  estimatedCostUsd: number; // USD estimate for the session so far
  tokensInput: number; // total input tokens to LLM
  tokensOutput: number; // total output tokens from LLM
  ttsCharacters: number; // characters sent to TTS engine
  audioMinutes: number; // total minutes of generated audio
  llmLatencyMs?: number; // average LLM response latency
  ttsLatencyMs?: number; // average TTS generation latency
  averageCandidateResponseMs?: number; // avg time candidate takes to answer
}
