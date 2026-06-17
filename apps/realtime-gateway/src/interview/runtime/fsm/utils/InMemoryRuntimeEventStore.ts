// src/interview/runtime/fsm/utils/InMemoryRuntimeEventStore.ts

import type { InterviewRuntimeEvent } from "../types/InterviewRuntimeEvent";
import { deepFreeze } from "../../utils/deepFreeze";

/**
 * Immutable, append‑only store for a single session.
 * All public outputs are deep‑frozen to prevent hidden mutation.
 */
export class InMemoryRuntimeEventStore {
  private readonly events: ReadonlyArray<InterviewRuntimeEvent>;

  constructor(initial?: readonly InterviewRuntimeEvent[]) {
    this.events = deepFreeze(initial ? [...initial] : []);
  }

  /** Append a single event – returns a brand‑new store instance. */
  public append(event: InterviewRuntimeEvent): InMemoryRuntimeEventStore {
    return new InMemoryRuntimeEventStore([...this.events, event] as const);
  }

  /** Append a batch of events atomically – returns a new store instance. */
  public appendBatch(
    batch: readonly InterviewRuntimeEvent[],
  ): InMemoryRuntimeEventStore {
    return new InMemoryRuntimeEventStore([...this.events, ...batch] as const);
  }

  /** Return a deep‑frozen snapshot of the stored events. */
  public getAll(): ReadonlyArray<InterviewRuntimeEvent> {
    // Defensive copy + deep freeze to guarantee immutability of nested objects.
    return deepFreeze([...this.events]);
  }

  /** Current sequence number (1‑based). */
  public getLastSequence(): number {
    return this.events.length;
  }
}
