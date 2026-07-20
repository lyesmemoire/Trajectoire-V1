/**
 * Analytics Service
 * Main analytics service for tracking and measuring product quality
 * Independent analytics architecture (not relying solely on Google Analytics)
 */

import { z } from "zod";

// Event Types
export enum EventType {
  PAGE_VIEW = "page_view",
  SESSION_START = "session_start",
  SESSION_END = "session_end",
  INTERVIEW_START = "interview_start",
  INTERVIEW_END = "interview_end",
  INTERVIEW_ABANDON = "interview_abandon",
  FEATURE_USAGE = "feature_usage",
  BUTTON_CLICK = "button_click",
  FORM_SUBMIT = "form_submit",
  ERROR = "error",
  FEEDBACK_SUBMIT = "feedback_submit",
  REPORT_GENERATE = "report_generate",
  REPORT_VIEW = "report_view",
  GOAL_ACHIEVED = "goal_achieved",
}

// Event Priority
export enum EventPriority {
  CRITICAL = "critical",
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low",
}

// Analytics Event
export interface AnalyticsEvent {
  id: string;
  userId: string;
  sessionId: string;
  eventType: EventType;
  priority: EventPriority;
  timestamp: Date;
  properties: Record<string, any>;
  metadata: {
    userAgent?: string;
    referrer?: string;
    url?: string;
    screenWidth?: number;
    screenHeight?: number;
    language?: string;
  };
}

// Analytics Context
export interface AnalyticsContext {
  userId: string;
  sessionId: string;
  properties: Record<string, any>;
}

// Analytics Config
export interface AnalyticsConfig {
  enabled: boolean;
  sampleRate: number; // 0-1
  batchSize: number;
  flushInterval: number; // milliseconds
  retentionDays: number;
}

export class AnalyticsService {
  private static instance: AnalyticsService;
  private events: AnalyticsEvent[] = [];
  private config: AnalyticsConfig = {
    enabled: true,
    sampleRate: 1.0,
    batchSize: 50,
    flushInterval: 30000, // 30 seconds
    retentionDays: 90,
  };
  private flushTimer: NodeJS.Timeout | null = null;

  private constructor() {
    this.startFlushTimer();
  }

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  /**
   * Track an event
   */
  track(
    eventType: EventType,
    context: AnalyticsContext,
    properties: Record<string, any> = {},
    priority: EventPriority = EventPriority.MEDIUM
  ): void {
    if (!this.config.enabled) return;

    // Sample rate check
    if (Math.random() > this.config.sampleRate) return;

    const event: AnalyticsEvent = {
      id: this.generateEventId(),
      userId: context.userId,
      sessionId: context.sessionId,
      eventType,
      priority,
      timestamp: new Date(),
      properties: {
        ...context.properties,
        ...properties,
      },
      metadata: this.getMetadata(),
    };

    this.events.push(event);

    // Flush if batch size reached
    if (this.events.length >= this.config.batchSize) {
      this.flush();
    }
  }

  /**
   * Track page view
   */
  trackPageView(
    context: AnalyticsContext,
    pageName: string,
    properties: Record<string, any> = {}
  ): void {
    this.track(EventType.PAGE_VIEW, context, {
      pageName,
      ...properties,
    });
  }

  /**
   * Track feature usage
   */
  trackFeatureUsage(
    context: AnalyticsContext,
    featureName: string,
    properties: Record<string, any> = {}
  ): void {
    this.track(EventType.FEATURE_USAGE, context, {
      featureName,
      ...properties,
    });
  }

  /**
   * Track error
   */
  trackError(
    context: AnalyticsContext,
    error: Error,
    properties: Record<string, any> = {}
  ): void {
    this.track(EventType.ERROR, context, {
      errorMessage: error.message,
      errorStack: error.stack,
      ...properties,
    }, EventPriority.HIGH);
  }

  /**
   * Track goal achievement
   */
  trackGoal(
    context: AnalyticsContext,
    goalName: string,
    properties: Record<string, any> = {}
  ): void {
    this.track(EventType.GOAL_ACHIEVED, context, {
      goalName,
      ...properties,
    }, EventPriority.HIGH);
  }

  /**
   * Generate unique event ID
   */
  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get metadata from browser
   */
  private getMetadata(): AnalyticsEvent["metadata"] {
    if (typeof window === "undefined") {
      return {};
    }

    return {
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      url: window.location.href,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      language: navigator.language,
    };
  }

  /**
   * Start flush timer
   */
  private startFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.config.flushInterval);
  }

  /**
   * Flush events to storage
   */
  private async flush(): Promise<void> {
    if (this.events.length === 0) return;

    const eventsToFlush = [...this.events];
    this.events = [];

    try {
      // In production, this would send to analytics backend
      // For now, we'll store in localStorage
      if (typeof window !== "undefined") {
        const existingEvents = JSON.parse(localStorage.getItem("analytics_events") || "[]");
        const allEvents = [...existingEvents, ...eventsToFlush];
        
        // Apply retention policy
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - this.config.retentionDays);
        const filteredEvents = allEvents.filter((e: AnalyticsEvent) => 
          new Date(e.timestamp) > cutoffDate
        );

        localStorage.setItem("analytics_events", JSON.stringify(filteredEvents));
      }
    } catch (error) {
      console.error("Failed to flush analytics events:", error);
      // Re-add events if flush failed
      this.events = [...eventsToFlush, ...this.events];
    }
  }

  /**
   * Get events for analysis
   */
  getEvents(
    filters?: {
      userId?: string;
      sessionId?: string;
      eventType?: EventType;
      startDate?: Date;
      endDate?: Date;
    }
  ): AnalyticsEvent[] {
    if (typeof window === "undefined") return [];

    try {
      const events = JSON.parse(localStorage.getItem("analytics_events") || "[]") as AnalyticsEvent[];

      return events.filter(event => {
        if (filters?.userId && event.userId !== filters.userId) return false;
        if (filters?.sessionId && event.sessionId !== filters.sessionId) return false;
        if (filters?.eventType && event.eventType !== filters.eventType) return false;
        if (filters?.startDate && new Date(event.timestamp) < filters.startDate) return false;
        if (filters?.endDate && new Date(event.timestamp) > filters.endDate) return false;
        return true;
      });
    } catch (error) {
      console.error("Failed to get analytics events:", error);
      return [];
    }
  }

  /**
   * Calculate metrics
   */
  calculateMetrics(events: AnalyticsEvent[]): {
    totalEvents: number;
    eventsByType: Record<EventType, number>;
    uniqueUsers: number;
    uniqueSessions: number;
    averageEventsPerSession: number;
  } {
    const eventsByType: Record<EventType, number> = {
      [EventType.PAGE_VIEW]: 0,
      [EventType.SESSION_START]: 0,
      [EventType.SESSION_END]: 0,
      [EventType.INTERVIEW_START]: 0,
      [EventType.INTERVIEW_END]: 0,
      [EventType.INTERVIEW_ABANDON]: 0,
      [EventType.FEATURE_USAGE]: 0,
      [EventType.BUTTON_CLICK]: 0,
      [EventType.FORM_SUBMIT]: 0,
      [EventType.ERROR]: 0,
      [EventType.FEEDBACK_SUBMIT]: 0,
      [EventType.REPORT_GENERATE]: 0,
      [EventType.REPORT_VIEW]: 0,
      [EventType.GOAL_ACHIEVED]: 0,
    };

    const uniqueUsers = new Set<string>();
    const uniqueSessions = new Set<string>();

    events.forEach(event => {
      eventsByType[event.eventType] = (eventsByType[event.eventType] || 0) + 1;
      uniqueUsers.add(event.userId);
      uniqueSessions.add(event.sessionId);
    });

    const sessionStartEvents = events.filter(e => e.eventType === EventType.SESSION_START);
    const averageEventsPerSession = sessionStartEvents.length > 0
      ? events.length / sessionStartEvents.length
      : 0;

    return {
      totalEvents: events.length,
      eventsByType,
      uniqueUsers: uniqueUsers.size,
      uniqueSessions: uniqueSessions.size,
      averageEventsPerSession,
    };
  }

  /**
   * Update config
   */
  updateConfig(config: Partial<AnalyticsConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get config
   */
  getConfig(): AnalyticsConfig {
    return { ...this.config };
  }

  /**
   * Clear all events
   */
  clearEvents(): void {
    this.events = [];
    if (typeof window !== "undefined") {
      localStorage.removeItem("analytics_events");
    }
  }

  /**
   * Stop service
   */
  stop(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    this.flush();
  }
}

export const analyticsService = AnalyticsService.getInstance();
