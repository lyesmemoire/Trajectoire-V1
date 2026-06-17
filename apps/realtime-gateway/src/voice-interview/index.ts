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
export * from "./core/state";
export * from "./core/evaluation";
export * from "./core/question-generator";
export * from "./core/interview-engine";
export * from "./core/feedback-text";
export * from "./core/intent-detector";
export * from "./core/interview-summary";
export * from "./core/voice-orchestrator";

// Interview Engine V2 (P3.6) — entretien réaliste, déterministe, isolé.
export * as V2 from "./core/v2/index";
// Couche de simulation comportementale (refactor P3.7) : perception /
// interviewer-brain / adaptive / evaluation. Le moteur V2 y délègue.
export * as Simulation from "./core/simulation/index";

// Sessions (runtime)
export { SessionManager } from "./sessions/session-manager";
export type {
  VoiceSession,
  VoiceTurnRecord,
  CreateSessionInput,
  SessionManagerOptions,
} from "./sessions/session-manager";

// Adapters (I/O)
export { DeepgramAdapter, extractTranscript } from "./adapters/deepgram";
export type {
  DeepgramAdapterCallbacks,
  DeepgramAdapterOptions,
} from "./adapters/deepgram";
export {
  DefaultTTSAdapter,
  ChainTTSAdapter,
  createDefaultTTS,
  createSilentWav,
  MockTTSProvider,
  ElevenLabsTTSProvider,
  OpenAITTSProvider,
} from "./adapters/tts/index";
export type { TTSAdapter, TTSProvider } from "./adapters/tts/types";
export {
  handleVoiceConnection,
} from "./adapters/websocket";
export type {
  WsLike,
  ServerMessage,
  VoiceWebSocketDeps,
} from "./adapters/websocket";
export { handleVoiceConnectionV2 } from "./adapters/voice-websocket";
export type {
  VoiceWsLike,
  VoiceServerMessage,
  VoiceConnectionDeps,
} from "./adapters/voice-websocket";
export { handleVoiceConnectionV2Engine } from "./adapters/voice-websocket-v2";
export type {
  VoiceV2Deps,
  VoiceV2Input,
  V2ServerMessage,
} from "./adapters/voice-websocket-v2";
