// @ts-nocheck
import { aiOrchestrator } from "../../ai/AIOrchestrator";
import { decisionEstimationV1 } from "../../ai/Prompts/decision-estimation-v1";

/**
 * Decision Estimation AI Engine
 *
 * Orchestrates AI-powered hiring decision estimation using AIOrchestrator.
 */

export interface DecisionEstimationInput {
  candidateData: string;
  interviewPerformance: string;
  comparison: string;
}

export class DecisionEstimationAIEngine {
  /**
   * Estimate hiring decision using AI
   */
  static async estimateDecision(input: DecisionEstimationInput) {
    const result = await aiOrchestrator.execute(
      decisionEstimationV1,
      {
        candidateData: input.candidateData,
        interviewPerformance: input.interviewPerformance,
        comparison: input.comparison,
      },
      {
        provider: "openai",
        model: "gpt-4-turbo",
        promptId: "decision-estimation",
        promptVersion: "v1",
        temperature: 0.7,
        maxTokens: 2000,
      }
    );

    if (!result.success || !result.data) {
      throw new Error(`Decision estimation failed: ${result.error}`);
    }

    return result.data;
  }
}
