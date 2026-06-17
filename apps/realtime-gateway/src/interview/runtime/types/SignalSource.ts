// runtime/types/SignalSource.ts

/**
 * Enum representing the origin of a signal within the deterministic runtime.
 * Using a string enum preserves runtime values while providing type safety.
 */
export enum SignalSource {
  STT = "STT",
  LLM = "LLM",
  POLICY = "POLICY",
  PIPELINE = "PIPELINE",
  USER_EVENT = "USER_EVENT",
  RECOVERY = "RECOVERY",
  SYSTEM = "SYSTEM",
}
