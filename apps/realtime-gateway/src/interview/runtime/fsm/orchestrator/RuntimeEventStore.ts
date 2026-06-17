// src/interview/runtime/fsm/orchestrator/RuntimeEventStore.ts

import type { InterviewRuntimeEvent } from "../types/InterviewRuntimeEvent";

/**
 * Persistent, append‑only store for immutable runtime events.
 * Implementations may be in‑memory, Redis, Supabase, Kafka, etc.
 */
export interface RuntimeEventStore {
  /** Append a single event */
  append(event: InterviewRuntimeEvent): Promise<void>;

  /** Append a batch of events */
  appendBatch(events: readonly InterviewRuntimeEvent[]): Promise<void>;

  /** Return events starting after the given zero‑based sequence index */
  getEventsSince(sequence: number): Promise<readonly InterviewRuntimeEvent[]>;
}
