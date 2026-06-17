import type { InterviewRuntimeEvent } from "../types/InterviewRuntimeEvent";
import { deepFreeze } from "../../utils/deepFreeze";

/**
 * Immutable, append‑only event bus.
 * All stored events are deep‑frozen and the bus itself is frozen after each mutation
 * to guarantee deterministic, replay‑safe semantics.
 */
export class RuntimeEventBus {
  private readonly _events: readonly InterviewRuntimeEvent[];
  private readonly _baseSequence: number;

  private constructor(events: readonly InterviewRuntimeEvent[], baseSequence: number = 0) {
    this._events = deepFreeze(events);
    this._baseSequence = baseSequence;
  }

  /** Create an empty bus, optionally starting from a snapshot sequence */
  static create(baseSequence: number = 0): RuntimeEventBus {
    return new RuntimeEventBus([], baseSequence);
  }

  /** Append a single event, returning a new frozen bus */
  append(event: InterviewRuntimeEvent): RuntimeEventBus {
    const frozenEvent = deepFreeze(event);
    return new RuntimeEventBus([...this._events, frozenEvent] as const, this._baseSequence);
  }

  /** Append a batch of events, returning a new frozen bus */
  appendBatch(events: readonly InterviewRuntimeEvent[]): RuntimeEventBus {
    const frozenBatch = events.map(e => deepFreeze(e));
    return new RuntimeEventBus([...this._events, ...frozenBatch] as const, this._baseSequence);
  }

  /** Return all stored events in order */
  getEvents(): readonly InterviewRuntimeEvent[] {
    return this._events;
  }

  /** Return events starting after the given zero‑based sequence index */
  getEventsSince(sequence: number): readonly InterviewRuntimeEvent[] {
    return this._events.slice(sequence);
  }

  /** Serialize the event stream – useful for persistence or debugging */
  serialize(): string {
    return JSON.stringify(this._events);
  }

  /** Return the highest sequence number currently in the bus */
  getLastSequence(): number {
    if (this._events.length === 0) return this._baseSequence;
    return this._events[this._events.length - 1]?.sequence ?? this._baseSequence;
  }
}
export default RuntimeEventBus;
