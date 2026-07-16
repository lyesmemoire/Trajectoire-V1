/**
 * Message sequencer for ordering guarantees.
 * Assigns monotonic sequence numbers and queues messages during disconnection.
 */

import type { InboundMessage } from "../types/protocol.js";

interface QueuedMessage {
  readonly sequence: number;
  readonly payload: string;
  readonly enqueuedAt: number;
}

export class MessageSequencer {
  private sequence: number = 0;
  private readonly queue: QueuedMessage[] = [];
  private readonly maxQueueSize: number;
  private readonly maxAgeMs: number;

  constructor(maxQueueSize: number = 100, maxAgeMs: number = 30_000) {
    this.maxQueueSize = maxQueueSize;
    this.maxAgeMs = maxAgeMs;
  }

  nextSequence(): number {
    this.sequence += 1;
    return this.sequence;
  }

  enqueue(message: InboundMessage): void {
    const payload = JSON.stringify(message);
    const entry: QueuedMessage = {
      sequence: this.nextSequence(),
      payload,
      enqueuedAt: Date.now(),
    };

    if (this.queue.length >= this.maxQueueSize) {
      // Drop oldest message
      this.queue.shift();
    }

    this.queue.push(entry);
  }

  drain(): readonly string[] {
    const now = Date.now();
    const valid = this.queue
      .filter((msg) => now - msg.enqueuedAt < this.maxAgeMs)
      .sort((a, b) => a.sequence - b.sequence)
      .map((msg) => msg.payload);

    this.queue.length = 0;
    return Object.freeze(valid);
  }

  get pendingCount(): number {
    return this.queue.length;
  }

  get currentSequence(): number {
    return this.sequence;
  }

  reset(): void {
    this.sequence = 0;
    this.queue.length = 0;
  }
}
