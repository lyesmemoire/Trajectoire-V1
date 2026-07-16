/**
 * Brain Patterns
 *
 * Analyzes observations to detect recurring patterns and behaviors.
 */
// @ts-nocheck


import { BrainObservation } from "./BrainMemory";

export interface PatternMatch {
  pattern: string;
  confidence: number;
  occurrences: number;
  examples: string[];
  category: "strength" | "weakness" | "behavior" | "skill" | "risk";
}

export class BrainPatterns {
  /**
   * Analyze observations to detect patterns
   */
  static detectPatterns(observations: BrainObservation[]): PatternMatch[] {
    const patterns: PatternMatch[] = [];

    // Group by type
    const byType = new Map<string, BrainObservation[]>();
    for (const obs of observations) {
      const existing = byType.get(obs.type) || [];
      existing.push(obs);
      byType.set(obs.type, existing);
    }

    // Detect patterns for each type
    const typeEntries = Array.from(byType.entries());
    for (const [type, typeObs] of typeEntries) {
      const typePatterns = this.analyzeTypePatterns(type, typeObs);
      patterns.push(...typePatterns);
    }

    return patterns;
  }

  /**
   * Analyze patterns for a specific type
   */
  private static analyzeTypePatterns(type: string, observations: BrainObservation[]): PatternMatch[] {
    const patterns: PatternMatch[] = [];

    if (observations.length < 2) {
      return patterns;
    }

    // Extract common themes from observations
    const themes = this.extractThemes(observations);

    for (const theme of themes) {
      if (theme.occurrences >= 2) {
        patterns.push({
          pattern: theme.pattern,
          confidence: Math.min(1, theme.occurrences / observations.length),
          occurrences: theme.occurrences,
          examples: theme.examples,
          category: this.categorizePattern(type, theme.pattern),
        });
      }
    }

    return patterns;
  }

  /**
   * Extract common themes from observations
   */
  private static extractThemes(observations: BrainObservation[]): Array<{
    pattern: string;
    occurrences: number;
    examples: string[];
  }> {
    const themes = new Map<string, { count: number; examples: string[] }>();

    for (const obs of observations) {
      const data = obs.data as Record<string, unknown>;
      const description = this.extractDescription(data);

      if (description) {
        const existing = themes.get(description) || { count: 0, examples: [] };
        existing.count += 1;
        existing.examples.push(obs.id);
        themes.set(description, existing);
      }
    }

    return Array.from(themes.entries()).map(([pattern, data]) => ({
      pattern,
      occurrences: data.count,
      examples: data.examples,
    }));
  }

  /**
   * Extract description from observation data
   */
  private static extractDescription(data: Record<string, unknown>): string | null {
    // Try to find a description or summary field
    if (data.description) return data.description as string;
    if (data.summary) return data.summary as string;
    if (data.feedback) return data.feedback as string;
    if (data.strengths && Array.isArray(data.strengths) && data.strengths.length > 0) {
      return `Strength: ${data.strengths[0]}`;
    }
    if (data.weaknesses && Array.isArray(data.weaknesses) && data.weaknesses.length > 0) {
      return `Weakness: ${data.weaknesses[0]}`;
    }

    return null;
  }

  /**
   * Categorize a pattern
   */
  private static categorizePattern(type: string, pattern: string): PatternMatch["category"] {
    const lowerPattern = pattern.toLowerCase();

    if (lowerPattern.includes("strength") || lowerPattern.includes("good") || lowerPattern.includes("excellent")) {
      return "strength";
    }
    if (lowerPattern.includes("weakness") || lowerPattern.includes("improve") || lowerPattern.includes("lack")) {
      return "weakness";
    }
    if (lowerPattern.includes("risk") || lowerPattern.includes("concern") || lowerPattern.includes("warning")) {
      return "risk";
    }
    if (lowerPattern.includes("skill") || lowerPattern.includes("competence") || lowerPattern.includes("ability")) {
      return "skill";
    }

    return "behavior";
  }

  /**
   * Get pattern evolution over time
   */
  static getPatternEvolution(
    observations: BrainObservation[],
    pattern: string
  ): {
    trend: "increasing" | "decreasing" | "stable";
    frequency: number;
    firstSeen: Date;
    lastSeen: Date;
  } {
    const matchingObs = observations.filter((obs) => {
      const data = obs.data as Record<string, unknown>;
      const description = this.extractDescription(data);
      return description === pattern;
    });

    if (matchingObs.length === 0) {
      return {
        trend: "stable",
        frequency: 0,
        firstSeen: new Date(),
        lastSeen: new Date(),
      };
    }

    const sorted = matchingObs.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    if (sorted.length === 0) {
      return {
        trend: "stable",
        frequency: 0,
        firstSeen: new Date(),
        lastSeen: new Date(),
      };
    }
    const firstSeen = sorted[0]?.timestamp ?? new Date();
    const lastSeen = sorted[sorted.length - 1]?.timestamp ?? new Date();

    // Determine trend
    const recentCount = matchingObs.filter(
      (obs) => obs.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;
    const olderCount = matchingObs.filter(
      (obs) => obs.timestamp <= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;

    let trend: "increasing" | "decreasing" | "stable" = "stable";
    if (recentCount > olderCount * 1.5) {
      trend = "increasing";
    } else if (recentCount < olderCount * 0.5) {
      trend = "decreasing";
    }

    return {
      trend,
      frequency: matchingObs.length,
      firstSeen,
      lastSeen,
    };
  }
}
