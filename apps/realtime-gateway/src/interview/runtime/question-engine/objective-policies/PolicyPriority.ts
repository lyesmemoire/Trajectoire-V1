// runtime/question-engine/objective-policies/PolicyPriority.ts
/**
 * Strict priority levels for policy resolution.
 * Prevents magic numbers and guarantees deterministic tie-breaking
 * when policies conflict.
 */
export enum PolicyPriority {
  CRITICAL = 1000,
  HIGH = 750,
  NORMAL = 500,
  LOW = 250,
}
