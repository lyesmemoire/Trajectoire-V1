
/**
 * AI Timeline Engine
 * Complete timeline of all AI decisions and evolutions
 */

import {
  TimelineEventType,
  TimelineEvent,
  TimelineSegment,
  TimelineComparison,
  TimelineAnalysis,
  TimelineMetrics,
  AITimelineEngineConfig,
  defaultAITimelineEngineConfig,
} from "./interfaces/IAITimelineEngine";

// ============================================================================
// AI TIMELINE ENGINE CLASS
// ============================================================================

export class AITimelineEngine {
  private static instance: AITimelineEngine;
  private config: AITimelineEngineConfig;
  private events: Map<string, TimelineEvent> = new Map();
  private segments: Map<string, TimelineSegment> = new Map();
  private comparisons: Map<string, TimelineComparison> = new Map();
  private analyses: Map<string, TimelineAnalysis> = new Map();

  private constructor() {
    this.config = defaultAITimelineEngineConfig;
  }

  static getInstance(): AITimelineEngine {
    if (!AITimelineEngine.instance) {
      AITimelineEngine.instance = new AITimelineEngine();
    }
    return AITimelineEngine.instance;
  }

  /**
   * Set configuration
   */
  setConfig(config: Partial<AITimelineEngineConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Add event
   */
  addEvent(userId: string, eventType: TimelineEventType, description: string, data: Record<string, unknown>, impact: number = 0.5, confidence: number = 0.8): string {
    const eventId = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const event: TimelineEvent = {
      id: eventId,
      userId,
      eventType,
      timestamp: new Date(),
      description,
      data,
      impact,
      confidence,
      relatedEvents: [],
      metadata: {},
    };

    this.events.set(eventId, event);

    // Auto-segment if enabled
    if (this.config.enableAutoSegmentation) {
      this.autoSegment(userId);
    }

    // Auto-analyze if enabled
    if (this.config.enableAutoAnalysis) {
      this.autoAnalyze(userId);
    }

    return eventId;
  }

  /**
   * Auto segment
   */
  private autoSegment(userId: string): void {
    const userEvents = Array.from(this.events.values()).filter(event => event.userId === userId);
    const sortedEvents = userEvents.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    if (sortedEvents.length === 0) return;

    const latestEvent = sortedEvents[sortedEvents.length - 1];
    const segmentId = `segment_${userId}_${latestEvent.timestamp.getTime()}`;

    // Check if segment exists
    const existingSegment = this.segments.get(segmentId);
    if (existingSegment) {
      existingSegment.events.push(latestEvent);
      existingSegment.endTime = new Date();
    } else {
      // Create new segment
      const segment: TimelineSegment = {
        id: segmentId,
        userId,
        startTime: latestEvent.timestamp,
        endTime: new Date(),
        events: [latestEvent],
        summary: "",
        keyInsights: [],
        evolution: "",
      };

      this.segments.set(segmentId, segment);
    }

    // Update segment summary
    this.updateSegmentSummary(segmentId);
  }

  /**
   * Update segment summary
   */
  private updateSegmentSummary(segmentId: string): void {
    const segment = this.segments.get(segmentId);
    if (!segment) return;

    const eventTypes = segment.events.map(event => event.eventType);
    const eventCount = segment.events.length;
    const averageImpact = segment.events.reduce((sum, event) => sum + event.impact, 0) / eventCount;

    segment.summary = `${eventCount} events including ${eventTypes.join(", ")}. Average impact: ${(averageImpact * 100).toFixed(0)}%.`;

    // Generate key insights
    segment.keyInsights = this.generateKeyInsights(segment);

    // Generate evolution
    segment.evolution = this.generateEvolution(segment);
  }

  /**
   * Generate key insights
   */
  private generateKeyInsights(segment: TimelineSegment): string[] {
    const insights: string[] = [];

    const eventTypes = segment.events.map(event => event.eventType);
    const typeCounts: Record<string, number> = {};
    eventTypes.forEach(type => {
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    // Most frequent event type
    const mostFrequentType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0];
    if (mostFrequentType) {
      insights.push(`Most frequent activity: ${mostFrequentType[0]} (${mostFrequentType[1]} times)`);
    }

    // High impact events
    const highImpactEvents = segment.events.filter(event => event.impact > 0.8);
    if (highImpactEvents.length > 0) {
      insights.push(`${highImpactEvents.length} high-impact events detected`);
    }

    // Errors
    const errors = segment.events.filter(event => event.eventType === "error");
    if (errors.length > 0) {
      insights.push(`${errors.length} errors encountered`);
    }

    // Improvements
    const improvements = segment.events.filter(event => event.eventType === "improvement");
    if (improvements.length > 0) {
      insights.push(`${improvements.length} improvements made`);
    }

    return insights;
  }

  /**
   * Generate evolution
   */
  private generateEvolution(segment: TimelineSegment): string {
    const improvements = segment.events.filter(event => event.eventType === "improvement").length;
    const errors = segment.events.filter(event => event.eventType === "error").length;

    if (improvements > errors) {
      return "Positive evolution with more improvements than errors";
    } else if (errors > improvements) {
      return "Challenging evolution with more errors than improvements";
    } else {
      return "Stable evolution with balanced improvements and errors";
    }
  }

  /**
   * Auto analyze
   */
  private autoAnalyze(userId: string): void {
    const analysisId = `analysis_${userId}_${Date.now()}`;

    const userEvents = Array.from(this.events.values()).filter(event => event.userId === userId);
    const totalEvents = userEvents.length;

    const eventsByType: Record<string, number> = {};
    userEvents.forEach(event => {
      eventsByType[event.eventType] = (eventsByType[event.eventType] || 0) + 1;
    });

    const averageImpact = totalEvents > 0
      ? userEvents.reduce((sum, event) => sum + event.impact, 0) / totalEvents
      : 0;

    const averageConfidence = totalEvents > 0
      ? userEvents.reduce((sum, event) => sum + event.confidence, 0) / totalEvents
      : 0;

    const trend = this.calculateTrend(userEvents);

    const keyPatterns = this.extractPatterns(userEvents);
    const recommendations = this.generateRecommendations(userEvents);

    const analysis: TimelineAnalysis = {
      id: analysisId,
      userId,
      totalEvents,
      eventsByType,
      averageImpact,
      averageConfidence,
      trend,
      keyPatterns,
      recommendations,
      timestamp: new Date(),
    };

    this.analyses.set(analysisId, analysis);
  }

  /**
   * Calculate trend
   */
  private calculateTrend(events: TimelineEvent[]): "improving" | "stable" | "degrading" {
    if (events.length < 2) return "stable";

    const recentEvents = events.slice(-10);
    const recentImpact = recentEvents.reduce((sum, event) => sum + event.impact, 0) / recentEvents.length;
    const olderEvents = events.slice(0, -10);
    const olderImpact = olderEvents.length > 0
      ? olderEvents.reduce((sum, event) => sum + event.impact, 0) / olderEvents.length
      : recentImpact;

    if (recentImpact > olderImpact * 1.1) return "improving";
    if (recentImpact < olderImpact * 0.9) return "degrading";
    return "stable";
  }

  /**
   * Extract patterns
   */
  private extractPatterns(events: TimelineEvent[]): string[] {
    const patterns: string[] = [];

    // Pattern: Frequent errors
    const errors = events.filter(event => event.eventType === "error");
    if (errors.length > 5) {
      patterns.push("High error rate detected");
    }

    // Pattern: Frequent improvements
    const improvements = events.filter(event => event.eventType === "improvement");
    if (improvements.length > 5) {
      patterns.push("Continuous improvement pattern");
    }

    // Pattern: Low confidence
    const lowConfidence = events.filter(event => event.confidence < 0.5);
    if (lowConfidence.length > 3) {
      patterns.push("Low confidence in decisions");
    }

    return patterns;
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(events: TimelineEvent[]): string[] {
    const recommendations: string[] = [];

    const errors = events.filter(event => event.eventType === "error");
    if (errors.length > 3) {
      recommendations.push("Review error patterns and implement preventive measures");
    }

    const lowConfidence = events.filter(event => event.confidence < 0.5);
    if (lowConfidence.length > 3) {
      recommendations.push("Improve decision confidence through better data or models");
    }

    const improvements = events.filter(event => event.eventType === "improvement");
    if (improvements.length < 2) {
      recommendations.push("Focus on continuous improvement initiatives");
    }

    return recommendations;
  }

  /**
   * Compare segments
   */
  compareSegments(segment1Id: string, segment2Id: string): TimelineComparison | null {
    const segment1 = this.segments.get(segment1Id);
    const segment2 = this.segments.get(segment2Id);

    if (!segment1 || !segment2) return null;

    const comparisonId = `comparison_${segment1Id}_${segment2Id}_${Date.now()}`;

    const similarities: string[] = [];
    const differences: string[] = [];
    const improvements: string[] = [];
    const degradations: string[] = [];

    // Compare event types
    const types1 = new Set(segment1.events.map(e => e.eventType));
    const types2 = new Set(segment2.events.map(e => e.eventType));

    types1.forEach(type => {
      if (types2.has(type)) {
        similarities.push(`Both segments have ${type} events`);
      } else {
        differences.push(`Segment 1 has ${type} events, segment 2 does not`);
      }
    });

    types2.forEach(type => {
      if (!types1.has(type)) {
        differences.push(`Segment 2 has ${type} events, segment 1 does not`);
      }
    });

    // Compare impact
    const avgImpact1 = segment1.events.reduce((sum, e) => sum + e.impact, 0) / segment1.events.length;
    const avgImpact2 = segment2.events.reduce((sum, e) => sum + e.impact, 0) / segment2.events.length;

    if (avgImpact2 > avgImpact1) {
      improvements.push(`Average impact improved from ${(avgImpact1 * 100).toFixed(0)}% to ${(avgImpact2 * 100).toFixed(0)}%`);
    } else if (avgImpact2 < avgImpact1) {
      degradations.push(`Average impact degraded from ${(avgImpact1 * 100).toFixed(0)}% to ${(avgImpact2 * 100).toFixed(0)}%`);
    }

    const overallChange = Math.abs(avgImpact2 - avgImpact1);

    const comparison: TimelineComparison = {
      id: comparisonId,
      userId: segment1.userId,
      segment1Id,
      segment2Id,
      similarities,
      differences,
      improvements,
      degradations,
      overallChange,
      timestamp: new Date(),
    };

    this.comparisons.set(comparisonId, comparison);

    return comparison;
  }

  /**
   * Get events by user
   */
  getEventsByUser(userId: string): TimelineEvent[] {
    return Array.from(this.events.values()).filter(event => event.userId === userId);
  }

  /**
   * Get events by type
   */
  getEventsByType(eventType: TimelineEventType): TimelineEvent[] {
    return Array.from(this.events.values()).filter(event => event.eventType === eventType);
  }

  /**
   * Get events by time range
   */
  getEventsByTimeRange(startTime: Date, endTime: Date): TimelineEvent[] {
    return Array.from(this.events.values()).filter(
      event => event.timestamp >= startTime && event.timestamp <= endTime
    );
  }

  /**
   * Get segment
   */
  getSegment(segmentId: string): TimelineSegment | null {
    return this.segments.get(segmentId) || null;
  }

  /**
   * Get segments by user
   */
  getSegmentsByUser(userId: string): TimelineSegment[] {
    return Array.from(this.segments.values()).filter(segment => segment.userId === userId);
  }

  /**
   * Get comparison
   */
  getComparison(comparisonId: string): TimelineComparison | null {
    return this.comparisons.get(comparisonId) || null;
  }

  /**
   * Get analysis
   */
  getAnalysis(analysisId: string): TimelineAnalysis | null {
    return this.analyses.get(analysisId) || null;
  }

  /**
   * Get analysis by user
   */
  getAnalysisByUser(userId: string): TimelineAnalysis | null {
    return Array.from(this.analyses.values()).find(analysis => analysis.userId === userId) || null;
  }

  /**
   * Get metrics
   */
  getMetrics(): TimelineMetrics {
    const totalEvents = this.events.size;
    const totalSegments = this.segments.size;
    const totalComparisons = this.comparisons.size;
    const totalAnalyses = this.analyses.size;

    const averageEventsPerSegment = totalSegments > 0
      ? Array.from(this.segments.values()).reduce((sum, segment) => sum + segment.events.length, 0) / totalSegments
      : 0;

    const segments = Array.from(this.segments.values());
    const averageSegmentDuration = segments.length > 0
      ? segments.reduce((sum, segment) => {
        const duration = segment.endTime ? segment.endTime.getTime() - segment.startTime.getTime() : 0;
        return sum + duration;
      }, 0) / segments.length
      : 0;

    const eventDistribution: Record<string, number> = {};
    this.events.forEach(event => {
      eventDistribution[event.eventType] = (eventDistribution[event.eventType] || 0) + 1;
    });

    const userDistribution: Record<string, number> = {};
    this.events.forEach(event => {
      userDistribution[event.userId] = (userDistribution[event.userId] || 0) + 1;
    });

    const averageImpact = totalEvents > 0
      ? Array.from(this.events.values()).reduce((sum, event) => sum + event.impact, 0) / totalEvents
      : 0;

    const averageConfidence = totalEvents > 0
      ? Array.from(this.events.values()).reduce((sum, event) => sum + event.confidence, 0) / totalEvents
      : 0;

    return {
      totalEvents,
      totalSegments,
      totalComparisons,
      totalAnalyses,
      averageEventsPerSegment,
      averageSegmentDuration,
      eventDistribution,
      userDistribution,
      averageImpact,
      averageConfidence,
    };
  }

  /**
   * Clear old data
   */
  clearOldData(): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.config.retentionDays);

    // Clear old events
    this.events.forEach((event, id) => {
      if (event.timestamp < cutoffDate) {
        this.events.delete(id);
      }
    });

    // Clear old segments
    this.segments.forEach((segment, id) => {
      if (segment.startTime < cutoffDate) {
        this.segments.delete(id);
      }
    });
  }

  /**
   * Clear all data
   */
  clearAll(): void {
    this.events.clear();
    this.segments.clear();
    this.comparisons.clear();
    this.analyses.clear();
  }
}

export const aiTimelineEngine = AITimelineEngine.getInstance();
