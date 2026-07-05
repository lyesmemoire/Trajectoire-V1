import { OutboxRepository } from "./OutboxRepository";
import { PlatformEvent } from "../../events/base.event";
import prisma from "@/lib/prisma";

export class PrismaOutboxRepository implements OutboxRepository {
  async save(event: PlatformEvent): Promise<void> {
    await prisma.outboxEvent.create({
      data: {
        eventId: event.eventId,
        eventType: event.type,
        correlationId: event.correlationId,
        aggregateId: event.aggregateId,
        causationId: event.causationId,
        payload: event.payload as any,
        metadata: event.metadata as any,
        occurredAt: event.occurredAt,
        availableAt: new Date(),
      }
    });
  }

  async fetchUnprocessed(limit: number): Promise<PlatformEvent[]> {
    const records = await prisma.outboxEvent.findMany({
      where: {
        processedAt: null,
        availableAt: { lte: new Date() },
        attempts: { lt: 5 } // Max 5 retry attempts
      },
      orderBy: { occurredAt: 'asc' },
      take: limit
    });

    return records.map(r => ({
      eventId: r.eventId,
      type: r.eventType,
      correlationId: r.correlationId,
      causationId: r.causationId ?? undefined,
      aggregateId: r.aggregateId || "",
      version: 1, // default
      payload: r.payload as any,
      metadata: r.metadata as any || {},
      occurredAt: r.occurredAt
    }));
  }

  async markAsProcessed(eventId: string): Promise<void> {
    await prisma.outboxEvent.update({
      where: { eventId },
      data: { processedAt: new Date() }
    });
  }

  async markAsFailed(eventId: string, error: string): Promise<void> {
    const event = await prisma.outboxEvent.findUnique({ where: { eventId } });
    if (!event) return;

    const newAttempts = event.attempts + 1;
    
    if (newAttempts >= 5) {
      // Move to dead-letter after max retries
      await this.moveToDeadLetter(eventId, error);
    } else {
      await prisma.outboxEvent.update({
        where: { eventId },
        data: { 
          attempts: { increment: 1 },
          lastError: error
        }
      });
    }
  }

  async moveToDeadLetter(eventId: string, error: string): Promise<void> {
    const event = await prisma.outboxEvent.findUnique({ where: { eventId } });
    if (!event) return;

    // TODO: Create deadLetterEvent table in Prisma schema
    // For now, just mark as failed with high attempt count
    await prisma.outboxEvent.update({
      where: { eventId },
      data: {
        attempts: 999, // Mark as permanently failed
        lastError: `[DEAD-LETTER] ${error}`,
      }
    });
    
    // Copy to dead-letter table (when table exists)
    // await prisma.deadLetterEvent.create({
    //   data: {
    //     eventId: event.eventId,
    //     eventType: event.eventType,
    //     correlationId: event.correlationId,
    //     aggregateId: event.aggregateId,
    //     causationId: event.causationId,
    //     payload: event.payload,
    //     metadata: event.metadata,
    //     occurredAt: event.occurredAt,
    //     lastError: error,
    //     attempts: event.attempts,
    //     movedAt: new Date(),
    //   }
    // });

    // Delete from outbox (when dead-letter table exists)
    // await prisma.outboxEvent.delete({ where: { eventId } });
  }
}
