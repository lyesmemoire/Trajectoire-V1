import { z } from "zod";

// ===================================================================
// PERCEPTION SCHEMA
// Defines the exact shape of the output the LLM must generate.
// ===================================================================

export const ObservationTypeSchema = z.enum([
  "FACT",
  "CLAIM",
  "METRIC",
  "TIMELINE",
  "DECISION",
  "RESPONSIBILITY",
  "TECHNOLOGY",
  "FAILURE",
  "SUCCESS",
  "CHALLENGE",
  "RISK",
  "UNKNOWN",
]);

export const ObservationSchema = z.object({
  id: z.string().uuid().optional(), // Can be omitted by LLM, filled by engine
  type: ObservationTypeSchema,
  quote: z.string().describe("The exact quote from the candidate's answer."),
  normalizedFact: z.string().describe("A concise, objective restatement of the quote in third-person."),
  confidence: z.number().min(0).max(1).describe("The LLM's confidence in this observation (0 to 1)."),
  speaker: z.enum(["CANDIDATE", "INTERVIEWER"]).default("CANDIDATE"),
  
  // Extracted arrays
  entities: z.array(z.string()).default([]),
  numbers: z.array(z.number()).default([]),
  technologies: z.array(z.string()).default([]),
  competenciesMentioned: z.array(z.string()).default([]),
  projects: z.array(z.string()).default([]),
  companies: z.array(z.string()).default([]),
  metrics: z.array(z.string()).default([]),
  dates: z.array(z.string()).default([]),
  locations: z.array(z.string()).default([]),
});

// The payload that the LLM will generate
export const PerceptionOutputSchema = z.object({
  observations: z.array(ObservationSchema),
});
