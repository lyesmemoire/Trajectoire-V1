/**
 * Brain Timeline
 *
 * Visualizes the chronological progression of AI observations and insights.
 */

export interface TimelineEvent {
  id: string;
  timestamp: Date;
  type: "observation" | "insight" | "goal" | "milestone";
  title: string;
  description: string;
  impact: "low" | "medium" | "high";
  relatedIds: string[];
}

export class BrainTimeline {
  private events: TimelineEvent[] = [];

  /**
   * Add a timeline event
   */
  addEvent(event: Omit<TimelineEvent, "id">): TimelineEvent {
    const fullEvent: TimelineEvent = {
      ...event,
      id: this.generateId(),
    };

    this.events.push(fullEvent);
    return fullEvent;
  }

  /**
   * Get all events
   */
  getEvents(): TimelineEvent[] {
    return [...this.events].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  /**
   * Get events by type
   */
  getEventsByType(type: TimelineEvent["type"]): TimelineEvent[] {
    return this.getEvents().filter((e) => e.type === type);
  }

  /**
   * Get events by impact
   */
  getEventsByImpact(impact: TimelineEvent["impact"]): TimelineEvent[] {
    return this.getEvents().filter((e) => e.impact === impact);
  }

  /**
   * Get high-impact events
   */
  getHighImpactEvents(): TimelineEvent[] {
    return this.getEventsByImpact("high");
  }

  /**
   * Get events in date range
   */
  getEventsByDateRange(start: Date, end: Date): TimelineEvent[] {
    return this.getEvents().filter((e) => e.timestamp >= start && e.timestamp <= end);
  }

  /**
   * Get timeline summary
   */
  getSummary(): {
    totalEvents: number;
    byType: Record<string, number>;
    byImpact: Record<string, number>;
    highImpactCount: number;
  } {
    const events = this.getEvents();
    const byType: Record<string, number> = {};
    const byImpact: Record<string, number> = {};

    for (const event of events) {
      byType[event.type] = (byType[event.type] || 0) + 1;
      byImpact[event.impact] = (byImpact[event.impact] || 0) + 1;
    }

    return {
      totalEvents: events.length,
      byType,
      byImpact,
      highImpactCount: this.getHighImpactEvents().length,
    };
  }

  /**
   * Clear all events
   */
  clear(): void {
    this.events = [];
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
