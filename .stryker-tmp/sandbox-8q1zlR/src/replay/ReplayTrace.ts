// @ts-nocheck
import type { TickTrace } from "@common/trace";
import type { TickBucket } from "./types";

/**
 * Pure replay engine – sorts events by tick and groups them.
 * Returns a Record where the key is the tickId and the value is a TickBucket.
 */
export function replayTrace(trace: TickTrace[]): Record<number, TickBucket> {
  // Ensure deterministic order
  const sorted = [...trace].sort((a: TickTrace, b: TickTrace) => a.tickId - b.tickId);

  const grouped: Record<number, TickBucket> = {};
  for (const ev of sorted) {
    const key = ev.tickId;
    if (grouped[key]) {
      grouped[key].events.push(ev);
    } else {
      grouped[key] = { tickId: key, events: [ev] };
    }
  }
  return grouped;
}
