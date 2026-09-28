/**
 * CompleteOnboardingSchema
 * Validation du corps de POST /api/onboarding/complete.
 *
 * Les schémas sont `strict()` : toute clé inattendue (par exemple un `userId`
 * fourni par le client) est rejetée avec une erreur de validation plutôt
 * qu'ignorée silencieusement. L'identité vient exclusivement de la session.
 */

import { z } from "zod";

export const ONBOARDING_SECTORS = [
  "Tech",
  "Finance",
  "Santé",
  "Conseil",
  "Industrie",
  "Commerce",
  "Public",
  "Autre",
] as const;

// Mêmes valeurs que /simulation/new (niveau d'expérience).
export const ONBOARDING_LEVELS = [
  "Junior",
  "Intermédiaire",
  "Senior",
  "Lead",
  "Manager",
] as const;

// Mêmes valeurs que CreateSessionSchema (type d'entretien).
export const ONBOARDING_INTERVIEW_TYPES = ["RH", "Technique", "Manager"] as const;

// Refuse les caractères de contrôle (NUL, ESC, etc.) dans les champs texte libres.
const hasNoControlChars = (value: string) => !/[\u0000-\u001f\u007f]/.test(value);

export const CompleteOnboardingSchema = z
  .object({
    targetJob: z
      .object({
        title: z
          .string()
          .trim()
          .min(1, "Le poste visé est requis")
          .max(100, "Le poste visé est trop long")
          .refine(hasNoControlChars, "Caractères non autorisés"),
        sector: z.enum(ONBOARDING_SECTORS, {
          message: "Secteur invalide",
        }),
        level: z.enum(ONBOARDING_LEVELS, {
          message: "Niveau invalide",
        }),
      })
      .strict(),
    name: z
      .string()
      .trim()
      .min(1, "Le nom est requis")
      .max(80, "Le nom est trop long")
      .refine(hasNoControlChars, "Caractères non autorisés"),
    goal: z
      .object({
        interviewType: z.enum(ONBOARDING_INTERVIEW_TYPES, {
          message: "Type d'entretien invalide",
        }),
      })
      .strict(),
    cvProvided: z.boolean(),
  })
  .strict();

export type CompleteOnboardingInput = z.infer<typeof CompleteOnboardingSchema>;
