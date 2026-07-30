import { z } from "zod";

// ===================================================================
// CONFIDENCE — Pure mathematical confidence engine
// This module is the single source of truth for confidence computation.
// No LLM is involved. No heuristics. Only math.
// ===================================================================

export const CompetencyConfidenceSchema = z.object({
  competency: z.string(),
  value: z.number().min(0).max(1),
  evidenceCount: z.number().int().nonnegative(),
  contradictionCount: z.number().int().nonnegative(),
  weakSignalCount: z.number().int().nonnegative(),
  lastUpdated: z.date(),
});

export type CompetencyConfidence = z.infer<typeof CompetencyConfidenceSchema>;

export const ConfidenceMatrixSchema = z.record(
  z.string(),
  CompetencyConfidenceSchema
);

export type ConfidenceMatrix = z.infer<typeof ConfidenceMatrixSchema>;

/**
 * Pure function: creates a fresh confidence entry for a competency.
 */
export function createInitialConfidence(competency: string): CompetencyConfidence {
  return {
    competency,
    value: 0,
    evidenceCount: 0,
    contradictionCount: 0,
    weakSignalCount: 0,
    lastUpdated: new Date(),
  };
}

/**
 * Pure function: applies a confidence delta to an existing confidence entry.
 * Returns a new object (immutable).
 */
export function applyConfidenceDelta(
  current: CompetencyConfidence,
  delta: number,
  source: "evidence" | "contradiction" | "weak_signal"
): CompetencyConfidence {
  const clamp = (v: number): number => Math.max(0, Math.min(1, v));

  return {
    ...current,
    value: clamp(current.value + delta),
    evidenceCount:
      source === "evidence"
        ? current.evidenceCount + 1
        : current.evidenceCount,
    contradictionCount:
      source === "contradiction"
        ? current.contradictionCount + 1
        : current.contradictionCount,
    weakSignalCount:
      source === "weak_signal"
        ? current.weakSignalCount + 1
        : current.weakSignalCount,
    lastUpdated: new Date(),
  };
}
