// @ts-nocheck
import { callLlmStrict } from "../llm-strict.js";
import { z } from "zod";

export interface HRNarrativeEvaluation {
  narrative_structure_score: number;
  clarity_score: number;
  strategic_alignment_score: number;
  career_maturity_score: number;
  stability_risk: "Low" | "Moderate" | "High";
  generic_language_detected: boolean;
  analysis_summary: string;
}

const HRNarrativeSchema = z.object({
  narrative_structure_score: z.number().min(0).max(10),
  clarity_score: z.number().min(0).max(10),
  strategic_alignment_score: z.number().min(0).max(10),
  career_maturity_score: z.number().min(0).max(10),
  stability_risk: z.enum(["Low", "Moderate", "High"]),
  generic_language_detected: z.boolean(),
  analysis_summary: z.string(),
});

/**
 * Evaluates the candidate's narrative structure, clarity, and career progression
 * mimicking a Strategic HR Director. Used primarily in Phase 1 of the interview.
 */
export async function evaluateHRNarrative(
  phase1Question: string,
  transcriptChunk: string
): Promise<HRNarrativeEvaluation> {
  const systemPrompt = `You are a strategic HR Director evaluating executive-level candidates.

You must evaluate the following response based on:
- Logical structure
- Clarity
- Career progression coherence
- Strategic positioning
- Maturity of motivation
- Stability risk signals

STRICT RULES:
- No encouragement.
- No praise.
- No coaching tone.
- Pure assessment.
- JSON only.`;

  const userPrompt = `INPUT:
QUESTION:
"""
${phase1Question}
"""

RESPONSE:
"""
${transcriptChunk}
"""`;

  return await callLlmStrict(
    systemPrompt,
    userPrompt,
    HRNarrativeSchema,
    `{ "narrative_structure_score": number, "clarity_score": number, "strategic_alignment_score": number, "career_maturity_score": number, "stability_risk": "Low" | "Moderate" | "High", "generic_language_detected": boolean, "analysis_summary": string }`
  );
}
