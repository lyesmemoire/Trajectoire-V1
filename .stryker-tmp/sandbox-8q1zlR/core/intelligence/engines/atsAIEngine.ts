// @ts-nocheck
import { aiOrchestrator } from "../../ai/AIOrchestrator";
import { atsAnalysisV1 } from "../../ai/Prompts/ats-analysis-v1";
import { eventBus } from "../../ai/events/EventBus";
import { ATSCompletedEvent } from "../../ai/events/BrainEvents";

/**
 * ATS AI Engine
 *
 * Orchestrates AI-powered ATS analysis using AIOrchestrator.
 */

export interface ATSAnalysisInput {
  jobDescription: string;
  cvContent: string;
  cvId?: string;
  jobDescriptionId?: string;
  candidateId?: string;
}

export class ATSAIEngine {
  /**
   * Analyze CV against job description using AI
   */
  static async analyzeATS(input: ATSAnalysisInput) {
    const result = await aiOrchestrator.execute(
      atsAnalysisV1,
      {
        jobDescription: input.jobDescription,
        cvContent: input.cvContent,
      },
      {
        provider: "openai",
        model: "gpt-4-turbo",
        promptId: "ats-analysis",
        promptVersion: "v1",
        temperature: 0.7,
        maxTokens: 2000,
      }
    );

    if (!result.success || !result.data) {
      throw new Error(`ATS analysis failed: ${result.error}`);
    }

    // Publish event to event bus if IDs are provided
    if (input.cvId && input.jobDescriptionId) {
      await eventBus.publish<ATSCompletedEvent>({
        id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        type: "ats_completed",
        payload: {
          cvId: input.cvId,
          jobDescriptionId: input.jobDescriptionId,
          analysis: result.data,
          metrics: {
            latency: result.metrics?.latency || 0,
            tokens: result.metrics?.totalTokens || 0,
            cost: result.metrics?.cost || 0,
          },
        },
      });
    }

    return result.data;
  }
}
