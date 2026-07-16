// @ts-nocheck
import { aiOrchestrator } from "../../ai/AIOrchestrator";
import { careerAnalysisV1 } from "../../ai/Prompts/career-analysis-v1";
import { eventBus } from "../../ai/events/EventBus";
import { CareerUpdatedEvent } from "../../ai/events/BrainEvents";
import { candidateAIBrain } from "../../ai/brain/CandidateAIBrain";

/**
 * Career Analysis AI Engine
 *
 * Orchestrates AI-powered career trajectory analysis using AIOrchestrator.
 */

export interface CareerAnalysisInput {
  careerHistory: string;
  skillsEvolution: string;
  achievements: string;
  candidateId?: string;
  historicalInsights?: string[];
  previousAnalyses?: string[];
  knownPatterns?: string[];
}

export class CareerAnalysisAIEngine {
  /**
   * Analyze career trajectory using AI
   */
  static async analyzeCareer(input: CareerAnalysisInput) {
    // Check if we have a recent analysis in Brain
    const inputHash = JSON.stringify(input);
    const promptId = "career-analysis";
    
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
    const previousAnalyses = candidateAIBrain.findHistory(promptId, 3)
      .map(h => JSON.stringify(h.output).substring(0, 100) + "...");
    const knownPatterns = brainPatterns.patterns
      .slice(0, 5)
      .map((p: any) => `${p.pattern} (${p.category})`);

    const result = await aiOrchestrator.execute(
      careerAnalysisV1,
      {
        careerHistory: input.careerHistory,
        skillsEvolution: input.skillsEvolution,
        achievements: input.achievements,
        historicalInsights: input.historicalInsights?.join(", ") || historicalInsights.join(", "),
        previousAnalyses: input.previousAnalyses?.join(", ") || previousAnalyses.join(", "),
        knownPatterns: input.knownPatterns?.join(", ") || knownPatterns.join(", "),
      },
      {
        provider: "openai",
        model: "gpt-4-turbo",
        promptId: "career-analysis",
        promptVersion: "v1",
        temperature: 0.7,
        maxTokens: 2000,
      }
    );

    if (!result.success || !result.data) {
      throw new Error(`Career analysis failed: ${result.error}`);
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
      await eventBus.publish<CareerUpdatedEvent>({
        id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        type: "career_updated",
        payload: {
          candidateId: input.candidateId,
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
