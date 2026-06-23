import { StorageAdapter, StorageTransaction } from "../contracts/storage";

import { buildTenantKey } from "../utils/tenant-key";

class InMemoryTransaction implements StorageTransaction {
  public operations: Array<{ collection: string; id: string; record: any }> = [];
  public status: "PENDING" | "COMMITTED" | "ROLLED_BACK" = "PENDING";

  constructor(private commitHandler: (tx: InMemoryTransaction) => Promise<void>) {}

  async begin(): Promise<void> {
    if (this.status !== "PENDING") throw new Error("Transaction already completed");
  }

  async commit(): Promise<void> {
    if (this.status !== "PENDING") throw new Error("Transaction already completed");
    await this.commitHandler(this);
    this.status = "COMMITTED";
  }

  async rollback(): Promise<void> {
    if (this.status !== "PENDING") throw new Error("Transaction already completed");
    this.operations = [];
    this.status = "ROLLED_BACK";
  }
}

export class InMemoryStorageAdapter implements StorageAdapter {
  // collection -> tenantId:id -> record
  private store: Map<string, Map<string, any>> = new Map();

  async transaction(): Promise<StorageTransaction> {
    return new InMemoryTransaction(async (tx) => {
      // Commit all operations atomically in memory
      for (const op of tx.operations) {
        if (!this.store.has(op.collection)) {
          this.store.set(op.collection, new Map());
        }
        this.store.get(op.collection)!.set(op.id, JSON.parse(JSON.stringify(op.record)));
      }
    });
  }

  async saveRecord<T>(collection: string, tenantId: string, id: string, record: T, tx?: StorageTransaction): Promise<void> {
    if (!tenantId) {
      throw new Error(`StorageAdapter: tenantId is undefined for collection ${collection}`);
    }
    const globalKey = buildTenantKey(tenantId, id);

    if (tx) {
      if (!(tx instanceof InMemoryTransaction)) throw new Error("Invalid transaction object");
      if (tx.status !== "PENDING") throw new Error("Transaction is not pending");
      
      // Stage the write
      tx.operations.push({ collection, id: globalKey, record });
    } else {
      // Immediate write
      if (!this.store.has(collection)) {
        this.store.set(collection, new Map());
      }
      this.store.get(collection)!.set(globalKey, JSON.parse(JSON.stringify(record)));
    }
  }

  async loadRecord<T>(collection: string, tenantId: string, id: string): Promise<T | null> {
    if (!tenantId) {
      throw new Error(`StorageAdapter: tenantId is undefined for collection ${collection}`);
    }
    const globalKey = buildTenantKey(tenantId, id);
    const col = this.store.get(collection);
    if (!col) return null;
    const record = col.get(globalKey);
    return record ? JSON.parse(JSON.stringify(record)) as T : null;
  }

  // Helper for tests
  async _dumpStore(): Promise<Map<string, Map<string, any>>> {
    return this.store;
  }

  // Helper for tests
  async _clearStore(): Promise<void> {
    this.store.clear();
  }
}
