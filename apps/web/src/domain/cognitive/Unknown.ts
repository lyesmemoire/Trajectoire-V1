import { z } from "zod";

// ===================================================================
// UNKNOWN — An area of uncertainty that must be investigated
// Every competency starts as UNKNOWN. The engine's mission
// is to transform every UNKNOWN into VERIFIED or REJECTED.
// ===================================================================

export const UnknownPrioritySchema = z.enum([
  "CRITICAL",
  "HIGH",
  "MEDIUM",
  "LOW",
]);

export type UnknownPriority = z.infer<typeof UnknownPrioritySchema>;

export const UnknownSchema = z.object({
  id: z.string().uuid(),
  competency: z.string().min(1),
  priority: UnknownPrioritySchema,
  impact: z.number().min(0).max(1),
  remainingQuestions: z.number().int().nonnegative(),
  difficulty: z.number().min(0).max(1),
  reason: z.string().min(1),
  createdAt: z.date(),
  resolvedAt: z.date().nullable().default(null),
});

export type Unknown = z.infer<typeof UnknownSchema>;

/**
 * Pure function: determines if an unknown has been resolved.
 * An unknown is resolved when its competency reaches sufficient confidence.
 */
export function isUnknownResolved(
  unknown: Unknown,
  competencyConfidence: number
): boolean {
  return competencyConfidence >= 0.6 || unknown.resolvedAt !== null;
}

/**
 * Pure function: computes the investigation priority score.
 * Higher score = more urgent to investigate.
 */
export function computeInvestigationPriority(unknown: Unknown): number {
  const priorityMultiplier: Record<UnknownPriority, number> = {
    CRITICAL: 4,
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1,
  };

  return (
    priorityMultiplier[unknown.priority] *
    unknown.impact *
    (1 - unknown.difficulty * 0.3)
  );
}
