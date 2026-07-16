import { intelligenceCoreModule } from "../../../lib/intelligence-core";
import { IntelligenceRequest } from "../../../lib/intelligence-core";
import { EventPublisher } from "../../../lib/intelligence-runtime/application/EventPublisher";
import { recommendationsV1 } from "../../ai/Prompts/recommendations-v1";
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

    const promptTemplate = recommendationsV1.system || recommendationsV1.user;
    const intelligenceUseCase = intelligenceCoreModule.createUseCase(promptTemplate);

    const request: IntelligenceRequest = {
      id: `recommendations-${Date.now()}`,
      type: "recommendations",
      input: input as unknown as Record<string, unknown>,
      context: {
        candidateProfile: {},
        historicalObservations: [],
        currentGoals: [],
        recentInsights: [],
        engineContext: {
          candidateProfile: input.candidateProfile,
          assessmentResults: input.assessmentResults,
          careerGoals: input.careerGoals,
          marketContext: input.marketContext,
          historicalInsights: input.historicalInsights?.join(", ") || historicalInsights.join(", "),
          previousRecommendations: input.previousRecommendations?.join(", ") || previousRecommendations.join(", "),
          knownPatterns: input.knownPatterns?.join(", ") || knownPatterns.join(", "),
        },
      },
      options: {
        provider: "openai",
        model: "gpt-4-turbo",
        temperature: 0.7,
        maxTokens: 2000,
      },
    };

    const result = await intelligenceUseCase.execute(request);

    if (!result.success || !result.output) {
      throw new Error(`Recommendations generation failed: ${result.error}`);
    }

    // Store analysis in Brain history
    candidateAIBrain.addHistoryEntry({
      promptId,
      promptVersion: "v1",
      input: {...input},
      output: result.output,
      timestamp: new Date(),
      metrics: {
        latency: 0,
        tokens: {
          prompt: 0,
          completion: 0,
          total: 0,
        },
        cost: 0,
        retryCount: 0,
      },
      status: "success",
    });

    // Publish event via EventPublisher if candidateId is provided
    if (input.candidateId) {
      const eventPublisher = new EventPublisher();
      eventPublisher.publish("recommendation_generated", {
        candidateId: input.candidateId,
        recommendations: result.output,
        metrics: {
          latency: 0,
          tokens: 0,
          cost: 0,
        },
      });
    }

    return result.output;
  }
}
