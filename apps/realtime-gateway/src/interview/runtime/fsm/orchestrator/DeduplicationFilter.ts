import type { InterviewRuntimeEvent } from "../types/InterviewRuntimeEvent";

/**
 * Ensures exactly-once processing of events by maintaining a sliding window of recent event IDs.
 * Used by RuntimeOrchestrator to reject duplicate transitions.
 */
export class DeduplicationFilter {
  private readonly windowSize: number;
  private readonly recentEvents: Set<string>;
  private readonly eventOrder: string[]; // To efficiently manage the sliding window

  constructor(windowSize: number = 1000) {
    this.windowSize = windowSize;
    this.recentEvents = new Set();
    this.eventOrder = [];
  }

  /**
   * Check if an event has already been processed.
   * If not, returns a new instance of the filter with the event added.
   * @returns [isDuplicate, nextFilter]
   */
  public checkAndAdd(event: InterviewRuntimeEvent): [boolean, DeduplicationFilter] {
    if (this.recentEvents.has(event.eventId)) {
      return [true, this];
    }

    const nextEvents = new Set(this.recentEvents);
    const nextOrder = [...this.eventOrder];

    nextEvents.add(event.eventId);
    nextOrder.push(event.eventId);

    // Maintain window size
    if (nextOrder.length > this.windowSize) {
      const oldest = nextOrder.shift();
      if (oldest) {
        nextEvents.delete(oldest);
      }
    }

    const nextFilter = new DeduplicationFilter(this.windowSize);
    // Bypass constructor initialization for performance
    (nextFilter as any).recentEvents = nextEvents;
    (nextFilter as any).eventOrder = nextOrder;

    return [false, nextFilter];
  }

  /**
   * Query without mutating the filter.
   */
  public has(eventId: string): boolean {
    return this.recentEvents.has(eventId);
  }
}
