import { RuntimeOrchestrator } from "../../apps/realtime-gateway/src/interview/runtime/fsm/orchestrator/RuntimeOrchestrator";
import { RuntimeEventBus } from "../../apps/realtime-gateway/src/interview/runtime/fsm/orchestrator/RuntimeEventBus";
import type { TickTrace } from "@common/trace";
import { randomUUID } from "crypto";

/**
 * Execute the federated watchdog scenario and return the collected TickTrace array.
 * No filesystem side‑effects – suitable for import by tests or the CLI harness.
 */
export async function runScenario(): Promise<TickTrace[]> {
  const bus = RuntimeEventBus.create();
  const mockFsm = {
    transition: (_seq: number, _event: any) => ({
      transitionId: "mock",
      newState: { name: "MOCK_STATE" },
    }),
  } as any;

  const orchestrator = new RuntimeOrchestrator(bus, mockFsm);
  const limit = Number(process.env.HARNESS_LIMIT ?? 10_000);
  const runId = randomUUID();
  const trace: TickTrace[] = [];

  for (let i = 0; i < limit; i++) {
    const event = {
      eventId: `evt-${i}`,
      sessionId: "session-123",
      source: "harness",
      type: "BENCHMARK_EVENT",
      payload: { index: i },
      timestamp: Date.now(),
      sequence: i,
      version: 1,
      runId,
      traceVersion: 1,
    };
    // orchestrator.process returns a TickTrace (emits the event)
    const emitted = await orchestrator.process(event);
    trace.push(emitted as any as TickTrace);
  }

  return trace;
}
