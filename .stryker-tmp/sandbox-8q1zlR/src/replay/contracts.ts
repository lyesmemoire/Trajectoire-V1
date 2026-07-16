// @ts-nocheck
// src/replay/contracts.ts
import type { ReplayTimeline } from "./types";

/**
 * Constant metadata for the replay contract. Used for static analysis, tree‑shaking, and CI documentation.
 */
export const REPLAY_CONTRACT = {
  timeline: "Record<number, TickBucket>",
  deterministicOrdering: true,
  mutationAllowed: false,
} as const;

/**
 * Runtime guard – asserts that the provided value conforms to `ReplayTimeline`.
 * Throws a descriptive error if the shape is invalid.
 */
export function assertTimelineShape(value: unknown): asserts value is ReplayTimeline {
  if (typeof value !== "object" || value === null) {
    throw new Error("Invalid ReplayTimeline: not a non‑null object");
  }

  // Ensure we are iterating over own properties only (prevent prototype pollution)
  for (const key in value) {
    if (!Object.prototype.hasOwnProperty.call(value, key)) continue;
    const tickId = Number(key);
    if (!Number.isInteger(tickId) || tickId < 0) {
      throw new Error(`Invalid tick key "${key}"`);
    }
    const bucket: any = (value as Record<string, unknown>)[key];
    if (
      typeof bucket !== "object" ||
      bucket === null ||
      typeof bucket.tickId !== "number" ||
      !Array.isArray(bucket.events)
    ) {
      throw new Error(`Invalid TickBucket at tick ${key}`);
    }
    // Validate each TickTrace inside the bucket
    for (const ev of bucket.events) {
      if (
        typeof ev !== "object" ||
        ev === null ||
        typeof ev.tickId !== "number" ||
        typeof ev.nodeId !== "string" ||
        typeof ev.isLeader !== "boolean"
      ) {
        throw new Error(`Invalid TickTrace inside tick ${key}`);
      }
    }
  }
}
