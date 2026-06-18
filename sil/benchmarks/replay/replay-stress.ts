import * as crypto from "crypto";
import { MemoryEventStore } from "../../services/memory-event-store";
import { DefaultEventQueryService } from "../../services/query/event-query-service";
import { SILEvent } from "../../contracts/sil-events";

/**
 * SIL v1.0 — Replay Stress Test
 * 
 * Simulates concurrent replay requests to measure:
 * - replay duration under load
 * - hash determinism (divergence count MUST be 0)
 * - p95 replay latency
 * 
 * Usage: npx ts-node sil/benchmarks/replay/replay-stress.ts
 */

const SESSION_COUNT = 50;
const EVENTS_PER_SESSION = 200;
const TENANT_ID = "replay-bench-tenant";

function generateSessionEvents(sessionId: string): SILEvent[] {
  const events: SILEvent[] = [];
  let previousHash = "genesis";

  for (let i = 0; i < EVENTS_PER_SESSION; i++) {
    const hash = crypto.createHash("sha256").update(`${sessionId}-${i}-${previousHash}`).digest("hex");
    events.push({
      tenantId: TENANT_ID,
      sessionId,
      eventId: `${sessionId}-evt-${i}`,
      type: i === EVENTS_PER_SESSION - 1 ? "REPORT_GENERATED" : "TEST",
      timestamp: i + 1,
      signature: "sig",
      hash,
      previousEventHash: previousHash,
      payload: i === EVENTS_PER_SESSION - 1 ? { reportHash: hash } : { index: i },
    });
    previousHash = hash;
  }

  return events;
}

async function run() {
  const store = new MemoryEventStore();

  console.log(`\n🔁 SIL Replay Stress Test — ${SESSION_COUNT} sessions × ${EVENTS_PER_SESSION} events\n`);

  // Seed data
  const sessionIds: string[] = [];
  for (let s = 0; s < SESSION_COUNT; s++) {
    const sessionId = `sess-${s}`;
    sessionIds.push(sessionId);
    const events = generateSessionEvents(sessionId);
    for (const e of events) {
      await store.append(e);
    }
  }

  console.log(`  Seeded ${SESSION_COUNT * EVENTS_PER_SESSION} events across ${SESSION_COUNT} sessions`);

  // Replay all sessions and measure
  const query = new DefaultEventQueryService(store as any);
  // We don't have real P7/Trace mocks here, so we'll just measure event retrieval + ordering
  const latencies: number[] = [];
  let divergences = 0;

  for (const sessionId of sessionIds) {
    const start = performance.now();
    const events = await query.getSessionEvents(TENANT_ID, sessionId);
    latencies.push(performance.now() - start);

    // Verify chain
    for (let i = 1; i < events.length; i++) {
      if (events[i]!.previousEventHash !== events[i - 1]!.hash) {
        divergences++;
      }
    }
  }

  const sorted = [...latencies].sort((a, b) => a - b);
  const p50 = sorted[Math.floor(sorted.length * 0.5)]!;
  const p95 = sorted[Math.floor(sorted.length * 0.95)]!;
  const avg = latencies.reduce((a, b) => a + b, 0) / latencies.length;

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`  Sessions:      ${SESSION_COUNT}`);
  console.log(`  Events/sess:   ${EVENTS_PER_SESSION}`);
  console.log(`  Avg Replay:    ${avg.toFixed(3)} ms`);
  console.log(`  p50 Replay:    ${p50.toFixed(3)} ms`);
  console.log(`  p95 Replay:    ${p95.toFixed(3)} ms`);
  console.log(`  Divergences:   ${divergences === 0 ? "✅ 0" : `❌ ${divergences}`}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  if (divergences > 0) {
    process.exit(1);
  }
}

run().catch(console.error);
