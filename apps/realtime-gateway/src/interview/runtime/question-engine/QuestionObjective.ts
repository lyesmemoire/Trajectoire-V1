// runtime/question-engine/QuestionObjective.ts
/**
 * Operational objectives used by selectors to guide question generation.
 */
export type QuestionObjective =
  | "explore_topic"
  | "validate_skill"
  | "detect_depth"
  | "challenge_claim"
  | "measure_confidence"
  | "detect_consistency"
  | "detect_authenticity"
  | "recover_candidate";
