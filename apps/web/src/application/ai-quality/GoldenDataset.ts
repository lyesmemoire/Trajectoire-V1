/**
 * Golden Dataset
 * Manages reference conversations for regression testing
 */

import {
  GoldenConversation,
  ConversationTurn,
  CriteriaScores,
  QualityMetrics,
  ConversationEvaluation,
} from "./interfaces/IEvaluationPlatform";
import { scenarioLibrary, InterviewScenario } from "./ScenarioLibrary";
import { evaluationEngine } from "./EvaluationEngine";

// ============================================================================
// GOLDEN DATASET CLASS
// ============================================================================

export class GoldenDataset {
  private static instance: GoldenDataset;
  private goldenConversations: Map<string, GoldenConversation> = new Map();

  private constructor() {}

  static getInstance(): GoldenDataset {
    if (!GoldenDataset.instance) {
      GoldenDataset.instance = new GoldenDataset();
    }
    return GoldenDataset.instance;
  }

  /**
   * Add golden conversation
   */
  addGoldenConversation(conversation: GoldenConversation): void {
    if (conversation.isImmutable && this.goldenConversations.has(conversation.id)) {
      throw new Error(`Cannot modify immutable golden conversation: ${conversation.id}`);
    }
    this.goldenConversations.set(conversation.id, conversation);
  }

  /**
   * Get golden conversation by ID
   */
  getGoldenConversation(id: string): GoldenConversation | null {
    return this.goldenConversations.get(id) || null;
  }

  /**
   * Get golden conversations by scenario
   */
  getGoldenConversationsByScenario(scenarioId: string): GoldenConversation[] {
    const conversations: GoldenConversation[] = [];
    this.goldenConversations.forEach(conversation => {
      if (conversation.scenarioId === scenarioId) {
        conversations.push(conversation);
      }
    });
    return conversations;
  }

  /**
   * Get all golden conversations
   */
  getAllGoldenConversations(): GoldenConversation[] {
    return Array.from(this.goldenConversations.values());
  }

  /**
   * Compare conversation against golden dataset
   */
  compareAgainstGolden(
    conversationId: string,
    scenarioId: string,
    turns: ConversationTurn[]
  ): {
    goldenId: string;
    similarity: number;
    criteriaDelta: Partial<Record<keyof CriteriaScores, number>>;
    metricsDelta: Partial<Record<keyof QualityMetrics, number>>;
    passed: boolean;
    threshold: number;
  } {
    const goldenConversations = this.getGoldenConversationsByScenario(scenarioId);
    
    if (goldenConversations.length === 0) {
      throw new Error(`No golden conversations found for scenario: ${scenarioId}`);
    }

    // Evaluate current conversation
    const evaluation = evaluationEngine.evaluateConversation(conversationId, scenarioId, turns);

    // Find best matching golden conversation
    let bestMatch: GoldenConversation = goldenConversations[0];
    let bestSimilarity = 0;

    goldenConversations.forEach(golden => {
      const similarity = this.calculateSimilarity(evaluation, golden);
      if (similarity > bestSimilarity) {
        bestSimilarity = similarity;
        bestMatch = golden;
      }
    });

    // Calculate deltas
    const criteriaDelta: Partial<Record<keyof CriteriaScores, number>> = {};
    Object.keys(evaluation.criteriaScores).forEach(key => {
      const k = key as keyof CriteriaScores;
      criteriaDelta[k] = evaluation.criteriaScores[k] - bestMatch.expectedEvaluation[k];
    });

    const metricsDelta: Partial<Record<keyof QualityMetrics, number>> = {};
    Object.keys(evaluation.metrics).forEach(key => {
      const k = key as keyof QualityMetrics;
      if (typeof evaluation.metrics[k] === "number" && typeof bestMatch.expectedMetrics[k] === "number") {
        metricsDelta[k] = evaluation.metrics[k] - bestMatch.expectedMetrics[k];
      }
    });

    const threshold = 0.8; // 80% similarity threshold
    const passed = bestSimilarity >= threshold;

    return {
      goldenId: bestMatch.id,
      similarity: bestSimilarity,
      criteriaDelta,
      metricsDelta,
      passed,
      threshold,
    };
  }

  /**
   * Calculate similarity between evaluation and golden conversation
   */
  private calculateSimilarity(
    evaluation: ConversationEvaluation,
    golden: GoldenConversation
  ): number {
    // Calculate criteria similarity
    const criteriaSimilarity = this.calculateCriteriaSimilarity(
      evaluation.criteriaScores,
      golden.expectedEvaluation
    );

    // Calculate metrics similarity
    const metricsSimilarity = this.calculateMetricsSimilarity(
      evaluation.metrics,
      golden.expectedMetrics
    );

    // Weighted average
    return (criteriaSimilarity * 0.6 + metricsSimilarity * 0.4);
  }

  /**
   * Calculate criteria similarity
   */
  private calculateCriteriaSimilarity(
    current: CriteriaScores,
    expected: CriteriaScores
  ): number {
    const keys = Object.keys(current) as (keyof CriteriaScores)[];
    let totalDifference = 0;

    keys.forEach(key => {
      const difference = Math.abs(current[key] - expected[key]);
      totalDifference += difference;
    });

    const maxDifference = keys.length * 10; // Each criterion is 0-10
    const similarity = 1 - (totalDifference / maxDifference);
    return Math.max(0, similarity);
  }

  /**
   * Calculate metrics similarity
   */
  private calculateMetricsSimilarity(
    current: QualityMetrics,
    expected: QualityMetrics
  ): number {
    const keys = Object.keys(current) as (keyof QualityMetrics)[];
    let totalDifference = 0;
    let count = 0;

    keys.forEach(key => {
      const currentValue = current[key];
      const expectedValue = expected[key];
      
      if (typeof currentValue === "number" && typeof expectedValue === "number") {
        // Normalize metrics to 0-1 range for comparison
        const normalizedCurrent = this.normalizeMetric(key, currentValue);
        const normalizedExpected = this.normalizeMetric(key, expectedValue);
        const difference = Math.abs(normalizedCurrent - normalizedExpected);
        totalDifference += difference;
        count++;
      }
    });

    if (count === 0) return 1;

    const similarity = 1 - (totalDifference / count);
    return Math.max(0, similarity);
  }

  /**
   * Normalize metric to 0-1 range
   */
  private normalizeMetric(metric: keyof QualityMetrics, value: number): number {
    // Different metrics have different ranges, normalize them
    const ranges: Partial<Record<keyof QualityMetrics, { min: number; max: number }>> = {
      questionRepetitionRate: { min: 0, max: 1 },
      promptSize: { min: 0, max: 10000 },
      promptCost: { min: 0, max: 1 },
      conversationLength: { min: 0, max: 100 },
      averageTurns: { min: 0, max: 50 },
      averageTokens: { min: 0, max: 500 },
      openaiCost: { min: 0, max: 10 },
      hallucinationRate: { min: 0, max: 1 },
      relevanceScore: { min: 0, max: 1 },
      conversationFlowScore: { min: 0, max: 1 },
      humanLikeScore: { min: 0, max: 1 },
      recruiterConsistency: { min: 0, max: 1 },
      emotionConsistency: { min: 0, max: 1 },
      followUpQuality: { min: 0, max: 1 },
      interviewCoverage: { min: 0, max: 1 },
      evaluationAccuracy: { min: 0, max: 1 },
      reportAccuracy: { min: 0, max: 1 },
      coachingAccuracy: { min: 0, max: 1 },
      latency: { min: 0, max: 10000 },
      throughput: { min: 0, max: 10 },
    };

    const range = ranges[metric];
    if (!range) return value; // Return as-is if no range defined

    const normalized = (value - range.min) / (range.max - range.min);
    return Math.max(0, Math.min(1, normalized));
  }

  /**
   * Create golden conversation from evaluation
   */
  createGoldenConversation(
    scenarioId: string,
    turns: ConversationTurn[],
    evaluation: ConversationEvaluation,
    version: string
  ): GoldenConversation {
    const golden: GoldenConversation = {
      id: `golden_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      scenarioId,
      conversation: turns,
      expectedEvaluation: evaluation.criteriaScores,
      expectedMetrics: evaluation.metrics,
      createdAt: new Date(),
      version,
      isImmutable: false, // Can be modified initially
    };

    this.addGoldenConversation(golden);
    return golden;
  }

  /**
   * Make golden conversation immutable
   */
  makeImmutable(id: string): void {
    const conversation = this.goldenConversations.get(id);
    if (!conversation) {
      throw new Error(`Golden conversation not found: ${id}`);
    }
    conversation.isImmutable = true;
    this.goldenConversations.set(id, conversation);
  }

  /**
   * Delete golden conversation
   */
  deleteGoldenConversation(id: string): void {
    const conversation = this.goldenConversations.get(id);
    if (!conversation) {
      throw new Error(`Golden conversation not found: ${id}`);
    }
    if (conversation.isImmutable) {
      throw new Error(`Cannot delete immutable golden conversation: ${id}`);
    }
    this.goldenConversations.delete(id);
  }

  /**
   * Get golden dataset statistics
   */
  getStatistics(): {
    totalConversations: number;
    immutableConversations: number;
    scenariosCovered: string[];
    versions: string[];
  } {
    const conversations = this.getAllGoldenConversations();
    const scenariosCovered = new Set<string>();
    const versions = new Set<string>();

    conversations.forEach(conversation => {
      scenariosCovered.add(conversation.scenarioId);
      versions.add(conversation.version);
    });

    const immutableConversations = conversations.filter(c => c.isImmutable).length;

    return {
      totalConversations: conversations.length,
      immutableConversations,
      scenariosCovered: Array.from(scenariosCovered),
      versions: Array.from(versions),
    };
  }

  /**
   * Export golden dataset
   */
  exportDataset(): GoldenConversation[] {
    return this.getAllGoldenConversations();
  }

  /**
   * Import golden dataset
   */
  importDataset(conversations: GoldenConversation[]): void {
    conversations.forEach(conversation => {
      this.addGoldenConversation(conversation);
    });
  }

  /**
   * Clear golden dataset
   */
  clearDataset(): void {
    this.goldenConversations.clear();
  }
}

export const goldenDataset = GoldenDataset.getInstance();
