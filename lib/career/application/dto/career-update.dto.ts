import { z } from "zod";

export const CareerUpdateSchema = z.object({
  sessionId: z.string().uuid().optional(),
  interviewAnalysis: z.object({
    communicationScore: z.number().min(0).max(100).optional(),
    confidenceScore: z.number().min(0).max(100).optional(),
    technicalScore: z.number().min(0).max(100).optional(),
    leadershipScore: z.number().min(0).max(100).optional(),
    verbosity: z.number().min(0).optional(),
    interruptionCount: z.number().int().min(0).optional(),
    recoveryCount: z.number().int().min(0).optional(),
    freezeCount: z.number().int().min(0).optional(),
    completionRate: z.number().min(0).max(100).optional(),
  }),
  uxFingerprint: z.object({
    entropyScore: z.number().optional(),
    headless: z.boolean().optional(),
    unnaturalSpeed: z.boolean().optional(),
    hesitationIndex: z.number().optional(),
    scrollEntropy: z.number().optional(),
    clickDelayAvg: z.number().optional(),
  }).optional(),
});

export type CareerUpdateDTO = z.infer<typeof CareerUpdateSchema>;
