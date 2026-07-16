/**
 * adapters/tts/ — Système de providers TTS avec fallback (P3.3).
 *
 * Architecture : le core ne sait JAMAIS quel provider est utilisé.
 * Chaîne de fallback déterministe :
 *   ElevenLabs -> OpenAI -> mock (silent WAV, P3.2)
 *
 * Chaque provider est optionnel et chargé dynamiquement : le gateway compile
 * et tourne même si un SDK est absent. Aucune dépendance obligatoire.
 */
// @ts-nocheck


import type { TTSAdapter, TTSProvider } from "./types.js";
import { MockTTSProvider, createSilentWav } from "./mock.js";
import { ElevenLabsTTSProvider } from "./elevenlabs.js";
import { OpenAITTSProvider } from "./openai.js";
import { metricsStore } from "../../../monitoring/metrics-store.js";
import pLimit from "p-limit";

export type { TTSAdapter, TTSProvider } from "./types.js";
export { createSilentWav } from "./mock.js";
export { MockTTSProvider } from "./mock.js";
export { ElevenLabsTTSProvider } from "./elevenlabs.js";
export { OpenAITTSProvider } from "./openai.js";

export interface ChainTTSOptions {
  /** Liste ordonnée de providers (le premier configuré gagne, fallback en cascade). */
  providers?: TTSProvider[];
}

/**
 * Adapter TTS à fallback en chaîne.
 * - synthesize() tente chaque provider configuré dans l'ordre ;
 * - si tous échouent -> mock (silent WAV). Ne rejette jamais.
 * - Limite concurrence TTS à 10 appels simultanés max.
 */
export class ChainTTSAdapter implements TTSAdapter {
  private readonly providers: TTSProvider[];
  private readonly mock = new MockTTSProvider();
  private readonly ttsLimit = pLimit(10); // max 10 TTS simultanés

  constructor(options: ChainTTSOptions = {}) {
    this.providers =
      options.providers ?? [
        new ElevenLabsTTSProvider(),
        new OpenAITTSProvider(),
      ];
  }

  /** True si AU MOINS un provider réel est configuré. */
  isConfigured(): boolean {
    return this.providers.some((p) => p.isConfigured());
  }

  async synthesize(text: string): Promise<ArrayBuffer> {
    return this.ttsLimit(async () => {
      const TTS_TIMEOUT_MS = 5000;
      
      for (const provider of this.providers) {
        if (!provider.isConfigured()) continue;
        
        const startTime = Date.now();
        
        try {
          const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error("TTS timeout")), TTS_TIMEOUT_MS);
          });
          
          const audio = await Promise.race([
            provider.synthesize(text),
            timeoutPromise
          ]);
          
          if (audio && audio.byteLength > 0) {
            const ttsMs = Date.now() - startTime;
            if (ttsMs > 2000) {
              metricsStore.slowTtsCount++;
            }
            return audio;
          }
        } catch (err) {
          // provider en échec -> on tente le suivant
          if (err instanceof Error && err.message === "TTS timeout") {
            metricsStore.slowTtsCount++;
          }
        }
      }
      // Dernier recours : silence déterministe.
      return this.mock.synthesize(text);
    });
  }
}

/** Construit l'adapter TTS par défaut (chaîne complète). */
export function createDefaultTTS(): TTSAdapter {
  return new ChainTTSAdapter();
}

// Rétro-compat : DefaultTTSAdapter conserve l'API P3.2.
export class DefaultTTSAdapter implements TTSAdapter {
  private readonly inner: TTSAdapter;
  constructor(options: { provider?: TTSProvider } = {}) {
    this.inner = options.provider
      ? new ChainTTSAdapter({ providers: [options.provider] })
      : new ChainTTSAdapter();
  }
  isConfigured(): boolean {
    return this.inner.isConfigured();
  }
  synthesize(text: string): Promise<ArrayBuffer> {
    return this.inner.synthesize(text);
  }
}

export { createSilentWav as __silentWav };
