import { mistralModel } from "@/lib/mistral";
import { generateText } from "ai";

export interface AnswerAnalysis {
  clarity: number;
  specificity: number;
  confidence: number;
  ownership: number;

  // Nouveaux signaux pour l'interruption
  verbosity: number; // Longueur/quantité de mots (0-100)
  fillerDensity: number; // Fréquence des euh, donc, etc. (0-100)
  relevanceScore: number; // Sujet respecté ? (0-100)
  ramblingScore: number; // Tendance à parler pour rien dire (0-100)

  weaknesses: string[];
  strengths: string[];
  summary: string;
}

const SYSTEM_PROMPT = `Tu es un expert en psychologie comportementale et recrutement.
Analyse la réponse du candidat sur ces dimensions (0-100) :
- Clarity : Structure.
- Specificity : Chiffres et faits.
- Confidence : Assurance.
- Ownership : Responsabilité.
- Verbosity : Trop long par rapport à la valeur ?
- FillerDensity : Fréquence des tics de langage.
- RelevanceScore : Répond-il à la question ?
- RamblingScore : Tourne-t-il autour du pot ?

Réponds uniquement en JSON.`;

export async function analyzeAnswer(
  answer: string,
  question: string,
): Promise<AnswerAnalysis> {
  try {
    const { text } = await generateText({
      model: mistralModel,
      temperature: 0.1,
      system: SYSTEM_PROMPT,
      prompt: `Question: ${question}\nRéponse: ${answer}`,
    });

    const cleanJson = text
      .trim()
      .replace(/^```json/, "")
      .replace(/```$/, "");
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Analysis Error:", error);
    return {
      clarity: 50,
      specificity: 50,
      confidence: 50,
      ownership: 50,
      verbosity: 50,
      fillerDensity: 50,
      relevanceScore: 50,
      ramblingScore: 50,
      weaknesses: ["Erreur d'analyse"],
      strengths: [],
      summary: "Erreur technique.",
    };
  }
}
