import { callLlmStrict } from "../llm-strict";
import { z } from "zod";

export interface AdaptiveControllerInput {
  phase: "Phase1" | "Phase2" | "Phase3" | "Phase4";
  last_question: string;
  last_response_summary: string;
  scores: {
    narrative_structure_score?: number;
    clarity_score?: number;
    strategic_alignment_score?: number;
    career_maturity_score?: number;
    technical_depth_score?: number;
    architectural_thinking_score?: number;
    tradeoff_awareness_score?: number;
    quantification_depth_score?: number;
    consistency_gap_score?: number;
    bluff_score?: number;
  };
  cumulative_state: {
    integrity_risk_index: number;
    consistency_gap_trend: "Stable" | "Increasing" | "Critical";
    bluff_trend: "Stable" | "Increasing" | "Critical";
    pressure_level: number;
    retested_claims: string[];
    flagged_weak_zones: string[];
  };
  interview_context: {
    key_requirements: string[];
    cv_strengths: string[];
    cv_weaknesses: string[];
    risk_flags: string[];
    focus_zones: string[];
  };
}

export interface AdaptiveControllerOutput {
  decision: {
    escalation_action:
      | "Continue"
      | "ForceQuantification"
      | "ForceContradiction"
      | "IncreasePressure"
      | "RetestClaim"
      | "AdvancePhase"
      | "ReducePressure";
    new_pressure_level: number;
    reasoning_summary: string;
  };
  next_question: {
    interviewer_role: "HR" | "BusinessDirector";
    tone: "Calm" | "Structured" | "Analytical" | "Demanding" | "HighScrutiny";
    question_text: string;
  };
  updated_internal_flags: {
    integrity_risk_adjustment: number;
    new_flagged_weak_zone: string | null;
    retested_claim: string | null;
  };
}

const AdaptiveControllerSchema = z.object({
  decision: z.object({
    escalation_action: z.enum([
      "Continue",
      "ForceQuantification",
      "ForceContradiction",
      "IncreasePressure",
      "RetestClaim",
      "AdvancePhase",
      "ReducePressure",
    ]),
    new_pressure_level: z.number().min(1).max(5),
    reasoning_summary: z.string(),
  }),
  next_question: z.object({
    interviewer_role: z.enum(["HR", "BusinessDirector"]),
    tone: z.enum(["Calm", "Structured", "Analytical", "Demanding", "HighScrutiny"]),
    question_text: z.string(),
  }),
  updated_internal_flags: z.object({
    integrity_risk_adjustment: z.number().min(-1).max(2),
    new_flagged_weak_zone: z.string().nullable(),
    retested_claim: z.string().nullable(),
  }),
});

/**
 * The Adaptive Executive Interview Controller.
 * It analyzes accumulated evaluation signals, detects weakness patterns,
 * decides the escalation strategy, and generates the next interview move.
 */
export async function determineAdaptiveNextMove(
  input: AdaptiveControllerInput
): Promise<AdaptiveControllerOutput> {
  const systemPrompt = `You are conducting a structured executive-level interview.

You alternate naturally between:
- Strategic HR Director
- Business/Technical Director
- Executive Committee Member

You must not announce role changes.

You have access to:
- Job requirements
- CV strengths
- CV weaknesses
- Risk flags
- Leadership expectations
(These are provided in the INPUT JSON under interview_context).

Rules:
- Be precise.
- Interrupt when vague.
- Escalate gradually.
- Force quantification when missing.
- Test consistency between CV claims and verbal explanation.
- No praise.
- No coaching.
- Maintain executive tone.

Your role is NOT to ask random questions.
Your role is to:
1) Analyze accumulated evaluation signals.
2) Detect weakness patterns.
3) Detect inconsistency and bluff risk.
4) Decide escalation strategy.
5) Generate the next interview move.

STRICT RULES:
- Be analytical.
- Output STRICT JSON only.
- Do not explain outside JSON.
- Do not repeat input.
- Do not apologize.
- Do not simulate the candidate.

OBJECTIVES:
1) Evaluate whether the candidate is:
   - Superficial
   - Avoiding quantification
   - Conceptually weak
   - Inconsistent with CV
   - Stable and credible
2) Decide whether to:
   - Continue normally
   - Force quantification
   - Force contradiction
   - Increase pressure
   - Retest a previously claimed strength
   - Escalate to next phase
   - Reduce pressure (if candidate is performing strongly)
3) Adapt pressure dynamically:
   - If technical depth < 6 -> increase depth pressure
   - If quantification depth < 5 -> force metrics
   - If consistency gap > 6 -> trigger contradiction
   - If bluff score > 6 -> increase pressure
   - If cumulative integrity risk > 7 -> enter high scrutiny mode
4) Maintain realism:
   - No robotic phrasing
   - No repeated structures
   - Questions must feel natural
   - Questions must feel executive-level
   - Avoid verbosity

ESCALATION LOGIC GUIDELINES:
Pressure Levels:
1 = Calm
2 = Structured
3 = Analytical
4 = Demanding
5 = High Scrutiny

If:
- integrity_risk_index > 8 -> pressure_level = 5
- consistency_gap_trend = "Critical" -> force contradiction
- bluff_trend = "Increasing" -> increase pressure by +1
- strong technical depth (>8) and low risk -> reduce pressure slightly

BEHAVIORAL CONSTRAINTS:
- Do not be polite.
- Do not say “good answer”.
- Do not encourage.
- Do not give hints.
- Do not correct the candidate.
- Do not provide coaching.
- Do not simplify questions unnecessarily.
- Maintain executive authority tone.`;

  const userPrompt = `INPUT:\n${JSON.stringify(input, null, 2)}`;

  return await callLlmStrict(
    systemPrompt,
    userPrompt,
    AdaptiveControllerSchema,
    `{ "decision": { "escalation_action": string, "new_pressure_level": number, "reasoning_summary": string }, "next_question": { "interviewer_role": "HR" | "BusinessDirector", "tone": "Calm" | "Structured" | "Analytical" | "Demanding" | "HighScrutiny", "question_text": string }, "updated_internal_flags": { "integrity_risk_adjustment": number, "new_flagged_weak_zone": string | null, "retested_claim": string | null } }`
  );
}
