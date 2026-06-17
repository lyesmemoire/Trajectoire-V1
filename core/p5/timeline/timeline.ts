import { Timeline } from "./timeline-contract";

/**
 * Creates a new, empty Timeline.
 */
export function createTimeline(): Timeline {
  return { entries: [] };
}
