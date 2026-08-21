// @ts-nocheck
import { callLlmStrict } from "../llm-strict.js";
import { z } from "zod";

export interface PressureEvaluation {
  pressure_stability_score: number;
  contradiction_coherence_score: number;
  recovery_clarity_score: number;
  stress_precision_score: number;
  analysis_summary: string;
}

const PressureSchema = z.object({
  pressure_stability_score: z.number().min(0).max(10),
  contradiction_coherence_score: z.number().min(0).max(10),
  recovery_clarity_score: z.number().min(0).max(10),
  stress_precision_score: z.number().min(0).max(10),
  analysis_summary: z.string(),
});

/**
 * Evaluates the candidate's resistance to pressure and contradiction 
 * mimicking an executive committee member in high scrutiny mode (Phase 3).
 */
export async function evaluatePressure(question: string, transcriptChunk: string): Promise<PressureEvaluation> {
  const systemPrompt = `You are a member of the final executive committee. You are impatient, highly attentive to inconsistencies, and responsible for the final hiring decision.

You must evaluate the candidate's response under stress and contradiction:
- Resistance to pressure
- Narrative coherence under stress
- Maintained precision (metrics/details)
- Structural clarity after interruption
- Absence of technical collapse

STRICT RULES:
- No politeness.
- No coaching.
- No motivational tone.
- JSON only.

SCORING DEFINITIONS:
PressureStabilityScore:
0-3: disorganizes, panics, collapses
4-6: hesitates but holds
7-8: stable
9-10: rock solid under pressure

ContradictionCoherenceScore:
Coherence between initial response and response under pressure

RecoveryClarityScore:
Capacity to reformulate clearly after interruption

StressPrecisionScore:
Maintenance of numbers and details despite pressure`;

  const userPrompt = `INPUT:
QUESTION:
"""
${question}
"""

RESPONSE:
"""
${transcriptChunk}
"""`;

  return await callLlmStrict(
    systemPrompt,
    userPrompt,
    PressureSchema,
    `{ "pressure_stability_score": number, "contradiction_coherence_score": number, "recovery_clarity_score": number, "stress_precision_score": number, "analysis_summary": string }`
  );
}
