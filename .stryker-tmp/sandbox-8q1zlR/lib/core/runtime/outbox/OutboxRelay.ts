// @ts-nocheck
import { OutboxRepository } from "./OutboxRepository";
import { EventDispatcher } from "../event-dispatcher/EventDispatcher";
import { LoggerProvider } from "../../observability/logger";

export class OutboxRelay {
  private log = LoggerProvider.getLogger();

  constructor(
    private readonly repository: OutboxRepository,
    private readonly dispatcher: EventDispatcher
  ) {}

  async processBatch(limit: number = 50): Promise<void> {
    const events = await this.repository.fetchUnprocessed(limit);
    if (events.length === 0) return;

    this.log.info(`Processing ${events.length} outbox events...`);

    for (const event of events) {
      try {
        await this.dispatcher.dispatch(event);
        await this.repository.markAsProcessed(event.eventId);
        this.log.debug(`Processed outbox event ${event.eventId}`);
      } catch (error: any) {
        this.log.error(`Failed to process outbox event ${event.eventId}`, error, { eventId: event.eventId });
        await this.repository.markAsFailed(event.eventId, error.message);
      }
    }
  }

  /**
   * Process events that have exceeded max retries and moved to dead-letter.
   * This can be used for manual inspection or reprocessing.
   */
  async processDeadLetter(limit: number = 50): Promise<void> {
    // This would require a DeadLetterRepository interface
    // For now, events are moved to dead-letter table for manual inspection
    this.log.warn("Dead-letter processing not yet implemented. Events moved to dead-letter table for manual inspection.");
  }
}
