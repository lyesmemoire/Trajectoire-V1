/**
 * AB Testing Engine
 * Manages A/B testing for prompt versions
 */

import {
  ABTest,
  PromptVersion,
  ABTestResults,
} from "./interfaces/IEvaluationPlatform";
import { promptVersionManager } from "./PromptVersionManager";
import { scenarioLibrary, InterviewScenario } from "./ScenarioLibrary";
import { candidateSimulator, SyntheticCandidate } from "./CandidateSimulator";
import { evaluationEngine, ConversationEvaluation } from "./EvaluationEngine";
import { ConversationTurn } from "./interfaces/IEvaluationPlatform";

// ============================================================================
// AB TEST CONFIGURATION
// ============================================================================

export interface ABTestConfig {
  promptId: string;
  versionA: string;
  versionB: string;
  name: string;
  description: string;
  sampleSize: number;
  scenariosToTest: string[];
  behaviors: SyntheticCandidate["behavior"][];
  significanceLevel: number; // 0.05 for 95% confidence
  minimumParticipants: number;
}

export const defaultABTestConfig: Partial<ABTestConfig> = {
  sampleSize: 100,
  scenariosToTest: [], // Empty = test all scenarios
  behaviors: ["excellent", "good", "average", "poor"],
  significanceLevel: 0.05,
  minimumParticipants: 30,
};

// ============================================================================
// AB TESTING ENGINE CLASS
// ============================================================================

export class ABTestingEngine {
  private static instance: ABTestingEngine;
  private tests: Map<string, ABTest> = new Map();

  private constructor() {}

  static getInstance(): ABTestingEngine {
    if (!ABTestingEngine.instance) {
      ABTestingEngine.instance = new ABTestingEngine();
    }
    return ABTestingEngine.instance;
  }

  /**
   * Create A/B test
   */
  createABTest(config: ABTestConfig): ABTest {
    const finalConfig = { ...defaultABTestConfig, ...config } as ABTestConfig;

    // Get prompt versions
    const promptA = promptVersionManager.getPromptVersion(
      finalConfig.promptId,
      finalConfig.versionA
    );
    const promptB = promptVersionManager.getPromptVersion(
      finalConfig.promptId,
      finalConfig.versionB
    );

    if (!promptA || !promptB) {
      throw new Error("One or both prompt versions not found");
    }

    const test: ABTest = {
      id: `abtest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: finalConfig.name,
      description: finalConfig.description,
      promptA,
      promptB,
      createdAt: new Date(),
      status: "running",
      totalParticipants: 0,
      participantsA: 0,
      participantsB: 0,
      results: {
        qualityScoreA: 0,
        qualityScoreB: 0,
        costA: 0,
        costB: 0,
        latencyA: 0,
        latencyB: 0,
        satisfactionA: 0,
        satisfactionB: 0,
        successRateA: 0,
        successRateB: 0,
        winner: "inconclusive",
        confidence: 0,
        statisticalSignificance: false,
      },
    };

    this.tests.set(test.id, test);
    return test;
  }

  /**
   * Run A/B test
   */
  async runABTest(testId: string): Promise<ABTest> {
    const test = this.tests.get(testId);
    if (!test) {
      throw new Error(`Test not found: ${testId}`);
    }

    if (test.status !== "running") {
      throw new Error(`Test is not running: ${test.status}`);
    }

    // Get scenarios to test
    const scenarios = scenarioLibrary.getAllScenarios();
    if (scenarios.length === 0) {
      throw new Error("No scenarios available");
    }

    // Run tests for version A
    const resultsA = await this.runVersionTests(
      test.promptA,
      scenarios,
      test.participantsA
    );

    // Run tests for version B
    const resultsB = await this.runVersionTests(
      test.promptB,
      scenarios,
      test.participantsB
    );

    // Calculate results
    const testResults = this.calculateTestResults(resultsA, resultsB);

    // Update test
    test.results = testResults;
    test.totalParticipants = resultsA.length + resultsB.length;
    test.participantsA = resultsA.length;
    test.participantsB = resultsB.length;
    test.status = "completed";

    this.tests.set(testId, test);

    return test;
  }

  /**
   * Run tests for a specific version
   */
  private async runVersionTests(
    promptVersion: PromptVersion,
    scenarios: InterviewScenario[],
    currentCount: number
  ): Promise<ConversationEvaluation[]> {
    const results: ConversationEvaluation[] = [];
    const behaviors: SyntheticCandidate["behavior"][] = ["excellent", "good", "average", "poor"];

    for (const scenario of scenarios) {
      for (const behavior of behaviors) {
        // Simulate conversation
        const simulationResult = await this.simulateConversation(
          scenario,
          behavior,
          promptVersion
        );
        results.push(simulationResult);

        // Stop if we've reached sample size
        if (results.length >= 100) {
          break;
        }
      }

      if (results.length >= 100) {
        break;
      }
    }

    return results;
  }

  /**
   * Simulate conversation with specific prompt version
   */
  private async simulateConversation(
    scenario: InterviewScenario,
    behavior: SyntheticCandidate["behavior"],
    promptVersion: PromptVersion
  ): Promise<ConversationEvaluation> {
    // Initialize candidate
    candidateSimulator.initializeCandidate(scenario, behavior);

    // Simulate conversation turns
    const turns: ConversationTurn[] = [];
    const maxTurns = 20;

    for (let i = 0; i < maxTurns; i++) {
      // Recruiter asks a question (using prompt version)
      const recruiterTurn: ConversationTurn = {
        id: `turn_${i}_recruiter`,
        role: "recruiter",
        content: this.generateQuestionFromPrompt(promptVersion, i),
        timestamp: new Date(),
        tokens: promptVersion.template.length / 4, // Estimate tokens
        latency: 1000 + Math.random() * 500,
      };
      turns.push(recruiterTurn);

      // Candidate responds
      const candidateTurn = candidateSimulator.generateResponse(recruiterTurn.content);
      turns.push(candidateTurn);

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

    return evaluation;
  }

  /**
   * Generate question from prompt template
   */
  private generateQuestionFromPrompt(promptVersion: PromptVersion, turnIndex: number): string {
    // In production, would use the actual prompt template
    // For now, return a mock question
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
   * Calculate test results
   */
  private calculateTestResults(
    resultsA: ConversationEvaluation[],
    resultsB: ConversationEvaluation[]
  ): ABTestResults {
    if (resultsA.length === 0 || resultsB.length === 0) {
      return {
        qualityScoreA: 0,
        qualityScoreB: 0,
        costA: 0,
        costB: 0,
        latencyA: 0,
        latencyB: 0,
        satisfactionA: 0,
        satisfactionB: 0,
        successRateA: 0,
        successRateB: 0,
        winner: "inconclusive",
        confidence: 0,
        statisticalSignificance: false,
      };
    }

    // Calculate averages
    const qualityScoreA = resultsA.reduce((sum, r) => sum + r.overallScore, 0) / resultsA.length;
    const qualityScoreB = resultsB.reduce((sum, r) => sum + r.overallScore, 0) / resultsB.length;

    const costA = resultsA.reduce((sum, r) => sum + r.metrics.promptCost, 0) / resultsA.length;
    const costB = resultsB.reduce((sum, r) => sum + r.metrics.promptCost, 0) / resultsB.length;

    const latencyA = resultsA.reduce((sum, r) => sum + r.metrics.latency, 0) / resultsA.length;
    const latencyB = resultsB.reduce((sum, r) => sum + r.metrics.latency, 0) / resultsB.length;

    const satisfactionA = resultsA.reduce((sum, r) => sum + r.criteriaScores.naturalness, 0) / resultsA.length;
    const satisfactionB = resultsB.reduce((sum, r) => sum + r.criteriaScores.naturalness, 0) / resultsB.length;

    const successRateA = resultsA.filter(r => r.passed).length / resultsA.length;
    const successRateB = resultsB.filter(r => r.passed).length / resultsB.length;

    // Determine winner
    let winner: "A" | "B" | "tie" | "inconclusive";
    const scoreDiff = qualityScoreA - qualityScoreB;

    if (Math.abs(scoreDiff) < 2) {
      winner = "tie";
    } else if (scoreDiff > 0) {
      winner = "A";
    } else {
      winner = "B";
    }

    // Calculate confidence (simplified)
    const confidence = this.calculateConfidence(resultsA, resultsB);
    const statisticalSignificance = confidence > 0.95;

    return {
      qualityScoreA,
      qualityScoreB,
      costA,
      costB,
      latencyA,
      latencyB,
      satisfactionA,
      satisfactionB,
      successRateA,
      successRateB,
      winner,
      confidence,
      statisticalSignificance,
    };
  }

  /**
   * Calculate confidence (simplified statistical test)
   */
  private calculateConfidence(
    resultsA: ConversationEvaluation[],
    resultsB: ConversationEvaluation[]
  ): number {
    // Simplified confidence calculation
    // In production, would use proper statistical tests (t-test, chi-square, etc.)
    const scoresA = resultsA.map(r => r.overallScore);
    const scoresB = resultsB.map(r => r.overallScore);

    const meanA = scoresA.reduce((sum, s) => sum + s, 0) / scoresA.length;
    const meanB = scoresB.reduce((sum, s) => sum + s, 0) / scoresB.length;

    const varianceA = scoresA.reduce((sum, s) => sum + Math.pow(s - meanA, 2), 0) / scoresA.length;
    const varianceB = scoresB.reduce((sum, s) => sum + Math.pow(s - meanB, 2), 0) / scoresB.length;

    const pooledStdDev = Math.sqrt((varianceA + varianceB) / 2);
    const standardError = pooledStdDev * Math.sqrt(1 / scoresA.length + 1 / scoresB.length);

    if (standardError === 0) return 1;

    const zScore = Math.abs(meanA - meanB) / standardError;
    const confidence = Math.min(1, zScore / 2); // Simplified

    return confidence;
  }

  /**
   * Get test by ID
   */
  getTest(testId: string): ABTest | null {
    return this.tests.get(testId) || null;
  }

  /**
   * Get all tests
   */
  getAllTests(): ABTest[] {
    return Array.from(this.tests.values());
 }

  /**
   * Get tests by status
   */
  getTestsByStatus(status: "running" | "completed" | "paused"): ABTest[] {
    return this.getAllTests().filter(t => t.status === status);
  }

  /**
   * Pause test
   */
  pauseTest(testId: string): void {
    const test = this.tests.get(testId);
    if (!test) {
      throw new Error(`Test not found: ${testId}`);
    }

    if (test.status !== "running") {
      throw new Error(`Test is not running: ${test.status}`);
    }

    test.status = "paused";
    this.tests.set(testId, test);
  }

  /**
   * Resume test
   */
  resumeTest(testId: string): void {
    const test = this.tests.get(testId);
    if (!test) {
      throw new Error(`Test not found: ${testId}`);
    }

    if (test.status !== "paused") {
      throw new Error(`Test is not paused: ${test.status}`);
    }

    test.status = "running";
    this.tests.set(testId, test);
  }

  /**
   * Delete test
   */
  deleteTest(testId: string): void {
    const test = this.tests.get(testId);
    if (!test) {
      throw new Error(`Test not found: ${testId}`);
    }

    if (test.status === "running") {
      throw new Error("Cannot delete running test");
    }

    this.tests.delete(testId);
  }

  /**
   * Get test statistics
   */
  getStatistics(): {
    totalTests: number;
    runningTests: number;
    completedTests: number;
    pausedTests: number;
    averageConfidence: number;
    winners: Record<"A" | "B" | "tie" | "inconclusive", number>;
  } {
    const tests = this.getAllTests();
    const runningTests = tests.filter(t => t.status === "running").length;
    const completedTests = tests.filter(t => t.status === "completed").length;
    const pausedTests = tests.filter(t => t.status === "paused").length;

    const completed = tests.filter(t => t.status === "completed");
    const averageConfidence =
      completed.length > 0
        ? completed.reduce((sum, t) => sum + t.results.confidence, 0) / completed.length
        : 0;

    const winners: Record<"A" | "B" | "tie" | "inconclusive", number> = {
      A: 0,
      B: 0,
      tie: 0,
      inconclusive: 0,
    };

    completed.forEach(t => {
      winners[t.results.winner]++;
    });

    return {
      totalTests: tests.length,
      runningTests,
      completedTests,
      pausedTests,
      averageConfidence,
      winners,
    };
  }

  /**
   * Export test data
   */
  exportTests(): ABTest[] {
    return this.getAllTests();
  }

  /**
   * Import test data
   */
  importTests(tests: ABTest[]): void {
    tests.forEach(test => {
      this.tests.set(test.id, test);
    });
  }

  /**
   * Clear all tests
   */
  clearAllTests(): void {
    this.tests.clear();
  }
}

export const abTestingEngine = ABTestingEngine.getInstance();
