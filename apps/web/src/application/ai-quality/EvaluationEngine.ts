/**
 * AI Evaluation Engine
 * Evaluates AI recruiter quality based on multiple criteria
 */

import {
  ConversationEvaluation,
  CriteriaScores,
  QualityMetrics,
  ConversationTurn,
} from "./interfaces/IEvaluationPlatform";

export type { ConversationEvaluation };

// ============================================================================
// EVALUATION ENGINE CLASS
// ============================================================================

export class EvaluationEngine {
  private static instance: EvaluationEngine;

  private constructor() {}

  static getInstance(): EvaluationEngine {
    if (!EvaluationEngine.instance) {
      EvaluationEngine.instance = new EvaluationEngine();
    }
    return EvaluationEngine.instance;
  }

  /**
   * Evaluate a conversation
   */
  evaluateConversation(
    conversationId: string,
    scenarioId: string,
    turns: ConversationTurn[]
  ): ConversationEvaluation {
    const criteriaScores = this.calculateCriteriaScores(turns);
    const metrics = this.calculateQualityMetrics(turns);
    const overallScore = this.calculateOverallScore(criteriaScores, metrics);
    const feedback = this.generateFeedback(criteriaScores, metrics);
    const passed = overallScore >= 70; // Threshold for passing

    const evaluation: ConversationEvaluation = {
      id: `eval_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      conversationId,
      scenarioId,
      timestamp: new Date(),
      overallScore,
      criteriaScores,
      metrics,
      feedback,
      passed,
    };

    return evaluation;
  }

  /**
   * Calculate criteria scores
   */
  private calculateCriteriaScores(turns: ConversationTurn[]): CriteriaScores {
    const recruiterTurns = turns.filter(t => t.role === "recruiter");
    const candidateTurns = turns.filter(t => t.role === "candidate");

    return {
      coherence: this.calculateCoherence(recruiterTurns),
      relevance: this.calculateRelevance(recruiterTurns, candidateTurns),
      variety: this.calculateVariety(recruiterTurns),
      naturalness: this.calculateNaturalness(recruiterTurns),
      fluency: this.calculateFluency(recruiterTurns),
      personality: this.calculatePersonality(recruiterTurns),
      realism: this.calculateRealism(recruiterTurns, candidateTurns),
      listeningAbility: this.calculateListeningAbility(recruiterTurns, candidateTurns),
      followUpQuality: this.calculateFollowUpQuality(recruiterTurns, candidateTurns),
      silenceManagement: this.calculateSilenceManagement(recruiterTurns),
      stressManagement: this.calculateStressManagement(recruiterTurns, candidateTurns),
      adaptation: this.calculateAdaptation(recruiterTurns, candidateTurns),
      repetitionAvoidance: this.calculateRepetitionAvoidance(recruiterTurns),
      cvRespect: this.calculateCVRespect(recruiterTurns),
      contextRespect: this.calculateContextRespect(recruiterTurns),
      difficultyRespect: this.calculateDifficultyRespect(recruiterTurns),
    };
  }

  /**
   * Calculate quality metrics
   */
  private calculateQualityMetrics(turns: ConversationTurn[]): QualityMetrics {
    const recruiterTurns = turns.filter(t => t.role === "recruiter");
    const totalTokens = turns.reduce((sum, t) => sum + (t.tokens || 0), 0);

    return {
      questionRepetitionRate: this.calculateQuestionRepetitionRate(recruiterTurns),
      promptSize: this.calculatePromptSize(recruiterTurns),
      promptCost: this.calculatePromptCost(recruiterTurns),
      conversationLength: turns.length,
      averageTurns: this.calculateAverageTurns(turns),
      averageTokens: this.calculateAverageTokens(turns),
      openaiCost: this.calculateOpenAICost(turns),
      hallucinationRate: this.calculateHallucinationRate(recruiterTurns),
      relevanceScore: this.calculateRelevanceScore(recruiterTurns),
      conversationFlowScore: this.calculateConversationFlowScore(turns),
      humanLikeScore: this.calculateHumanLikeScore(recruiterTurns),
      recruiterConsistency: this.calculateRecruiterConsistency(recruiterTurns),
      emotionConsistency: this.calculateEmotionConsistency(recruiterTurns),
      followUpQuality: this.calculateFollowUpQualityMetric(recruiterTurns),
      interviewCoverage: this.calculateInterviewCoverage(recruiterTurns),
      evaluationAccuracy: this.calculateEvaluationAccuracy(recruiterTurns),
      reportAccuracy: this.calculateReportAccuracy(recruiterTurns),
      coachingAccuracy: this.calculateCoachingAccuracy(recruiterTurns),
      latency: this.calculateAverageLatency(turns),
      throughput: this.calculateThroughput(turns),
    };
  }

  /**
   * Calculate overall score
   */
  private calculateOverallScore(criteriaScores: CriteriaScores, metrics: QualityMetrics): number {
    const criteriaWeight = 0.6;
    const metricsWeight = 0.4;

    const criteriaAverage = this.averageCriteriaScores(criteriaScores);
    const metricsAverage = this.averageQualityMetrics(metrics);

    return (criteriaAverage * criteriaWeight + metricsAverage * metricsWeight);
  }

  /**
   * Average criteria scores
   */
  private averageCriteriaScores(scores: CriteriaScores): number {
    const values = Object.values(scores);
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  /**
   * Average quality metrics (normalized to 0-10)
   */
  private averageQualityMetrics(metrics: QualityMetrics): number {
    const values = Object.values(metrics);
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  // ============================================================================
  // CRITERIA CALCULATIONS
  // ============================================================================

  private calculateCoherence(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    // Mock implementation - would analyze logical flow
    return 7.5;
  }

  private calculateRelevance(recruiterTurns: ConversationTurn[], candidateTurns: ConversationTurn[]): number {
    if (recruiterTurns.length === 0) return 0;
    // Mock implementation - would analyze question-response relevance
    return 8.0;
  }

  private calculateVariety(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    const uniqueQuestions = new Set(turns.map(t => t.content));
    return Math.min(10, (uniqueQuestions.size / turns.length) * 10);
  }

  private calculateNaturalness(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    // Mock implementation - would analyze language patterns
    return 7.0;
  }

  private calculateFluency(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    // Mock implementation - would analyze sentence structure
    return 8.5;
  }

  private calculatePersonality(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    // Mock implementation - would analyze personality consistency
    return 7.5;
  }

  private calculateRealism(recruiterTurns: ConversationTurn[], candidateTurns: ConversationTurn[]): number {
    if (recruiterTurns.length === 0) return 0;
    // Mock implementation - would compare to real interviews
    return 7.0;
  }

  private calculateListeningAbility(recruiterTurns: ConversationTurn[], candidateTurns: ConversationTurn[]): number {
    if (recruiterTurns.length === 0 || candidateTurns.length === 0) return 0;
    // Mock implementation - would analyze follow-up questions
    return 8.0;
  }

  private calculateFollowUpQuality(recruiterTurns: ConversationTurn[], candidateTurns: ConversationTurn[]): number {
    if (recruiterTurns.length === 0 || candidateTurns.length === 0) return 0;
    // Mock implementation - would analyze follow-up relevance
    return 7.5;
  }

  private calculateSilenceManagement(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    // Mock implementation - would analyze timing
    return 8.0;
  }

  private calculateStressManagement(recruiterTurns: ConversationTurn[], candidateTurns: ConversationTurn[]): number {
    if (recruiterTurns.length === 0 || candidateTurns.length === 0) return 0;
    // Mock implementation - would analyze stress cues
    return 7.5;
  }

  private calculateAdaptation(recruiterTurns: ConversationTurn[], candidateTurns: ConversationTurn[]): number {
    if (recruiterTurns.length === 0 || candidateTurns.length === 0) return 0;
    // Mock implementation - would analyze adaptation to candidate
    return 7.0;
  }

  private calculateRepetitionAvoidance(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    const repeatedPhrases = this.findRepeatedPhrases(turns);
    return Math.max(0, 10 - repeatedPhrases.length);
  }

  private calculateCVRespect(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    // Mock implementation - would analyze CV-based questions
    return 8.0;
  }

  private calculateContextRespect(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    // Mock implementation - would analyze context awareness
    return 7.5;
  }

  private calculateDifficultyRespect(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    // Mock implementation - would analyze question difficulty
    return 8.0;
  }

  // ============================================================================
  // METRICS CALCULATIONS
  // ============================================================================

  private calculateQuestionRepetitionRate(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    const repeatedPhrases = this.findRepeatedPhrases(turns);
    return repeatedPhrases.length / turns.length;
  }

  private calculatePromptSize(turns: ConversationTurn[]): number {
    return turns.reduce((sum, t) => sum + (t.tokens || 0), 0);
  }

  private calculatePromptCost(turns: ConversationTurn[]): number {
    const tokens = this.calculatePromptSize(turns);
    // Mock cost calculation: $0.001 per 1000 tokens
    return (tokens / 1000) * 0.001;
  }

  private calculateAverageTurns(turns: ConversationTurn[]): number {
    return turns.length;
  }

  private calculateAverageTokens(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    const totalTokens = turns.reduce((sum, t) => sum + (t.tokens || 0), 0);
    return totalTokens / turns.length;
  }

  private calculateOpenAICost(turns: ConversationTurn[]): number {
    return this.calculatePromptCost(turns);
  }

  private calculateHallucinationRate(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    // Mock implementation - would detect hallucinations
    return 0.05;
  }

  private calculateRelevanceScore(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    // Mock implementation - would calculate relevance
    return 0.85;
  }

  private calculateConversationFlowScore(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    // Mock implementation - would analyze flow
    return 0.80;
  }

  private calculateHumanLikeScore(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    // Mock implementation - would compare to human conversations
    return 0.75;
  }

  private calculateRecruiterConsistency(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    // Mock implementation - would analyze consistency
    return 0.85;
  }

  private calculateEmotionConsistency(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    // Mock implementation - would analyze emotion consistency
    return 0.80;
  }

  private calculateFollowUpQualityMetric(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    // Mock implementation - would analyze follow-up quality
    return 0.75;
  }

  private calculateInterviewCoverage(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    // Mock implementation - would analyze topic coverage
    return 0.80;
  }

  private calculateEvaluationAccuracy(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    // Mock implementation - would compare to ground truth
    return 0.85;
  }

  private calculateReportAccuracy(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    // Mock implementation - would analyze report quality
    return 0.80;
  }

  private calculateCoachingAccuracy(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    // Mock implementation - would analyze coaching quality
    return 0.75;
  }

  private calculateAverageLatency(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    const latencies = turns.map(t => t.latency || 0);
    return latencies.reduce((sum, lat) => sum + lat, 0) / latencies.length;
  }

  private calculateThroughput(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    // Mock implementation - would calculate conversations per minute
    return 1.0;
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private findRepeatedPhrases(turns: ConversationTurn[]): string[] {
    const phrases: string[] = [];
    const contentMap: Map<string, number> = new Map();

    turns.forEach(turn => {
      const words = turn.content.toLowerCase().split(/\s+/);
      words.forEach(word => {
        if (word.length > 3) {
          contentMap.set(word, (contentMap.get(word) || 0) + 1);
        }
      });
    });

    contentMap.forEach((count, phrase) => {
      if (count > 2) {
        phrases.push(phrase);
      }
    });

    return phrases;
  }

  /**
   * Generate feedback
   */
  private generateFeedback(criteriaScores: CriteriaScores, metrics: QualityMetrics): string {
    const overall = this.averageCriteriaScores(criteriaScores);
    
    let feedback = `Overall score: ${overall.toFixed(1)}/10. `;
    
    if (overall >= 8) {
      feedback += "Excellent performance across most criteria.";
    } else if (overall >= 6) {
      feedback += "Good performance with room for improvement.";
    } else if (overall >= 4) {
      feedback += "Average performance requiring significant improvement.";
    } else {
      feedback += "Poor performance requiring major improvements.";
    }

    // Add specific feedback based on low scores
    if (criteriaScores.repetitionAvoidance < 5) {
      feedback += " Reduce question repetition.";
    }
    if (criteriaScores.naturalness < 5) {
      feedback += " Improve conversation naturalness.";
    }
    if (metrics.hallucinationRate > 0.1) {
      feedback += " Address hallucination issues.";
    }

    return feedback;
  }

  /**
   * Validate evaluation
   */
  validateEvaluation(evaluation: ConversationEvaluation): boolean {
    // Basic validation
    return (
      evaluation.id !== undefined &&
      evaluation.conversationId !== undefined &&
      evaluation.scenarioId !== undefined &&
      evaluation.overallScore >= 0 &&
      evaluation.overallScore <= 100
    );
  }

  /**
   * Compare two evaluations
   */
  compareEvaluations(
    evaluationA: ConversationEvaluation,
    evaluationB: ConversationEvaluation
  ): {
    scoreDelta: number;
    improved: boolean;
    criteriaDeltas: Partial<Record<keyof CriteriaScores, number>>;
    metricsDeltas: Partial<Record<keyof QualityMetrics, number>>;
  } {
    const scoreDelta = evaluationB.overallScore - evaluationA.overallScore;
    
    const criteriaDeltas: Partial<Record<keyof CriteriaScores, number>> = {};
    Object.keys(evaluationA.criteriaScores).forEach(key => {
      const k = key as keyof CriteriaScores;
      criteriaDeltas[k] = evaluationB.criteriaScores[k] - evaluationA.criteriaScores[k];
    });

    const metricsDeltas: Partial<Record<keyof QualityMetrics, number>> = {};
    Object.keys(evaluationA.metrics).forEach(key => {
      const k = key as keyof QualityMetrics;
      metricsDeltas[k] = evaluationB.metrics[k] - evaluationA.metrics[k];
    });

    return {
      scoreDelta,
      improved: scoreDelta > 0,
      criteriaDeltas,
      metricsDeltas,
    };
  }
}

export const evaluationEngine = EvaluationEngine.getInstance();
