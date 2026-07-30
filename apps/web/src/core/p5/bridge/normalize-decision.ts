import { GovernorDecision } from "./normalization-contract.js";
import { P5Event } from "../execution-contract.js";

/**
 * Transforms a GovernorDecision into a deterministic, ordered list of P5Events.
 *
 * Order guarantee (B2): trust → suspicion → pressure → emotion.
 * This order is stable and independent of object key enumeration.
 *
 * Only present (defined) fields produce events.
 * This is a pure function — no RNG, no clock, no side effects (B4).
 */
export function normalizeDecision(decision: GovernorDecision): P5Event[] {
  const events: P5Event[] = [];

  if (decision.trustDelta !== undefined) {
    events.push({ type: "TRUST_DELTA", delta: decision.trustDelta });
  }

  if (decision.suspicionDelta !== undefined) {
    events.push({ type: "SUSPICION_DELTA", delta: decision.suspicionDelta });
  }

  if (decision.pressureDelta !== undefined) {
    events.push({ type: "PRESSURE_DELTA", delta: decision.pressureDelta });
  }

  if (decision.emotion !== undefined) {
    events.push({ type: "EMOTION_SET", emotion: decision.emotion });
  }

  return events;
}
