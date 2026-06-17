// src/distributed/core/CoordinatorNode.ts
import { DistributedTask, NodeStatus } from './types';
import { NodeRegistry } from './NodeRegistry';
import { WorkerNode } from './WorkerNode';
import { ExecutionLedger } from '../persistence/ExecutionLedger';
import { EventStreamBus } from '../stream/EventStreamBus';
// alias for type clarity

/**
 * CoordinatorNode orchestrates distributed certification tasks.
 * It now emits structured events for observability.
 */
export class CoordinatorNode {
  private registry: NodeRegistry;
  private workers: Map<string, WorkerNode> = new Map();
  private ledger: ExecutionLedger;
  private bus: EventStreamBus;

  constructor(registry: NodeRegistry, ledger: ExecutionLedger, bus: EventStreamBus) {
    this.registry = registry;
    this.ledger = ledger;
    this.bus = bus;
  }

  /** Register a worker with the coordinator */
  addWorker(worker: WorkerNode) {
    this.workers.set(worker.nodeId, worker);
    this.registry.registerNode({
      nodeId: worker.nodeId,
      status: 'ALIVE',
      lastHeartbeat: Date.now(),
      load: 0,
    });
  }

  /** Create a certification task for a given epoch */
  createTask(epoch: number, payload: unknown = {}): DistributedTask {
    return {
      id: `task-${epoch}`,
      type: 'CERT',
      payload,
      createdAt: Date.now(),
    };
  }

  /** Dispatch a task to all registered workers and collect results */
  async dispatch(task: DistributedTask) {
    const results: any[] = [];
    for (const worker of this.workers.values()) {
      const res = await worker.runTask(task);
      results.push({ nodeId: worker.nodeId, result: res });
      // emit per‑task execution event
      this.bus.publish({
        type: 'TASK_EXECUTED',
        epoch: Number(task.id.split('-')[1]),
        ts: Date.now(),
        payload: { nodeId: worker.nodeId, taskId: task.id, status: res.status },
      });
    }
    return results;
  }

  /** Commit execution results to the ledger and emit an event */
  commitResults(results: any[]) {
    for (const r of results) {
      this.ledger.record({
        nodeId: r.nodeId,
        status: r.result.status,
        timestamp: Date.now(),
        resultHash: r.result.resultHash,
        attempt: 1,
      });
    }
    this.bus.publish({
      type: 'LEDGER_COMMIT',
      epoch: Number(results[0]?.result?.taskId?.split('-')[1] ?? 0),
      ts: Date.now(),
      payload: { count: results.length },
    });
  }

  /** Update node status based on heartbeat information and emit heartbeat event */
  updateHeartbeat(nodeId: string) {
    const node = this.registry.getNode(nodeId);
    if (node) {
      node.lastHeartbeat = Date.now();
      node.status = 'ALIVE';
      this.bus.publish({
        type: 'NODE_HEARTBEAT',
        epoch: 0,
        ts: Date.now(),
        payload: { nodeId },
      });
    }
  }

  /** Scan for dead nodes (no heartbeat within timeout) */
  sweepDeadNodes(timeoutMs = 5000) {
    const now = Date.now();
    for (const node of this.registry.getAllNodes()) {
      if (now - node.lastHeartbeat > timeoutMs) {
        node.status = 'DEAD';
      }
    }
  }

  /** Return a snapshot of all node status objects */
  getNodes(): NodeStatus[] {
    return Array.from(this.registry.getAllNodes());
  }
}
