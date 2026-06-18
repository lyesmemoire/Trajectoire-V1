import { callLlmStrict } from "../llm-strict.js";
import { z } from "zod";

export interface ImpressionInput {
  finalExecutiveScore: number;
  integrityRiskIndex: number;
  technicalDepthScore: number;
  quantificationDepthScore: number;
  leadershipCompositeScore: number;
  consistencyGap: number;
}

const ImpressionSchema = z.object({
  executiveImpression: z.string(),
});

/**
 * Generates a cold, analytical executive summary of the candidate's performance
 * based on their final aggregated scores.
 */
export async function generateExecutiveImpression(
  scores: ImpressionInput
): Promise<string> {
  const systemPrompt = `You are a senior executive assessor.

Write a cold, analytical executive summary of this candidate.
No praise.
No motivational tone.
No speculation.
No coaching.
No generic advice.
Max 4 sentences.`;

  const userPrompt = `INPUT:
{
  "finalExecutiveScore": ${scores.finalExecutiveScore},
  "integrityRiskIndex": ${scores.integrityRiskIndex},
  "technicalDepthScore": ${scores.technicalDepthScore},
  "quantificationDepthScore": ${scores.quantificationDepthScore},
  "leadershipCompositeScore": ${scores.leadershipCompositeScore},
  "consistencyGap": ${scores.consistencyGap}
}`;

  const result = await callLlmStrict(
    systemPrompt,
    userPrompt,
    ImpressionSchema,
    `{ "executiveImpression": string }`
  );

  return result.executiveImpression;
}
