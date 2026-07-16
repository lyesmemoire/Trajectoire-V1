/**
 * Provider Runtime State Machine
 *
 * Responsibilities:
 * - Manage runtime state transitions
 * - Validate state transitions
 * - Track state history
 * - Emit state change events
 *
 * NO business logic, NO reasoning, NO analysis
 * ONLY state management
 */
// @ts-nocheck


import { RuntimeState, RuntimeEvent } from "./RuntimeEngine";

// ============================================================================
// STATE TRANSITION
// ============================================================================

export interface StateTransition {
  from: RuntimeState;
  to: RuntimeState;
  event: RuntimeEvent;
  timestamp: number;
}

// ============================================================================
// STATE MACHINE INTERFACE
// ============================================================================

export interface RuntimeStateMachine {
  getCurrentState(): RuntimeState;
  transitionTo(newState: RuntimeState, event: RuntimeEvent): boolean;
  isValidTransition(from: RuntimeState, to: RuntimeState): boolean;
  getStateHistory(): StateTransition[];
  reset(): void;
}

// ============================================================================
// STATE TRANSITIONS
// ============================================================================

const VALID_TRANSITIONS: Record<RuntimeState, RuntimeState[]> = {
  Idle: ["Initializing", "Running", "Error"],
  Initializing: ["Idle", "Running", "Error"],
  Running: ["Switching", "FailingOver", "CircuitBreakerOpen", "ShuttingDown", "Error"],
  Switching: ["Running", "Error"],
  FailingOver: ["Running", "Error"],
  CircuitBreakerOpen: ["Running", "ShuttingDown", "Error"],
  ShuttingDown: ["Idle", "Error"],
  Error: ["Idle", "Initializing", "Running"]
};

// ============================================================================
// STATE MACHINE IMPLEMENTATION
// ============================================================================

export class RuntimeStateMachineImpl implements RuntimeStateMachine {
  private currentState: RuntimeState = "Idle";
  private stateHistory: StateTransition[] = [];

  getCurrentState(): RuntimeState {
    return this.currentState;
  }

  transitionTo(newState: RuntimeState, event: RuntimeEvent): boolean {
    if (!this.isValidTransition(this.currentState, newState)) {
      return false;
    }

    const transition: StateTransition = {
      from: this.currentState,
      to: newState,
      event,
      timestamp: Date.now()
    };

    this.stateHistory.push(transition);
    this.currentState = newState;

    return true;
  }

  isValidTransition(from: RuntimeState, to: RuntimeState): boolean {
    const validTargets = VALID_TRANSITIONS[from];
    return validTargets.includes(to);
  }

  getStateHistory(): StateTransition[] {
    return [...this.stateHistory];
  }

  reset(): void {
    this.currentState = "Idle";
    this.stateHistory = [];
  }
}
