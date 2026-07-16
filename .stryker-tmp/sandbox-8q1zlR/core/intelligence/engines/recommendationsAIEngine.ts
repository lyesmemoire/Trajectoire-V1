// @ts-nocheck
import { aiOrchestrator } from "../../ai/AIOrchestrator";
import { recommendationsV1 } from "../../ai/Prompts/recommendations-v1";
import { eventBus } from "../../ai/events/EventBus";
import { RecommendationGeneratedEvent } from "../../ai/events/BrainEvents";
import { candidateAIBrain } from "../../ai/brain/CandidateAIBrain";

/**
 * Recommendations AI Engine
 *
 * Orchestrates AI-powered recommendations generation using AIOrchestrator.
 */

export interface RecommendationsInput {
  candidateProfile: string;
  assessmentResults: string;
  careerGoals: string;
  marketContext: string;
  candidateId?: string;
  historicalInsights?: string[];
  previousRecommendations?: string[];
  knownPatterns?: string[];
}

export class RecommendationsAIEngine {
  /**
   * Generate recommendations using AI
   */
  static async generateRecommendations(input: RecommendationsInput) {
    // Check if we have a recent analysis in Brain
    const inputHash = JSON.stringify(input);
    const promptId = "recommendations";
    
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
    const previousRecommendations = candidateAIBrain.findHistory(promptId, 3)
      .map(h => JSON.stringify(h.output).substring(0, 100) + "...");
    const knownPatterns = brainPatterns.patterns
      .slice(0, 5)
      .map((p: any) => `${p.pattern} (${p.category})`);

    const result = await aiOrchestrator.execute(
      recommendationsV1,
      {
        candidateProfile: input.candidateProfile,
        assessmentResults: input.assessmentResults,
        careerGoals: input.careerGoals,
        marketContext: input.marketContext,
        historicalInsights: input.historicalInsights?.join(", ") || historicalInsights.join(", "),
        previousRecommendations: input.previousRecommendations?.join(", ") || previousRecommendations.join(", "),
        knownPatterns: input.knownPatterns?.join(", ") || knownPatterns.join(", "),
      },
      {
        provider: "openai",
        model: "gpt-4-turbo",
        promptId: "recommendations",
        promptVersion: "v1",
        temperature: 0.7,
        maxTokens: 2000,
      }
    );

    if (!result.success || !result.data) {
      throw new Error(`Recommendations generation failed: ${result.error}`);
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

    // Publish event to event bus if candidateId is provided
    if (input.candidateId) {
      await eventBus.publish<RecommendationGeneratedEvent>({
        id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        type: "recommendation_generated",
        payload: {
          candidateId: input.candidateId,
          recommendations: result.data,
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
