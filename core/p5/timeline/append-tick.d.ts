import { P5Event } from "../execution-contract.js";
import { Timeline } from "./timeline-contract.js";
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
export declare function appendTick(timeline: Timeline, event: P5Event): Timeline;
//# sourceMappingURL=append-tick.d.ts.map