/**
 * adapters/tts/elevenlabs.ts — Provider TTS ElevenLabs (P3.3), optionnel.
 *
 * SDK chargé dynamiquement : si absent ou clé manquante -> isConfigured()=false
 * (le chaînage passe au provider suivant). N'impose aucune dépendance au build.
 */

import type { TTSProvider } from "./types";

export interface ElevenLabsOptions {
  apiKey?: string;
  voiceId?: string;
  modelId?: string;
}

export class ElevenLabsTTSProvider implements TTSProvider {
  readonly name = "elevenlabs";
  private readonly apiKey: string;
  private readonly voiceId: string;
  private readonly modelId: string;

  constructor(options: ElevenLabsOptions = {}) {
    this.apiKey = options.apiKey ?? process.env.ELEVENLABS_API_KEY ?? "";
    this.voiceId =
      options.voiceId ?? process.env.ELEVENLABS_VOICE_ID ?? "Rachel";
    this.modelId = options.modelId ?? "eleven_multilingual_v2";
  }

  isConfigured(): boolean {
    return this.apiKey.length > 0;
  }

  async synthesize(text: string): Promise<ArrayBuffer> {
    if (!this.isConfigured()) throw new Error("ElevenLabs non configuré");

    // Appel REST direct (pas de dépendance SDK obligatoire au build).
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(
        this.voiceId,
      )}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": this.apiKey,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: this.modelId,
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      },
    );

    if (!res.ok) {
      throw new Error(`ElevenLabs HTTP ${res.status}`);
    }
    return await res.arrayBuffer();
  }
}
