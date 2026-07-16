/**
 * Brain Events
 *
 * Tracks significant events in the candidate's AI journey.
 */

export interface BrainEvent {
  id: string;
  timestamp: Date;
  type: "observation" | "insight" | "goal_created" | "goal_achieved" | "contradiction" | "progress" | "regression";
  description: string;
  relatedId?: string; // ID of related observation, insight, or goal
  severity: "info" | "warning" | "error" | "success";
  metadata?: Record<string, unknown>;
}

export class BrainEvents {
  private events: BrainEvent[] = [];

  /**
   * Add an event
   */
  addEvent(event: Omit<BrainEvent, "id">): BrainEvent {
    const fullEvent: BrainEvent = {
      ...event,
      id: this.generateId(),
    };

    this.events.push(fullEvent);
    return fullEvent;
  }

  /**
   * Get all events
   */
  getEvents(): BrainEvent[] {
    return [...this.events];
  }

  /**
   * Get events by type
   */
  getEventsByType(type: BrainEvent["type"]): BrainEvent[] {
    return this.events.filter((e) => e.type === type);
  }

  /**
   * Get events by severity
   */
  getEventsBySeverity(severity: BrainEvent["severity"]): BrainEvent[] {
    return this.events.filter((e) => e.severity === severity);
  }

  /**
   * Get events in date range
   */
  getEventsByDateRange(start: Date, end: Date): BrainEvent[] {
    return this.events.filter((e) => e.timestamp >= start && e.timestamp <= end);
  }

  /**
   * Get recent events
   */
  getRecentEvents(limit: number = 10): BrainEvent[] {
    return this.events
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Get events related to a specific ID
   */
  getEventsByRelatedId(relatedId: string): BrainEvent[] {
    return this.events.filter((e) => e.relatedId === relatedId);
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
