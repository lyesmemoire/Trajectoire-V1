// ===================================================================
// TEMPORAL EXTRACTOR — Pure Orchestrator (no business logic)
// ===================================================================

import { TemporalCatalog } from "./TemporalCatalog";

export interface TemporalExtractionInput {
  observations: any[];
  sessionId: string;
}

export interface TemporalEvent {
  id: string;
  observationId: string;
  eventType: string;
  timestamp?: Date;
  startDate?: Date;
  endDate?: Date;
  duration?: number;
  description: string;
  confidence: number;
  temporalExpressions: string[];
}

export interface TemporalExtractionResult {
  events: TemporalEvent[];
  timeline: TemporalEvent[];
  metadata: {
    totalEvents: number;
    withTimestamp: number;
    withDuration: number;
        averageConfidence: number;
  };
}

export class TemporalExtractor {
  private readonly promptVersion: string;
  private readonly provider: string;

  constructor(promptVersion: string = "1.0.0", provider: string = "openai") {
    this.promptVersion = promptVersion;
    this.provider = provider;
  }

  /**
   * Extract temporal information from observations using LLM
   * This is a placeholder for actual LLM integration
   */
  async extract(input: TemporalExtractionInput): Promise<TemporalExtractionResult> {
    const events: TemporalEvent[] = [];

    for (const observation of input.observations) {
      const content = observation.data?.content || observation.content || "";
      const temporalInfo = await this.extractFromContent(content, observation.id);
      
      if (temporalInfo) {
        events.push(temporalInfo);
      }
    }

    // Build timeline by sorting events by timestamp
    const timeline = this.buildTimeline(events);

    const withTimestamp = events.filter(e => e.timestamp || e.startDate).length;
    const withDuration = events.filter(e => e.duration).length;
    const averageConfidence = events.reduce((sum, e) => sum + e.confidence, 0) / (events.length || 1);

    return {
      events,
      timeline,
      metadata: {
        totalEvents: events.length,
        withTimestamp,
        withDuration,
        averageConfidence,
      },
    };
  }

  /**
   * Extract temporal information from a single content using TemporalCatalog
   */
  private async extractFromContent(content: string, observationId: string): Promise<TemporalEvent | null> {
    // Delegate all business logic to TemporalCatalog
    const temporalExpressions = TemporalCatalog.extractTemporalExpressions(content);
    
    if (temporalExpressions.length === 0) {
      return null;
    }

    const timestamp = TemporalCatalog.parseTimestamp(content);
    const duration = TemporalCatalog.parseDuration(content);
    const eventType = TemporalCatalog.inferEventType(content);
    const confidence = TemporalCatalog.calculateConfidence(temporalExpressions, timestamp, duration);
    
    return {
      id: crypto.randomUUID(),
      observationId,
      eventType,
      timestamp,
      duration,
      description: content,
      confidence,
      temporalExpressions,
    };
  }

  /**
   * Build timeline by sorting events chronologically
   */
  private buildTimeline(events: TemporalEvent[]): TemporalEvent[] {
    return [...events].sort((a, b) => {
      const timeA = a.timestamp?.getTime() || a.startDate?.getTime() || 0;
      const timeB = b.timestamp?.getTime() || b.startDate?.getTime() || 0;
      return timeA - timeB;
    });
  }

  getPromptVersion(): string {
    return this.promptVersion;
  }

  getProvider(): string {
    return this.provider;
  }
}
