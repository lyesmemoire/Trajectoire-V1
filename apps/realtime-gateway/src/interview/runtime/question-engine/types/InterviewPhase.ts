// runtime/question-engine/types/InterviewPhase.ts
/**
 * All interview phases used by the PhaseManager and selectors.
 * Using a string literal union ensures type‑safety across the pipeline.
 */
export type InterviewPhase =
  | "opening"
  | "background"
  | "technical"
  | "behavioral"
  | "deep_dive"
  | "challenge"
  | "recovery"
  | "closing";
