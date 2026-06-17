import { PostgresEventStore } from "./postgres-event-store";
import { SILEvent } from "../../contracts/sil-events";

export class BatchedEventWriter {
  private buffer: SILEvent[] = [];
  private timer?: NodeJS.Timeout;

  constructor(
    private store: PostgresEventStore,
    private flushSize = 100,
    private flushMs = 50
  ) {}

  write(event: SILEvent) {
    this.buffer.push(event);

    if (this.buffer.length >= this.flushSize) {
      this.flush();
      return;
    }

    if (!this.timer) {
      this.timer = setTimeout(() => this.flush(), this.flushMs);
    }
  }

  async flush() {
    if (this.buffer.length === 0) return;
    
    const batch = this.buffer;
    this.buffer = [];
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }

    try {
      await this.store.bulkInsert(batch);
    } catch (err) {
      console.error("[BatchedEventWriter] Flush failed", err);
      // In a production system, implement a DLQ or retry mechanism here
    }
  }
}
