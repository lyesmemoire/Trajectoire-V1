// src/interview/runtime/fsm/errors/InvalidTransitionError.ts

import { deepFreeze } from "../../utils/deepFreeze";

export interface TransitionErrorDetails {
  readonly currentState: string;
  readonly attemptedEvent: string;
  readonly allowedTransitions: readonly string[];
}

export class InvalidTransitionError extends Error {
  /** Frozen details for deterministic debugging */
  public readonly details: TransitionErrorDetails;

  constructor(message: string, details: TransitionErrorDetails) {
    super(message);
    // Ensure deterministic, immutable details
    this.details = deepFreeze(details) as TransitionErrorDetails;
    // Set the prototype explicitly (required when extending built‑ins in TS compiled to CJS)
    Object.setPrototypeOf(this, InvalidTransitionError.prototype);
    this.name = "InvalidTransitionError";
  }
}
