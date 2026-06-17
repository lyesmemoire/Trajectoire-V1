// src/interview/runtime/fsm/guards/TransitionGuard.ts

import type { InterviewRuntimeState } from "../types/InterviewRuntimeState";
import type { InterviewRuntimeEvent } from "../types/InterviewRuntimeEvent";
import { InvalidTransitionError } from "../errors/InvalidTransitionError";
import { VALID_TRANSITIONS } from "../constants/validTransitions";

/**
 * Determines whether a transition from the given state via the supplied event is allowed.
 * Pure function – no side‑effects, no mutation.
 */
export function isValidTransition(
  state: InterviewRuntimeState,
  event: InterviewRuntimeEvent,
): boolean {
  const allowed = VALID_TRANSITIONS[state.currentState as keyof typeof VALID_TRANSITIONS] as readonly string[] | undefined;
  if (!allowed) return false; // unknown state – treat as invalid
  return allowed.includes(event.type);
}

/**
 * Throws a deterministic error when a transition is not permitted.
 * The error includes frozen details required for replay‑safe debugging.
 */
export function assertValidTransition(
  state: InterviewRuntimeState,
  event: InterviewRuntimeEvent,
): void {
  if (!isValidTransition(state, event)) {
    const allowed = VALID_TRANSITIONS[state.currentState as keyof typeof VALID_TRANSITIONS] as readonly string[] | undefined;
    const details = {
      currentState: state.currentState,
      attemptedEvent: event.type,
      allowedTransitions: allowed ?? [],
    };
    throw new InvalidTransitionError(
      `Invalid transition: state ${state.currentState} cannot handle event ${event.type}`,
      details,
    );
  }
}
