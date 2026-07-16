// @ts-nocheck
import type { SpeechSynthesisPort } from "../../../application/ports/AIPorts.js";
import { ProviderError } from "../../errors/ProviderErrors.js";

export interface ElevenLabsClient {
  textToSpeech: (voiceId: string, text: string) => Promise<ArrayBuffer>;
}

export class ElevenLabsTTSAdapter implements SpeechSynthesisPort {
  constructor(private client: ElevenLabsClient, private voiceId: string) {}

  async synthesize(text: string): Promise<string> {
    try {
      const buffer = await this.client.textToSpeech(this.voiceId, text);
      // For architectural boundary, we'd normally return the buffer or a stream ID.
      // Returning base64 string for simplicity in this port's signature.
      return Buffer.from(buffer).toString("base64");
    } catch (error) {
      throw new ProviderError("ElevenLabs TTS Failed", "elevenlabs", error);
    }
  }
}
