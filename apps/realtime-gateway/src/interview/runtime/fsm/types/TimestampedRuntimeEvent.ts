import type { InterviewRuntimeEvent } from "./InterviewRuntimeEvent";

/**
 * Extends the base runtime event with a required deterministic timestamp.
 * All events flowing through the FSM must carry this timestamp to keep
 * hashing deterministic and replay‑safe.
 */
export type TimestampedRuntimeEvent = InterviewRuntimeEvent & {
  readonly timestamp: number;
};
