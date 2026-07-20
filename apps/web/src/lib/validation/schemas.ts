/**
 * Zod Schemas for API Validation
 * Centralized validation schemas for all API routes
 */

import { z } from "zod";

/**
 * Schema for creating a simulation session
 */
export const CreateSimulationSchema = z.object({
  jobTitle: z.string()
    .min(1, "Le poste est requis")
    .max(100, "Le poste ne peut pas dépasser 100 caractères")
    .trim(),
  level: z.enum(["Junior", "Mid", "Senior"], {
    message: "Le niveau doit être Junior, Mid ou Senior",
  }),
  interviewType: z.enum(["RH", "Technique", "Manager"], {
    message: "Le type doit être RH, Technique ou Manager",
  }),
  duration: z.number()
    .int("La durée doit être un entier")
    .min(15, "La durée minimale est de 15 minutes")
    .max(60, "La durée maximale est de 60 minutes"),
});

/**
 * Schema for sending a message in a simulation
 */
export const SendMessageSchema = z.object({
  sessionId: z.string()
    .uuid("L'ID de session doit être un UUID valide"),
  content: z.string()
    .min(1, "Le message ne peut pas être vide")
    .max(5000, "Le message ne peut pas dépasser 5000 caractères")
    .trim(),
});

/**
 * Schema for ending a simulation session
 */
export const EndSessionSchema = z.object({
  sessionId: z.string()
    .uuid("L'ID de session doit être un UUID valide"),
});

/**
 * Schema for generating a report
 */
export const GenerateReportSchema = z.object({
  sessionId: z.string()
    .uuid("L'ID de session doit être un UUID valide"),
});

/**
 * Type exports
 */
export type CreateSimulationInput = z.infer<typeof CreateSimulationSchema>;
export type SendMessageInput = z.infer<typeof SendMessageSchema>;
export type EndSessionInput = z.infer<typeof EndSessionSchema>;
export type GenerateReportInput = z.infer<typeof GenerateReportSchema>;
