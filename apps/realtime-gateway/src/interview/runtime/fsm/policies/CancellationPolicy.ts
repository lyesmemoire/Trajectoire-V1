// src/interview/runtime/fsm/policies/CancellationPolicy.ts

/**
 * CancellationPolicy – determines if a given event signals session cancellation.
 * Pure, deterministic, side‑effect‑free.
 */
export class CancellationPolicy {
  /**
   * Returns whether the event represents a cancellation request.
   * The runtime design mandates the explicit type "CANCEL_SESSION".
   */
  static apply(event: { type: string }): { cancelled: boolean } {
    const cancelled = event.type === "CANCEL_SESSION";
    return { cancelled };
  }
}
