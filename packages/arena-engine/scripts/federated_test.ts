// scripts/federated_test.ts
// Functional validation of FederatedWatchdog components

import "ts-node/register"; // enable ts-node runtime
import { EventEmitter } from "events";
import type { NodeHealth } from "../src/watchdog/federation/types.ts";
import { FederatedWatchdog } from "../src/watchdog/federation/FederatedWatchdog.ts";

// Helper sleep
const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

async function runTest() {
  const healthSource = new EventEmitter();

  const nodeIds = ["node1", "node2", "node3"];
  const ports = [9000, 9001, 9002];
  const peersMap: Record<string, string[]> = {
    node1: ["127.0.0.1:9001", "127.0.0.1:9002"],
    node2: ["127.0.0.1:9000", "127.0.0.1:9002"],
    node3: ["127.0.0.1:9000", "127.0.0.1:9001"]
  };

  const watchdogs: Record<string, FederatedWatchdog> = {};

  for (let i = 0; i < nodeIds.length; i++) {
    const opts = {
      nodeId: nodeIds[i],
      listenPort: ports[i],
      peers: peersMap[nodeIds[i]],
      healthSource,
    };
    const wd = new FederatedWatchdog(opts);
    wd.start();
    watchdogs[nodeIds[i]] = wd;
  }

  // Emit initial healthy nodes
  const initialHealth: NodeHealth[] = nodeIds.map(id => ({
    nodeId: id,
    health: 1,
    lastSeen: Date.now()
  }));
  healthSource.emit("health", initialHealth);

  await sleep(2000);

  // Perform a tick on each watchdog to generate consensus logs
  for (const id of nodeIds) {
    watchdogs[id].tick();
  }

  await sleep(1000);

  // Inject fault overlay on node2 to trigger leaseRisk and restartBlock
  // Simulate fault telemetry (global map used by FederatedWatchdog)
  (globalThis as any).faultTelemetryMap = {
    node2: { cpu: 0.9, memory: 0.9, replayLag: 500, ledgerDrift: 0 }
  };
  // Emit updated health (still healthy) to trigger fault processing
  healthSource.emit("health", initialHealth);
  await sleep(2000);
  for (const id of nodeIds) {
    watchdogs[id].tick();
  }

  // Cleanup
  for (const id of nodeIds) {
    watchdogs[id].shutdown();
  }
}

runTest().catch(err => console.error("Test error:", err));
