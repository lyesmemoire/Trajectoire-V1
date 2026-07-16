// @ts-nocheck
import { aiOrchestrator } from "../../ai/AIOrchestrator";
import { actionPlanV1 } from "../../ai/Prompts/action-plan-v1";
import { candidateAIBrain } from "../../ai/brain/CandidateAIBrain";

/**
 * Action Plan AI Engine
 *
 * Orchestrates AI-powered action plan generation using AIOrchestrator.
 */

export interface ActionPlanInput {
  assessmentResults: string;
  gaps: string;
  strengths: string;
  targetRole: string;
  historicalInsights?: string[];
  previousActionPlans?: string[];
  knownPatterns?: string[];
}

export class ActionPlanAIEngine {
  /**
   * Generate action plan using AI
   */
  static async generateActionPlan(input: ActionPlanInput) {
    // Check if we have a recent analysis in Brain
    const inputHash = JSON.stringify(input);
    const promptId = "action-plan";
    
    // Brain only retrieves, Engine decides
    const existingAnalysis = candidateAIBrain.findAnalysis(promptId, inputHash);
    
    if (existingAnalysis) {
      // Engine decides: is this analysis still valid?
      const ageInDays = (Date.now() - existingAnalysis.timestamp.getTime()) / (1000 * 60 * 60 * 24);
      
      // Decision: reuse if less than 7 days old AND no new observations
      if (ageInDays < 7 && existingAnalysis.output) {
        const observationsSince = candidateAIBrain.findAfter(existingAnalysis.timestamp);
        if (observationsSince.length === 0) {
          return existingAnalysis.output;
        }
      }
    }

    // Generate new analysis with historical context
    const brainInsights = candidateAIBrain.getInsights();
    const brainObservations = candidateAIBrain.getObservations();
    const brainPatterns = candidateAIBrain.getPatterns();
    
    const historicalInsights = brainInsights.slice(0, 5).map(i => i.description);
    const previousActionPlans = candidateAIBrain.findHistory(promptId, 3)
      .map(h => JSON.stringify(h.output).substring(0, 100) + "...");
    const knownPatterns = brainPatterns.patterns
      .slice(0, 5)
      .map((p: any) => `${p.pattern} (${p.category})`);

    const result = await aiOrchestrator.execute(
      actionPlanV1,
      {
        assessmentResults: input.assessmentResults,
        gaps: input.gaps,
        strengths: input.strengths,
        targetRole: input.targetRole,
        historicalInsights: input.historicalInsights?.join(", ") || historicalInsights.join(", "),
        previousActionPlans: input.previousActionPlans?.join(", ") || previousActionPlans.join(", "),
        knownPatterns: input.knownPatterns?.join(", ") || knownPatterns.join(", "),
      },
      {
        provider: "openai",
        model: "gpt-4-turbo",
        promptId: "action-plan",
        promptVersion: "v1",
        temperature: 0.7,
        maxTokens: 2000,
      }
    );

    if (!result.success || !result.data) {
      throw new Error(`Action plan generation failed: ${result.error}`);
    }

    // Store analysis in Brain history
    candidateAIBrain.addHistoryEntry({
      promptId,
      promptVersion: "v1",
      input: JSON.parse(JSON.stringify(input)) as Record<string, unknown>,
      output: result.data,
      timestamp: new Date(),
      metrics: {
        latency: result.metrics?.latency || 0,
        tokens: {
          prompt: result.metrics?.promptTokens || 0,
          completion: result.metrics?.completionTokens || 0,
          total: result.metrics?.totalTokens || 0,
        },
        cost: result.metrics?.cost || 0,
        retryCount: 0,
      },
      status: "success",
    });

    return result.data;
  }
}
