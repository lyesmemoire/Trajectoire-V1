/**
 * runtime/transport-binding.ts — Frontière I/O (P4.2).
 * Sépare strictement les flux entrants (Inbound) et sortants (Outbound).
 */
import type { TTSAdapter } from "../adapters/tts/types.js";
import type { VoiceInstruction } from "./voice-runtime.js";

export type OutboundVoiceSignal =
  | { type: "thinking"; ms: number }
  | { type: "silence"; ms: number }
  | { type: "interrupt"; atMs: number }
  | { type: "speaking_start"; estimatedMs: number; speechRate: number }
  | { type: "speaking_stop" }
  | { type: "turn_done"; latencyMs: number };

export type InboundVoiceEvent =
  | { type: "transcript"; text: string; isFinal: boolean }
  | { type: "user_silence"; ms: number };

export interface OutboundTransport {
  send(instruction: VoiceInstruction): void;
}

export interface InboundTransport {
  onEvent(handler: (event: InboundVoiceEvent) => void): void;
}

export interface InboundEventSource {
  dispatch(event: InboundVoiceEvent): void;
}

export interface TransportBinding
  extends OutboundTransport,
    InboundTransport,
    InboundEventSource {
  onInstruction(handler: (instruction: VoiceInstruction) => void): void;
}

export class DefaultTransportBinding implements TransportBinding {
  private eventHandlers: Array<(event: InboundVoiceEvent) => void> = [];
  private instructionHandlers: Array<(instruction: VoiceInstruction) => void> = [];

  onEvent(handler: (event: InboundVoiceEvent) => void): void {
    this.eventHandlers.push(handler);
  }

  dispatch(event: InboundVoiceEvent): void {
    for (const h of this.eventHandlers) h(event);
  }

  onInstruction(handler: (instruction: VoiceInstruction) => void): void {
    this.instructionHandlers.push(handler);
  }

  send(instruction: VoiceInstruction): void {
    for (const h of this.instructionHandlers) h(instruction);
  }
}

export interface VoiceSink {
  sendAudio(buffer: ArrayBuffer, meta: { speechRate: number }): void;
  sendSignal(signal: OutboundVoiceSignal): void;
}

export async function bindAndPlay(
  instructions: VoiceInstruction[],
  tts: TTSAdapter,
  sink: VoiceSink,
): Promise<void> {
  for (const instr of instructions) {
    switch (instr.type) {
      case "wait":
        sink.sendSignal({ type: "thinking", ms: instr.ms });
        break;
      case "emphatic_silence":
        sink.sendSignal({ type: "silence", ms: instr.ms });
        break;
      case "interrupt_candidate":
        sink.sendSignal({ type: "interrupt", atMs: instr.atMs });
        break;
      case "speak": {
        sink.sendSignal({
          type: "speaking_start",
          estimatedMs: instr.estimatedMs,
          speechRate: instr.speechRate,
        });
        const audio = await tts.synthesize(instr.text);
        sink.sendAudio(audio, { speechRate: instr.speechRate });
        break;
      }
      case "speaking_stop":
        sink.sendSignal({ type: "speaking_stop" });
        break;
      case "turn_done":
        sink.sendSignal({ type: "turn_done", latencyMs: instr.latencyMs });
        break;
      default: {
        const _never: never = instr as never;
        void _never;
      }
    }
  }
}
