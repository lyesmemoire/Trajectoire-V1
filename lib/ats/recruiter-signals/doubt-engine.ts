import { mistralModel } from "@/lib/mistral";
import { generateText } from "ai";

export interface RecruiterDoubt {
  subject: string;
  reason: string;
  impact: "low" | "medium" | "high";
  coaching: string;
}

/**
 * 👔 Moteur de Doute Recruteur
 * Simule les hésitations d'un recruteur réel face au CV.
 */
export async function generateRecruiterDoubts(
  cvText: string,
  jobDesc: string,
): Promise<RecruiterDoubt[]> {
  const PROMPT = `Tu es un recruteur senior extrêmement exigeant. 
  Ton but est de trouver les failles, les manques de preuves et les incohérences dans ce CV par rapport à l'offre.
  
  RÈGLES :
  1. Ne sois pas méchant, sois sceptique et pro.
  2. Cherche les "trous" (ex: pas de chiffres, trop de buzzwords, écart de séniorité).
  3. Propose un conseil pour lever chaque doute.

  Réponds uniquement en JSON :
  [{ "subject": "titre du doute", "reason": "pourquoi tu doutes", "impact": "low|medium|high", "coaching": "comment corriger" }]`;

  try {
    const { text } = await generateText({
      model: mistralModel,
      temperature: 0.2,
      system: PROMPT,
      prompt: `OFFRE: ${jobDesc}\n\nCV: ${cvText}`,
    });

    const cleanJson = text
      .trim()
      .replace(/^```json/, "")
      .replace(/```$/, "");
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Doubt Engine Error:", error);
    return [];
  }
}
