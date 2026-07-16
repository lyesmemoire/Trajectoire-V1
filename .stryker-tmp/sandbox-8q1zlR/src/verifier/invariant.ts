// @ts-nocheck
import type { TickTrace } from "@common/trace";
import type { VerificationResult, VerificationViolation } from "./types";

/** Group an array by a key function. */
function groupBy<T, K extends keyof any>(
  arr: T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  return arr.reduce((acc, item) => {
    const k = keyFn(item);
    (acc[k] ??= []).push(item);
    return acc;
  }, {} as Record<K, T[]>);
}

/** Verify that each tick has at most one leader. */
export function verifyInvariant(trace: TickTrace[]): VerificationResult {
  const violations: VerificationViolation[] = [];
  const byTick = groupBy(trace, (t) => t.tickId);
  for (const [, events] of Object.entries(byTick)) {
    if (events.length === 0) continue;
    const leaders = events.filter((e) => e.isLeader);
    if (leaders.length > 1) {
      const tickId = events[0]!.tickId;
      const leaderIds = leaders.map((l) => l.nodeId);
      violations.push({
        code: "MULTIPLE_LEADERS",
        tickId,
        message: `Split‑brain detected: multiple leaders (${leaderIds.join(", ")})`,
      });
    }
  }
  return { ok: violations.length === 0, violations };
}
