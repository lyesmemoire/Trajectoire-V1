/**
 * Heatmap Events
 * Analytics for heatmap data
 * Tracks: clicks, scrolls, hover, element interactions
 */

import { z } from "zod";

// Heatmap Event Type
export enum HeatmapEventType {
  CLICK = "click",
  HOVER = "hover",
  SCROLL = "scroll",
  FOCUS = "focus",
  BLUR = "blur",
  INPUT = "input",
  SUBMIT = "submit",
}

// Heatmap Event Data
export interface HeatmapEvent {
  id: string;
  userId: string;
  sessionId: string;
  eventType: HeatmapEventType;
  timestamp: Date;
  elementSelector: string;
  elementTag: string;
  elementId?: string;
  elementClass?: string;
  pageUrl: string;
  viewportWidth: number;
  viewportHeight: number;
  scrollX: number;
  scrollY: number;
  clientX: number;
  clientY: number;
  targetText?: string;
  metadata?: Record<string, any>;
}

// Heatmap Metrics
export interface HeatmapMetrics {
  totalEvents: number;
  eventsByType: Record<HeatmapEventType, number>;
  topClickedElements: Array<{
    elementSelector: string;
    elementTag: string;
    clickCount: number;
    percentage: number;
  }>;
  scrollDepth: {
    averageScrollDepth: number; // 0-1
    usersScrolledToBottom: number;
    usersScrolledToMiddle: number;
    usersScrolledToQuarter: number;
  };
  hoverHeatmap: Array<{
    elementSelector: string;
    hoverCount: number;
    averageHoverDuration: number;
  }>;
  clickHeatmap: Array<{
    x: number;
    y: number;
    count: number;
  }>;
  mostInteractedPages: Array<{
    pageUrl: string;
    eventCount: number;
    uniqueUsers: number;
  }>;
}

export class HeatmapEvents {
  private static instance: HeatmapEvents;
  private events: HeatmapEvent[] = [];
  private clickPositions: Map<string, number> = new Map(); // "x,y" -> count

  private constructor() {}

  static getInstance(): HeatmapEvents {
    if (!HeatmapEvents.instance) {
      HeatmapEvents.instance = new HeatmapEvents();
    }
    return HeatmapEvents.instance;
  }

  /**
   * Track heatmap event
   */
  trackEvent(
    userId: string,
    sessionId: string,
    eventType: HeatmapEventType,
    element: HTMLElement,
    pageUrl: string,
    metadata?: Record<string, any>
  ): void {
    const event: HeatmapEvent = {
      id: this.generateEventId(),
      userId,
      sessionId,
      eventType,
      timestamp: new Date(),
      elementSelector: this.getElementSelector(element),
      elementTag: element.tagName.toLowerCase(),
      elementId: element.id || undefined,
      elementClass: element.className || undefined,
      pageUrl,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      scrollX: window.scrollX,
      scrollY: window.scrollY,
      clientX: 0,
      clientY: 0,
      targetText: element.textContent?.substring(0, 100) || undefined,
      metadata,
    };

    this.events.push(event);

    // Track click positions for heatmap
    if (eventType === HeatmapEventType.CLICK && metadata?.clientX !== undefined && metadata?.clientY !== undefined) {
      const key = `${metadata.clientX},${metadata.clientY}`;
      this.clickPositions.set(key, (this.clickPositions.get(key) || 0) + 1);
    }
  }

  /**
   * Track click event
   */
  trackClick(
    userId: string,
    sessionId: string,
    element: HTMLElement,
    clientX: number,
    clientY: number,
    pageUrl: string
  ): void {
    this.trackEvent(userId, sessionId, HeatmapEventType.CLICK, element, pageUrl, {
      clientX,
      clientY,
    });
  }

  /**
   * Track hover event
   */
  trackHover(
    userId: string,
    sessionId: string,
    element: HTMLElement,
    duration: number,
    pageUrl: string
  ): void {
    this.trackEvent(userId, sessionId, HeatmapEventType.HOVER, element, pageUrl, {
      duration,
    });
  }

  /**
   * Track scroll event
   */
  trackScroll(
    userId: string,
    sessionId: string,
    scrollDepth: number,
    pageUrl: string
  ): void {
    const event: HeatmapEvent = {
      id: this.generateEventId(),
      userId,
      sessionId,
      eventType: HeatmapEventType.SCROLL,
      timestamp: new Date(),
      elementSelector: "window",
      elementTag: "window",
      pageUrl,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      scrollX: window.scrollX,
      scrollY: window.scrollY,
      clientX: 0,
      clientY: 0,
      metadata: { scrollDepth },
    };

    this.events.push(event);
  }

  /**
   * Get element selector
   */
  private getElementSelector(element: HTMLElement): string {
    if (element.id) {
      return `#${element.id}`;
    }
    if (element.className) {
      return `.${element.className.split(' ')[0]}`;
    }
    return element.tagName.toLowerCase();
  }

  /**
   * Generate event ID
   */
  private generateEventId(): string {
    return `hmt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Calculate heatmap metrics
   */
  calculateMetrics(): HeatmapMetrics {
    const totalEvents = this.events.length;

    const eventsByType: Record<HeatmapEventType, number> = {
      [HeatmapEventType.CLICK]: 0,
      [HeatmapEventType.HOVER]: 0,
      [HeatmapEventType.SCROLL]: 0,
      [HeatmapEventType.FOCUS]: 0,
      [HeatmapEventType.BLUR]: 0,
      [HeatmapEventType.INPUT]: 0,
      [HeatmapEventType.SUBMIT]: 0,
    };

    this.events.forEach(event => {
      eventsByType[event.eventType] = (eventsByType[event.eventType] || 0) + 1;
    });

    // Top clicked elements
    const clickEvents = this.events.filter(e => e.eventType === HeatmapEventType.CLICK);
    const elementClickCounts: Map<string, { count: number; tag: string }> = new Map();

    clickEvents.forEach(event => {
      const key = event.elementSelector;
      const existing = elementClickCounts.get(key);
      if (existing) {
        existing.count++;
      } else {
        elementClickCounts.set(key, { count: 1, tag: event.elementTag });
      }
    });

    const topClickedElements = Array.from(elementClickCounts.entries())
      .map(([selector, data]) => ({
        elementSelector: selector,
        elementTag: data.tag,
        clickCount: data.count,
        percentage: clickEvents.length > 0 ? (data.count / clickEvents.length) * 100 : 0,
      }))
      .sort((a, b) => b.clickCount - a.clickCount)
      .slice(0, 10);

    // Scroll depth
    const scrollEvents = this.events.filter(e => e.eventType === HeatmapEventType.SCROLL);
    const scrollDepths = scrollEvents.map(e => e.metadata?.scrollDepth || 0);
    const averageScrollDepth = scrollDepths.length > 0
      ? scrollDepths.reduce((sum, depth) => sum + depth, 0) / scrollDepths.length
      : 0;

    const usersScrolledToBottom = scrollEvents.filter(e => (e.metadata?.scrollDepth || 0) >= 0.9).length;
    const usersScrolledToMiddle = scrollEvents.filter(e => (e.metadata?.scrollDepth || 0) >= 0.5).length;
    const usersScrolledToQuarter = scrollEvents.filter(e => (e.metadata?.scrollDepth || 0) >= 0.25).length;

    // Hover heatmap
    const hoverEvents = this.events.filter(e => e.eventType === HeatmapEventType.HOVER);
    const elementHoverData: Map<string, { count: number; totalDuration: number }> = new Map();

    hoverEvents.forEach(event => {
      const key = event.elementSelector;
      const existing = elementHoverData.get(key);
      const duration = event.metadata?.duration || 0;
      if (existing) {
        existing.count++;
        existing.totalDuration += duration;
      } else {
        elementHoverData.set(key, { count: 1, totalDuration: duration });
      }
    });

    const hoverHeatmap = Array.from(elementHoverData.entries())
      .map(([selector, data]) => ({
        elementSelector: selector,
        hoverCount: data.count,
        averageHoverDuration: data.count > 0 ? data.totalDuration / data.count : 0,
      }))
      .sort((a, b) => b.hoverCount - a.hoverCount)
      .slice(0, 10);

    // Click heatmap (positions)
    const clickHeatmap = Array.from(this.clickPositions.entries())
      .map(([position, count]) => {
        const [x, y] = position.split(',').map(Number);
        return { x, y, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 100);

    // Most interacted pages
    const pageEventCounts: Map<string, { count: number; uniqueUsers: Set<string> }> = new Map();

    this.events.forEach(event => {
      const existing = pageEventCounts.get(event.pageUrl);
      if (existing) {
        existing.count++;
        existing.uniqueUsers.add(event.userId);
      } else {
        pageEventCounts.set(event.pageUrl, {
          count: 1,
          uniqueUsers: new Set([event.userId]),
        });
      }
    });

    const mostInteractedPages = Array.from(pageEventCounts.entries())
      .map(([pageUrl, data]) => ({
        pageUrl,
        eventCount: data.count,
        uniqueUsers: data.uniqueUsers.size,
      }))
      .sort((a, b) => b.eventCount - a.eventCount)
      .slice(0, 10);

    return {
      totalEvents,
      eventsByType,
      topClickedElements,
      scrollDepth: {
        averageScrollDepth,
        usersScrolledToBottom,
        usersScrolledToMiddle,
        usersScrolledToQuarter,
      },
      hoverHeatmap,
      clickHeatmap,
      mostInteractedPages,
    };
  }

  /**
   * Get events for specific page
   */
  getPageEvents(pageUrl: string): HeatmapEvent[] {
    return this.events.filter(e => e.pageUrl === pageUrl);
  }

  /**
   * Get events for specific element
   */
  getElementEvents(elementSelector: string): HeatmapEvent[] {
    return this.events.filter(e => e.elementSelector === elementSelector);
  }

  /**
   * Clear events
   */
  clearEvents(): void {
    this.events = [];
    this.clickPositions.clear();
  }

  /**
   * Get click positions for heatmap visualization
   */
  getClickHeatmapData(): Array<{ x: number; y: number; count: number }> {
    return Array.from(this.clickPositions.entries())
      .map(([position, count]) => {
        const [x, y] = position.split(',').map(Number);
        return { x, y, count };
      })
      .sort((a, b) => b.count - a.count);
  }
}

export const heatmapEvents = HeatmapEvents.getInstance();
