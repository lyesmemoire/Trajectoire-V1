import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";
import { logger } from "../telemetry/logger.js";
import { bus } from "../events/bus.js";
import { TranscriptMessage } from "../contracts/transcript.js";

export class DeepgramWrapper {
  private connection: any;

  constructor() {
    const apiKey = process.env.DEEPGRAM_API_KEY!;
    const dg = createClient(apiKey);
    this.connection = dg.listen.live({
      model: "nova-2-general",
      encoding: "linear16",
      sample_rate: 16000,
      channels: 1,
      punctuate: true,
      interim_results: true,
    });

    // keep-alive
    this.connection.keepAlive?.();

    // forward transcripts to the event bus
    this.connection.on(LiveTranscriptionEvents.Transcript, (data: any) => {
      // Validate with zod
      try {
        const msg = TranscriptMessage.parse({
          sessionId: data.session_id || "unknown", // SDK may not provide session_id directly here if not tracked, but keeping it for structure
          transcript: data.channel.alternatives[0].transcript,
          isFinal: data.is_final,
          confidence: data.channel.alternatives[0].confidence,
          startMs: (data.start ?? 0) * 1000,
          endMs: (data.end ?? 0) * 1000,
        });
        bus.emit("transcript", msg);
      } catch (err) {
        logger.error({ err, data }, "Failed to parse Deepgram transcript");
      }
    });
  }

  /** send a PCM-16 chunk (Uint8Array) to Deepgram */
  public sendPCM(chunk: Uint8Array) {
    this.connection.send(chunk);
  }
}
