/**
 * Recommendation Fusion Engine
 * Fuses duplicate recommendations from multiple engines
 */

import {
  RecommendationSource,
  FusedRecommendation,
  FusionConfig,
  FusionResult,
  SimilarityScore,
  defaultFusionConfig,
} from "./interfaces/IRecommendationFusionEngine";

// ============================================================================
// RECOMMENDATION FUSION ENGINE CLASS
// ============================================================================

export class RecommendationFusionEngine {
  private static instance: RecommendationFusionEngine;
  private config: FusionConfig;
  private fusionHistory: FusionResult[] = [];

  private constructor() {
    this.config = defaultFusionConfig;
  }

  static getInstance(): RecommendationFusionEngine {
    if (!RecommendationFusionEngine.instance) {
      RecommendationFusionEngine.instance = new RecommendationFusionEngine();
    }
    return RecommendationFusionEngine.instance;
  }

  /**
   * Set configuration
   */
  setConfig(config: Partial<FusionConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Fuse recommendations from multiple engines
   */
  fuseRecommendations(recommendations: RecommendationSource[]): FusionResult {
    if (!this.config.deduplicationEnabled) {
      // Return as-is if deduplication is disabled
      const fused = this.createFusedRecommendations(recommendations);
      return this.createFusionResult(recommendations, fused, 0, 0, 0);
    }

    // Group by category if enabled
    const grouped = this.config.categoryGrouping 
      ? this.groupByCategory(recommendations)
      : { all: recommendations };

    const fusedRecommendations: FusedRecommendation[] = [];
    let totalDuplicatesRemoved = 0;
    let totalConfidenceImprovement = 0;

    Object.values(grouped).forEach(group => {
      const fused = this.fuseGroup(group);
      fusedRecommendations.push(...fused);
      totalDuplicatesRemoved += group.length - fused.length;
      totalConfidenceImprovement += this.calculateConfidenceImprovement(group, fused);
    });

    // Limit recommendations per category
    const limited = this.limitByCategory(fusedRecommendations);

    const result = this.createFusionResult(
      recommendations,
      limited,
      totalDuplicatesRemoved,
      Object.keys(grouped).length,
      totalConfidenceImprovement
    );

    this.fusionHistory.push(result);
    return result;
  }

  /**
   * Group recommendations by category
   */
  private groupByCategory(recommendations: RecommendationSource[]): Record<string, RecommendationSource[]> {
    const grouped: Record<string, RecommendationSource[]> = {};

    recommendations.forEach(rec => {
      const category = this.extractCategory(rec.recommendation);
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(rec);
    });

    return grouped;
  }

  /**
   * Extract category from recommendation
   */
  private extractCategory(recommendation: string): string {
    // Simple category extraction - in production would use NLP
    const lowerRec = recommendation.toLowerCase();
    
    if (lowerRec.includes("communication")) return "communication";
    if (lowerRec.includes("leadership")) return "leadership";
    if (lowerRec.includes("negotiation")) return "negotiation";
    if (lowerRec.includes("english")) return "english";
    if (lowerRec.includes("technical")) return "technical";
    if (lowerRec.includes("soft") || lowerRec.includes("skill")) return "soft_skills";
    
    return "general";
  }

  /**
   * Fuse a group of recommendations
   */
  private fuseGroup(recommendations: RecommendationSource[]): FusedRecommendation[] {
    const fused: FusedRecommendation[] = [];
    const processed = new Set<number>();

    recommendations.forEach((rec, index) => {
      if (processed.has(index)) return;

      // Find similar recommendations
      const similar = this.findSimilarRecommendations(rec, recommendations, index);
      similar.forEach(i => processed.add(i));

      // Create fused recommendation
      const fusedRec = this.createFusedRecommendation(similar.map(i => recommendations[i]));
      fused.push(fusedRec);
    });

    return fused;
  }

  /**
   * Find similar recommendations
   */
  private findSimilarRecommendations(
    target: RecommendationSource,
    allRecommendations: RecommendationSource[],
    startIndex: number
  ): number[] {
    const similar: number[] = [startIndex];

    for (let i = startIndex + 1; i < allRecommendations.length; i++) {
      const similarity = this.calculateSimilarity(
        target.recommendation,
        allRecommendations[i].recommendation
      );

      if (similarity >= this.config.similarityThreshold) {
        similar.push(i);
      }
    }

    return similar;
  }

  /**
   * Calculate similarity between two recommendations
   */
  private calculateSimilarity(rec1: string, rec2: string): number {
    // Simple text similarity - in production would use semantic similarity
    const words1 = new Set(rec1.toLowerCase().split(/\s+/));
    const words2 = new Set(rec2.toLowerCase().split(/\s+/));

    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);

    return union.size > 0 ? intersection.size / union.size : 0;
  }

  /**
   * Create fused recommendation from sources
   */
  private createFusedRecommendation(sources: RecommendationSource[]): FusedRecommendation {
    const category = this.extractCategory(sources[0].recommendation);
    const content = this.fuseContent(sources);
    const confidence = this.aggregateConfidence(sources);
    const priority = this.aggregatePriority(sources);
    const reasoning = this.generateFusionReasoning(sources);

    return {
      id: `fused_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      category,
      content,
      sources,
      fusedFrom: sources.map(s => s.engine),
      confidence,
      priority,
      reasoning,
      duplicatesRemoved: sources.length - 1,
      timestamp: new Date(),
    };
  }

  /**
   * Fuse content from multiple sources
   */
  private fuseContent(sources: RecommendationSource[]): string {
    // Use the recommendation with highest confidence
    const sortedByConfidence = [...sources].sort((a, b) => b.confidence - a.confidence);
    return sortedByConfidence[0].recommendation;
  }

  /**
   * Aggregate confidence from sources
   */
  private aggregateConfidence(sources: RecommendationSource[]): number {
    const method = this.config.confidenceAggregation;

    if (method === "average") {
      return sources.reduce((sum, s) => sum + s.confidence, 0) / sources.length;
    } else if (method === "max") {
      return Math.max(...sources.map(s => s.confidence));
    } else if (method === "weighted") {
      // Weight by priority
      const totalPriority = sources.reduce((sum, s) => sum + s.priority, 0);
      const weightedSum = sources.reduce((sum, s) => sum + s.confidence * s.priority, 0);
      return totalPriority > 0 ? weightedSum / totalPriority : 0;
    }

    return sources[0].confidence;
  }

  /**
   * Aggregate priority from sources
   */
  private aggregatePriority(sources: RecommendationSource[]): number {
    const method = this.config.priorityAggregation;

    if (method === "average") {
      return sources.reduce((sum, s) => sum + s.priority, 0) / sources.length;
    } else if (method === "max") {
      return Math.max(...sources.map(s => s.priority));
    } else if (method === "weighted") {
      // Weight by confidence
      const totalConfidence = sources.reduce((sum, s) => sum + s.confidence, 0);
      const weightedSum = sources.reduce((sum, s) => sum + s.priority * s.confidence, 0);
      return totalConfidence > 0 ? weightedSum / totalConfidence : 0;
    }

    return sources[0].priority;
  }

  /**
   * Generate fusion reasoning
   */
  private generateFusionReasoning(sources: RecommendationSource[]): string {
    const engineNames = sources.map(s => s.engine);
    const avgConfidence = (sources.reduce((sum, s) => sum + s.confidence, 0) / sources.length).toFixed(2);
    
    return `Fused from ${engineNames.join(", ")}. Average confidence: ${avgConfidence}`;
  }

  /**
   * Calculate confidence improvement
   */
  private calculateConfidenceImprovement(
    original: RecommendationSource[],
    fused: FusedRecommendation[]
  ): number {
    const originalAvg = original.reduce((sum, s) => sum + s.confidence, 0) / original.length;
    const fusedAvg = fused.reduce((sum, f) => sum + f.confidence, 0) / fused.length;
    return fusedAvg - originalAvg;
  }

  /**
   * Limit recommendations by category
   */
  private limitByCategory(recommendations: FusedRecommendation[]): FusedRecommendation[] {
    const categoryCount: Record<string, number> = {};
    const limited: FusedRecommendation[] = [];

    recommendations.forEach(rec => {
      const count = categoryCount[rec.category] || 0;
      if (count < this.config.maxRecommendationsPerCategory) {
        limited.push(rec);
        categoryCount[rec.category] = count + 1;
      }
    });

    return limited;
  }

  /**
   * Create fused recommendations (no deduplication)
   */
  private createFusedRecommendations(recommendations: RecommendationSource[]): FusedRecommendation[] {
    return recommendations.map(rec => ({
      id: `fused_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      category: this.extractCategory(rec.recommendation),
      content: rec.recommendation,
      sources: [rec],
      fusedFrom: [rec.engine],
      confidence: rec.confidence,
      priority: rec.priority,
      reasoning: `Single recommendation from ${rec.engine}`,
      duplicatesRemoved: 0,
      timestamp: new Date(),
    }));
  }

  /**
   * Create fusion result
   */
  private createFusionResult(
    input: RecommendationSource[],
    fused: FusedRecommendation[],
    duplicatesRemoved: number,
    categoriesFused: number,
    confidenceImprovement: number
  ): FusionResult {
    return {
      id: `fusion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      inputRecommendations: input,
      fusedRecommendations: fused,
      duplicatesRemoved,
      categoriesFused,
      totalConfidenceImprovement: confidenceImprovement,
      timestamp: new Date(),
    };
  }

  /**
   * Get fusion history
   */
  getFusionHistory(): FusionResult[] {
    return this.fusionHistory;
  }

  /**
   * Get fusion statistics
   */
  getStatistics(): {
    totalFusions: number;
    averageDuplicatesRemoved: number;
    averageConfidenceImprovement: number;
    totalRecommendationsProcessed: number;
    totalRecommendationsOutput: number;
    categoryDistribution: Record<string, number>;
    engineDistribution: Record<string, number>;
  } {
    const totalFusions = this.fusionHistory.length;
    const averageDuplicatesRemoved = totalFusions > 0
      ? this.fusionHistory.reduce((sum, f) => sum + f.duplicatesRemoved, 0) / totalFusions
      : 0;
    const averageConfidenceImprovement = totalFusions > 0
      ? this.fusionHistory.reduce((sum, f) => sum + f.totalConfidenceImprovement, 0) / totalFusions
      : 0;
    const totalRecommendationsProcessed = this.fusionHistory.reduce(
      (sum, f) => sum + f.inputRecommendations.length,
      0
    );
    const totalRecommendationsOutput = this.fusionHistory.reduce(
      (sum, f) => sum + f.fusedRecommendations.length,
      0
    );

    const categoryDistribution: Record<string, number> = {};
    const engineDistribution: Record<string, number> = {};

    this.fusionHistory.forEach(fusion => {
      fusion.fusedRecommendations.forEach(rec => {
        categoryDistribution[rec.category] = (categoryDistribution[rec.category] || 0) + 1;
      });
      fusion.inputRecommendations.forEach(rec => {
        engineDistribution[rec.engine] = (engineDistribution[rec.engine] || 0) + 1;
      });
    });

    return {
      totalFusions,
      averageDuplicatesRemoved,
      averageConfidenceImprovement,
      totalRecommendationsProcessed,
      totalRecommendationsOutput,
      categoryDistribution,
      engineDistribution,
    };
  }

  /**
   * Export data
   */
  exportData(): {
    fusionHistory: FusionResult[];
    config: FusionConfig;
  } {
    return {
      fusionHistory: this.fusionHistory,
      config: this.config,
    };
  }

  /**
   * Import data
   */
  importData(data: {
    fusionHistory: FusionResult[];
    config?: FusionConfig;
  }): void {
    this.fusionHistory = data.fusionHistory;
    if (data.config) {
      this.setConfig(data.config);
    }
  }

  /**
   * Clear fusion history
   */
  clearHistory(): void {
    this.fusionHistory = [];
  }
}

export const recommendationFusionEngine = RecommendationFusionEngine.getInstance();
