// src/interview/runtime/fsm/types/InterviewRuntimeState.ts

import type { InterviewRuntimeEvent } from "./InterviewRuntimeEvent";
import type { RuntimeTransitionRecord } from "./RuntimeTransitionRecord";
import type { StableHash } from "../../utils/hash"; // corrected import

/** Immutable FSM state */
export interface InterviewRuntimeState {
  /** Identifier of the interview session */
  sessionId: string;
  /** Current logical state name */
  currentState: string;
  /** Previous logical state name */
  previousState: string | null;
  /** Ordered list of all events that have occurred */
  eventSequence: ReadonlyArray<InterviewRuntimeEvent>;
  /** Identifier of the currently active question, if any */
  activeQuestionId?: string;
  /** Runtime flags (e.g., 'paused', 'recoveryMode') */
  runtimeFlags: ReadonlyArray<string>;
  /** History of transitions */
  transitionHistory: ReadonlyArray<RuntimeTransitionRecord>;
  /** Map of timestamps for start / last update */
  timestamps: {
    startedAt: number;
    lastUpdatedAt: number;
  };
  /** Deterministic hash of the whole state for replay verification */
  replayHash: StableHash;
}
