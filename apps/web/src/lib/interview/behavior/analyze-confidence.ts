import { mistralModel } from "@/lib/mistral";
import { generateText } from "ai";

export interface ConfidenceReport {
  score: number;
  reasoning: string;
  isReliable: boolean;
}

/**
 * Analyse la confiance de l'IA envers la réponse du candidat.
 */
export async function analyzeAnswerConfidence(
  answer: string,
): Promise<ConfidenceReport> {
  const { text } = await generateText({
    model: mistralModel,
    system:
      'Analyse l\'assurance du candidat. JSON: { "score": 0-100, "reasoning": "" }',
    prompt: answer,
  });

  const parsed = JSON.parse(
    text
      .trim()
      .replace(/^```json/, "")
      .replace(/```$/, ""),
  );
  return {
    score: parsed.score,
    reasoning: parsed.reasoning,
    isReliable: parsed.score > 40,
  };
}
