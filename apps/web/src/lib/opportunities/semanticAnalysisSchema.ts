/**
 * SemanticAnalysisSchema
 *
 * Zod schema for the LLM-structured semantic CV x Job analysis.
 * All fields are evidence-grounded; no hallucination allowed.
 */
import { z } from "zod";

export const RequirementStatusSchema = z.enum([
  "PROVEN",   // Explicit evidence found in the CV with supporting context
  "PARTIAL",  // Some evidence exists but incomplete or lacks depth
  "MISSING",  // Clearly required by the job but absent from the CV
  "UNKNOWN",  // Cannot determine from CV alone - absence ≠ absence of skill
]);

export const RequirementMatchSchema = z.object({
  requirement: z
    .string()
    .describe("Exact skill/experience extracted verbatim from the job offer"),
  status: RequirementStatusSchema,
  evidence: z
    .string()
    .describe(
      "Direct quote or paraphrase from the CV. If MISSING or UNKNOWN, explain why there is no evidence. Never invent.",
    ),
  reasoning: z
    .string()
    .describe(
      "Why you assigned this status. Distinguish fact (CV says X) from inference (CV implies X). " +
        "Never invent metrics, durations, technologies, or responsibilities.",
    ),
});

export const CandidateRiskSchema = z.object({
  title: z
    .string()
    .max(80)
    .describe("Short risk title, max 80 chars, in French"),
  severity: z.enum(["HIGH", "MEDIUM"]),
  status: z.enum(["MISSING", "WEAK", "PARTIAL"]),
  competency: z
    .string()
    .describe("The specific competency or area at risk"),
  evidence: z
    .string()
    .describe(
      "What the CV shows (or does not show). Use exact quotes. Never invent.",
    ),
  reasoning: z
    .string()
    .describe(
      "Why this is a risk for this specific candidate for this specific role.",
    ),
});

export const SemanticAnalysisSchema = z.object({
  overallFit: z
    .number()
    .int()
    .min(0)
    .max(100)
    .describe(
      "Overall fit score 0-100. Based purely on evidence found in the CV vs job requirements. " +
        "Do NOT adjust upward without evidence.",
    ),
  strengths: z
    .array(z.string())
    .min(1)
    .max(4)
    .describe(
      "Evidence-based strengths. Each must cite a specific fact from the CV. " +
        "Never write generic positive statements.",
    ),
  gaps: z
    .array(z.string())
    .min(0)
    .max(4)
    .describe(
      "Real gaps between job requirements and CV evidence. " +
        "Only list what the job explicitly requires and the CV does not demonstrate. " +
        "Absence of proof is not proof of absence - use UNKNOWN when unsure.",
    ),
  requirementMatches: z
    .array(RequirementMatchSchema)
    .min(1)
    .max(12)
    .describe("One entry per key job requirement extracted from the offer."),
  candidateRisks: z
    .array(CandidateRiskSchema)
    .min(0)
    .max(3)
    .describe(
      "Maximum 3 risks, ordered by severity. Only include risks with real evidence. " +
        "Never invent a risk that has no basis in the job offer or the CV.",
    ),
  interviewFocus: z
    .array(z.string())
    .min(1)
    .max(4)
    .describe(
      "Questions the interviewer is very likely to ask based on the gaps and risks identified. " +
        "Specific to this candidate and this role.",
    ),
});

export type SemanticAnalysisResult = z.infer<typeof SemanticAnalysisSchema>;
export type RequirementMatch = z.infer<typeof RequirementMatchSchema>;
export type CandidateRisk = z.infer<typeof CandidateRiskSchema>;
