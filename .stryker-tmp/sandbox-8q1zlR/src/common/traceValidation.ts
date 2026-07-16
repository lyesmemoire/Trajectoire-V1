// @ts-nocheck
import type { TickTrace } from "@common/trace";

/**
 * Dev‑only runtime validation that a TickTrace object conforms to the expected shape.
 * In production this function is a no‑op (the caller guards the call based on NODE_ENV).
 */
export function assertValidTickTrace(ev: TickTrace): void {
  // Basic structural checks – throw if any field is missing or of wrong type.
  if (
    typeof ev !== "object" ||
    ev === null ||
    typeof ev.tickId !== "number" ||
    !Number.isFinite(ev.tickId) ||
    ev.tickId < 0 ||
    typeof ev.ts !== "number" ||
    !Number.isFinite(ev.ts) ||
    typeof ev.nodeId !== "string" ||
    typeof ev.isLeader !== "boolean"
  ) {
    throw new Error("Invalid TickTrace object");
  }
}
