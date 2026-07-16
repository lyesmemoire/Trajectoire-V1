// @ts-nocheck
import type { SpeechSynthesisPort } from "../../../application/ports/AIPorts.js";

// Removed SilentAudioAdapter to its own file

export class ChainTTSAdapter implements SpeechSynthesisPort {
  constructor(private adapters: SpeechSynthesisPort[]) {
    if (adapters.length === 0) {
      throw new Error("ChainTTSAdapter requires at least one adapter");
    }
  }

  async synthesize(text: string): Promise<string> {
    let lastError: unknown;

    for (const adapter of this.adapters) {
      try {
        return await adapter.synthesize(text);
      } catch (error) {
        lastError = error;
        // Continue to the next adapter in the chain
      }
    }

    throw lastError; // Should never happen if SilentAudioAdapter is at the end
  }
}
