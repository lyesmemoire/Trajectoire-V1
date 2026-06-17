import * as crypto from "crypto";
import { MemoryEventStore } from "../../services/memory-event-store";
import { SILEvent } from "../../contracts/sil-events";

/**
 * SIL v1.0 — Ingestion Stress Test
 * 
 * Simulates high-throughput event ingestion to measure:
 * - events/sec throughput
 * - p95 append latency
 * - hash chain integrity under load
 * 
 * Usage: npx ts-node sil/benchmarks/load/ingest-stress.ts
 */

const EVENT_COUNT = 10_000;
const TENANT_ID = "bench-tenant";
const SESSION_ID = "bench-session";

function generateEvent(i: number, previousHash: string): SILEvent {
  const hash = crypto.createHash("sha256").update(`event-${i}-${previousHash}`).digest("hex");
  return {
    tenantId: TENANT_ID,
    sessionId: SESSION_ID,
    eventId: `evt-${i}`,
    type: "BENCHMARK",
    timestamp: Date.now(),
    signature: "bench-sig",
    hash,
    previousEventHash: previousHash,
    payload: { index: i, data: `payload-${i}` },
  };
}

async function run() {
  const store = new MemoryEventStore();
  const latencies: number[] = [];
  let previousHash = "genesis";

  console.log(`\n⚡ SIL Ingestion Stress Test — ${EVENT_COUNT.toLocaleString()} events\n`);

  const totalStart = performance.now();

  for (let i = 0; i < EVENT_COUNT; i++) {
    const event = generateEvent(i, previousHash);
    previousHash = event.hash;

    const start = performance.now();
    await store.append(event);
    latencies.push(performance.now() - start);
  }

  const totalMs = performance.now() - totalStart;

  // Verify chain integrity
  const events = await store.readAll(TENANT_ID, SESSION_ID);
  let chainValid = true;
  for (let i = 1; i < events.length; i++) {
    if (events[i]!.previousEventHash !== events[i - 1]!.hash) {
      chainValid = false;
      break;
    }
  }

  // Compute p95
  const sorted = [...latencies].sort((a, b) => a - b);
  const p50 = sorted[Math.floor(sorted.length * 0.5)]!;
  const p95 = sorted[Math.floor(sorted.length * 0.95)]!;
  const p99 = sorted[Math.floor(sorted.length * 0.99)]!;

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`  Events:        ${EVENT_COUNT.toLocaleString()}`);
  console.log(`  Total Time:    ${totalMs.toFixed(1)} ms`);
  console.log(`  Throughput:    ${(EVENT_COUNT / (totalMs / 1000)).toFixed(0)} events/sec`);
  console.log(`  p50 Latency:   ${p50.toFixed(3)} ms`);
  console.log(`  p95 Latency:   ${p95.toFixed(3)} ms`);
  console.log(`  p99 Latency:   ${p99.toFixed(3)} ms`);
  console.log(`  Chain Valid:   ${chainValid ? "✅ YES" : "❌ NO"}`);
  console.log(`  Final Hash:    ${previousHash.substring(0, 16)}...`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  if (!chainValid) {
    process.exit(1);
  }
}

run().catch(console.error);
