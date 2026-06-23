import { z } from "zod";

export const ContinueSessionSchema = z.object({
  // Réponse de l'IA à la dernière réponse du candidat
  ai_response: z.string().min(1).max(1000),

  // Relance ou question suivante
  follow_up: z.object({
    type: z.enum([
      "DEEP_DIVE",     // Approfondit la réponse précédente
      "CHALLENGE",     // Met en doute un chiffre ou une affirmation
      "NEXT_QUESTION", // Passe à la question suivante
      "CLOSING",       // Fin de session
    ]),
    question: z.string().min(1).max(400).nullable(),
  }),

  // Feedback immédiat sur la réponse qui vient d'être donnée
  instant_feedback: z.object({
    signal_quality: z.enum(["STRONG", "ADEQUATE", "WEAK"]),
    one_line:       z.string().max(150), // Une seule phrase, factuelle
  }),

  session_complete: z.boolean(),
});

export type ContinueSession = z.infer<typeof ContinueSessionSchema>;
