// src/contracts/signaling.ts
import { z } from "zod";

export const protocolVersion = 1 as const;

export const signalOfferSchema = z.object({
  type: z.literal("offer"),
  sessionId: z.string(),
  protocolVersion: z.literal(protocolVersion),
  sdp: z.string(),
  timestamp: z.number().int().optional(),
});

export const signalAnswerSchema = z.object({
  type: z.literal("answer"),
  sessionId: z.string(),
  protocolVersion: z.literal(protocolVersion),
  sdp: z.string(),
  timestamp: z.number().int().optional(),
});

export const signalCandidateSchema = z.object({
  type: z.literal("candidate"),
  sessionId: z.string(),
  protocolVersion: z.literal(protocolVersion),
  candidate: z.object({
    candidate: z.string(),
    sdpMid: z.string().optional(),
    sdpMLineIndex: z.number().int().optional(),
  }),
  timestamp: z.number().int().optional(),
});

export const signalMessageSchema = z.union([
  signalOfferSchema,
  signalAnswerSchema,
  signalCandidateSchema,
]);

export type SignalMessage = z.infer<typeof signalMessageSchema>;

// src/contracts/transcript.ts
export interface TranscriptMessage {
  type: "transcript";
  sessionId: string;
  sequence: number; // monotonic per session
  transcript: string;
  isFinal: boolean;
  timestamp: number; // ms since epoch
}

// src/contracts/events.ts
export enum EventName {
  AudioChunk = "audioChunk", // raw PCM Uint8Array
  Transcript = "transcript", // TranscriptMessage
  Interrupt = "interrupt", // sessionId only
}
