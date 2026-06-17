import { EventEmitter } from "eventemitter3";
import type { TranscriptMessage } from "../contracts/transcript";

export interface GatewayEvents {
  transcript: (msg: TranscriptMessage) => void;
  ai_chunk: (msg: { sessionId: string; payload: string }) => void;
  ai_done: (msg: { sessionId: string }) => void;
  ai_error: (msg: { sessionId: string; error: string }) => void;
  ai_audio_chunk: (msg: { sessionId: string; payload: Uint8Array }) => void;
  ai_audio_done: (msg: { sessionId: string }) => void;
  interrupt: (msg: { sessionId: string }) => void;
}

export const bus = new EventEmitter<GatewayEvents>();
