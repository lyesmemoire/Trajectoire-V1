/**
 * adapters/tts/openai.ts — Provider TTS OpenAI (P3.3), optionnel.
 *
 * Appel REST direct (audio/speech). Si clé manquante -> isConfigured()=false.
 * Aucune dépendance SDK obligatoire au build.
 */
// @ts-nocheck


import type { TTSProvider } from "./types.js";

export interface OpenAITTSOptions {
  apiKey?: string;
  model?: string;
  voice?: string;
}

export class OpenAITTSProvider implements TTSProvider {
  readonly name = "openai";
  private readonly apiKey: string;
  private readonly model: string;
  private readonly voice: string;

  constructor(options: OpenAITTSOptions = {}) {
    this.apiKey = options.apiKey ?? process.env.OPENAI_API_KEY ?? "";
    this.model = options.model ?? "gpt-4o-mini-tts";
    this.voice = options.voice ?? "alloy";
  }

  isConfigured(): boolean {
    return this.apiKey.length > 0;
  }

  async synthesize(text: string): Promise<ArrayBuffer> {
    if (!this.isConfigured()) throw new Error("OpenAI TTS non configuré");

    const res = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        voice: this.voice,
        input: text,
        format: "mp3",
      }),
    });

    if (!res.ok) {
      throw new Error(`OpenAI TTS HTTP ${res.status}`);
    }
    return await res.arrayBuffer();
  }
}
