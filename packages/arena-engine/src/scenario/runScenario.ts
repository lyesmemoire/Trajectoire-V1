import { IRuntimeOrchestrator } from "../ports/IOrchestrator";
import type { TickTrace } from "@common/trace";
import { randomUUID } from "crypto";
import { IClock } from "../ports/IInfra";

/**
 * Execute the federated watchdog scenario and return the collected TickTrace array.
 * No filesystem side‑effects – suitable for import by tests or the CLI harness.
 */
export async function runScenario(clock: IClock, orchestrator: IRuntimeOrchestrator, limit: number = 10000): Promise<TickTrace[]> {
  const runId = randomUUID();
  const trace: TickTrace[] = [];

  for (let i = 0; i < limit; i++) {
    const event = {
      eventId: `evt-${i}`,
      sessionId: "session-123",
      source: "harness",
      type: "BENCHMARK_EVENT",
      payload: { index: i },
      timestamp: clock.now(),
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
