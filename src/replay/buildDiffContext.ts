import type { TickTrace } from "../common/trace";

export interface DiffContextResult {
  context: string;
  trace: unknown;
  totalOldEvents?: number;
}

export function buildDiffContext(oldTrace: TickTrace[], newTrace?: TickTrace[]): DiffContextResult {
  return { context: 'diff-context', trace: oldTrace, totalOldEvents: oldTrace.length };
}
