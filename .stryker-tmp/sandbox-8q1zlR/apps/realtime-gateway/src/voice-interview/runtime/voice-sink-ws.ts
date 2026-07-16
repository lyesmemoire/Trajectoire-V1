/**
 * runtime/voice-sink-ws.ts — Pont VoiceSink ⇄ transport WS V2 (P4.2). ADDITIF.
 *
 * Permet de brancher la couche runtime (déterministe) sur le WebSocket V2
 * EXISTANT sans le réécrire : on adapte ses callbacks (sendJson/sendAudio) à
 * l'interface VoiceSink « bête ». Activable côté serveur derrière un flag
 * (ex. ?sim=1) — par défaut, le flux historique reste inchangé.
 *
 * Le pont ne décide rien : il sérialise les events runtime vers le protocole WS.
 */
// @ts-nocheck

import type { VoiceSink, OutboundVoiceSignal } from "./transport-binding.js";

/** Callbacks minimaux fournis par le WS V2 (déjà existants). */
export interface WsSendBridge {
  sendJson: (msg: { type: string; [k: string]: unknown }) => void;
  sendAudio: (audio: ArrayBuffer) => void;
}

/** Mappe un event runtime vers un message WS (protocole sim_*). */
function toWsMessage(e: OutboundVoiceSignal): { type: string; [k: string]: unknown } {
  switch (e.type) {
    case "thinking":
      return { type: "sim_thinking", ms: e.ms };
    case "silence":
      return { type: "sim_silence", ms: e.ms };
    case "interrupt":
      return { type: "sim_interrupt", atMs: e.atMs };
    case "speaking_start":
      return {
        type: "sim_speaking_start",
        estimatedMs: e.estimatedMs,
        speechRate: e.speechRate,
      };
    case "speaking_stop":
      return { type: "sim_speaking_stop" };
    case "turn_done":
      return { type: "sim_turn_done", latencyMs: e.latencyMs };
    default: {
      const _never: never = e as never;
      void _never;
      return { type: "sim_unknown" };
    }
  }
}

/** Construit un VoiceSink branché sur le WS V2 existant. */
export function createWsVoiceSink(bridge: WsSendBridge): VoiceSink {
  return {
    sendAudio(buffer: ArrayBuffer, meta: { speechRate: number }) {
      bridge.sendJson({ type: "sim_audio_meta", speechRate: meta.speechRate });
      bridge.sendAudio(buffer);
    },
    sendSignal(signal: OutboundVoiceSignal) {
      bridge.sendJson(toWsMessage(signal));
    },
  };
}
