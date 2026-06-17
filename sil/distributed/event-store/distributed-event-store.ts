import { EventStore } from "../../contracts/event-store";
import { SILEvent } from "../../contracts/sil-events";
import { ShardRouter } from "../sharding/shard-router";
import { GlobalEventIndex } from "../index/global-event-index";
import { SILCheckpoint } from "../../contracts/session-state";

export type IndexedSILEvent = SILEvent & { sequence: number };

export class DistributedEventStore implements EventStore {
  constructor(
    private shardRouter: ShardRouter,
    private stores: Map<number, EventStore>,
    private index: GlobalEventIndex
  ) {}

  async append(event: SILEvent): Promise<void> {
    const shard = this.shardRouter.getShard(event.tenantId);
    const store = this.stores.get(shard);

    if (!store) throw new Error("Shard not available");

    const indexedEvent = {
      ...event,
      sequence: this.index.assign(event),
    } as IndexedSILEvent;

    await store.append(indexedEvent);
  }

  async readAll(tenantId: string, sessionId: string): Promise<SILEvent[]> {
    const shard = this.shardRouter.getShard(tenantId);
    const store = this.stores.get(shard);
    
    if (!store) throw new Error("Shard not available");

    const events = await store.readAll(tenantId, sessionId) as IndexedSILEvent[];

    return events.sort((a, b) => a.sequence - b.sequence);
  }

  // Pass-through other methods for now, assuming they route to the shard
  async readAfter(tenantId: string, sessionId: string, pointer: number): Promise<SILEvent[]> {
    const events = await this.readAll(tenantId, sessionId);
    return events.slice(pointer + 1);
  }

  async hasEvent(tenantId: string, sessionId: string, eventId: string): Promise<boolean> {
    const shard = this.shardRouter.getShard(tenantId);
    const store = this.stores.get(shard);
    if (!store) return false;
    return store.hasEvent(tenantId, sessionId, eventId);
  }

  async getCheckpoint(tenantId: string, sessionId: string): Promise<SILCheckpoint | null> {
    const shard = this.shardRouter.getShard(tenantId);
    const store = this.stores.get(shard);
    if (!store) return null;
    return store.getCheckpoint(tenantId, sessionId);
  }

  async saveCheckpoint(tenantId: string, checkpoint: SILCheckpoint): Promise<void> {
    const shard = this.shardRouter.getShard(tenantId);
    const store = this.stores.get(shard);
    if (!store) throw new Error("Shard not available");
    return store.saveCheckpoint(tenantId, checkpoint);
  }
}
