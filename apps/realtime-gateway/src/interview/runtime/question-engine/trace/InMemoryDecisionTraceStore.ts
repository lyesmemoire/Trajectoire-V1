// runtime/question-engine/trace/InMemoryDecisionTraceStore.ts
/**
 * In‑memory implementation of DecisionTraceStore.
 * Stores events in a private array and returns a read‑only view.
 * All events are deep‑frozen to guarantee immutability.
 */
import { DecisionTraceStore } from "./DecisionTraceStore";
import type { DecisionTraceEvent } from "../models/DecisionTraceEvent";
import { deepFreeze } from "@core/freeze/deepFreeze";

export class InMemoryDecisionTraceStore implements DecisionTraceStore {
  private readonly events: DecisionTraceEvent[] = [];

  /** Record a new immutable decision trace event */
  record(event: DecisionTraceEvent): void {
    // Ensure the stored event cannot be mutated later.
    this.events.push(deepFreeze(event));
  }

  /** Return a read‑only snapshot of all recorded events */
  getEvents(): readonly DecisionTraceEvent[] {
    // Return a shallow‑frozen copy to prevent accidental pushes.
    return Object.freeze([...this.events]);
  }
}
