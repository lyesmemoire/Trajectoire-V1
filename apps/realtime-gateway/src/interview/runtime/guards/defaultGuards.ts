import type { GuardFn } from "./RuntimeGuardEngine";

/** Guard that blocks self-transitions (from state equal to to state) */
export const noSelfTransitionGuard: GuardFn = ({ from, to }) => {
  if (from === to) {
    return { allowed: false, reason: "SELF_TRANSITION_BLOCKED" };
  }
  return { allowed: true };
};

/** Guard that ensures event is not null/undefined */
export const validEventGuard: GuardFn = ({ event }) => {
  if (event == null) {
    return { allowed: false, reason: "NULL_EVENT" };
  }
  return { allowed: true };
};
