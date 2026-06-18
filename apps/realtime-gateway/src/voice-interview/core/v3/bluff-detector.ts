import { callLlmStrict } from "../llm-strict.js";
import { z } from "zod";

export interface BluffEvaluation {
  bluff_score: number;
  buzzword_density: number;
  vagueness_level: number;
  evasion_detected: boolean;
  theoretical_response: boolean;
  concrete_examples_present: boolean;
  verdict: "No Bluff" | "Possible Bluff" | "Likely Bluff";
  analysis_summary: string;
}

const BluffSchema = z.object({
  bluff_score: z.number().min(0).max(10),
  buzzword_density: z.number().min(0).max(10),
  vagueness_level: z.number().min(0).max(10),
  evasion_detected: z.boolean(),
  theoretical_response: z.boolean(),
  concrete_examples_present: z.boolean(),
  verdict: z.enum(["No Bluff", "Possible Bluff", "Likely Bluff"]),
  analysis_summary: z.string(),
});

/**
 * Detects bluffing patterns such as buzzwords, generic statements, evasion,
 * and theoretical definitions instead of lived experience.
 */
export async function evaluateBluff(
  question: string,
  transcriptChunk: string
): Promise<BluffEvaluation> {
  const systemPrompt = `You are a bluff detection engine used in executive-level interviews.

Your task is to detect whether the candidate's answer contains:

- Buzzwords without explanation
- Generic statements applicable to any situation
- Repetition of question without depth
- Theoretical definitions instead of lived experience
- Evasion patterns
- Non-answers
- Overuse of vague qualifiers (e.g., "significant", "optimized", "scalable")

STRICT RULES:
- Be strict.
- No politeness.
- No praise.
- No emotional commentary.
- No assumptions beyond text.
- Output JSON only.

SCORING:
0-3 = No bluff
4-6 = Moderate risk
7-10 = Likely bluff`;

  const userPrompt = `INPUT:
INTERVIEW_QUESTION:
"""
${question}
"""

VERBAL_RESPONSE:
"""
${transcriptChunk}
"""`;

  return await callLlmStrict(
    systemPrompt,
    userPrompt,
    BluffSchema,
    `{ "bluff_score": number, "buzzword_density": number, "vagueness_level": number, "evasion_detected": boolean, "theoretical_response": boolean, "concrete_examples_present": boolean, "verdict": "No Bluff" | "Possible Bluff" | "Likely Bluff", "analysis_summary": string }`
  );
}
