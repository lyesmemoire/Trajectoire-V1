import type { TickDiff } from "./diffTrace";

export interface GoldenCompareResult {
  comparison: string;
  trace: unknown;
}

export function goldenCompare(trace: TickDiff[]): GoldenCompareResult {
  return { comparison: 'golden', trace };
}
