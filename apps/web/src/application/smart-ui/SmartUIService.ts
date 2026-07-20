/**
 * Smart UI Service
 * Adaptive interface
 */

import {
  UIElement,
  SmartUIConfiguration,
  SmartUILayout,
  SmartUIConfig,
  defaultSmartUIConfig,
} from "./interfaces/ISmartUI";
import { userPersonalizationEngine } from "../adaptive-intelligence/UserPersonalizationEngine";

// ============================================================================
// SMART UI SERVICE CLASS
// ============================================================================

export class SmartUIService {
  private static instance: SmartUIService;
  private config: SmartUIConfig;
  private layoutCache: Map<string, SmartUILayout> = new Map();

  private constructor() {
    this.config = defaultSmartUIConfig;
  }

  static getInstance(): SmartUIService {
    if (!SmartUIService.instance) {
      SmartUIService.instance = new SmartUIService();
    }
    return SmartUIService.instance;
  }

  /**
   * Set configuration
   */
  setConfig(config: Partial<SmartUIConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Generate smart UI layout
   */
  async generateLayout(config: SmartUIConfiguration): Promise<SmartUILayout> {
    // Check cache first
    const cacheKey = this.generateCacheKey(config);
    const cached = this.layoutCache.get(cacheKey);
    if (cached && this.isCacheValid(cached)) {
      return cached;
    }

    // Generate elements based on user type and context
    const elements = await this.generateElements(config);

    // Sort elements by priority
    const sortedElements = elements.sort((a, b) => b.priority - a.priority);

    // Limit elements
    const limitedElements = sortedElements.slice(0, this.config.maxElements);

    // Assign positions
    const positionedElements = this.assignPositions(limitedElements, config);

    // Determine layout
    const layout = this.determineLayout(config);

    // Track which engines were used
    const generatedBy = [
      "SmartUIService",
      "UserPersonalizationEngine",
    ];

    const smartLayout: SmartUILayout = {
      id: `layout_${config.userId}_${Date.now()}`,
      userId: config.userId,
      elements: positionedElements,
      layout,
      generatedBy,
      timestamp: new Date(),
    };

    // Cache the result
    this.layoutCache.set(cacheKey, smartLayout);

    return smartLayout;
  }

  /**
   * Generate cache key
   */
  private generateCacheKey(config: SmartUIConfiguration): string {
    return `${config.userId}_${config.userType}_${config.context.timeOfDay}_${config.context.dayOfWeek}`;
  }

  /**
   * Check if cache is valid
   */
  private isCacheValid(cached: SmartUILayout): boolean {
    const hoursDiff = (Date.now() - cached.timestamp.getTime()) / (1000 * 60 * 60);
    return hoursDiff < 6; // Cache valid for 6 hours
  }

  /**
   * Generate UI elements
   */
  private async generateElements(config: SmartUIConfiguration): Promise<UIElement[]> {
    const elements: UIElement[] = [];

    // Generate stats element
    if (config.preferences.showStats) {
      elements.push(await this.generateStatsElement(config));
    }

    // Generate recommendations element
    if (config.preferences.showRecommendations) {
      elements.push(await this.generateRecommendationsElement(config));
    }

    // Generate history element
    if (config.preferences.showHistory) {
      elements.push(await this.generateHistoryElement(config));
    }

    // Generate CTA element
    elements.push(await this.generateCTAElement(config));

    // Generate chart elements based on user type
    elements.push(...await this.generateChartElements(config));

    // Generate widget elements based on user type
    elements.push(...await this.generateWidgetElements(config));

    return elements;
  }

  /**
   * Generate stats element
   */
  private async generateStatsElement(config: SmartUIConfiguration): Promise<UIElement> {
    const userMatrix = userPersonalizationEngine.getMatrix(config.userId);
    const personalizedFactors = userMatrix ? userPersonalizationEngine.getPersonalizedFactors(config.userId) : null;

    return {
      id: `element_stats_${Date.now()}`,
      type: "stat",
      title: "Statistiques",
      content: `Progression: ${Math.round(config.context.engagementLevel * 100)}%`,
      size: "medium",
      position: { row: 0, column: 0 },
      color: this.selectColor(config, "stat"),
      priority: 90,
      visible: true,
      metadata: {
        engagement: config.context.engagementLevel,
        stress: config.context.stressLevel,
      },
    };
  }

  /**
   * Generate recommendations element
   */
  private async generateRecommendationsElement(config: SmartUIConfiguration): Promise<UIElement> {
    return {
      id: `element_recommendations_${Date.now()}`,
      type: "recommendation",
      title: "Recommandations",
      content: "Basé sur votre progression",
      size: "large",
      position: { row: 0, column: 1 },
      color: this.selectColor(config, "recommendation"),
      priority: 85,
      visible: config.preferences.showRecommendations,
      metadata: {},
    };
  }

  /**
   * Generate history element
   */
  private async generateHistoryElement(config: SmartUIConfiguration): Promise<UIElement> {
    return {
      id: `element_history_${Date.now()}`,
      type: "history",
      title: "Historique",
      content: "Vos sessions récentes",
      size: "medium",
      position: { row: 1, column: 0 },
      color: this.selectColor(config, "history"),
      priority: 70,
      visible: config.preferences.showHistory,
      metadata: {},
    };
  }

  /**
   * Generate CTA element
   */
  private async generateCTAElement(config: SmartUIConfiguration): Promise<UIElement> {
    const ctaText = this.getCTAText(config);

    return {
      id: `element_cta_${Date.now()}`,
      type: "cta",
      title: "Action principale",
      content: ctaText,
      size: "large",
      position: { row: 0, column: 2 },
      color: "blue",
      priority: 95,
      visible: true,
      metadata: {
        action: "start_simulation",
      },
    };
  }

  /**
   * Generate chart elements
   */
  private async generateChartElements(config: SmartUIConfiguration): Promise<UIElement[]> {
    const elements: UIElement[] = [];

    if (config.userType === "expert" || config.userType === "premium") {
      elements.push({
        id: `element_chart_progress_${Date.now()}`,
        type: "chart",
        title: "Progression",
        content: "Graphique de progression",
        size: "medium",
        position: { row: 1, column: 1 },
        color: "green",
        priority: 65,
        visible: true,
        metadata: {
          chartType: "line",
        },
      });
    }

    return elements;
  }

  /**
   * Generate widget elements
   */
  private async generateWidgetElements(config: SmartUIConfiguration): Promise<UIElement[]> {
    const elements: UIElement[] = [];

    // Beginner gets more guidance widgets
    if (config.userType === "beginner") {
      elements.push({
        id: `element_widget_guide_${Date.now()}`,
        type: "widget",
        title: "Guide",
        content: "Conseils pour débutants",
        size: "small",
        position: { row: 2, column: 0 },
        color: "purple",
        priority: 60,
        visible: true,
        metadata: {},
      });
    }

    // Inactive users get re-engagement widgets
    if (config.userType === "inactive") {
      elements.push({
        id: `element_widget_reengage_${Date.now()}`,
        type: "widget",
        title: "Retour",
        content: "Revenez pratiquer !",
        size: "medium",
        position: { row: 0, column: 1 },
        color: "orange",
        priority: 100,
        visible: true,
        metadata: {},
      });
    }

    // Premium users get advanced widgets
    if (config.userType === "premium") {
      elements.push({
        id: `element_widget_advanced_${Date.now()}`,
        type: "widget",
        title: "Avancé",
        content: "Fonctionnalités premium",
        size: "small",
        position: { row: 2, column: 2 },
        color: "yellow",
        priority: 55,
        visible: true,
        metadata: {},
      });
    }

    return elements;
  }

  /**
   * Select color based on config
   */
  private selectColor(config: SmartUIConfiguration, elementType: string): "blue" | "green" | "yellow" | "red" | "purple" | "orange" | "gray" {
    if (!this.config.adaptiveColors) {
      return "blue";
    }

    // Stress-based color
    if (config.context.stressLevel > 0.7) {
      return "red";
    }

    // Engagement-based color
    if (config.context.engagementLevel > 0.8) {
      return "green";
    }

    // Time-based color
    if (config.context.timeOfDay === "evening") {
      return "purple";
    }

    // Default color
    return "blue";
  }

  /**
   * Get CTA text based on config
   */
  private getCTAText(config: SmartUIConfiguration): string {
    if (config.userType === "beginner") {
      return "Commencer ma première simulation";
    }

    if (config.userType === "inactive") {
      return "Reprendre la pratique";
    }

    if (config.context.availableTime < 15) {
      return "Session rapide (10 min)";
    }

    return "Nouvelle simulation";
  }

  /**
   * Assign positions to elements
   */
  private assignPositions(elements: UIElement[], config: SmartUIConfiguration): UIElement[] {
    const layout = config.preferences.preferredLayout;
    const positionedElements: UIElement[] = [];

    if (layout === "grid") {
      // Grid layout
      elements.forEach((element, index) => {
        const row = Math.floor(index / 3);
        const column = index % 3;
        element.position = { row, column };
        positionedElements.push(element);
      });
    } else if (layout === "list") {
      // List layout
      elements.forEach((element, index) => {
        element.position = { row: index, column: 0 };
        positionedElements.push(element);
      });
    } else {
      // Dashboard layout
      elements.forEach((element, index) => {
        if (index === 0) {
          element.position = { row: 0, column: 0 };
        } else if (index === 1) {
          element.position = { row: 0, column: 1 };
        } else {
          element.position = { row: Math.floor((index - 2) / 2), column: (index - 2) % 2 };
        }
        positionedElements.push(element);
      });
    }

    return positionedElements;
  }

  /**
   * Determine layout
   */
  private determineLayout(config: SmartUIConfiguration): "grid" | "list" | "dashboard" {
    if (this.config.adaptiveLayout) {
      // Compact mode prefers list
      if (config.preferences.compactMode) {
        return "list";
      }

      // Beginners prefer dashboard
      if (config.userType === "beginner") {
        return "dashboard";
      }

      // Experts prefer grid
      if (config.userType === "expert") {
        return "grid";
      }
    }

    return config.preferences.preferredLayout;
  }

  /**
   * Update element visibility
   */
  updateElementVisibility(userId: string, elementId: string, visible: boolean): void {
    const cacheKey = this.findCacheKeyByUserId(userId);
    if (!cacheKey) return;

    const layout = this.layoutCache.get(cacheKey);
    if (!layout) return;

    const element = layout.elements.find(e => e.id === elementId);
    if (element) {
      element.visible = visible;
    }

    this.layoutCache.set(cacheKey, layout);
  }

  /**
   * Find cache key by user ID
   */
  private findCacheKeyByUserId(userId: string): string | null {
    for (const [key, layout] of this.layoutCache.entries()) {
      if (layout.userId === userId) {
        return key;
      }
    }
    return null;
  }

  /**
   * Get user layout
   */
  getUserLayout(userId: string): SmartUILayout | null {
    const cacheKey = this.findCacheKeyByUserId(userId);
    return cacheKey ? this.layoutCache.get(cacheKey) || null : null;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.layoutCache.clear();
  }

  /**
   * Clear user cache
   */
  clearUserCache(userId: string): void {
    const cacheKey = this.findCacheKeyByUserId(userId);
    if (cacheKey) {
      this.layoutCache.delete(cacheKey);
    }
  }

  /**
   * Get statistics
   */
  getStatistics(): {
    totalLayouts: number;
    averageElementsPerLayout: number;
    layoutDistribution: Record<string, number>;
    elementDistribution: Record<string, number>;
  } {
    const totalLayouts = this.layoutCache.size;
    const allLayouts = Array.from(this.layoutCache.values());
    const averageElementsPerLayout = totalLayouts > 0
      ? allLayouts.reduce((sum, layout) => sum + layout.elements.length, 0) / totalLayouts
      : 0;

    const layoutDistribution: Record<string, number> = {};
    const elementDistribution: Record<string, number> = {};

    allLayouts.forEach(layout => {
      layoutDistribution[layout.layout] = (layoutDistribution[layout.layout] || 0) + 1;
      layout.elements.forEach(element => {
        elementDistribution[element.type] = (elementDistribution[element.type] || 0) + 1;
      });
    });

    return {
      totalLayouts,
      averageElementsPerLayout,
      layoutDistribution,
      elementDistribution,
    };
  }
}

export const smartUIService = SmartUIService.getInstance();
