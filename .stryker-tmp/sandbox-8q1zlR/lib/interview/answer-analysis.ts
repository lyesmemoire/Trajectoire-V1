// @ts-nocheck
import { mistralModel } from "@/lib/mistral";
import { generateText } from "ai";

export interface AnswerAnalysis {
  clarity: number; // 0-100
  specificity: number; // 0-100
  confidence: number; // 0-100
  ownership: number; // 0-100
  weaknesses: string[];
  strengths: string[];
  summary: string;
}

const ANALYSIS_PROMPT = `Tu es un expert en psychologie comportementale et recrutement.
Analyse la réponse suivante à une question d'entretien.
Évalue sur 100:
- Clarté: La réponse est-elle facile à suivre ?
- Spécificité: Utilise-t-il des exemples concrets et des chiffres ?
- Confiance: Le ton est-il assuré ?
- Ownership: Prend-il la responsabilité de ses actions ?

Réponds uniquement en JSON avec cette structure:
{
  "clarity": number,
  "specificity": number,
  "confidence": number,
  "ownership": number,
  "weaknesses": string[],
  "strengths": string[],
  "summary": string
}

REPONSE À ANALYSER:
`;

export async function analyzeAnswer(
  answer: string,
  question: string,
): Promise<AnswerAnalysis> {
  try {
    const { text } = await generateText({
      model: mistralModel,
      temperature: 0.1,
      prompt: `${ANALYSIS_PROMPT}\nQuestion: ${question}\nRéponse: ${answer}`,
    });

    const cleanText = text
      .trim()
      .replace(/^```json/, "")
      .replace(/```$/, "");
    return JSON.parse(cleanText) as AnswerAnalysis;
  } catch (error) {
    console.error("[analyzeAnswer Error]:", error);
    return {
      clarity: 50,
      specificity: 50,
      confidence: 50,
      ownership: 50,
      weaknesses: ["Analyse indisponible"],
      strengths: [],
      summary: "Une erreur est survenue lors de l'analyse.",
    };
  }
}
