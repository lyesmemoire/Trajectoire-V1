/**
 * adapters/tts/types.ts — Contrats du système TTS (P3.3).
 */

export interface TTSAdapter {
  /** True si une synthèse réelle est possible (sinon fallback silencieux). */
  isConfigured(): boolean;
  /** Texte -> audio. Ne rejette jamais (fallback interne). */
  synthesize(text: string): Promise<ArrayBuffer>;
}

export interface TTSProvider {
  /** Nom du provider (logs/diagnostic). */
  readonly name: string;
  /** True si configuré (clé API présente, etc.). */
  isConfigured(): boolean;
  /** Synthèse réelle. Peut rejeter : le chaînage gère le fallback. */
  synthesize(text: string): Promise<ArrayBuffer>;
}
