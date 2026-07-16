import type { SpeechRecognitionPort } from "../../../application/ports/AIPorts.js";
import { ProviderError } from "../../errors/ProviderErrors.js";

export interface DeepgramClient {
  transcription: {
    preRecorded: (source: any, options: any) => Promise<any>;
  };
}

export class DeepgramSTTAdapter implements SpeechRecognitionPort {
  constructor(private client: DeepgramClient) {}

  async transcribe(audioStream: unknown): Promise<string> {
    try {
      // Mock integration for Deepgram transcription
      const response = await this.client.transcription.preRecorded(audioStream, {
        smart_format: true,
        model: "nova-2",
        language: "fr"
      });

      const transcript = response.results?.channels[0]?.alternatives[0]?.transcript;
      if (typeof transcript !== "string") throw new Error("Invalid Deepgram response");

      return transcript;
    } catch (error) {
      throw new ProviderError("Deepgram STT Failed", "deepgram", error);
    }
  }
}
