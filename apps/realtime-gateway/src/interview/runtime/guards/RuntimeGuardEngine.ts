export type GuardContext = {
  from: string;
  to: string;
  event: unknown;
  state: unknown;
};

export type GuardResult = {
  allowed: boolean;
  reason?: string;
};

import { runtime_guard_duration_ms } from "../fsm/metrics/RuntimeMetrics";

export type GuardFn = (ctx: GuardContext) => GuardResult;

export class RuntimeGuardEngine {
  private guards: GuardFn[] = [];

  register(guard: GuardFn) {
    this.guards.push(guard);
  }

  evaluate(ctx: GuardContext): GuardResult {
    const end = runtime_guard_duration_ms.startTimer();
    try {
      for (const guard of this.guards) {
        const result = guard(ctx);
        if (!result.allowed) {
          return {
            allowed: false,
            reason: result.reason ?? "BLOCKED",
          };
        }
      }
      return { allowed: true };
    } finally {
      end();
    }
  }
}
