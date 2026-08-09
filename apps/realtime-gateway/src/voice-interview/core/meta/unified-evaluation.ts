import { getJsonCompletion } from "../../../ai/openai.js";
import { loadPrompt } from "./loadPrompt.js";
import { UnifiedSignals } from "./types.js";

export interface UnifiedEvaluationInput {
  candidate_answer: string;
  v1_signals?: {
    score: number;
    decision_hint: "probe" | "deepen" | "move-on";
  };
  v2_signals?: {
    specificity: number;
    ownership: number;
    technical_depth: number;
  };
  v3_signals?: {
    bluff_score: number;
    vagueness_level: number;
    integrity_risk_index: number;
    leadership_signal?: number;
  };
  recruiter_mind_snapshot?: {
    trust: number;
    suspicion: number;
    engagement: number;
    pressure_level: number;
    fatigue: number;
  };
}

/**
 * Exécute le moteur d'évaluation unifié.
 * Fusionne les signaux des 3 moteurs (V1/V2/V3) + RecruiterMind en un ensemble de signaux normalisés.
 */
export async function runUnifiedEvaluation(
  input: UnifiedEvaluationInput,
): Promise<UnifiedSignals> {
  const systemPrompt = await loadPrompt("PROMPT-UNIFIED-EVALUATION-ENGINE.md");
  
  const response = await getJsonCompletion([
    { role: "system", content: systemPrompt },
    { role: "user", content: JSON.stringify(input) },
  ]);

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("Empty unified evaluation response");
  }

  return JSON.parse(content) as UnifiedSignals;
}
