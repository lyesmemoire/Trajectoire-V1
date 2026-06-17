// apps/realtime-gateway/src/interview/runtime/fsm/policies/TimeoutPolicy.ts

/** Maximum allowed sequence gap before a timeout is considered */
export const MAX_GAP = 5;

/**
 * Pure, synchronous timeout policy.
 *
 * - `deadlineSeq` is a deterministic offset from the last observed sequence.
 *   For simplicity we add a fixed window of 100 sequence numbers.
 * - `gap` is the difference between the current and last observed sequence.
 * - `timedOut` is true when either the current sequence exceeds the deadline
 *   or the gap exceeds `MAX_GAP`.
 */
export class TimeoutPolicy {
  static apply(currentSeq: number, lastObservedSeq: number) {
    const deadlineSeq = lastObservedSeq + 100; // deterministic window
    const gap = currentSeq - lastObservedSeq;
    const timedOut = currentSeq > deadlineSeq || gap > MAX_GAP;
    return { timedOut, gap, deadlineSeq };
  }
}
