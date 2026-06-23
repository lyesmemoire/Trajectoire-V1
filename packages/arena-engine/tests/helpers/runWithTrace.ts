import { FakeInfra } from "../../src/testing/FakeInfra";
import type { ExecutionTrace } from "../../src/testing/ExecutionTrace";

export async function runWithTrace<TEngine>(
  engineFactory: (infra: FakeInfra) => TEngine,
  action: (engine: TEngine, infra: FakeInfra) => Promise<unknown> | unknown,
  seed = 1
): Promise<ExecutionTrace> {
  const infra = new FakeInfra(seed);

  const engine = engineFactory(infra);
  const output = await action(engine, infra);

  // Normalize logs to ensure deterministic snapshots (e.g. remove performance.now() durations and stack traces)
  const cleanLogs = infra.defaultLogger.logs.map(log => {
    let obj = log.obj;
    if (obj && typeof obj === 'object') {
      obj = { ...obj };
      if ('durationMs' in obj) {
        obj.durationMs = "[DURATION_MS]";
      }
      if (obj.err && obj.err instanceof Error) {
        obj.err = { message: obj.err.message, name: obj.err.name };
      }
    }
    return { ...log, obj };
  });

  return {
    input: "captured_in_test_action",
    output,
    logs: cleanLogs,
    metrics: infra.metrics.counters,
    traces: infra.tracer.traces,
  };
}
