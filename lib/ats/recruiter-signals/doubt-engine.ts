import { mistralModel } from "@/lib/mistral";
import { generateObject } from "ai";
import { z } from "zod";
import { PressureMunition, PressureMunitionSchema } from "../contracts/munitions";

/**
 * 👔 Moteur de Doute Recruteur
 * Simule les hésitations d'un recruteur réel face au CV.
 */
export async function generateRecruiterDoubts(
  cvText: string,
  jobDesc: string,
): Promise<PressureMunition[]> {
  const PROMPT = `Tu es un recruteur senior extrêmement exigeant. 
  Ton but est de trouver les failles, les manques de preuves et les incohérences dans ce CV par rapport à l'offre.
  
  RÈGLES :
  1. Ne sois pas méchant, sois sceptique et pro.
  2. Cherche les "trous" (ex: pas de chiffres, trop de buzzwords, écart de séniorité).
  3. Pour chaque doute, fournis une citation exacte du CV ("snippet") et explique pourquoi c'est un problème.
  4. La catégorie doit être "doubt".
  5. Détermine si le doute est assez concret pour en faire une question d'entretien de pression ("pressureReady").
  
  OFFRE: ${jobDesc}
  
  CV: ${cvText}`;

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const { object } = await generateObject({
        model: mistralModel,
        temperature: 0.2,
        schema: z.object({
          doubts: z.array(PressureMunitionSchema),
        }),
        system: "Tu es un extracteur de signaux recruteur strict. Tu dois absolument respecter le schéma JSON fourni.",
        prompt: PROMPT,
      });

      return object.doubts;
    } catch (error) {
      if (attempt === 2) {
        console.error("[Doubt Engine] Extraction failed after retry", error);
        return [];
      }
      console.warn("[Doubt Engine] Extraction failed, retrying", attempt);
    }
  }
  return [];
}
