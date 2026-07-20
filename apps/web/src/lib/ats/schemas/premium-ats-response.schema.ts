import { z } from "zod";

const PressureMunitionSchema = z.object({
  suggestedQuestion: z.string().max(500),
  hook:              z.string().max(500).optional(),
  evidence:          z.string().max(500).optional(),
  severity:          z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
});

const MunitionPackSchema = z.object({
  generatedAt: z.string(),
  munitions:   z.array(PressureMunitionSchema).max(20),
  context: z.object({
    overallATS:    z.number().min(0).max(100),
    riskLevel:     z.string().max(50),
    coachingFocus: z.array(z.string().max(200)).max(10),
  }),
});

export const PremiumATSResponseSchema = z.object({
  candidateId:        z.string(),
  jobTitle:           z.string().max(200),
  analyzedAt:         z.string(),
  score: z.object({
    overall:    z.number().min(0).max(100),
    skills:     z.number().min(0).max(100).optional(),
    behavioral: z.number().min(0).max(100).optional(),
    readability: z.number().min(0).max(100).optional(),
  }),
  recruiterSignals:    z.array(z.string().max(300)).max(10),
  strengths:           z.array(z.string().max(300)).max(10),
  missingSkills:       z.array(z.string().max(100)).max(20),
  rewriteSuggestions:  z.array(z.object({
    original: z.string().max(500),
    improved: z.string().max(800),
  })).max(15),
  confidence:          z.number().min(0).max(100),
  munitionPack:        MunitionPackSchema.optional(),
  reportId:            z.string().uuid().nullable(),
});

export type PremiumATSResponse = z.infer<typeof PremiumATSResponseSchema>;
