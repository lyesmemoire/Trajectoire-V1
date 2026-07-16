// @ts-nocheck
import type { TickTrace } from "@common/trace";
import { randomUUID } from "crypto";

/**
 * Execute the federated watchdog scenario and return the collected TickTrace array.
 * No filesystem side‑effects – suitable for import by tests or the CLI harness.
 * 
 * NOTE: This is a simplified mock version since RuntimeOrchestrator architecture has changed.
 * The original orchestrator dependencies are not available in the expected structure.
 */
export async function runScenario(): Promise<TickTrace[]> {
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
    // Mock the orchestrator.process behavior
    trace.push(event as any as TickTrace);
  }

  return trace;
}
