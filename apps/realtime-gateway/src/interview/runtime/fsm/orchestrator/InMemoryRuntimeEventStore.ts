// src/interview/runtime/fsm/orchestrator/InMemoryRuntimeEventStore.ts

import type { InterviewRuntimeEvent } from "../types/InterviewRuntimeEvent";
import type { RuntimeEventStore } from "./RuntimeEventStore";
import { deepFreeze } from "../../utils/deepFreeze";
import { SERIALIZATION_SCHEMA_VERSION } from "../constants/serializationSchemaVersion";

/**
 * In‑memory implementation of {@link RuntimeEventStore}.
 *
 * Guarantees:
 *  - Append‑only semantics – never mutates existing events.
 *  - Deterministic ordering – events are stored in the order they are appended.
 *  - Immutable export – returned arrays are deep‑frozen and sorted by `sequence`.
 *  - No internal timestamps – timestamps come from the events themselves.
 */
export class InMemoryRuntimeEventStore implements RuntimeEventStore {
  /** Internal immutable array of events */
  private _events: readonly InterviewRuntimeEvent[] = [];

  /** Append a single event – returns a promise for async compatibility */
  async append(event: InterviewRuntimeEvent): Promise<void> {
    const frozen = deepFreeze(event);
    // Create a new array to avoid mutating the previous one
    this._events = deepFreeze([...this._events, frozen] as const);
  }

  /** Append a batch of events – all events are frozen and appended atomically */
  async appendBatch(events: readonly InterviewRuntimeEvent[]): Promise<void> {
    const frozenBatch = events.map((e) => deepFreeze(e));
    this._events = deepFreeze([...this._events, ...frozenBatch] as const);
  }

  /** Return events starting after the given zero‑based sequence index.
   *  The returned array is deep‑frozen and sorted explicitly by `sequence` to
   *  eliminate any reliance on insertion order.
   */
  async getEventsSince(sequence: number): Promise<readonly InterviewRuntimeEvent[]> {
    const slice = this._events.filter((e) => e.sequence > sequence);
    // Ensure deterministic ordering even if callers provide out‑of‑order data.
    const sorted = slice.sort((a, b) => a.sequence - b.sequence);
    return deepFreeze(sorted) as readonly InterviewRuntimeEvent[];
  }
}

// src/interview/runtime/fsm/orchestrator/OrchestrationTraceEntry.ts

/**
 * Immutable trace entry recorded by the orchestrator for auditability.
 */
export interface OrchestrationTraceEntry {
  /** Action performed, e.g. "append", "retry", "cancel" */
  readonly action: string;
  /** Sequence number of the related event */
  readonly sequence: number;
  /** Deterministic timestamp taken from the event */
  readonly deterministicTimestamp: number;
  /** Session‑wide replay hash after the action */
  readonly sessionReplayHash: string; // StableHash alias
  /** Routing target – typically "FSMEngine.transition" */
  readonly target: string;
  /** Schema version for forward compatibility */
  readonly schemaVersion: typeof SERIALIZATION_SCHEMA_VERSION;
}

// src/interview/runtime/fsm/utils/stableSerialize.ts

/**
 * Stable serialized representation for deterministic persistence.
 * Guarantees canonical key ordering and omission of `undefined` values.
 */
export interface StableSerializedRuntime {
  /** Compact JSON string with deterministic key order */
  readonly json: string;
}

/**
 * Recursively sorts object keys to produce a deterministic representation.
 * Handles arrays, plain objects, and primitives. Non‑object values are returned
 * unchanged. `undefined` properties are omitted.
 */
function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortKeys);
  }
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const sorted: Record<string, unknown> = {};
    const keys = Object.keys(obj).filter((k) => obj[k] !== undefined).sort();
    for (const k of keys) {
      sorted[k] = sortKeys(obj[k]);
    }
    return sorted;
  }
  return value;
}

/**
 * Produce a deterministic, compact JSON string from any value.
 */
export function stableSerialize(value: unknown): StableSerializedRuntime {
  const canonical = sortKeys(value);
  const json = JSON.stringify(canonical);
  return { json };
}
