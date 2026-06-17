// runtime/question-engine/signals/SignalName.ts

/**
 * Strict union of all available runtime signals.
 * Adding a signal here is required to track it in the SignalRegistry.
 */
export type SignalName =
  | "fatigue"
  | "contradiction"
  | "hesitation"
  | "novelty"
  | "topic_saturation"
  | "confidence"
  | "communication_inconsistency";
