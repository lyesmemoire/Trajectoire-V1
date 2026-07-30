import { callLlmStrict } from "../llm-strict.js";
import { z } from "zod";

export interface IntegrityRiskEvaluation {
  integrity_risk_index: number;
  risk_level: "Low" | "Moderate" | "High" | "Critical";
  primary_risk_driver: string;
  final_assessment: string;
}

const IntegrityRiskSchema = z.object({
  integrity_risk_index: z.number().min(0).max(10),
  risk_level: z.enum(["Low", "Moderate", "High", "Critical"]),
  primary_risk_driver: z.string(),
  final_assessment: z.string(),
});

export interface RiskEngineInput {
  consistency_gap_score: number;
  bluff_score: number;
  technical_depth_score: number;
  quantification_depth_score: number;
  career_maturity_score: number;
}

/**
 * Synthesizes multiple evaluation metrics to determine the final Integrity Risk Index
 * of the candidate. Usually called at the end of the interview.
 */
export async function evaluateIntegrityRisk(input: _RiskEngineInput): Promise<IntegrityRiskEvaluation> {
  const systemPrompt = `You are an Executive Integrity Risk Engine.

Your task is to synthesize:
- Consistency gap analysis
- Bluff detection
- Technical depth evaluation
- Quantification depth
- Career maturity

STRICT RULES:
- No praise.
- No motivational language.
- No speculation.
- Deterministic analytical tone.
- JSON only.

SCORING LOGIC:
0-3 = Low risk
4-6 = Moderate
7-8 = High
9-10 = Critical`;

  const userPrompt = `INPUT:
{
  "consistency_gap_score": ${input.consistency_gap_score},
  "bluff_score": ${input.bluff_score},
  "technical_depth_score": ${input.technical_depth_score},
  "quantification_depth_score": ${input.quantification_depth_score},
  "career_maturity_score": ${input.career_maturity_score}
}`;

  return await callLlmStrict(
    systemPrompt,
    userPrompt,
    IntegrityRiskSchema,
    `{ "integrity_risk_index": number, "risk_level": "Low" | "Moderate" | "High" | "Critical", "primary_risk_driver": string, "final_assessment": string }`
  );
}
