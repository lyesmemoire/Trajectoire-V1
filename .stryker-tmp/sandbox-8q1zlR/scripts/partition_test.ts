// @ts-nocheck
// scripts/partition_test.ts
// Distributed partition test for FederatedWatchdog

import { EventEmitter } from "events";
import type { NodeHealth } from "../src/watchdog/federation/types.ts";
import { FederatedWatchdog } from "../src/watchdog/federation/FederatedWatchdog.ts";
import { InterNodeComm } from "../src/watchdog/federation/InterNodeComm.ts";

// Helper sleep
const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function runScenario(): Promise<Array<{ tickId: number; nodeId: string; isLeader: boolean }>> {
  console.log("[PARTITION_TEST] Starting test");

  const nodeIds = ["node1", "node2", "node3"]; // node1 will be initial leader
  const ports = [9000, 9001, 9002];
  const peersMap: Record<string, string[]> = {
    node1: ["127.0.0.1:9001", "127.0.0.1:9002"],
    node2: ["127.0.0.1:9000", "127.0.0.1:9002"],
    node3: ["127.0.0.1:9000", "127.0.0.1:9001"],
  };

  // shared health emitter
  const globalTrace: Array<{ tickId: number; nodeId: string; isLeader: boolean }> = [];
  // attach listeners for each watchdog (including later restarts)
  const attachListener = (id: string, wd: any) => {
    wd.on("tickTrace", (ev: any) => globalTrace.push(ev));
  };
  const healthSource = new EventEmitter();
  // Global logical tick counter orchestrated by the test harness
  let globalTick = 0;
  const runTicks = async (ids: string[]) => {
    globalTick++;
    for (const nid of ids) {
      const wd = watchdogs[nid] as any;
      if (wd && typeof wd.tick === "function") {
        wd.tick(); // no argument
      }
    }
    // small pause to let async processing settle
    await new Promise(r => setTimeout(r, 100));
  };

  const watchdogs: Record<string, FederatedWatchdog> = {};
  const comms: Record<string, InterNodeComm> = {};

  // Initialise watchdogs
  for (let i = 0; i < nodeIds.length; i++) {
    const opts = {
      nodeId: nodeIds[i],
      listenPort: ports[i],
      peers: peersMap[nodeIds[i]],
      healthSource,
    } as any;
    const wd = new FederatedWatchdog(opts);
    wd.start();
    watchdogs[nodeIds[i]] = wd;
    // expose underlying comm for test control
    const comm = (wd as any).comm as InterNodeComm;
    comms[nodeIds[i]] = comm;
    attachListener(nodeIds[i], wd);
  }

  // initial healthy health report
  const initialHealth: NodeHealth[] = nodeIds.map(id => ({ nodeId: id, health: 1, lastSeen: Date.now() }));
  healthSource.emit("health", initialHealth);
  await sleep(2000);

  // Perform initial tick to elect leader
  await runTicks(nodeIds);
  await sleep(500);

  // Capture initial leader info
  const leaderInfo1 = (watchdogs["node1"] as any).leaderElection.getIsLeader() ? "node1" : "unknown";
  console.log(`[PARTITION_TEST] Initial leader elected: ${leaderInfo1}`);

  // ---- Simulate leader crash ----
  console.log(`[PARTITION_TEST] Crashing leader (node1)`);
  watchdogs["node1"].shutdown(); // shutdown releases lease, stops watchdog (no internal stop for comm)
  // also close its comm to fully stop network handling
  comms["node1"].forceDisconnect();

  await sleep(1000);

  // ---- Simulate network partition for node2 (as example) ----
  console.log(`[PARTITION_TEST] Partitioning node2 network`);
  comms["node2"].forceDisconnect();

  await sleep(2000);

  // ---- Heal partition ----
  console.log(`[PARTITION_TEST] Healing network partitions`);
  comms["node2"].reconnectAll();
  // node1 was fully stopped; restart it as a fresh instance to re‑join cluster
  console.log(`[PARTITION_TEST] Restarting node1 instance`);
  const opts1 = {
    nodeId: "node1",
    listenPort: 9000,
    peers: peersMap["node1"],
    healthSource,
  } as any;
  const wd1 = new FederatedWatchdog(opts1);
  wd1.start();
  watchdogs["node1"] = wd1;
  const comm1 = (wd1 as any).comm as InterNodeComm;
  comms["node1"] = comm1;
  attachListener("node1", wd1);

  await sleep(2000);

  // Run ticks on all nodes to let them converge
  await runTicks(nodeIds);
  await sleep(500);

  // Gather final consensus data
  const finalLeaders: string[] = [];
  for (const id of nodeIds) {
    const le = (watchdogs[id] as any).leaderElection;
    if (le.getIsLeader()) finalLeaders.push(id);
  }
  console.log(`[PARTITION_TEST] Final leaders observed: ${finalLeaders.join(", ")}`);
  if (finalLeaders.length > 1) {
    console.error("[PARTITION_TEST] ERROR: Multiple leaders detected!");
  }

  // Invariant verification using logical tickId groups
  // Ensure strict ordering before verification
  console.log(`[PARTITION_TEST] Collected ${globalTrace.length} tickTrace events.`);
  // Return the raw trace for verifier consumption
  return globalTrace;
}
