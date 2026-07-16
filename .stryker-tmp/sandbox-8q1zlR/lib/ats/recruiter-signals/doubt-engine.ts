// @ts-nocheck
import { mistralModel } from "@/lib/mistral";
import { generateObject } from "ai";
import { z } from "zod";
import { PressureMunition, PressureMunitionSchema } from "../contracts/munitions";
import { createChildLogger } from "@/lib/core";
import { captureError } from "../../sentry-context";

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

  const log = createChildLogger({ component: 'doubt-engine' });

  for (let attempt = 1; attempt <= 2; attempt++) {
    const start = Date.now();
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

      log.info({ 
        event: 'llm_munitions_generated',
        duration: Date.now() - start,
        count: object.doubts.length,
        attempt
      });

      return object.doubts;
    } catch (error) {
      if (attempt === 2) {
        log.error({ err: error, event: 'llm_extraction_failed_fatal', duration: Date.now() - start });
        captureError(error, { component: 'doubt-engine', event: 'llm_extraction_failed_fatal', duration: Date.now() - start });
        return [];
      }
      log.warn({ event: 'llm_extraction_retry', attempt, duration: Date.now() - start });
    }
  }
  return [];
}
