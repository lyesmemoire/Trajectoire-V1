import { z } from "zod";

// ===================================================================
// WEAK SIGNAL — A subtle indicator that something may be wrong
// Weak signals are not evidence. They are suspicions that
// trigger deeper investigation.
// ===================================================================

export const WeakSignalTypeSchema = z.enum([
  "VAGUE_RESPONSE",
  "BUZZWORD_WITHOUT_EXPLANATION",
  "EVASION",
  "CONTRADICTION",
  "TEMPORAL_INCONSISTENCY",
  "MISSING_METRICS",
  "UNCLEAR_RESPONSIBILITY",
  "EXCESSIVE_WE_USAGE",
  "EXCESSIVE_GENERALITIES",
  "OVERCONFIDENCE",
  "NO_EXAMPLES",
  "RECITATIVE_ANSWER",
  "IMPROBABLE_METRICS",
  "INCOMPATIBLE_RESPONSIBILITIES",
  "VOCABULARY_SHIFT",
  "MEMORIZED_ANSWER",
  "AI_GENERATED_ANSWER",
]);

export type WeakSignalType = z.infer<typeof WeakSignalTypeSchema>;

export const WeakSignalSeveritySchema = z.enum([
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
]);

export type WeakSignalSeverity = z.infer<typeof WeakSignalSeveritySchema>;

export const WeakSignalSchema = z.object({
  id: z.string().uuid(),
  sessionId: z.string().uuid(),
  type: WeakSignalTypeSchema,
  severity: WeakSignalSeveritySchema,
  reason: z.string().min(1),
  sourceMessageIndex: z.number().int().nonnegative(),
  linkedCompetencies: z.array(z.string()).default([]),
  suggestedInvestigation: z.string().min(1),
  resolved: z.boolean().default(false),
  timestamp: z.date(),
});

export type WeakSignal = z.infer<typeof WeakSignalSchema>;

/**
 * Pure function: computes the confidence penalty caused by a weak signal.
 */
export function computeWeakSignalPenalty(signal: WeakSignal): number {
  const severityMap: Record<WeakSignalSeverity, number> = {
    LOW: 0.02,
    MEDIUM: 0.05,
    HIGH: 0.10,
    CRITICAL: 0.20,
  };
  return severityMap[signal.severity];
}
