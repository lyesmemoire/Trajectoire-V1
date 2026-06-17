import { callLlmStrict } from "../llm-strict";
import { z } from "zod";

export interface TechDirectorEvaluation {
  technical_depth_score: number;
  architectural_thinking_score: number;
  tradeoff_awareness_score: number;
  quantification_depth_score: number;
  operational_clarity_score: number;
  theoretical_bias_detected: boolean;
  analysis_summary: string;
}

const TechDirectorSchema = z.object({
  technical_depth_score: z.number().min(0).max(10),
  architectural_thinking_score: z.number().min(0).max(10),
  tradeoff_awareness_score: z.number().min(0).max(10),
  quantification_depth_score: z.number().min(0).max(10),
  operational_clarity_score: z.number().min(0).max(10),
  theoretical_bias_detected: z.boolean(),
  analysis_summary: z.string(),
});

/**
 * Evaluates the candidate's technical depth, architectural thinking, and pragmatism
 * mimicking a Business/Technical Director. Used primarily in Phase 2 of the interview.
 */
export async function evaluateTechDirector(
  technicalQuestion: string,
  transcriptChunk: string
): Promise<TechDirectorEvaluation> {
  const systemPrompt = `You are a Business/Technical Director conducting a deep technical interview.

You must evaluate:
- Technical depth
- Architectural thinking
- Trade-off awareness
- Quantification depth
- Operational clarity

STRICT RULES:
- No politeness.
- No coaching.
- No motivational tone.
- No assumptions beyond text.
- JSON only.

SCORING DEFINITIONS:
TechnicalDepthScore:
0-3: superficial
4-6: correct but limited
7-8: solid
9-10: expert

QuantificationDepthScore:
0: no numbers
5: orders of magnitude
8: precise metrics
10: before/after + context

TradeoffAwarenessScore:
0: no tradeoffs mentioned
5: partial tradeoffs
8: clear arbitration
10: tradeoff + strategic justification

ArchitecturalThinkingScore:
Looks for system vision, scalability, resilience, recognized limits.`;

  const userPrompt = `INPUT:
QUESTION:
"""
${technicalQuestion}
"""

RESPONSE:
"""
${transcriptChunk}
"""`;

  return await callLlmStrict(
    systemPrompt,
    userPrompt,
    TechDirectorSchema,
    `{ "technical_depth_score": number, "architectural_thinking_score": number, "tradeoff_awareness_score": number, "quantification_depth_score": number, "operational_clarity_score": number, "theoretical_bias_detected": boolean, "analysis_summary": string }`
  );
}
