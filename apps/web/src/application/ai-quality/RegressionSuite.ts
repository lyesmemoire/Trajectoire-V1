/**
 * Regression Suite
 * Automated regression testing for AI quality
 */

import {
  RegressionTestResult,
  MetricsComparison,
  CriteriaComparison,
  RegressionFailure,
  ConversationTurn,
  CriteriaScores,
  QualityMetrics,
} from "./interfaces/IEvaluationPlatform";
import { scenarioLibrary, InterviewScenario } from "./ScenarioLibrary";
import { candidateSimulator, SyntheticCandidate } from "./CandidateSimulator";
import { evaluationEngine, ConversationEvaluation } from "./EvaluationEngine";
import { qualityMetricsEngine } from "./QualityMetricsEngine";
import { goldenDataset } from "./GoldenDataset";

// ============================================================================
// REGRESSION CONFIGURATION
// ============================================================================

export interface RegressionConfig {
  totalSimulations: number;
  scenariosToTest: string[];
  behaviors: SyntheticCandidate["behavior"][];
  thresholds: {
    overallScore: number; // Minimum acceptable score
    scoreDelta: number; // Maximum acceptable degradation
    metricThresholds: Partial<Record<keyof QualityMetrics, number>>;
    criterionThresholds: Partial<Record<keyof CriteriaScores, number>>;
  };
  failOnRegression: boolean;
  compareWithGolden: boolean;
}

export const defaultRegressionConfig: RegressionConfig = {
  totalSimulations: 1000,
  scenariosToTest: [], // Empty = test all scenarios
  behaviors: ["excellent", "good", "average", "poor"],
  thresholds: {
    overallScore: 70,
    scoreDelta: -5, // Allow 5 point degradation
    metricThresholds: {
      hallucinationRate: 0.1,
      relevanceScore: 0.7,
    },
    criterionThresholds: {
      coherence: 6,
      relevance: 6,
      naturalness: 6,
    },
  },
  failOnRegression: true,
  compareWithGolden: true,
};

// ============================================================================
// REGRESSION SUITE CLASS
// ============================================================================

export class RegressionSuite {
  private static instance: RegressionSuite;
  private currentVersion: string = "1.0.0";
  private previousVersion: string = "1.0.0";
  private testHistory: RegressionTestResult[] = [];

  private constructor() {}

  static getInstance(): RegressionSuite {
    if (!RegressionSuite.instance) {
      RegressionSuite.instance = new RegressionSuite();
    }
    return RegressionSuite.instance;
  }

  /**
   * Set current version
   */
  setCurrentVersion(version: string): void {
    this.currentVersion = version;
  }

  /**
   * Set previous version
   */
  setPreviousVersion(version: string): void {
    this.previousVersion = version;
  }

  /**
   * Run regression test
   */
  async runRegressionTest(config?: Partial<RegressionConfig>): Promise<Omit<RegressionTestResult, "testId"> & { testId?: string }> {
    const finalConfig = { ...defaultRegressionConfig, ...config };
    const testId = `regression_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Get scenarios to test
    let scenarios = scenarioLibrary.getAllScenarios();
    if (finalConfig.scenariosToTest.length > 0) {
      scenarios = scenarios.filter(s => finalConfig.scenariosToTest.includes(s.id));
    }

    // Run simulations
    const results: Array<{
      scenarioId: string;
      behavior: SyntheticCandidate["behavior"];
      evaluation: ConversationEvaluation;
      goldenComparison?: any;
    }> = [];

    for (const scenario of scenarios) {
      for (const behavior of finalConfig.behaviors) {
        // Simulate conversation
        const simulationResult = await this.simulateConversation(scenario, behavior);
        results.push(simulationResult);
      }
    }

    // Calculate aggregate metrics
    const aggregateResults = this.calculateAggregateResults(results);

    // Compare with previous version
    const metricsComparison = this.compareWithPreviousVersion(aggregateResults.metrics);
    const criteriaComparison = this.compareWithPreviousCriteria(aggregateResults.criteria);

    // Calculate overall scores
    const currentOverallScore = aggregateResults.overallScore;
    const previousOverallScore = this.getPreviousOverallScore();
    const scoreDelta = currentOverallScore - previousOverallScore;

    // Detect failures
    const failures = this.detectFailures(
      results,
      metricsComparison,
      criteriaComparison,
      finalConfig
    );

    const passed = failures.length === 0 || !finalConfig.failOnRegression;

    const result: Omit<RegressionTestResult, "testId"> & { testId?: string } = {
      testId,
      timestamp: new Date(),
      version: this.currentVersion,
      previousVersion: this.previousVersion,
      totalSimulations: results.length,
      passedSimulations: results.length - failures.length,
      failedSimulations: failures.length,
      overallScore: currentOverallScore,
      previousScore: previousOverallScore,
      scoreDelta,
      metricsComparison,
      criteriaComparison,
      passed,
      failures,
    };

    // Store in history
    this.testHistory.push(result as RegressionTestResult);

    return result;
  }

  /**
   * Simulate a conversation
   */
  private async simulateConversation(
    scenario: InterviewScenario,
    behavior: SyntheticCandidate["behavior"]
  ): Promise<{
    scenarioId: string;
    behavior: SyntheticCandidate["behavior"];
    evaluation: ConversationEvaluation;
    goldenComparison?: any;
  }> {
    // Initialize candidate
    candidateSimulator.initializeCandidate(scenario, behavior);

    // Simulate conversation turns
    const turns: ConversationTurn[] = [];
    const maxTurns = 20; // Limit conversation length

    for (let i = 0; i < maxTurns; i++) {
      // Recruiter asks a question (mock)
      const recruiterTurn: ConversationTurn = {
        id: `turn_${i}_recruiter`,
        role: "recruiter",
        content: this.generateRecruiterQuestion(scenario, i),
        timestamp: new Date(),
        tokens: 50,
        latency: 1000,
      };
      turns.push(recruiterTurn);

      // Candidate responds
      const candidateTurn = candidateSimulator.generateResponse(recruiterTurn.content);
      turns.push(candidateTurn);

      // Stop if conversation seems complete
      if (i >= 5 && Math.random() > 0.7) {
        break;
      }
    }

    // Evaluate conversation
    const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const evaluation = evaluationEngine.evaluateConversation(
      conversationId,
      scenario.id,
      turns
    );

    // Record metrics
    qualityMetricsEngine.recordMetrics(
      evaluation.id,
      this.currentVersion,
      evaluation.overallScore,
      evaluation.criteriaScores,
      evaluation.metrics,
      scenario.id,
      conversationId
    );

    // Compare with golden dataset if available
    let goldenComparison;
    try {
      goldenComparison = goldenDataset.compareAgainstGolden(
        conversationId,
        scenario.id,
        turns
      );
    } catch (error) {
      // No golden conversation available
      goldenComparison = null;
    }

    return {
      scenarioId: scenario.id,
      behavior,
      evaluation,
      goldenComparison,
    };
  }

  /**
   * Generate recruiter question (mock)
   */
  private generateRecruiterQuestion(scenario: InterviewScenario, turnIndex: number): string {
    const questions = [
      "Can you tell me about yourself?",
      "What interests you about this position?",
      "What are your strengths?",
      "What are your weaknesses?",
      "Tell me about a challenging project you worked on.",
      "How do you handle stress?",
      "Where do you see yourself in 5 years?",
      "Do you have any questions for us?",
    ];
    return questions[turnIndex % questions.length];
  }

  /**
   * Calculate aggregate results
   */
  private calculateAggregateResults(results: Array<{
    evaluation: ConversationEvaluation;
  }>): {
    metrics: QualityMetrics;
    criteria: CriteriaScores;
    overallScore: number;
  } {
    const count = results.length;
    if (count === 0) {
      return {
        metrics: this.createEmptyMetrics(),
        criteria: this.createEmptyCriteria(),
        overallScore: 0,
      };
    }

    // Aggregate metrics
    const metrics: QualityMetrics = {} as QualityMetrics;
    Object.keys(results[0].evaluation.metrics).forEach(key => {
      const k = key as keyof QualityMetrics;
      const values = results.map(r => r.evaluation.metrics[k]);
      if (typeof values[0] === "number") {
        metrics[k] = (values as number[]).reduce((sum, val) => sum + val, 0) / count;
      }
    });

    // Aggregate criteria
    const criteria: CriteriaScores = {} as CriteriaScores;
    Object.keys(results[0].evaluation.criteriaScores).forEach(key => {
      const k = key as keyof CriteriaScores;
      const values = results.map(r => r.evaluation.criteriaScores[k]);
      criteria[k] = values.reduce((sum, val) => sum + val, 0) / count;
    });

    // Overall score
    const overallScore = results.reduce((sum, r) => sum + r.evaluation.overallScore, 0) / count;

    return { metrics, criteria, overallScore };
  }

  /**
   * Create empty metrics
   */
  private createEmptyMetrics(): QualityMetrics {
    return {
      questionRepetitionRate: 0,
      promptSize: 0,
      promptCost: 0,
      conversationLength: 0,
      averageTurns: 0,
      averageTokens: 0,
      openaiCost: 0,
      hallucinationRate: 0,
      relevanceScore: 0,
      conversationFlowScore: 0,
      humanLikeScore: 0,
      recruiterConsistency: 0,
      emotionConsistency: 0,
      followUpQuality: 0,
      interviewCoverage: 0,
      evaluationAccuracy: 0,
      reportAccuracy: 0,
      coachingAccuracy: 0,
      latency: 0,
      throughput: 0,
    };
  }

  /**
   * Create empty criteria
   */
  private createEmptyCriteria(): CriteriaScores {
    return {
      coherence: 0,
      relevance: 0,
      variety: 0,
      naturalness: 0,
      fluency: 0,
      personality: 0,
      realism: 0,
      listeningAbility: 0,
      followUpQuality: 0,
      silenceManagement: 0,
      stressManagement: 0,
      adaptation: 0,
      repetitionAvoidance: 0,
      cvRespect: 0,
      contextRespect: 0,
      difficultyRespect: 0,
    };
  }

  /**
   * Compare with previous version metrics
   */
  private compareWithPreviousVersion(current: QualityMetrics): MetricsComparison {
    const previous = this.getPreviousMetrics();
    const deltas: Partial<Record<keyof QualityMetrics, number>> = {};
    const improved: (keyof QualityMetrics)[] = [];
    const degraded: (keyof QualityMetrics)[] = [];

    Object.keys(current).forEach(key => {
      const k = key as keyof QualityMetrics;
      const delta = current[k] - previous[k];
      deltas[k] = delta;

      if (delta > 0) {
        improved.push(k);
      } else if (delta < 0) {
        degraded.push(k);
      }
    });

    return {
      current,
      previous,
      deltas,
      improved,
      degraded,
    };
  }

  /**
   * Compare with previous version criteria
   */
  private compareWithPreviousCriteria(current: CriteriaScores): CriteriaComparison {
    const previous = this.getPreviousCriteria();
    const deltas: Partial<Record<keyof CriteriaScores, number>> = {};
    const improved: (keyof CriteriaScores)[] = [];
    const degraded: (keyof CriteriaScores)[] = [];

    Object.keys(current).forEach(key => {
      const k = key as keyof CriteriaScores;
      const delta = current[k] - previous[k];
      deltas[k] = delta;

      if (delta > 0) {
        improved.push(k);
      } else if (delta < 0) {
        degraded.push(k);
      }
    });

    return {
      current,
      previous,
      deltas,
      improved,
      degraded,
    };
  }

  /**
   * Get previous metrics
   */
  private getPreviousMetrics(): QualityMetrics {
    const aggregation = qualityMetricsEngine.aggregateMetrics(this.previousVersion);
    const metrics = this.createEmptyMetrics();
    
    Object.keys(aggregation.metricsAggregation).forEach(key => {
      const k = key as keyof QualityMetrics;
      const agg = aggregation.metricsAggregation[k];
      if (agg) {
        metrics[k] = agg.average as any;
      }
    });
    
    return metrics;
  }

  /**
   * Get previous criteria
   */
  private getPreviousCriteria(): CriteriaScores {
    const aggregation = qualityMetricsEngine.aggregateMetrics(this.previousVersion);
    const criteria = this.createEmptyCriteria();
    
    Object.keys(aggregation.criteriaAggregation).forEach(key => {
      const k = key as keyof CriteriaScores;
      const agg = aggregation.criteriaAggregation[k];
      if (agg) {
        criteria[k] = agg.average;
      }
    });
    
    return criteria;
  }

  /**
   * Get previous overall score
   */
  private getPreviousOverallScore(): number {
    const aggregation = qualityMetricsEngine.aggregateMetrics(this.previousVersion);
    return aggregation.overallAggregation.average;
  }

  /**
   * Detect failures
   */
  private detectFailures(
    results: Array<{
      scenarioId: string;
      behavior: SyntheticCandidate["behavior"];
      evaluation: ConversationEvaluation;
      goldenComparison?: any;
    }>,
    metricsComparison: MetricsComparison,
    criteriaComparison: CriteriaComparison,
    config: RegressionConfig
  ): RegressionFailure[] {
    const failures: RegressionFailure[] = [];

    // Check overall score threshold
    const overallScore = results.reduce((sum, r) => sum + r.evaluation.overallScore, 0) / results.length;
    if (overallScore < config.thresholds.overallScore) {
      failures.push({
        scenarioId: "overall",
        reason: `Overall score ${overallScore.toFixed(2)} below threshold ${config.thresholds.overallScore}`,
        expected: config.thresholds.overallScore,
        actual: overallScore,
        threshold: config.thresholds.overallScore,
      });
    }

    // Check score delta
    const scoreDelta = overallScore - this.getPreviousOverallScore();
    if (scoreDelta < config.thresholds.scoreDelta) {
      failures.push({
        scenarioId: "overall",
        reason: `Score delta ${scoreDelta.toFixed(2)} below threshold ${config.thresholds.scoreDelta}`,
        expected: config.thresholds.scoreDelta,
        actual: scoreDelta,
        threshold: config.thresholds.scoreDelta,
      });
    }

    // Check metric thresholds
    Object.entries(config.thresholds.metricThresholds).forEach(([key, threshold]) => {
      const k = key as keyof QualityMetrics;
      const current = metricsComparison.current[k];
      if (typeof current === "number" && current > threshold) {
        failures.push({
          scenarioId: "metrics",
          reason: `Metric ${key} ${current} exceeds threshold ${threshold}`,
          metric: k,
          expected: threshold,
          actual: current,
          threshold,
        });
      }
    });

    // Check criterion thresholds
    Object.entries(config.thresholds.criterionThresholds).forEach(([key, threshold]) => {
      const k = key as keyof CriteriaScores;
      const current = criteriaComparison.current[k];
      if (current < threshold) {
        failures.push({
          scenarioId: "criteria",
          reason: `Criterion ${key} ${current} below threshold ${threshold}`,
          criterion: k,
          expected: threshold,
          actual: current,
          threshold,
        });
      }
    });

    // Check golden dataset comparisons
    if (config.compareWithGolden) {
      results.forEach(result => {
        if (result.goldenComparison && !result.goldenComparison.passed) {
          failures.push({
            scenarioId: result.scenarioId,
            reason: `Golden dataset comparison failed: similarity ${result.goldenComparison.similarity.toFixed(2)} below threshold ${result.goldenComparison.threshold}`,
            expected: result.goldenComparison.threshold,
            actual: result.goldenComparison.similarity,
            threshold: result.goldenComparison.threshold,
          });
        }
      });
    }

    return failures;
  }

  /**
   * Get test history
   */
  getTestHistory(): RegressionTestResult[] {
    return this.testHistory;
  }

  /**
   * Get latest test result
   */
  getLatestTestResult(): RegressionTestResult | null {
    if (this.testHistory.length === 0) return null;
    return this.testHistory[this.testHistory.length - 1];
  }

  /**
   * Clear test history
   */
  clearTestHistory(): void {
    this.testHistory = [];
  }

  /**
   * Export test results
   */
  exportTestResults(): RegressionTestResult[] {
    return this.testHistory;
  }

  /**
   * Import test results
   */
  importTestResults(results: RegressionTestResult[]): void {
    this.testHistory = results;
  }
}

export const regressionSuite = RegressionSuite.getInstance();
