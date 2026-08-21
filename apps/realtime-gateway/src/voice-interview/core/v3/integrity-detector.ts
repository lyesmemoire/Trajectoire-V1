// @ts-nocheck
import { callLlmStrict } from "../llm-strict.js";
import { z } from "zod";

export interface ConsistencyEvaluation {
  consistency_gap_score: number;
  gap_severity: "None" | "Low" | "Moderate" | "High";
  depth_mismatch: boolean;
  quantification_missing: boolean;
  operational_detail_missing: boolean;
  explanation_summary: string;
  risk_commentary: string;
}

const ConsistencySchema = z.object({
  consistency_gap_score: z.number().min(0).max(10),
  gap_severity: z.enum(["None", "Low", "Moderate", "High"]),
  depth_mismatch: z.boolean(),
  quantification_missing: z.boolean(),
  operational_detail_missing: z.boolean(),
  explanation_summary: z.string(),
  risk_commentary: z.string(),
});

/**
 * Detects inconsistency between a written CV claim and the candidate's verbal explanation.
 * Evaluates depth, superficiality, and absence of quantification.
 */
export async function evaluateConsistencyGap(cvClaim: string, transcriptChunk: string): Promise<ConsistencyEvaluation> {
  const systemPrompt = `You are an executive-level evaluation engine.

Your task is to detect inconsistency between:
1) A written CV claim
2) The candidate's verbal explanation during interview

You must:
- Compare the depth of explanation
- Detect superficial understanding
- Detect conceptual vagueness
- Detect absence of operational detail
- Detect absence of quantification
- Detect mismatch between claimed responsibility and explained knowledge

STRICT RULES:
- Be analytical.
- Do not praise.
- Do not soften conclusions.
- No motivational language.
- No speculation beyond given content.
- Output STRICT JSON only.

SCORING LOGIC:
0-3 = Strong alignment
4-6 = Moderate gap
7-10 = Significant inconsistency`;

  const userPrompt = `INPUT:
CV_CLAIM:
"""
${cvClaim}
"""

VERBAL_RESPONSE:
"""
${transcriptChunk}
"""`;

  return await callLlmStrict(
    systemPrompt,
    userPrompt,
    ConsistencySchema,
    `{ "consistency_gap_score": number, "gap_severity": "None"|"Low"|"Moderate"|"High", "depth_mismatch": boolean, "quantification_missing": boolean, "operational_detail_missing": boolean, "explanation_summary": string, "risk_commentary": string }`
  );
}
