import type { SpeechSynthesisPort } from "../../../application/ports/AIPorts.js";

export class SilentAudioAdapter implements SpeechSynthesisPort {
  async synthesize(text: string): Promise<string> {
    // Returns a recognizable base64 flag indicating silent fallback
    return "SILENT_FALLBACK_AUDIO_BASE64";
  }
}
