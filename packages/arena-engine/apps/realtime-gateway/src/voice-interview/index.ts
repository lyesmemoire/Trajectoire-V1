/**
 * Voice Interview Brain — point d'entrée public du module (P3.1).
 *
 * Module STANDALONE et isolé :
 *  - core/     : logique pure déterministe (state, evaluation, question gen, engine)
 *  - sessions/ : état runtime in-memory + TTL
 *  - adapters/ : I/O (Deepgram STT, WebSocket)
 *
 * Aucune dépendance vers /product, ProductOutput, l'ATS, la DB ou Supabase.
 * Prêt pour P3.2 (TTS + audio bidirectionnel + LLM optionnel).
 */

// Core (pur, testable)
export * from "./core/state.js";
export * from "./core/evaluation.js";
export * from "./core/question-generator.js";
export * from "./core/interview-engine.js";
export * from "./core/feedback-text.js";
export * from "./core/intent-detector.js";
export * from "./core/interview-summary.js";
export * from "./core/voice-orchestrator.js";

// Interview Engine V2 (P3.6) — entretien réaliste, déterministe, isolé.
export * as V2 from "./core/v2/index.js";
// Couche de simulation comportementale (refactor P3.7) : perception /
// interviewer-brain / adaptive / evaluation. Le moteur V2 y délègue.
export * as Simulation from "./core/simulation/index.js";

// Sessions (runtime)
export { SessionManager } from "./sessions/session-manager.js";
export type {
  VoiceSession,
  VoiceTurnRecord,
  CreateSessionInput,
  SessionManagerOptions,
} from "./sessions/session-manager.js";

// Adapters (I/O)
export { DeepgramAdapter, extractTranscript } from "./adapters/deepgram.js";
export type {
  DeepgramAdapterCallbacks,
  DeepgramAdapterOptions,
} from "./adapters/deepgram.js";
export {
  DefaultTTSAdapter,
  ChainTTSAdapter,
  createDefaultTTS,
  createSilentWav,
  MockTTSProvider,
  ElevenLabsTTSProvider,
  OpenAITTSProvider,
} from "./adapters/tts/index.js";
export type { TTSAdapter, TTSProvider } from "./adapters/tts/types.js";
export {
  handleVoiceConnection,
} from "./adapters/websocket.js";
export type {
  WsLike,
  ServerMessage,
  VoiceWebSocketDeps,
} from "./adapters/websocket.js";
export { handleVoiceConnectionV2 } from "./adapters/voice-websocket.js";
export type {
  VoiceWsLike,
  VoiceServerMessage,
  VoiceConnectionDeps,
} from "./adapters/voice-websocket.js";
export { handleVoiceConnectionV2Engine } from "./adapters/voice-websocket-v2.js";
export type {
  VoiceV2Deps,
  VoiceV2Input,
  V2ServerMessage,
} from "./adapters/voice-websocket-v2.js";
