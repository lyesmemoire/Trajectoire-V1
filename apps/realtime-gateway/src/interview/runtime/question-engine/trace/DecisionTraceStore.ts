// runtime/question-engine/trace/DecisionTraceStore.ts
/**
 * Abstraction for storing decision trace events.
 * Implementations can be in‑memory, persisted to Kafka, files, etc.
 */
import type { DecisionTraceEvent } from "../models/DecisionTraceEvent";

export interface DecisionTraceStore {
  /** Record a new decision trace event */
  record(event: DecisionTraceEvent): void;

  /** Retrieve all recorded events (read‑only). */
  getEvents(): readonly DecisionTraceEvent[];
}
