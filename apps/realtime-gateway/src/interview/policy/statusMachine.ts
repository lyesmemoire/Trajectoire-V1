// apps/realtime-gateway/src/interview/policy/statusMachine.ts

import type { InterviewStatus } from "../models/InterviewStatus";

const VALID_TRANSITIONS: Record<InterviewStatus, Set<InterviewStatus>> = {
  idle: new Set(["active"]),
  active: new Set(["paused", "completed", "expired", "failed"]),
  paused: new Set(["active"]),
  completed: new Set(),
  expired: new Set(),
  failed: new Set(),
};

export function canTransitionStatus(
  current: InterviewStatus,
  next: InterviewStatus,
): boolean {
  if (current === next) return true;
  return VALID_TRANSITIONS[current]?.has(next) ?? false;
}

export function assertValidTransition(
  current: InterviewStatus,
  next: InterviewStatus,
): void {
  if (!canTransitionStatus(current, next)) {
    throw new Error(
      `Invalid status transition from '${current}' to '${next}'.`,
    );
  }
}
