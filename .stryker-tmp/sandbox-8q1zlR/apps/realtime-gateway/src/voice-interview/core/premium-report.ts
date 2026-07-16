// @ts-nocheck
import type { StructuredScore } from "./scoring.js";

export interface PremiumReport {
  detailedAnalysis: Record<string, string>;
  actionPlan: string[];
  hireProbability: number;
  recruiterVerdict: string;
}

export async function generatePremiumReport(
  transcript: string,
  structuredScore: StructuredScore,
  role: string,
  llm: (prompt: string) => Promise<string>,
): Promise<PremiumReport> {
  const prompt = `
Tu es un recruteur senior expert.

Contexte :
Poste ciblé : ${role}

Score structuré :
${JSON.stringify(structuredScore, null, 2)}

Transcript :
${transcript}

Retourne STRICTEMENT un JSON valide :

{
  "detailedAnalysis": {
    "communication": string,
    "technical_depth": string,
    "clarity": string,
    "problem_solving": string,
    "confidence": string
  },
  "actionPlan": string[],
  "hireProbability": number (0-100),
  "recruiterVerdict": string
}
`;

  const raw = await llm(prompt);
  return JSON.parse(raw);
}
