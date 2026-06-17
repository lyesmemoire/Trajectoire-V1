import { mistralModel } from "@/lib/mistral";
import { generateText } from "ai";

/**
 * 👔 Layer 1: Hiring Manager Mode
 * Analyzes architectural decision-making and ownership.
 */
export async function analyzeTechnicalLeadership(
  cvText: string,
): Promise<string[]> {
  const { text } = await generateText({
    model: mistralModel,
    system:
      "Tu es un CTO / Engineering Manager. Analyse si le CV montre de l'autonomie et des décisions d'architecture.",
    prompt: cvText,
  });
  return [text];
}

/**
 * ⚖️ Layer 2: Consistency Engine
 * Detects mismatches between claims and seniority.
 */
export function detectInconsistencies(cv: any, job: any): string[] {
  const issues = [];
  if (cv.years_experience < job.min_years) {
    issues.push(
      `Seniority Mismatch: L'offre demande ${job.min_years} ans, le profil en affiche ${cv.years_experience}.`,
    );
  }
  return issues;
}

/**
 * ⚠️ Layer 3: Interview Risk Prediction
 */
export function predictInterviewRisks(weaknesses: string[]): string[] {
  return weaknesses.map(
    (w) => `Risque: Challenge probable sur "${w}" en entretien technique.`,
  );
}
