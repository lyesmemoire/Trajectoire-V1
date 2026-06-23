import { z } from "zod";

export const ContinueSessionSchema = z.object({
  ai_response: z.string().min(1).max(1000),

  follow_up: z.object({
    type: z.enum(["DEEP_DIVE", "CHALLENGE", "NEXT_QUESTION", "CLOSING"]),
    question: z.string().min(1).max(400).nullable(),
  }),

  instant_feedback: z.object({
    signal_quality: z.enum(["STRONG", "ADEQUATE", "WEAK"]),
    one_line: z.string().max(150),
  }),

  session_complete: z.boolean(),
});

export type ContinueSession = z.infer<typeof ContinueSessionSchema>;
