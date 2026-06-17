// runtime/question-engine/models/SelectorName.ts
/**
 * Strict enumeration of selector identifiers used in DecisionTrace events.
 * Using a union of string literals prevents typos and enables exhaustive
 * switch statements throughout the codebase.
 */
export type SelectorName =
  | "topic"
  | "difficulty"
  | "objective"
  | "followup"
  | "phase";
