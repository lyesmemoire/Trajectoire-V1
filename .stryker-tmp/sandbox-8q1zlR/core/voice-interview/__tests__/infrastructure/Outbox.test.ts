// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import type { EventEnvelope } from '../../../domain/events/DomainEvent.js';
import type { EventPublisherPort } from '../../../application/ports/index.js';

// Simulation of an Outbox Worker
class OutboxWorker {
  private readonly outbox: EventEnvelope[] = [];

  constructor(private publisher: EventPublisherPort) {}

  public async saveToOutbox(events: EventEnvelope[]): Promise<void> {
    this.outbox.push(...events);
  }

  public async processPending(): Promise<void> {
    const pending = [...this.outbox];
    for (const evt of pending) {
      try {
        await this.publisher.publish([evt]);
        // Remove from outbox if successful
        const idx = this.outbox.indexOf(evt);
        if (idx > -1) this.outbox.splice(idx, 1);
      } catch (err) {
        // Leave in outbox for retry
        console.error('Publish failed for event', evt.eventId);
      }
    }
  }

  public getPendingCount(): number {
    return this.outbox.length;
  }
}

describe('Outbox Pattern', () => {
  it('should keep events in outbox on publish failure and clear them on retry success', async () => {
    let failMode = true;
    const mockPublisher: EventPublisherPort = {
      publish: vi.fn().mockImplementation(async () => {
        if (failMode) throw new Error('Network error');
        return;
      }),
      onPublish: vi.fn()
    };

    const worker = new OutboxWorker(mockPublisher);

    const dummyEvent: EventEnvelope = {
      eventId: 'evt-1',
      type: 'InterviewSessionStarted',
      timestamp: new Date(),
      payload: {},
      version: 1,
      aggregateVersion: 1,
      schemaVersion: 1,
      correlationId: 'c1'
    };

    // 1. Transaction commits, event is saved to outbox
    await worker.saveToOutbox([dummyEvent]);
    expect(worker.getPendingCount()).toBe(1);

    // 2. Background worker attempts to process, but network fails
    await worker.processPending();
    expect(mockPublisher.publish).toHaveBeenCalledTimes(1);
    expect(worker.getPendingCount()).toBe(1); // Event remains in outbox!

    // 3. Network recovers, next background worker tick
    failMode = false;
    await worker.processPending();
    expect(mockPublisher.publish).toHaveBeenCalledTimes(2);
    expect(worker.getPendingCount()).toBe(0); // Event published and removed
  });
});
