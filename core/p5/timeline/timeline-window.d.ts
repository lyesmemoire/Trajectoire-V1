import { Tick, Timeline } from "./timeline-contract.js";
/**
 * Extracts a window of timeline entries between fromTick and toTick (inclusive).
 *
 * Guarantees:
 * - T4: Concatenating adjacent windows reconstructs the original timeline entries.
 * - Returns an empty array if no entries match the range.
 * - Pure function — no side effects.
 */
export declare function timelineWindow(timeline: Timeline, fromTick: Tick, toTick: Tick): Timeline;
//# sourceMappingURL=timeline-window.d.ts.map