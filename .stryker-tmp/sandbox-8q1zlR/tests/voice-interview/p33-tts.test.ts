/**
 * Tests P3.3 — système de providers TTS avec fallback en chaîne.
 */
// @ts-nocheck

import { describe, it, expect } from "vitest";
import {
  ChainTTSAdapter,
  MockTTSProvider,
  ElevenLabsTTSProvider,
  OpenAITTSProvider,
  createSilentWav,
} from "@/apps/realtime-gateway/src/voice-interview/adapters/tts/index";
import type { TTSProvider } from "@/apps/realtime-gateway/src/voice-interview/adapters/tts/types";

function provider(
  name: string,
  configured: boolean,
  impl: () => Promise<ArrayBuffer>,
): TTSProvider {
  return { name, isConfigured: () => configured, synthesize: impl };
}

describe("ChainTTSAdapter", () => {
  it("utilise le premier provider configuré", async () => {
    const chain = new ChainTTSAdapter({
      providers: [
        provider("a", true, async () => new Uint8Array([1]).buffer),
        provider("b", true, async () => new Uint8Array([2, 2]).buffer),
      ],
    });
    const audio = await chain.synthesize("x");
    expect(audio.byteLength).toBe(1);
  });

  it("passe au suivant si le premier n'est pas configuré", async () => {
    const chain = new ChainTTSAdapter({
      providers: [
        provider("a", false, async () => new Uint8Array([1]).buffer),
        provider("b", true, async () => new Uint8Array([2, 2]).buffer),
      ],
    });
    const audio = await chain.synthesize("x");
    expect(audio.byteLength).toBe(2);
  });

  it("cascade sur échec puis fallback mock (silent WAV)", async () => {
    const chain = new ChainTTSAdapter({
      providers: [
        provider("a", true, async () => {
          throw new Error("fail A");
        }),
        provider("b", true, async () => {
          throw new Error("fail B");
        }),
      ],
    });
    const audio = await chain.synthesize("x");
    // fallback mock => WAV non vide commençant par RIFF
    expect(audio.byteLength).toBeGreaterThan(44);
    const head = new TextDecoder().decode(new Uint8Array(audio, 0, 4));
    expect(head).toBe("RIFF");
  });

  it("isConfigured = true si au moins un provider réel configuré", () => {
    expect(
      new ChainTTSAdapter({
        providers: [provider("a", true, async () => new ArrayBuffer(2))],
      }).isConfigured(),
    ).toBe(true);
    expect(
      new ChainTTSAdapter({
        providers: [provider("a", false, async () => new ArrayBuffer(2))],
      }).isConfigured(),
    ).toBe(false);
  });

  it("ne rejette jamais, même sans aucun provider", async () => {
    const chain = new ChainTTSAdapter({ providers: [] });
    const audio = await chain.synthesize("x");
    expect(audio.byteLength).toBeGreaterThan(0);
  });
});

describe("providers réels (non configurés en CI)", () => {
  it("ElevenLabs/OpenAI non configurés sans clé", () => {
    // En test, on force des clés vides.
    expect(new ElevenLabsTTSProvider({ apiKey: "" }).isConfigured()).toBe(false);
    expect(new OpenAITTSProvider({ apiKey: "" }).isConfigured()).toBe(false);
  });
  it("ElevenLabs/OpenAI configurés avec clé", () => {
    expect(new ElevenLabsTTSProvider({ apiKey: "k" }).isConfigured()).toBe(true);
    expect(new OpenAITTSProvider({ apiKey: "k" }).isConfigured()).toBe(true);
  });
  it("MockTTSProvider toujours configuré", () => {
    expect(new MockTTSProvider().isConfigured()).toBe(true);
  });
  it("createSilentWav est un WAV valide", () => {
    const buf = createSilentWav();
    expect(new TextDecoder().decode(new Uint8Array(buf, 0, 4))).toBe("RIFF");
  });
});
