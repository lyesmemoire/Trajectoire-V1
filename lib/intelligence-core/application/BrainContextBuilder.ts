/**
 * BrainContextBuilder
 *
 * Generic component for building AI context from Brain data.
 * This abstraction eliminates repetitive Brain data transformation logic across engines.
 *
 * Responsibility:
 * - Retrieve Brain data (insights, observations, patterns, goals)
 * - Transform Brain data into standardized context format
 * - Provide consistent context structure for all engines
 
 * Location: intelligence-core
 * Justification: This is a shared abstraction that belongs in the core library,
 * as it provides common functionality for all intelligence engines.
 */

export interface IntelligenceContext {
  candidateProfile: Record<string, unknown>;
  historicalObservations: unknown[];
  currentGoals: unknown[];
  recentInsights: unknown[];
  engineContext: Record<string, unknown>;
}

export interface BrainData {
  insights: Array<{ description: string }>;
  observations: Array<{ type: string; source: string; data: unknown }>;
  patterns: { patterns: Array<{ pattern: string; category: string }> };
  goals: Array<{ status: string; description: string }>;
}

export interface BrainContextOptions {
  maxInsights?: number;
  maxObservations?: number;
  maxPatterns?: number;
  maxGoals?: number;
  observationTypeFilter?: string;
  goalStatusFilter?: string;
}

export class BrainContextBuilder {
  /**
   * Build standardized AI context from Brain data
   *
   * @param brainData - Raw Brain data
   * @param options - Configuration for context building
   * @returns Standardized IntelligenceContext
   */
  static buildContext(
    brainData: BrainData,
    options: BrainContextOptions = {}
  ): Partial<IntelligenceContext> {
    const {
      maxInsights = 5,
      maxObservations = 10,
      maxPatterns = 5,
      maxGoals = 10,
      observationTypeFilter,
      goalStatusFilter,
    } = options;

    const historicalInsights = this.extractInsights(brainData.insights, maxInsights);
    const historicalObservations = this.extractObservations(
      brainData.observations,
      maxObservations,
      observationTypeFilter
    );
    const knownPatterns = this.extractPatterns(brainData.patterns, maxPatterns);
    const currentGoals = this.extractGoals(brainData.goals, maxGoals, goalStatusFilter);

    return {
      candidateProfile: {},
      historicalObservations: [],
      currentGoals: [],
      recentInsights: [],
      engineContext: {
        historicalInsights: historicalInsights.join(", "),
        knownPatterns: knownPatterns.join(", "),
        previousGoals: currentGoals.previousGoals.join(", "),
        currentBrainGoals: currentGoals.currentGoals.join(", "),
        recentObservations: historicalObservations.join(", "),
      },
    };
  }

  /**
   * Extract insights from Brain data
   */
  private static extractInsights(
    insights: Array<{ description: string }>,
    max: number
  ): string[] {
    return insights.slice(0, max).map(i => i.description);
  }

  /**
   * Extract observations from Brain data
   */
  private static extractObservations(
    observations: Array<{ type: string; source: string; data: unknown }>,
    max: number,
    typeFilter?: string
  ): string[] {
    let filtered = observations;
    
    if (typeFilter) {
      filtered = observations.filter(o => o.type === typeFilter);
    }

    return filtered
      .slice(0, max)
      .map(o => `${o.source}: ${JSON.stringify(o.data).substring(0, 100)}...`);
  }

  /**
   * Extract patterns from Brain data
   */
  private static extractPatterns(
    patterns: { patterns: Array<{ pattern: string; category: string }> },
    max: number
  ): string[] {
    return patterns.patterns
      .slice(0, max)
      .map(p => `${p.pattern} (${p.category})`);
  }

  /**
   * Extract goals from Brain data
   */
  private static extractGoals(
    goals: Array<{ status: string; description: string }>,
    max: number,
    statusFilter?: string
  ): { previousGoals: string[]; currentGoals: string[] } {
    let filtered = goals;
    
    if (statusFilter) {
      filtered = goals.filter(g => g.status === statusFilter);
    }

    const previousGoals = filtered
      .filter(g => g.status === "achieved")
      .slice(0, max)
      .map(g => g.description);

    const currentGoals = filtered
      .filter(g => g.status === "in_progress")
      .slice(0, max)
      .map(g => g.description);

    return { previousGoals, currentGoals };
  }

  /**
   * Build engine-specific context with custom variables
   *
   * @param brainData - Raw Brain data
   * @param customVariables - Custom engine-specific variables
   * @param options - Configuration for context building
   * @returns Complete IntelligenceContext with engine-specific variables
   */
  static buildEngineContext<T extends Record<string, unknown>>(
    brainData: BrainData,
    customVariables: T,
    options: BrainContextOptions = {}
  ): Partial<IntelligenceContext> {
    const brainContext = this.buildContext(brainData, options);
    
    return {
      ...brainContext,
      engineContext: {
        ...brainContext.engineContext,
        ...customVariables,
      },
    };
  }
}
