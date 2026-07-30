import * as crypto from "crypto";
import { EventStore } from "../../contracts/event-store";

export interface LedgerBatch {
  batchId: string;
  startSequence: number;
  endSequence: number;
  rootHash: string;
  createdAt: number;
}

export interface MerkleLedgerWriter {
  append(event: {
    tenantId: string;
    sessionId: string;
    eventId: string;
    hash: string;
    previousHash?: string;
    sequence: number;
  }): Promise<void>;

  flushBatch(): Promise<LedgerBatch>;
}

export class InMemoryMerkleLedgerWriter implements MerkleLedgerWriter {
  private buffer: unknown[] = [];
  private BATCH_SIZE = 100;

  constructor(private eventStore: EventStore) {}

  async append(event: unknown): Promise<void> {
    this.buffer.push(event);

    if (this.buffer.length >= this.BATCH_SIZE) {
      await this.flushBatch();
    }
  }

  async flushBatch(): Promise<LedgerBatch> {
    if (this.buffer.length === 0) {
      throw new Error("Empty ledger batch");
    }

    const startSequence = this.buffer[0].sequence;
    const endSequence = this.buffer[this.buffer.length - 1].sequence;

    const rootHash = this.computeMerkleRoot(this.buffer);

    const batch: LedgerBatch = {
      batchId: crypto.randomUUID(),
      startSequence,
      endSequence,
      rootHash,
      createdAt: Date.now(),
    };

    // IMPORTANT: audit write ONLY (never affects SIL runtime)
    await this.persistLedger(batch);

    this.buffer = [];
    return batch;
  }

  private computeMerkleRoot(events: unknown[]): string {
    let hashes = events.map(e =>
      crypto.createHash("sha256").update(e.hash).digest("hex")
    );

    while (hashes.length > 1) {
      const temp: string[] = [];

      for (let i = 0; i < hashes.length; i += 2) {
        const left = hashes[i];
        const right = hashes[i + 1] || left;

        const combined = crypto
          .createHash("sha256")
          .update(left + right)
          .digest("hex");

        temp.push(combined);
      }

      hashes = temp;
    }

    return hashes[0];
  }

  private async persistLedger(_batch: LedgerBatch) {
    // intentionally isolated side-effect
    // In production, this would persist to the ledger_batches Postgres table
    // console.log("[LEDGER]", batch);
  }
}
