import { z } from "zod";
import {
  callLlmStrict,
  clampScore,
  scoreToPercentile,
  getScoreTier,
  getEngineMetadata,
  type EngineMetadata,
  type ScoreTier,
} from "./llm-strict";
import type { StructuredCV } from "./cv-structurer";

// ─── Zod Schema (Level 2 — Strategic Diagnostic) ──────────────

export const CvDiagnosticSchema = z.object({
  market_positioning: z.object({
    estimated_seniority: z.string(),
    positioning_gap: z.string(),
  }),
  strengths: z.array(z.string()),
  critical_weaknesses: z.array(z.string()),
  risk_flags: z.array(z.string()),
  hire_risk_assessment: z.object({
    risk_level: z.enum(["Low", "Moderate", "High", "Critical"]),
    primary_risk_factors: z.array(z.string()),
    mitigation_recommendations: z.array(z.string()),
  }),
  impact_analysis: z.object({
    quantification_quality_score: z.number().min(0).max(10),
    business_impact_visibility_score: z.number().min(0).max(10),
    ownership_signal_strength: z.number().min(0).max(10),
  }),
  narrative_coherence_analysis: z.string(),
  narrative_coherence_score: z.number().min(0).max(10),
  strategic_alignment_with_target_role: z.number().min(0).max(10),
});

export type RawCvDiagnostic = z.infer<typeof CvDiagnosticSchema>;

// ─── Final Report Type (with backend-computed fields) ──────────

export interface FinalCabinetCvReport extends RawCvDiagnostic {
  computed_overall_cabinet_score: number;
  computed_competitiveness_percentile: number;
  computed_tier: ScoreTier;
  structural_data: StructuredCV;
  metadata: EngineMetadata;
}

// ─── System Prompt (Hardened — Anti-hallucination + Calibration Anchors) ───

const SYSTEM_PROMPT = `You are a senior partner at a top-tier consulting firm specializing in executive talent assessment.

Your task is to produce a rigorous, analytical, evidence-based evaluation of a candidate's CV structural data.

CRITICAL RULES:
- Be precise and analytical. No motivational language. No generic compliments.
- Do not exaggerate strengths. A candidate with 1 month of internship and self-taught skills is NOT competitive for a senior role.
- Identify structural weaknesses clearly and bluntly.
  Example of GOOD analysis: "The candidate describes responsibilities rather than measurable impact in 60% of bullet points."
  Example of BAD analysis: "The candidate shows great potential."
- Base conclusions strictly on the provided structural evidence. Never infer or assume.
- Never infer quantified results if not explicitly present in the data.
- Never fabricate metrics, achievements, or experience not present in the data.
- If insufficient evidence exists, explicitly state it.

CALIBRATION ANCHORS (use these to set your scale):
- A junior with no quantified impact and 1 short experience → strategic_alignment < 4.0 for any Senior role
- A senior with 10+ years, multiple promotions, and quantified results → strategic_alignment > 7.5
- A CV with career gaps and no progression → hire_risk_assessment.risk_level = "High" or "Critical"
- Avoid central clustering: DO NOT default everything between 6.0 and 7.0. Be willing to assign scores below 4.0 or above 8.0 when evidence warrants it.

Risk level definitions:
- "Low": Strong candidate, clear fit, minimal concerns
- "Moderate": Some gaps but manageable with support
- "High": Significant concerns that would block hiring
- "Critical": Major red flags that make hiring very risky

All scores must be between 0.0 and 10.0.`;

const SCHEMA_DESCRIPTION = `
{
  "market_positioning": {
    "estimated_seniority": string,
    "positioning_gap": string
  },
  "strengths": string[],
  "critical_weaknesses": string[],
  "risk_flags": string[],
  "hire_risk_assessment": {
    "risk_level": "Low" | "Moderate" | "High" | "Critical",
    "primary_risk_factors": string[],
    "mitigation_recommendations": string[]
  },
  "impact_analysis": {
    "quantification_quality_score": number (0 - 10),
    "business_impact_visibility_score": number (0 - 10),
    "ownership_signal_strength": number (0 - 10)
  },
  "narrative_coherence_analysis": string,
  "narrative_coherence_score": number (0 - 10),
  "strategic_alignment_with_target_role": number (0 - 10)
}
`;

// ─── Main Function ─────────────────────────────────────────────

export async function generateCvDiagnostic(
  structuredCv: StructuredCV,
  targetRole: string
): Promise<FinalCabinetCvReport> {
  const userPrompt = `
Evaluate this candidate for the role of: ${targetRole}

Here is the strictly factual structural data extracted from their CV:
${JSON.stringify(structuredCv, null, 2)}

Provide your strategic executive assessment.`;

  const rawData = await callLlmStrict(
    SYSTEM_PROMPT,
    userPrompt,
    CvDiagnosticSchema,
    SCHEMA_DESCRIPTION
  );

  // ── Backend Deterministic Recalculation ──
  // NEVER trust LLM for final scoring authority.
  const impactQuality = clampScore(
    (rawData.impact_analysis.quantification_quality_score +
      rawData.impact_analysis.business_impact_visibility_score +
      rawData.impact_analysis.ownership_signal_strength) / 3,
    0,
    10
  );

  const narrativeCoherence = clampScore(rawData.narrative_coherence_score, 0, 10);
  const strategicAlignment = clampScore(rawData.strategic_alignment_with_target_role, 0, 10);
  const structuralCoherence = clampScore(structuredCv.overall_structural_coherence_score, 0, 10);

  // Weighted formula (deterministic, backend-only):
  //   impact_quality      * 0.35
  //   structural_coherence * 0.20
  //   strategic_alignment  * 0.25
  //   narrative_coherence  * 0.20
  const overallRaw =
    impactQuality * 0.35 +
    structuralCoherence * 0.20 +
    strategicAlignment * 0.25 +
    narrativeCoherence * 0.20;

  const overallScore = clampScore(overallRaw, 0, 10);
  const percentile = scoreToPercentile(overallScore);
  const tier = getScoreTier(overallScore);

  return {
    ...rawData,
    computed_overall_cabinet_score: overallScore,
    computed_competitiveness_percentile: percentile,
    computed_tier: tier,
    structural_data: structuredCv,
    metadata: getEngineMetadata(),
  };
}
