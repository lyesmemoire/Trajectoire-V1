import { getJsonCompletion } from "../../../ai/openai.js";
import { loadPrompt } from "./loadPrompt.js";
import { MetaDecision, UnifiedSignals } from "./types.js";

export interface MetaDecisionInput {
  unified_signals: UnifiedSignals;
  recruiter_mind_snapshot: {
    trust: number;
    suspicion: number;
    engagement: number;
    pressure_level: number;
    fatigue: number;
    confidence?: number;
    momentum?: number;
  };
  interview_state: {
    current_phase: "hr" | "tech" | "pressure" | "leadership" | "wrap";
    turn_count: number;
    current_pressure_level: number;
    profile_level: "junior" | "senior" | "executive";
    max_turns: number;
  };
}

/**
 * Exécute le moteur de décision méta.
 * Décide de la stratégie globale (phase, pression, action) en utilisant les signaux unifiés + RecruiterMind + métadonnées.
 */
export async function runMetaDecision(
  input: MetaDecisionInput,
): Promise<MetaDecision> {
  const systemPrompt = await loadPrompt("PROMPT-META-DECISION-ENGINE.md");
  
  const response = await getJsonCompletion([
    { role: "system", content: systemPrompt },
    { role: "user", content: JSON.stringify(input) },
  ]);

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("Empty meta decision response");
  }

  return JSON.parse(content) as MetaDecision;
}
