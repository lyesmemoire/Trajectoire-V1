import { P5Event } from "../execution-contract";
import { Timeline } from "./timeline-contract";

/**
 * Appends an event to a timeline, returning a new timeline.
 *
 * Tick is derived from entries.length + 1, guaranteeing:
 * - T1: Monotonicity (tick(n+1) > tick(n))
 * - T2: No gaps (1, 2, 3, ...)
 *
 * The original timeline is never mutated.
 * Pure function — no side effects.
 */
export function appendTick(timeline: Timeline, event: P5Event): Timeline {
  const nextTick = timeline.entries.length + 1;

  return {
    entries: [
      ...timeline.entries,
      { tick: nextTick, event },
    ],
  };
}
