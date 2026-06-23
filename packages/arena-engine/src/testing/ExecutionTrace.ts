export interface ExecutionTrace {
  input: unknown;
  output: unknown;
  logs: unknown[];
  metrics: Record<string, number>;
  traces: string[];
}
