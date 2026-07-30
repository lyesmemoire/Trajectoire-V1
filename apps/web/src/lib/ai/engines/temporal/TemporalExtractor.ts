// ===================================================================
// TEMPORAL EXTRACTOR — LLM-based Temporal Information Extraction
// ===================================================================

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
   * Extract temporal information from a single content using LLM
   * Placeholder for actual LLM call
   */
  private async extractFromContent(content: string, observationId: string): Promise<TemporalEvent | null> {
    // Simple rule-based extraction as placeholder
    // In production, this would use LLM with structured output
    
    const temporalExpressions = this.extractTemporalExpressions(content);
    
    if (temporalExpressions.length === 0) {
      return null;
    }

    const timestamp = this.parseTimestamp(content);
    const duration = this.parseDuration(content);
    
    return {
      id: crypto.randomUUID(),
      observationId,
      eventType: this.inferEventType(content),
      timestamp,
      duration,
      description: content,
      confidence: this.calculateConfidence(temporalExpressions, timestamp, duration),
      temporalExpressions,
    };
  }

  /**
   * Extract temporal expressions from content
   * Placeholder for NLP-based extraction
   */
  private extractTemporalExpressions(content: string): string[] {
    const expressions: string[] = [];
    
    // Common temporal patterns
    const patterns = [
      /\d{4}/g, // Years
      /\d{1,2}\/\d{1,2}\/\d{4}/g, // Dates
      /\d{1,2}\/\d{1,2}/g, // Month/Day
      /\d{1,2} years?/gi,
      /\d{1,2} months?/gi,
      /\d{1,2} weeks?/gi,
      /\d{1,2} days?/gi,
      /\d{1,2} hours?/gi,
      /january|february|march|april|may|june|july|august|september|october|november|december/gi,
      /monday|tuesday|wednesday|thursday|friday|saturday|sunday/gi,
      /yesterday|today|tomorrow/gi,
      /last week|last month|last year/gi,
      /next week|next month|next year/gi,
    ];

    for (const pattern of patterns) {
      const matches = content.match(pattern);
      if (matches) {
        expressions.push(...matches);
      }
    }

    return [...new Set(expressions.map(e => e.toLowerCase()))];
  }

  /**
   * Parse timestamp from content
   */
  private parseTimestamp(content: string): Date | undefined {
    const yearMatch = content.match(/\b(20\d{2}|19\d{2})\b/);
    if (yearMatch) {
      return new Date(parseInt(yearMatch[1]), 0, 1);
    }
    return undefined;
  }

  /**
   * Parse duration from content
   */
  private parseDuration(content: string): number | undefined {
    const yearMatch = content.match(/(\d+)\s*years?/i);
    if (yearMatch) {
      return parseInt(yearMatch[1]) * 365 * 24 * 60 * 60 * 1000; // Convert to ms
    }
    
    const monthMatch = content.match(/(\d+)\s*months?/i);
    if (monthMatch) {
      return parseInt(monthMatch[1]) * 30 * 24 * 60 * 60 * 1000;
    }
    
    const weekMatch = content.match(/(\d+)\s*weeks?/i);
    if (weekMatch) {
      return parseInt(weekMatch[1]) * 7 * 24 * 60 * 60 * 1000;
    }
    
    return undefined;
  }

  /**
   * Infer event type from content
   */
  private inferEventType(content: string): string {
    const lower = content.toLowerCase();
    
    if (lower.includes("worked") || lower.includes("job") || lower.includes("position")) {
      return "employment";
    }
    if (lower.includes("project") || lower.includes("migration") || lower.includes("deployment")) {
      return "project";
    }
    if (lower.includes("learned") || lower.includes("studied") || lower.includes("training")) {
      return "learning";
    }
    if (lower.includes("incident") || lower.includes("outage") || lower.includes("failure")) {
      return "incident";
    }
    
    return "general";
  }

  /**
   * Calculate confidence based on extracted information
   */
  private calculateConfidence(expressions: string[], timestamp?: Date, duration?: number): number {
    let confidence = 0.5;
    
    if (expressions.length > 0) {
      confidence += 0.2 * Math.min(expressions.length, 3) / 3;
    }
    
    if (timestamp) {
      confidence += 0.2;
    }
    
    if (duration) {
      confidence += 0.1;
    }
    
    return Math.min(confidence, 1.0);
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
