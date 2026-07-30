import { callLlmStrict } from "../llm-strict.js";
import { z } from "zod";

export interface LeadershipEvaluation {
  strategic_thinking_score: number;
  conflict_leadership_score: number;
  organizational_impact_score: number;
  executive_presence_score: number;
  analysis_summary: string;
}

const LeadershipSchema = z.object({
  strategic_thinking_score: z.number().min(0).max(10),
  conflict_leadership_score: z.number().min(0).max(10),
  organizational_impact_score: z.number().min(0).max(10),
  executive_presence_score: z.number().min(0).max(10),
  analysis_summary: z.string(),
});

/**
 * Evaluates the candidate's strategic thinking, conflict resolution, and impact
 * mimicking an Executive Committee Member. Used primarily in Phase 4 of the interview.
 */
export async function evaluateLeadership(strategicQuestion: string, transcriptChunk: string): Promise<LeadershipEvaluation> {
  const systemPrompt = `You are an Executive Committee Member conducting the final phase of a strategic interview.

You must evaluate:
- Strategic thinking
- Conflict leadership
- Organizational impact
- Executive presence

STRICT RULES:
- No politeness.
- No coaching.
- No motivational tone.
- JSON only.

SCORING DEFINITIONS:
StrategicThinkingScore:
Looks for structure of decision, risk management, methodology, impact vs effort analysis.
Penalize "I do my best" or lacking explicit method.

ConflictLeadershipScore:
Looks for relational intelligence, ability to argue, listen, and decide without being defensive.
Penalize blaming others, defensive posture, emotional narrative.

OrganizationalImpactScore:
Looks for real impact, influence, responsibility, systemic vision.
Penalize minor examples or purely technical execution without organizational impact.

ExecutivePresenceScore:
General maturity and gravitas.`;

  const userPrompt = `INPUT:
QUESTION:
"""
${strategicQuestion}
"""

RESPONSE:
"""
${transcriptChunk}
"""`;

  return await callLlmStrict(
    systemPrompt,
    userPrompt,
    LeadershipSchema,
    `{ "strategic_thinking_score": number, "conflict_leadership_score": number, "organizational_impact_score": number, "executive_presence_score": number, "analysis_summary": string }`
  );
}
