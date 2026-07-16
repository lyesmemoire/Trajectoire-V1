/**
 * Pure Finite State Machine engine for the Voice Interview client.
 * No I/O, no side effects — only state transitions.
 */

import { ClientState, ClientEvent, TERMINAL_STATES } from "./States.js";
import { lookupTransition } from "./Transitions.js";
import { evaluateGuard, type GuardContext } from "./Guards.js";
import { StateError } from "../errors/StateError.js";

export interface TransitionResult {
  readonly previousState: ClientState;
  readonly currentState: ClientState;
  readonly event: ClientEvent;
  readonly timestamp: number;
}

export class InterviewStateMachine {
  private _currentState: ClientState = ClientState.Disconnected;
  private readonly history: TransitionResult[] = [];

  get currentState(): ClientState {
    return this._currentState;
  }

  get isTerminal(): boolean {
    return TERMINAL_STATES.has(this._currentState);
  }

  get transitionHistory(): readonly TransitionResult[] {
    return Object.freeze([...this.history]);
  }

  canTransition(event: ClientEvent): boolean {
    const transition = lookupTransition(this._currentState, event);
    return transition !== undefined;
  }

  transition(event: ClientEvent, guardContext: GuardContext): TransitionResult {
    const transition = lookupTransition(this._currentState, event);

    if (!transition) {
      throw StateError.invalidTransition(this._currentState, event);
    }

    // Evaluate guard if present
    if (transition.guard !== null) {
      const guardPassed = evaluateGuard(transition.guard, guardContext);
      if (!guardPassed) {
        throw StateError.invalidTransition(this._currentState, event);
      }
    }

    const result: TransitionResult = Object.freeze({
      previousState: this._currentState,
      currentState: transition.to,
      event,
      timestamp: Date.now(),
    });

    this._currentState = transition.to;
    this.history.push(result);

    return result;
  }

  reset(): void {
    this._currentState = ClientState.Disconnected;
    this.history.length = 0;
  }
}
