// @ts-nocheck
// src/contracts/events.ts
import { z } from "zod";

// ---- Signaling protocol version ----
export const PROTOCOL_VERSION = 1 as const;

// ---- Signaling message envelope ----
export const signalingMessageSchema = z.object({
  protocolVersion: z.literal(PROTOCOL_VERSION),
  type: z.string(),
  sessionId: z.string(),
  payload: z.any(),
  timestamp: z.number().int().optional(),
});
export type SignalingMessage = z.infer<typeof signalingMessageSchema>;

// ---- Transcript message sent from gateway to client ----
export const transcriptMessageSchema = z.object({
  sequence: z.number().int(),
  transcript: z.string(),
  isFinal: z.boolean(),
  confidence: z.number().min(0).max(1).optional(),
});
export type TranscriptMessage = z.infer<typeof transcriptMessageSchema>;

// ---- Event bus payload typings ----
export interface GatewayEvents {
  transcript: TranscriptMessage;
  pcmChunk: Uint8Array; // raw PCM16 mono 16kHz
  interrupt: { sessionId: string };
}
