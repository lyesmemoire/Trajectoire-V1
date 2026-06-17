import { z } from "zod";

export const TranscriptMessage = z.object({
  sessionId: z.string(),
  transcript: z.string(),
  isFinal: z.boolean(),
  confidence: z.number().optional(),
  startMs: z.number().optional(),
  endMs: z.number().optional(),
});

export type TranscriptMessage = z.infer<typeof TranscriptMessage>;
