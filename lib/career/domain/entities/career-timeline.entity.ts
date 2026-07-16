import { Clock } from "@/lib/core/clock/Clock";

export interface TimelineEvent {
  id: string;
  userId: string;
  eventType: "cv_uploaded" | "profile_extracted" | "job_offer_imported" | "ats_completed" | "cv_optimized" | "interview_started" | "interview_completed" | "report_generated" | "copilot_updated";
  timestamp: Date;
  metadata: Record<string, unknown>;
}

export class CareerTimeline {
  private events: TimelineEvent[] = [];

  constructor(private readonly clock: Clock) {}

  addEvent(userId: string, eventType: TimelineEvent["eventType"], metadata: Record<string, unknown> = {}): TimelineEvent {
    const event: TimelineEvent = {
      id: `${eventType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      eventType,
      timestamp: this.clock.now(),
      metadata
    };

    this.events.push(event);
    return event;
  }

  getEvents(userId: string): TimelineEvent[] {
    return this.events.filter(e => e.userId === userId).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  getEventsByType(userId: string, eventType: TimelineEvent["eventType"]): TimelineEvent[] {
    return this.events.filter(e => e.userId === userId && e.eventType === eventType);
  }

  getRecentEvents(userId: string, limit: number = 10): TimelineEvent[] {
    return this.getEvents(userId).slice(0, limit);
  }

  clear(): void {
    this.events = [];
  }
}
