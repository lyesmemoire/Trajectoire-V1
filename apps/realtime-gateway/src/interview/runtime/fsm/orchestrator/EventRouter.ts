import type { TimestampedRuntimeEvent } from "../types/TimestampedRuntimeEvent";
import type { InterviewRuntimeState } from "../types/InterviewRuntimeState";
import { transition } from "../engine/FSMEngine";

/**
 * Routes an event to the pure FSM engine.
 * Expects a timestamped event to keep the transition deterministic.
 */
export function routeEvent(
  state: InterviewRuntimeState,
  event: TimestampedRuntimeEvent,
) {
  // Direct delegation – no side‑effects.
  return transition(state, event);
}
