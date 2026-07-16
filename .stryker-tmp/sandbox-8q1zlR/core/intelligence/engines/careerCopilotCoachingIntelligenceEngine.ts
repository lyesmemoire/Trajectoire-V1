// @ts-nocheck
import { aiOrchestrator } from "../../ai/AIOrchestrator";
import { careerCopilotCoachingIntelligenceV1 } from "../../ai/Prompts/career-copilot-coaching-intelligence-v1";
import { candidateAIBrain } from "../../ai/brain/CandidateAIBrain";
import { eventBus } from "../../ai/events/EventBus";
import { CareerCopilotExecutionIntelligenceEngine } from "./careerCopilotExecutionIntelligenceEngine";

export interface CoachingInput {
  candidateGraph: unknown;
}

export interface CoachingOutput {
  coachingGuidance: {
    howToStart: string;
    steps: Array<{
      stepNumber: number;
      description: string;
      estimatedTime: string;
      completionCriteria: string;
    }>;
    commonPitfalls: string[];
    howToOvercomeObstacles: string;
  };
  motivationStrategy: {
    tone: "encouraging" | "realistic" | "challenging";
    approach: string;
    confidenceLevel: "high" | "medium" | "low";
    adaptationReason: string;
  };
  microObjectives: Array<{
    objective: string;
    estimatedTime: string;
    completionCriteria: string;
    priority: "high" | "medium" | "low";
  }>;
  learningTips: Array<{
    tip: string;
    technique: string;
    resource: string;
  }>;
  encouragement: {
    message: string;
    basedOn: string[];
    potentialHighlight: string;
  };
  riskPrevention: {
    commonErrors: string[];
    likelyBlockages: string[];
    badPriorities: string[];
    motivationRisks: string[];
    preventionStrategies: string[];
  };
  adaptiveCoaching: {
    constraintsConsidered: string[];
    confidenceAdjustment: string;
    resourceOptimization: string;
    progressionAdaptation: string;
  };
  coachingExplainability: {
    whyThisCoaching: string;
    intelligencesConsulted: string[];
    evidenceUsed: string[];
    candidateGraphConsulted: string;
    limitations: string[];
  };
  coachingMetadata: {
    timestamp: string;
    nextBestActionId: string;
    adaptationLevel: "high" | "medium" | "low";
    personalizationScore: number;
  };
}

export class CareerCopilotCoachingIntelligenceEngine {
  private static lastCoachingAnalysis: CoachingOutput | null = null;
  private static coachingHistory: CoachingOutput[] = [];

  /**
   * Génère un accompagnement personnalisé pour la Next Best Action
   */
  static async generateCoaching(input: CoachingInput): Promise<CoachingOutput> {
    try {
      // Récupérer la Next Best Action depuis Execution Intelligence
      const nextBestAction = CareerCopilotExecutionIntelligenceEngine.getLastExecutionAnalysis();
      
      if (!nextBestAction) {
        throw new Error("No next best action available from Execution Intelligence");
      }

      // Extraction du contexte depuis CandidateAIBrain (observations)
      let planningContext = null;
      try {
        const planningObs = candidateAIBrain.getObservations()
          .filter(obs => obs.source === "CareerCopilotPlanningIntelligenceEngine")
          .slice(-1);
        if (planningObs.length > 0 && planningObs[0]) {
          planningContext = planningObs[0].data;
        }
      } catch (error) {
        console.error("Failed to get planning intelligence context (non-critical):", error);
      }

      let reflectionContext = null;
      try {
        const reflectionObs = candidateAIBrain.getObservations()
          .filter(obs => obs.source === "CareerCopilotReflectionIntelligenceEngine")
          .slice(-1);
        if (reflectionObs.length > 0 && reflectionObs[0]) {
          reflectionContext = reflectionObs[0].data;
        }
      } catch (error) {
        console.error("Failed to get reflection intelligence context (non-critical):", error);
      }

      let constraintContext = null;
      try {
        const constraintObs = candidateAIBrain.getObservations()
          .filter(obs => obs.source === "CareerCopilotConstraintIntelligenceEngine")
          .slice(-1);
        if (constraintObs.length > 0 && constraintObs[0]) {
          constraintContext = constraintObs[0].data;
        }
      } catch (error) {
        console.error("Failed to get constraint intelligence context (non-critical):", error);
      }

      let resourceContext = null;
      try {
        const resourceObs = candidateAIBrain.getObservations()
          .filter(obs => obs.source === "CareerCopilotResourceIntelligenceEngine")
          .slice(-1);
        if (resourceObs.length > 0 && resourceObs[0]) {
          resourceContext = resourceObs[0].data;
        }
      } catch (error) {
        console.error("Failed to get resource intelligence context (non-critical):", error);
      }

      let confidenceContext = null;
      try {
        const confidenceObs = candidateAIBrain.getObservations()
          .filter(obs => obs.source === "CareerCopilotExecutionIntelligenceEngine")
          .slice(-1);
        if (confidenceObs.length > 0 && confidenceObs[0]) {
          confidenceContext = confidenceObs[0].data;
        }
      } catch (error) {
        console.error("Failed to get confidence intelligence context (non-critical):", error);
      }

      let personalizationContext = null;
      try {
        const personalizationObs = candidateAIBrain.getObservations()
          .filter(obs => obs.source === "CareerCopilotPersonalizationEngine")
          .slice(-1);
        if (personalizationObs.length > 0 && personalizationObs[0]) {
          personalizationContext = personalizationObs[0].data;
        }
      } catch (error) {
        console.error("Failed to get personalization intelligence context (non-critical):", error);
      }

      let successContext = null;
      try {
        const successObs = candidateAIBrain.getObservations()
          .filter(obs => obs.source === "CareerCopilotSuccessIntelligenceEngine")
          .slice(-1);
        if (successObs.length > 0 && successObs[0]) {
          successContext = successObs[0].data;
        }
      } catch (error) {
        console.error("Failed to get success intelligence context (non-critical):", error);
      }

      let accountabilityContext = null;
      try {
        const accountabilityObs = candidateAIBrain.getObservations()
          .filter(obs => obs.source === "CareerCopilotAccountabilityEngine")
          .slice(-1);
        if (accountabilityObs.length > 0 && accountabilityObs[0]) {
          accountabilityContext = accountabilityObs[0].data;
        }
      } catch (error) {
        console.error("Failed to get accountability intelligence context (non-critical):", error);
      }

      // Préparation des variables pour le prompt
      const promptVariables = {
        nextBestAction: JSON.stringify(nextBestAction, null, 2),
        candidateGraph: JSON.stringify(input.candidateGraph, null, 2),
        planningIntelligence: planningContext ? JSON.stringify(planningContext, null, 2) : "Non disponible",
        reflectionIntelligence: reflectionContext ? JSON.stringify(reflectionContext, null, 2) : "Non disponible",
        constraintIntelligence: constraintContext ? JSON.stringify(constraintContext, null, 2) : "Non disponible",
        resourceIntelligence: resourceContext ? JSON.stringify(resourceContext, null, 2) : "Non disponible",
        confidenceIntelligence: confidenceContext ? JSON.stringify(confidenceContext, null, 2) : "Non disponible",
        personalizationIntelligence: personalizationContext ? JSON.stringify(personalizationContext, null, 2) : "Non disponible",
        successIntelligence: successContext ? JSON.stringify(successContext, null, 2) : "Non disponible",
        accountabilityIntelligence: accountabilityContext ? JSON.stringify(accountabilityContext, null, 2) : "Non disponible",
      };

      // Exécution du prompt via AIOrchestrator
      const result = await aiOrchestrator.execute(
        careerCopilotCoachingIntelligenceV1,
        promptVariables,
        {
          provider: "anthropic",
          model: "claude-3-5-sonnet-20241022",
          promptId: "career-copilot-coaching-intelligence-v1",
          temperature: 0, // Déterminisme
        }
      );

      // Parsing de la réponse
      const coachingOutput: CoachingOutput = JSON.parse(String(result.data));

      // Ajout du timestamp si non présent
      if (!coachingOutput.coachingMetadata.timestamp) {
        coachingOutput.coachingMetadata.timestamp = new Date().toISOString();
      }

      // Ajout de l'ID de la Next Best Action
      if (!coachingOutput.coachingMetadata.nextBestActionId) {
        coachingOutput.coachingMetadata.nextBestActionId = `action-${Date.now()}`;
      }

      // Stockage de l'analyse
      this.lastCoachingAnalysis = coachingOutput;
      this.coachingHistory.push(coachingOutput);

      // Sauvegarde dans CandidateAIBrain
      candidateAIBrain.addObservation({
        timestamp: new Date(),
        source: "CareerCopilotCoachingIntelligenceEngine",
        type: "career",
        data: coachingOutput,
        confidence: coachingOutput.coachingMetadata.personalizationScore / 100,
      });

      // Publication d'événements via EventBus
      eventBus.publish({
        id: `coaching-generated-${Date.now()}`,
        timestamp: new Date(),
        type: "observation_created",
        payload: {
          source: "CareerCopilotCoachingIntelligenceEngine",
          observationType: "career",
          data: {
            adaptationLevel: coachingOutput.coachingMetadata.adaptationLevel,
            personalizationScore: coachingOutput.coachingMetadata.personalizationScore,
            nextBestActionId: coachingOutput.coachingMetadata.nextBestActionId,
          },
          confidence: coachingOutput.coachingMetadata.personalizationScore / 100,
        },
      });

      return coachingOutput;
    } catch (error) {
      console.error("Erreur lors de la génération du coaching:", error);
      throw new Error(`Failed to generate coaching: ${error}`);
    }
  }

  /**
   * Récupère la dernière analyse de coaching
   */
  static getLastCoachingAnalysis(): CoachingOutput | null {
    return this.lastCoachingAnalysis;
  }

  /**
   * Récupère l'historique des analyses de coaching
   */
  static getCoachingHistory(): CoachingOutput[] {
    return this.coachingHistory;
  }

  /**
   * Récupère le coaching guidance
   */
  static getCoachingGuidance(): CoachingOutput["coachingGuidance"] | null {
    return this.lastCoachingAnalysis?.coachingGuidance || null;
  }

  /**
   * Récupère la stratégie de motivation
   */
  static getMotivationStrategy(): CoachingOutput["motivationStrategy"] | null {
    return this.lastCoachingAnalysis?.motivationStrategy || null;
  }

  /**
   * Récupère les micro-objectifs
   */
  static getMicroObjectives(): CoachingOutput["microObjectives"] | null {
    return this.lastCoachingAnalysis?.microObjectives || null;
  }

  /**
   * Récupère les conseils d'apprentissage
   */
  static getLearningTips(): CoachingOutput["learningTips"] | null {
    return this.lastCoachingAnalysis?.learningTips || null;
  }

  /**
   * Récupère l'encouragement
   */
  static getEncouragement(): CoachingOutput["encouragement"] | null {
    return this.lastCoachingAnalysis?.encouragement || null;
  }

  /**
   * Récupère la prévention des risques
   */
  static getRiskPrevention(): CoachingOutput["riskPrevention"] | null {
    return this.lastCoachingAnalysis?.riskPrevention || null;
  }

  /**
   * Récupère le coaching adaptatif
   */
  static getAdaptiveCoaching(): CoachingOutput["adaptiveCoaching"] | null {
    return this.lastCoachingAnalysis?.adaptiveCoaching || null;
  }

  /**
   * Récupère l'explicabilité du coaching
   */
  static getCoachingExplainability(): CoachingOutput["coachingExplainability"] | null {
    return this.lastCoachingAnalysis?.coachingExplainability || null;
  }

  /**
   * Réinitialise l'historique (pour les tests)
   */
  static resetHistory(): void {
    this.lastCoachingAnalysis = null;
    this.coachingHistory = [];
  }
}
