// runtime/question-engine/policies/difficultyPolicies.ts
/**
 * Policies governing difficulty selection behavior.
 * Centralized here to avoid hard‑coded logic scattered across selectors.
 */
import type { DifficultyLevel } from "../DifficultyLevel";

/**
 * Maximum allowed difficulty per interview phase.
 * Phases are free‑form strings (e.g., "opening", "exploration", "deep_technical", "closing").
 * The values are the highest difficulty that may be selected in that phase.
 */
export const PHASE_DIFFICULTY_CEILINGS: Record<string, DifficultyLevel> = {
  opening: "intermediate",
  exploration: "advanced",
  deep_technical: "expert",
  closing: "advanced",
} as const;

/**
 * Overload guard thresholds – if any of these exceed the limits, the selector will cap the difficulty.
 */
export const OVERLOAD_THRESHOLDS = {
  fatigue: 0.7, // fatigue score in [0,1]
  contradiction: 0.6, // contradiction density in [0,1]
} as const;

/**
 * Helper to get the numeric rank of a DifficultyLevel (ascending order).
 */
export const DIFFICULTY_RANK: Record<DifficultyLevel, number> = {
  introductory: 0,
  intermediate: 1,
  advanced: 2,
  expert: 3,
} as const;

/**
 * Helper to map a numeric rank back to a DifficultyLevel, clamping to the valid range.
 */
export function rankToDifficulty(rank: number): DifficultyLevel {
  const clamped = Math.max(0, Math.min(3, Math.round(rank)));
  const mapping: Record<number, DifficultyLevel> = {
    0: "introductory",
    1: "intermediate",
    2: "advanced",
    3: "expert",
  };
  return mapping[clamped]!;
}
