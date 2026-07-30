// internode_audit.ts - temporary audit script for InterNodeComm
import { InterNodeComm } from "../src/watchdog/federation/InterNodeComm.ts";
import type { FederationMessage } from "../src/watchdog/federation/types.ts";

function log(step: _string, result: unknown) {
  console.log(`${step}\t${JSON.stringify(result)}`);
}

// Helper to wait
function wait(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

// Node configurations
const nodes = [
  { id: "node1", port: 9000, peers: ["127.0.0.1:9001", "127.0.0.1:9002"] },
  { id: "node2", port: 9001, peers: ["127.0.0.1:9000", "127.0.0.1:9002"] },
  { id: "node3", port: 9002, peers: ["127.0.0.1:9000", "127.0.0.1:9001"] },
];

const instances: unknown[] = [];

(async () => {
  // Start all nodes
  for (const cfg of nodes) {
    const comm = new InterNodeComm(cfg.id, cfg.port, cfg.peers);
    // capture messages
    const msgs: FederationMessage[] = [];
    comm.onMessage((m) => msgs.push(m));
    (comm as unknown)._captured = msgs; // expose for later
    comm.start();
    instances.push(comm);
  }

  // give time for connections
  await wait(2000);

  // STEP1: server init (check server object exists)
  log("STEP1_serverInit", instances.map((c) => !!(c as unknown).server));

  // STEP2: peer connections (socket map size)
  log(
    "STEP2_peerConn",
    instances.map((c) => (c as unknown).sockets.size)
  );

  // STEP3: broadcast a Heartbeat from node1
  const hb: FederationMessage = { type: "Heartbeat", nodeId: "node1" } as unknown;
  (instances[0] as unknown).broadcast(hb);
  await wait(500);
  log(
    "STEP3_broadcastHeartbeat",
    instances.map((c) => (c as unknown)._captured.length)
  );

  // STEP4: broadcast each message type from node2
  const types = ["RequestVote", "VoteResponse", "RestartVote", "LeaseRenew"] as const;
  for (const t of types) {
    const msg: FederationMessage = { type: t, nodeId: "node2" } as unknown;
    (instances[1] as unknown).broadcast(msg);
  }
  await wait(500);
  log(
    "STEP4_messageTypes",
    instances.map((c) => (c as unknown)._captured.map((m: unknown) => m.type))
  );

  // STEP5: simulate peer failure (close node3 server)
  (instances[2] as unknown).server.close();
  // wait for reconnect attempts from node1 and node2
  await wait(3000);
  log("STEP5_reconnectAttempts", instances.map((c) => (c as unknown).reconnectAttempts.size));

  // STEP6: verify socket cleanup after close (node3 should have 0 sockets)
  log("STEP6_socketLeak", instances.map((c) => (c as unknown).sockets.size));

  // Cleanup all
  for (const c of instances) {
    c.stop?.(); // not implemented, ignore
  }
})();
