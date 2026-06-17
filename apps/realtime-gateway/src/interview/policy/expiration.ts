// apps/realtime-gateway/src/interview/policy/expiration.ts

import type { InterviewState } from "../models/InterviewState";
import { INTERVIEW_CONFIG } from "../config/config";

export function isExpired(
  state: InterviewState,
  currentTimeMs: number = Date.now(),
): boolean {
  if (
    state.status === "expired" ||
    state.status === "completed" ||
    state.status === "failed"
  ) {
    // Cannot expire an already terminal state, but from an expiration check perspective it's "expired/done"
    return true;
  }

  // Use explicit expiresAt if set
  if (state.expiresAt && currentTimeMs > state.expiresAt) {
    return true;
  }

  // Fallback: check duration based on first event timestamp (session_started)
  const startEvent = state.events.find((e) => e.type === "session_started");
  if (startEvent) {
    const elapsedMs = currentTimeMs - startEvent.timestamp;
    const maxDurationMs = INTERVIEW_CONFIG.MAX_DURATION_MINUTES * 60 * 1000;
    if (elapsedMs > maxDurationMs) {
      return true;
    }
  }

  return false;
}
