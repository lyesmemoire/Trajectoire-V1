// @ts-nocheck
import { aiOrchestrator } from "../../ai/AIOrchestrator";
import { executiveSummaryV1 } from "../../ai/Prompts/executive-summary-v1";

/**
 * Executive Summary AI Engine
 *
 * Orchestrates AI-powered executive summary generation using AIOrchestrator.
 */

export interface ExecutiveSummaryInput {
  candidateProfile: string;
  interviewFeedback: string;
  assessmentResults: string;
}

export class ExecutiveSummaryAIEngine {
  /**
   * Generate executive summary using AI
   */
  static async generateExecutiveSummary(input: ExecutiveSummaryInput) {
    const result = await aiOrchestrator.execute(
      executiveSummaryV1,
      {
        candidateProfile: input.candidateProfile,
        interviewFeedback: input.interviewFeedback,
        assessmentResults: input.assessmentResults,
      },
      {
        provider: "openai",
        model: "gpt-4-turbo",
        promptId: "executive-summary",
        promptVersion: "v1",
        temperature: 0.7,
        maxTokens: 2000,
      }
    );

    if (!result.success || !result.data) {
      throw new Error(`Executive summary generation failed: ${result.error}`);
    }

    return result.data;
  }
}
