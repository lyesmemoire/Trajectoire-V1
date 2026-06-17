import { P5Event } from "../execution-contract";

/**
 * A logical clock tick. Strictly monotonic, no gaps, starts at 1.
 */
export type Tick = number;

/**
 * A single timeline entry: a logical tick paired with a P5Event.
 */
export interface TimelineEntry {
  readonly tick: Tick;
  readonly event: P5Event;
}

/**
 * An ordered, immutable sequence of ticked events.
 * Represents the causal execution order of the P5 engine.
 */
export interface Timeline {
  readonly entries: readonly TimelineEntry[];
}
