/**
 * runtime/transport-binding.ts — Frontière I/O « bête » (P4.2).
 * Exécute une séquence de VoiceInstruction via TTSAdapter + VoiceSink.
 * Ne décide rien : traduit des instructions déjà décidées.
 */
import type { TTSAdapter } from "../adapters/tts/types";
import type { VoiceInstruction } from "./voice-runtime";

export interface VoiceSink {
  sendAudio(buffer: ArrayBuffer, meta: { speechRate: number }): void;
  sendEvent(event: VoiceTransportEvent): void;
}

export type VoiceTransportEvent =
  | { type: "thinking"; ms: number }
  | { type: "silence"; ms: number }
  | { type: "interrupt"; atMs: number }
  | { type: "speaking_start"; estimatedMs: number; speechRate: number }
  | { type: "turn_done"; latencyMs: number };

export async function bindAndPlay(
  instructions: VoiceInstruction[],
  tts: TTSAdapter,
  sink: VoiceSink,
): Promise<void> {
  for (const instr of instructions) {
    switch (instr.type) {
      case "wait":
        sink.sendEvent({ type: "thinking", ms: instr.ms });
        break;
      case "emphatic_silence":
        sink.sendEvent({ type: "silence", ms: instr.ms });
        break;
      case "interrupt_candidate":
        sink.sendEvent({ type: "interrupt", atMs: instr.atMs });
        break;
      case "speak": {
        sink.sendEvent({
          type: "speaking_start",
          estimatedMs: instr.estimatedMs,
          speechRate: instr.speechRate,
        });
        const audio = await tts.synthesize(instr.text);
        sink.sendAudio(audio, { speechRate: instr.speechRate });
        break;
      }
      case "turn_done":
        sink.sendEvent({ type: "turn_done", latencyMs: instr.latencyMs });
        break;
      default: {
        const _never: never = instr;
        void _never;
      }
    }
  }
}
