// @ts-nocheck
import { RuntimeTraceProvider } from "../../contracts/runtime-trace-provider";
import { RuntimeTrace } from "../../../core/p7/trace-contract";

/**
 * InMemoryRuntimeTraceProvider — Test mock
 * 
 * Returns a minimal but structurally valid RuntimeTrace with `turns`.
 * Used by integration tests to avoid coupling to Kafka/Postgres/Collector.
 */
export class MockRuntimeTraceProvider implements RuntimeTraceProvider {
  async getTrace(sessionId: string): Promise<RuntimeTrace> {
    return {
      sessionId,
      turns: [
        {
          index: 0,
          input: { message: "Bonjour, je suis le candidat.", timestamp: 1000 },
          output: { utterance: "Bienvenue.", timestamp: 1200 },
          p5: { snapshotHash: "snap0", journalPointer: "1" },
          events: [
            { type: "DECISION", timestamp: 1050, payload: { trustDelta: 0.1 } },
          ],
          derived: { latencyMs: 200, turnDurationMs: 200 },
        },
      ],
    };
  }

  async hasTrace(sessionId: string): Promise<boolean> {
    return true;
  }
}
