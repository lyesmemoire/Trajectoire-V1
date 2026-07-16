// @ts-nocheck
// src/distributed/core/WorkerNode.ts
import { DistributedTask } from "./types";
import { ExecutionLedger } from "../persistence/ExecutionLedger";
import crypto from "crypto";
import { setInterval } from "timers";

/**
 * WorkerNode simulates a node that can execute tasks and report heartbeats.
 * In this prototype the task execution is a dummy operation that simply
 * returns the payload wrapped in a result object. Real logic would invoke
 * the certification kernel, replay engine, chaos, etc.
 */
export class WorkerNode {
  public readonly nodeId: string;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private ledger: ExecutionLedger;
  private coordinatorHeartbeatFn: (nodeId: string) => void;

  constructor(nodeId: string, ledger: ExecutionLedger, heartbeatFn: (nodeId: string) => void) {
    this.nodeId = nodeId;
    this.ledger = ledger;
    this.coordinatorHeartbeatFn = heartbeatFn;
    this.startHeartbeat();
  }

  /** Start periodic heartbeat emission */
  private startHeartbeat() {
    // send heartbeat every 1 second
    this.heartbeatInterval = setInterval(() => {
      this.coordinatorHeartbeatFn(this.nodeId);
    }, 1000);
  }

  /** Stop heartbeat (e.g., when node is retired) */
  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /** Execute a DistributedTask and record the execution */
  async runTask(task: DistributedTask): Promise<any> {
    // Simulated execution – in real code this would run the certification pipeline
    const start = Date.now();
    let result: any;
    let status: "SUCCESS" | "FAILURE" = "SUCCESS";
    try {
      // dummy processing: echo back the task payload with a timestamp
      result = {
        taskId: task.id,
        processedAt: Date.now(),
        payload: task.payload,
      };
    } catch (e) {
      status = "FAILURE";
      result = { error: (e as Error).message };
    }

    const resultHash = crypto.createHash("sha256").update(JSON.stringify(result)).digest("hex");

    // Record execution in ledger (attempt always 1 for this simple demo)
    this.ledger.record({
      nodeId: this.nodeId,
      status,
      timestamp: Date.now(),
      resultHash,
      attempt: 1,
    });

    // Return result to coordinator
    return { status, result, resultHash, durationMs: Date.now() - start };
  }
}
