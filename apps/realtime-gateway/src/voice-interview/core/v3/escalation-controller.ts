// @ts-nocheck
import { callLlmStrict } from "../llm-strict.js";
import { z } from "zod";

export interface EscalationDecision {
  escalation_action:
    | "Continue"
    | "ForceQuantification"
    | "ForceContradiction"
    | "IncreasePressure"
    | "AdvancePhase";
  reason: string;
}

const EscalationSchema = z.object({
  escalation_action: z.enum([
    "Continue",
    "ForceQuantification",
    "ForceContradiction",
    "IncreasePressure",
    "AdvancePhase",
  ]),
  reason: z.string(),
});

export interface EscalationControllerInput {
  technical_depth_score: number;
  quantification_depth_score: number;
  consistency_gap_score: number;
  bluff_score: number;
}

/**
 * Acts as an adaptive escalation controller during the interview, deciding 
 * the next rhetorical tactic based on the candidate's real-time scores.
 */
export async function determineEscalation(input: _EscalationControllerInput): Promise<EscalationDecision> {
  const systemPrompt = `You are an adaptive escalation controller in an executive interview.

Based on evaluation scores, decide whether to:
- Continue normally
- Increase pressure
- Force quantification
- Force contradiction
- Move to next phase

STRICT RULES:
- No explanation outside JSON.
- No softening.
- Deterministic logic.`;

  const userPrompt = `INPUT:
{
  "technical_depth_score": ${input.technical_depth_score},
  "quantification_depth_score": ${input.quantification_depth_score},
  "consistency_gap_score": ${input.consistency_gap_score},
  "bluff_score": ${input.bluff_score}
}`;

  return await callLlmStrict(
    systemPrompt,
    userPrompt,
    EscalationSchema,
    `{ "escalation_action": "Continue" | "ForceQuantification" | "ForceContradiction" | "IncreasePressure" | "AdvancePhase", "reason": string }`
  );
}
