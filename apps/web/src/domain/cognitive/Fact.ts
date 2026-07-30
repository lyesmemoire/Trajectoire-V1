import { z } from "zod";

// ===================================================================
// FACT — Cognitive Fact Contract
// ===================================================================

export enum FactType {
  OBSERVATION = "OBSERVATION",
  EVIDENCE = "EVIDENCE",
  CONTRADICTION = "CONTRADICTION",
  HYPOTHESIS = "HYPOTHESIS",
  DECISION = "DECISION",
}

export interface Fact {
  id: string;
  type: FactType;
  content: string;
  confidence: number;
  source: string;
  timestamp: Date;
}

// Zod Schema
export const FactTypeSchema = z.enum([
  FactType.OBSERVATION,
  FactType.EVIDENCE,
  FactType.CONTRADICTION,
  FactType.HYPOTHESIS,
  FactType.DECISION,
]);

export const FactSchema = z.object({
  id: z.string().uuid(),
  type: FactTypeSchema,
  content: z.string().min(1),
  confidence: z.number().min(0).max(1),
  source: z.string().min(1),
  timestamp: z.date(),
});
