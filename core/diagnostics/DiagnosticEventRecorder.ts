/**
 * Diagnostic Event Recorder
 *
 * Passive event recorder that captures all diagnostic events.
 * No business logic, no state modification, only observation.
 */

import { DiagnosticEvent } from "./types";

export class DiagnosticEventRecorder {
  private events: DiagnosticEvent[] = [];
  private maxEvents: number;
  private eventCounter: number = 0;

  constructor(maxEvents: number = 10000) {
    this.maxEvents = maxEvents;
  }

  /**
   * Record a diagnostic event
   */
  recordEvent(
    source: DiagnosticEvent["source"],
    eventType: string,
    data: Record<string, unknown>
  ): void {
    const event: DiagnosticEvent = {
      id: `evt_${this.eventCounter++}_${Date.now()}`,
      source,
      eventType,
      timestamp: new Date(),
      data,
    };

    this.events.push(event);

    // Maintain max events limit (FIFO)
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }
  }

  /**
   * Get all events
   */
  getEvents(): DiagnosticEvent[] {
    return [...this.events];
  }

  /**
   * Get events by source
   */
  getEventsBySource(source: DiagnosticEvent["source"]): DiagnosticEvent[] {
    return this.events.filter(e => e.source === source);
  }

  /**
   * Get events by type
   */
  getEventsByType(eventType: string): DiagnosticEvent[] {
    return this.events.filter(e => e.eventType === eventType);
  }

  /**
   * Get events in time range
   */
  getEventsInTimeRange(start: Date, end: Date): DiagnosticEvent[] {
    return this.events.filter(
      e => e.timestamp >= start && e.timestamp <= end
    );
  }

  /**
   * Get recent events
   */
  getRecentEvents(count: number): DiagnosticEvent[] {
    return this.events.slice(-count);
  }

  /**
   * Clear all events
   */
  clearEvents(): void {
    this.events = [];
    this.eventCounter = 0;
  }

  /**
   * Get event count
   */
  getEventCount(): number {
    return this.events.length;
  }
}
