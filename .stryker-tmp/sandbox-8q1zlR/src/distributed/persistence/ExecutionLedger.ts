// @ts-nocheck
// src/distributed/persistence/ExecutionLedger.ts
import { v4 as uuidv4 } from "uuid";

export interface ExecutionRecord {
  taskId: string;
  nodeId: string;
  status: "SUCCESS" | "FAILURE" | "RETRY";
  timestamp: number;
  resultHash?: string; // SHA256 of result payload
  attempt: number;
}

/**
 * Simple in‑memory ledger that records every task execution.
 * In a production system this would be backed by a durable store
 * (e.g. a write‑ahead log or a DB). For the purpose of the
 * prototype we keep it in memory and expose a JSON export
 * method for audit purposes.
 */
export class ExecutionLedger {
  private records: ExecutionRecord[] = [];

  /** Record the outcome of a task execution */
  record(record: Omit<ExecutionRecord, "taskId">) {
    const taskId = uuidv4();
    const entry: ExecutionRecord = { taskId, ...record };
    this.records.push(entry);
    return entry;
  }

  /** Retrieve all records for a specific task */
  getByTask(taskId: string): ExecutionRecord[] {
    return this.records.filter(r => r.taskId === taskId);
  }

  /** Export the whole ledger as JSON (audit‑grade) */
  dump(): string {
    return JSON.stringify(this.records, null, 2);
  }
}
