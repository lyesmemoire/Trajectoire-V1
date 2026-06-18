/**
 * adapters/tts/mock.ts — Provider TTS de secours (silent WAV, P3.3).
 * Toujours "configuré", ne dépend de rien. Garantit le fallback ultime.
 */

import type { TTSProvider } from "./types.js";

/** Buffer WAV PCM 16-bit mono silencieux déterministe. */
export function createSilentWav(durationMs = 200, sampleRate = 16000): ArrayBuffer {
  const numSamples = Math.max(1, Math.floor((sampleRate * durationMs) / 1000));
  const dataSize = numSamples * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);
  const writeStr = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
  };
  writeStr(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, "data");
  view.setUint32(40, dataSize, true);
  return buffer;
}

export class MockTTSProvider implements TTSProvider {
  readonly name = "mock";
  isConfigured(): boolean {
    return true;
  }
  async synthesize(_text: string): Promise<ArrayBuffer> {
    void _text;
    return createSilentWav();
  }
}
