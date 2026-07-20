/**
 * Session Analytics
 * Analytics for user sessions
 * Tracks: session duration, page views, feature usage, abandonment
 */

import { z } from "zod";
import { analyticsService, EventType, AnalyticsContext } from "./AnalyticsService";

// Session Data
export interface SessionData {
  sessionId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // seconds
  pageViews: number;
  featuresUsed: string[];
  pagesVisited: string[];
  deviceType: string;
  browser: string;
  referrer?: string;
  exitPage?: string;
  isBounced: boolean; // single page view
  isConverted: boolean; // completed a key action
}

// Session Metrics
export interface SessionMetrics {
  totalSessions: number;
  averageDuration: number; // seconds
  averagePageViews: number;
  bounceRate: number; // 0-1
  conversionRate: number; // 0-1
  averageSessionDurationByDevice: Record<string, number>;
  topExitPages: Array<{ page: string; count: number; percentage: number }>;
  topEntryPages: Array<{ page: string; count: number; percentage: number }>;
  sessionsByDuration: Array<{ range: string; count: number; percentage: number }>;
}

export class SessionAnalytics {
  private static instance: SessionAnalytics;
  private sessions: Map<string, SessionData> = new Map();

  private constructor() {}

  static getInstance(): SessionAnalytics {
    if (!SessionAnalytics.instance) {
      SessionAnalytics.instance = new SessionAnalytics();
    }
    return SessionAnalytics.instance;
  }

  /**
   * Start session
   */
  startSession(userId: string, sessionId: string): SessionData {
    const sessionData: SessionData = {
      sessionId,
      userId,
      startTime: new Date(),
      pageViews: 0,
      featuresUsed: [],
      pagesVisited: [],
      deviceType: this.detectDeviceType(),
      browser: this.detectBrowser(),
      referrer: this.getReferrer(),
      isBounced: true,
      isConverted: false,
    };

    this.sessions.set(sessionId, sessionData);

    // Track session start
    analyticsService.track(
      EventType.SESSION_START,
      { userId, sessionId, properties: {} },
      {
        deviceType: sessionData.deviceType,
        browser: sessionData.browser,
        referrer: sessionData.referrer,
      }
    );

    return sessionData;
  }

  /**
   * End session
   */
  endSession(sessionId: string): SessionData | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    session.endTime = new Date();
    session.duration = Math.floor((session.endTime.getTime() - session.startTime.getTime()) / 1000);

    // Track session end
    analyticsService.track(
      EventType.SESSION_END,
      { userId: session.userId, sessionId, properties: {} },
      {
        duration: session.duration,
        pageViews: session.pageViews,
        featuresUsed: session.featuresUsed,
        isBounced: session.isBounced,
        isConverted: session.isConverted,
      }
    );

    return session;
  }

  /**
   * Track page view
   */
  trackPageView(sessionId: string, pageName: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.pageViews++;
    session.pagesVisited.push(pageName);
    session.isBounced = session.pageViews > 1 ? false : session.isBounced;
    session.exitPage = pageName;

    analyticsService.trackPageView(
      { userId: session.userId, sessionId, properties: {} },
      pageName
    );
  }

  /**
   * Track feature usage
   */
  trackFeatureUsage(sessionId: string, featureName: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    if (!session.featuresUsed.includes(featureName)) {
      session.featuresUsed.push(featureName);
    }

    analyticsService.trackFeatureUsage(
      { userId: session.userId, sessionId, properties: {} },
      featureName
    );
  }

  /**
   * Mark session as converted
   */
  markAsConverted(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.isConverted = true;
  }

  /**
   * Get session data
   */
  getSession(sessionId: string): SessionData | null {
    return this.sessions.get(sessionId) || null;
  }

  /**
   * Get all sessions for user
   */
  getUserSessions(userId: string): SessionData[] {
    return Array.from(this.sessions.values()).filter(s => s.userId === userId);
  }

  /**
   * Calculate session metrics
   */
  calculateMetrics(): SessionMetrics {
    const sessions = Array.from(this.sessions.values());
    
    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        averageDuration: 0,
        averagePageViews: 0,
        bounceRate: 0,
        conversionRate: 0,
        averageSessionDurationByDevice: {},
        topExitPages: [],
        topEntryPages: [],
        sessionsByDuration: [],
      };
    }

    const totalDuration = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const averageDuration = totalDuration / sessions.length;

    const totalPageViews = sessions.reduce((sum, s) => sum + s.pageViews, 0);
    const averagePageViews = totalPageViews / sessions.length;

    const bouncedSessions = sessions.filter(s => s.isBounced).length;
    const bounceRate = bouncedSessions / sessions.length;

    const convertedSessions = sessions.filter(s => s.isConverted).length;
    const conversionRate = convertedSessions / sessions.length;

    // Average duration by device
    const sessionsByDevice: Record<string, SessionData[]> = {};
    sessions.forEach(s => {
      if (!sessionsByDevice[s.deviceType]) {
        sessionsByDevice[s.deviceType] = [];
      }
      sessionsByDevice[s.deviceType].push(s);
    });

    const averageSessionDurationByDevice: Record<string, number> = {};
    Object.entries(sessionsByDevice).forEach(([device, deviceSessions]) => {
      const totalDeviceDuration = deviceSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
      averageSessionDurationByDevice[device] = totalDeviceDuration / deviceSessions.length;
    });

    // Top exit pages
    const exitPageCounts: Record<string, number> = {};
    sessions.forEach(s => {
      if (s.exitPage) {
        exitPageCounts[s.exitPage] = (exitPageCounts[s.exitPage] || 0) + 1;
      }
    });

    const topExitPages = Object.entries(exitPageCounts)
      .map(([page, count]) => ({
        page,
        count,
        percentage: (count / sessions.length) * 100,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Top entry pages (first page visited)
    const entryPageCounts: Record<string, number> = {};
    sessions.forEach(s => {
      const entryPage = s.pagesVisited[0];
      if (entryPage) {
        entryPageCounts[entryPage] = (entryPageCounts[entryPage] || 0) + 1;
      }
    });

    const topEntryPages = Object.entries(entryPageCounts)
      .map(([page, count]) => ({
        page,
        count,
        percentage: (count / sessions.length) * 100,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Sessions by duration ranges
    const durationRanges = [
      { range: "0-30s", min: 0, max: 30 },
      { range: "30s-1m", min: 30, max: 60 },
      { range: "1m-5m", min: 60, max: 300 },
      { range: "5m-10m", min: 300, max: 600 },
      { range: "10m+", min: 600, max: Infinity },
    ];

    const sessionsByDuration = durationRanges.map(range => {
      const count = sessions.filter(s => {
        const duration = s.duration || 0;
        return duration >= range.min && duration < range.max;
      }).length;

      return {
        range: range.range,
        count,
        percentage: (count / sessions.length) * 100,
      };
    });

    return {
      totalSessions: sessions.length,
      averageDuration,
      averagePageViews,
      bounceRate,
      conversionRate,
      averageSessionDurationByDevice,
      topExitPages,
      topEntryPages,
      sessionsByDuration,
    };
  }

  /**
   * Detect device type
   */
  private detectDeviceType(): string {
    if (typeof window === "undefined") return "unknown";

    const ua = navigator.userAgent;
    if (/Mobile|Android|iPhone|iPad/i.test(ua)) {
      return "mobile";
    }
    if (/Tablet|iPad/i.test(ua)) {
      return "tablet";
    }
    return "desktop";
  }

  /**
   * Detect browser
   */
  private detectBrowser(): string {
    if (typeof window === "undefined") return "unknown";

    const ua = navigator.userAgent;
    if (ua.includes("Chrome")) return "chrome";
    if (ua.includes("Firefox")) return "firefox";
    if (ua.includes("Safari")) return "safari";
    if (ua.includes("Edge")) return "edge";
    return "unknown";
  }

  /**
   * Get referrer
   */
  private getReferrer(): string | undefined {
    if (typeof window === "undefined") return undefined;
    return document.referrer || undefined;
  }

  /**
   * Clear session data
   */
  clearSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  /**
   * Clear all sessions
   */
  clearAllSessions(): void {
    this.sessions.clear();
  }
}

export const sessionAnalytics = SessionAnalytics.getInstance();
