import { PrismaClient } from "@prisma/client";
import { PrismaRepository } from "@/lib/core/infrastructure/base/PrismaRepository";
import { CareerTimelineRepositoryPort } from "../../ports/career-timeline-repository.port";
import { TimelineEvent } from "../../domain/entities/career-timeline.entity";
import { Result, ok } from "@/lib/core/result";

export class PrismaCareerTimelineRepository extends PrismaRepository implements CareerTimelineRepositoryPort {
  constructor(private readonly prismaClient: PrismaClient) {
    super();
  }

  protected get db() {
    return this.prismaClient;
  }

  async getById(id: string): Promise<Result<TimelineEvent>> {
    return this.safeExecute(async () => {
      // Timeline events are stored in Journey data field
      const journeys = await (this.db as any).journey.findMany();

      for (const journey of journeys) {
        const data = journey.data as { timelineEvents?: TimelineEvent[] };
        if (data.timelineEvents && Array.isArray(data.timelineEvents)) {
          const event = data.timelineEvents.find((e) => e.id === id);
          if (event) {
            return {
              id: event.id,
              userId: event.userId,
              eventType: event.eventType,
              timestamp: new Date(event.timestamp),
              metadata: event.metadata
            };
          }
        }
      }

      throw new Error("Timeline event not found");
    });
  }

  async findByUserId(userId: string): Promise<TimelineEvent[]> {
    const result = await this.safeExecute(async () => {
      const journeys = await (this.db as any).journey.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" }
      });

      const events: TimelineEvent[] = [];

      for (const journey of journeys) {
        const data = journey.data as { timelineEvents?: TimelineEvent[] };
        if (data.timelineEvents && Array.isArray(data.timelineEvents)) {
          events.push(...data.timelineEvents.map((e) => ({
            id: e.id,
            userId: e.userId,
            eventType: e.eventType,
            timestamp: new Date(e.timestamp),
            metadata: e.metadata
          })));
        }
      }

      return events;
    });

    return result.isSuccess() ? result.unwrap() : [];
  }

  async findByUserIdAndEventType(userId: string, eventType: TimelineEvent["eventType"]): Promise<TimelineEvent[]> {
    const allEvents = await this.findByUserId(userId);
    return allEvents.filter(e => e.eventType === eventType);
  }

  async findRecentByUserId(userId: string, limit: number): Promise<TimelineEvent[]> {
    const allEvents = await this.findByUserId(userId);
    return allEvents.slice(0, limit);
  }

  async save(event: TimelineEvent): Promise<Result<void>> {
    return this.safeExecute(async () => {
      // Store timeline event in Journey data field
      const existingJourney = await (this.db as any).journey.findFirst({
        where: { userId: event.userId }
      });

      if (existingJourney) {
        const data = existingJourney.data as { timelineEvents?: TimelineEvent[] };
        if (!data.timelineEvents) {
          data.timelineEvents = [];
        }
        data.timelineEvents.push(event);

        await (this.db as any).journey.update({
          where: { id: existingJourney.id },
          data: { data }
        });
      } else {
        // Create a new journey if none exists for this user
        await (this.db as any).journey.create({
          data: {
            userId: event.userId,
            currentStep: "timeline",
            status: "active",
            data: {
              timelineEvents: [event]
            }
          }
        });
      }
    });
  }

  async delete(id: string): Promise<Result<void>> {
    return this.safeExecute(async () => {
      const journeys = await (this.db as any).journey.findMany();

      for (const journey of journeys) {
        const data = journey.data as { timelineEvents?: TimelineEvent[] };
        if (data.timelineEvents && Array.isArray(data.timelineEvents)) {
          const index = data.timelineEvents.findIndex((e) => e.id === id);
          if (index !== -1) {
            data.timelineEvents.splice(index, 1);
            await (this.db as any).journey.update({
              where: { id: journey.id },
              data: { data }
            });
            break;
          }
        }
      }
    });
  }
}
