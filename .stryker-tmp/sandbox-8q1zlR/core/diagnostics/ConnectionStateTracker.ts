/**
 * Connection State Tracker
 *
 * Passive tracker for connection states.
 * Observes connection states without modifying them.
 */
// @ts-nocheck


import { ConnectionState } from "./types";
import { DiagnosticEventRecorder } from "./DiagnosticEventRecorder";

export class ConnectionStateTracker {
  private states: Map<string, ConnectionState>;
  private eventRecorder: DiagnosticEventRecorder;

  constructor(eventRecorder: DiagnosticEventRecorder) {
    this.eventRecorder = eventRecorder;
    this.states = new Map();
  }

  /**
   * Update connection state for a component
   */
  updateState(
    component: string,
    state: ConnectionState["state"]
  ): void {
    const previousState = this.states.get(component);
    const newState: ConnectionState = {
      component,
      state,
      timestamp: new Date(),
      previousState: previousState?.state ?? null,
    };

    this.states.set(component, newState);

    this.eventRecorder.recordEvent("runtime", "connection_state_change", {
      component,
      from: previousState?.state ?? null,
      to: state,
      timestamp: newState.timestamp,
    });
  }

  /**
   * Get state for a component
   */
  getState(component: string): ConnectionState | null {
    const state = this.states.get(component);
    return state ? { ...state } : null;
  }

  /**
   * Get all states
   */
  getAllStates(): ConnectionState[] {
    return Array.from(this.states.values()).map(s => ({ ...s }));
  }

  /**
   * Get connected components
   */
  getConnectedComponents(): string[] {
    return Array.from(this.states.entries())
      .filter(([_, s]) => s.state === "connected")
      .map(([component]) => component);
  }

  /**
   * Get disconnected components
   */
  getDisconnectedComponents(): string[] {
    return Array.from(this.states.entries())
      .filter(([_, s]) => s.state === "disconnected")
      .map(([component]) => component);
  }

  /**
   * Reset state for a component
   */
  resetComponentState(component: string): void {
    this.states.delete(component);

    this.eventRecorder.recordEvent("runtime", "connection_state_reset", {
      component,
      timestamp: new Date(),
    });
  }

  /**
   * Reset all states
   */
  resetAllStates(): void {
    this.states.clear();

    this.eventRecorder.recordEvent("runtime", "all_connection_states_reset", {
      timestamp: new Date(),
    });
  }
}
