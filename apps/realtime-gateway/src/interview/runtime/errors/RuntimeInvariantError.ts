// runtime/errors/RuntimeInvariantError.ts
/**
 * Specific error type used throughout the deterministic interview runtime.
 * Throwing this error signals a violation of an invariant that should never happen
 * in correct operation (e.g., phase transition violation, graph overflow, invalid
 * selector output, replay state corruption, confidence out of bounds).
 */
export class RuntimeInvariantError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RuntimeInvariantError";
  }
}
