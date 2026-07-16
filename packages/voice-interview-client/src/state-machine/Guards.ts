/**
 * Guard predicates for conditional transitions.
 * Guards are pure functions — no side effects.
 */

export type GuardName = "hasValidTicket" | "hasRetriesLeft" | "hasTranscript";

export interface GuardContext {
  readonly ticket: string | null;
  readonly retryCount: number;
  readonly maxRetries: number;
  readonly transcript: string | null;
}

type GuardFn = (ctx: GuardContext) => boolean;

const guardRegistry: Record<GuardName, GuardFn> = {
  hasValidTicket: (ctx: GuardContext): boolean => {
    return ctx.ticket !== null && ctx.ticket.length > 0;
  },

  hasRetriesLeft: (ctx: GuardContext): boolean => {
    return ctx.retryCount < ctx.maxRetries;
  },

  hasTranscript: (ctx: GuardContext): boolean => {
    return ctx.transcript !== null && ctx.transcript.trim().length > 0;
  },
};

export function evaluateGuard(name: GuardName, ctx: GuardContext): boolean {
  return guardRegistry[name](ctx);
}
