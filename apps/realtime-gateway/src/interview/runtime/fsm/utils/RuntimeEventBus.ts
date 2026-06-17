// src/interview/runtime/fsm/utils/RuntimeEventBus.ts

import { InMemoryRuntimeEventStore } from "./InMemoryRuntimeEventStore";
import type { InterviewRuntimeEvent } from "../types/InterviewRuntimeEvent";
import { computeEventHash } from "./computeEventHash";
import { versionedHash } from "./versionedHash";

/** Pure, immutable event bus with incremental replay hash */
export class RuntimeEventBus {
  private readonly store: InMemoryRuntimeEventStore;
  private readonly _replayHash: string;
  private readonly _lastSequence: number;

  /** Initialize with optional store, hash and sequence (used for snapshot restoration) */
  constructor(
    store?: InMemoryRuntimeEventStore,
    replayHash: string = "",
    lastSequence: number = 0,
  ) {
    this.store = store ?? new InMemoryRuntimeEventStore();
    this._replayHash = replayHash;
    this._lastSequence = lastSequence;
  }

  /** Append a single event – returns a new RuntimeEventBus instance with updated hash and sequence */
  public append(event: InterviewRuntimeEvent): RuntimeEventBus {
    const eventHash = computeEventHash(event);
    const nextHash = versionedHash({
      previousHash: this._replayHash,
      eventHash,
    }) as string;
    const nextStore = this.store.append(event);
    return new RuntimeEventBus(nextStore, nextHash, this._lastSequence + 1);
  }

  /** Append a batch of events – returns a new RuntimeEventBus instance */
  public appendBatch(events: readonly InterviewRuntimeEvent[]): RuntimeEventBus {
    let hash = this._replayHash;
    let seq = this._lastSequence;
    let nextStore = this.store;
    for (const ev of events) {
      const evHash = computeEventHash(ev);
      hash = versionedHash({ previousHash: hash, eventHash: evHash }) as string;
      nextStore = nextStore.append(ev);
      seq++;
    }
    return new RuntimeEventBus(nextStore, hash, seq);
  }

  /** Retrieve the last event (deep‑frozen) */
  public getLastEvent(): InterviewRuntimeEvent | undefined {
    const all = this.store.getAll();
    return all[all.length - 1];
  }

  /** Current sequence number (1‑based) */
  public getLastSequence(): number {
    return this._lastSequence;
  }

  /** Incremental deterministic session replay hash */
  public getSessionReplayHash(): string {
    return this._replayHash;
  }

  /** Serialize the stored events deterministically */
  public serialize(): string {
    // Use a stable JSON stringify (sorted keys) for deterministic output
    const stableStringify = (obj: any): string =>
      JSON.stringify(obj, Object.keys(obj).sort());
    return stableStringify(this.store.getAll());
  }
}

