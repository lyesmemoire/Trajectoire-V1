import { z } from "zod";

// ===================================================================
// EVIDENCE SCHEMA
// Defines the exact shape of the output the LLM must generate.
// ===================================================================

export const EvidenceLevelSchema = z.enum([
  "VERY_WEAK",
  "WEAK",
  "MODERATE",
  "STRONG",
  "VERY_STRONG",
]);

export const EvidenceDimensionsSchema = z.object({
  specificity: z.number().min(0).max(1),
  quantification: z.number().min(0).max(1),
  responsibility: z.number().min(0).max(1),
  ownership: z.number().min(0).max(1),
  technicalDepth: z.number().min(0).max(1),
  businessImpact: z.number().min(0).max(1),
  decisionComplexity: z.number().min(0).max(1),
  productionReality: z.number().min(0).max(1),
  failureEvidence: z.number().min(0).max(1),
  tradeOffEvidence: z.number().min(0).max(1),
  consistency: z.number().min(0).max(1),
  verifiability: z.number().min(0).max(1),
  recency: z.number().min(0).max(1),
  repetition: z.number().min(0).max(1),
});

export const AnalyzedEvidenceSchema = z.object({
  observationId: z.string().uuid(),
  isEvidence: z.boolean().describe("True if this is a genuine proof, False if it's just a vague claim or affirmation."),
  competencies: z.array(z.string()).describe("The competencies this evidence supports (e.g., 'React', 'Leadership', 'System Design')."),
  strength: EvidenceLevelSchema.describe("The absolute strength of the evidence."),
  dimensions: EvidenceDimensionsSchema.describe("Scores from 0 to 1 for each dimension."),
  confidence: z.number().min(0).max(1).describe("The LLM's confidence in this analysis."),
  reason: z.string().describe("Why this is or isn't considered strong evidence."),
  missingEvidence: z.array(z.string()).describe("What is missing to make this a complete, VERIFIED proof (e.g., metrics, team size, outcome)."),
  supports: z.array(z.string().uuid()).describe("IDs of other observations this evidence supports."),
  contradicts: z.array(z.string().uuid()).describe("IDs of other observations this evidence contradicts."),
  relatedFacts: z.array(z.string()).describe("Other facts that relate to this evidence."),
});

// The payload that the LLM will generate
export const EvidenceOutputSchema = z.object({
  analyses: z.array(AnalyzedEvidenceSchema),
});
