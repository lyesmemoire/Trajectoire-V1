/**
 * adapters/tts.ts — Façade rétro-compatible (P3.2 -> P3.3).
 *
 * Le système TTS a évolué en dossier `tts/` (providers + fallback en chaîne).
 * Ce fichier préserve l'API importée par P3.2 (DefaultTTSAdapter, createSilentWav,
 * TTSAdapter, TTSProvider) en réexportant la nouvelle implémentation.
 */
// @ts-nocheck


export {
  DefaultTTSAdapter,
  ChainTTSAdapter,
  createDefaultTTS,
  createSilentWav,
  MockTTSProvider,
  ElevenLabsTTSProvider,
  OpenAITTSProvider,
} from "./tts/index.js";
export type { TTSAdapter, TTSProvider } from "./tts/types.js";
