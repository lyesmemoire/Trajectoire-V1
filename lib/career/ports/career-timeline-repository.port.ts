import { TimelineEvent } from "../domain/entities/career-timeline.entity";
import { Repository } from "@/lib/core/infrastructure/base/Repository";

export interface CareerTimelineRepositoryPort extends Repository<TimelineEvent> {
  findByUserId(userId: string): Promise<TimelineEvent[]>;
  findByUserIdAndEventType(userId: string, eventType: TimelineEvent["eventType"]): Promise<TimelineEvent[]>;
  findRecentByUserId(userId: string, limit: number): Promise<TimelineEvent[]>;
}
