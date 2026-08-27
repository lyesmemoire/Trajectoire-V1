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

import type { TTSAdapter, TTSProvider } from "./types.js";
import { MockTTSProvider, createSilentWav } from "./mock.js";
import { ElevenLabsTTSProvider } from "./elevenlabs.js";
import { OpenAITTSProvider } from "./openai.js";

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
 */
export class ChainTTSAdapter implements TTSAdapter {
  private readonly providers: TTSProvider[];
  private readonly mock = new MockTTSProvider();

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

  async synthesize(
    text: string,
    options?: { signal?: AbortSignal },
  ): Promise<ArrayBuffer> {
    const errors: string[] = [];

    for (const provider of this.providers) {
      if (!provider.isConfigured()) continue;

      try {
        const audio = await provider.synthesize(text, options);

        if (audio && audio.byteLength > 0) {
          return audio;
        }

        errors.push(`${provider.name}: empty audio`);
      } catch (error) {
        if (options?.signal?.aborted) {
          throw error;
        }

        errors.push(
          `${provider.name}: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      }
    }

    if (process.env.NODE_ENV === "production") {
      const details =
        errors.length > 0
          ? ` Providers attempted: ${errors.join(" | ")}`
          : " No real TTS provider is configured.";

      throw new Error(
        `TTS unavailable in production.${details}`,
      );
    }

    return this.mock.synthesize(text, options);
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
  synthesize(
    text: string,
    options?: { signal?: AbortSignal },
  ): Promise<ArrayBuffer> {
    return this.inner.synthesize(text, options);
  }
}

export { createSilentWav as __silentWav };
