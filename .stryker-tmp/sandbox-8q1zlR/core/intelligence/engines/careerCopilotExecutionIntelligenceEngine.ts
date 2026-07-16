// @ts-nocheck
import { aiOrchestrator } from "../../ai/AIOrchestrator";
import { careerCopilotExecutionIntelligenceV1 } from "../../ai/Prompts/career-copilot-execution-intelligence-v1";
import { candidateAIBrain } from "../../ai/brain/CandidateAIBrain";
import { eventBus } from "../../ai/events/EventBus";

export interface ExecutionInput {
  candidateGraph: unknown;
  currentContext?: {
    recentActions: string[];
    currentMilestone?: string;
    timeAvailable: string;
    energyLevel?: string;
    recentOutcomes?: string[];
  };
}

export interface ExecutionOutput {
  nextBestAction: {
    action: string;
    actionType: string;
    actionDetails: string;
  };
  justification: {
    whyNow: string;
    whyNotOthers: string;
    expectedImpact: string;
    riskReduced: string;
    objectiveAdvanced: string;
  };
  priorityScore: {
    score: number;
    justification: string;
    urgency: "low" | "medium" | "high" | "critical";
    importance: "low" | "medium" | "high" | "critical";
  };
  executionConfidence: {
    level: "low" | "medium" | "high" | "very_high";
    justification: string;
    uncertaintyFactors: string[];
  };
  blockingFactors: {
    dependencies: string[];
    constraints: string[];
    immediateRisks: string[];
    missingInformation: string[];
  };
  expectedOutcome: {
    whatCandidateGets: string;
    whatItUnblocks: string;
    estimatedGain: string;
    timeToImpact: string;
  };
  opportunityWindow: {
    window: "critical_now" | "important" | "planifiable_later";
    justification: string;
    deadline?: string;
    consequenceIfDelayed: string;
  };
  executionExplainability: {
    intelligencesConsulted: string[];
    evidenceUsed: string[];
    candidateGraphConsulted: string;
    constraintsConsidered: string[];
    limitations: string[];
  };
  executionMetadata: {
    timestamp: string;
    planStep?: string;
    milestone?: string;
    alternativeActions: string[];
    rejectionReasons: string[];
  };
}

export class CareerCopilotExecutionIntelligenceEngine {
  private static lastExecutionAnalysis: ExecutionOutput | null = null;
  private static executionHistory: ExecutionOutput[] = [];

  /**
   * Génère la Next Best Action à partir des données existantes
   */
  static async generateExecution(input: ExecutionInput): Promise<ExecutionOutput> {
    try {
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

      let decisionContext = null;
      try {
        const decisionObs = candidateAIBrain.getObservations()
          .filter(obs => obs.source === "career-copilot-decision-intelligence")
          .slice(-1);
        if (decisionObs.length > 0 && decisionObs[0]) {
          decisionContext = decisionObs[0].data;
        }
      } catch (error) {
        console.error("Failed to get decision intelligence context (non-critical):", error);
      }

      let opportunityContext = null;
      try {
        const opportunityObs = candidateAIBrain.getObservations()
          .filter(obs => obs.source === "CareerCopilotOpportunityIntelligenceEngine")
          .slice(-1);
        if (opportunityObs.length > 0 && opportunityObs[0]) {
          opportunityContext = opportunityObs[0].data;
        }
      } catch (error) {
        console.error("Failed to get opportunity intelligence context (non-critical):", error);
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

      let scenarioContext = null;
      try {
        const scenarioObs = candidateAIBrain.getObservations()
          .filter(obs => obs.source === "CareerCopilotScenarioIntelligenceEngine")
          .slice(-1);
        if (scenarioObs.length > 0 && scenarioObs[0]) {
          scenarioContext = scenarioObs[0].data;
        }
      } catch (error) {
        console.error("Failed to get scenario intelligence context (non-critical):", error);
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

      // Préparation des variables pour le prompt
      const promptVariables = {
        candidateGraph: JSON.stringify(input.candidateGraph, null, 2),
        planningIntelligence: planningContext ? JSON.stringify(planningContext, null, 2) : "Non disponible",
        reflectionIntelligence: reflectionContext ? JSON.stringify(reflectionContext, null, 2) : "Non disponible",
        decisionIntelligence: decisionContext ? JSON.stringify(decisionContext, null, 2) : "Non disponible",
        opportunityIntelligence: opportunityContext ? JSON.stringify(opportunityContext, null, 2) : "Non disponible",
        constraintIntelligence: constraintContext ? JSON.stringify(constraintContext, null, 2) : "Non disponible",
        resourceIntelligence: resourceContext ? JSON.stringify(resourceContext, null, 2) : "Non disponible",
        forecastIntelligence: scenarioContext ? JSON.stringify(scenarioContext, null, 2) : "Non disponible",
        scenarioIntelligence: scenarioContext ? JSON.stringify(scenarioContext, null, 2) : "Non disponible",
        accountabilityIntelligence: accountabilityContext ? JSON.stringify(accountabilityContext, null, 2) : "Non disponible",
        successIntelligence: successContext ? JSON.stringify(successContext, null, 2) : "Non disponible",
        currentContext: input.currentContext ? JSON.stringify(input.currentContext, null, 2) : "Non disponible",
        currentDate: new Date().toISOString(),
      };

      // Exécution du prompt via AIOrchestrator
      const result = await aiOrchestrator.execute(
        careerCopilotExecutionIntelligenceV1,
        promptVariables,
        {
          provider: "anthropic",
          model: "claude-3-5-sonnet-20241022",
          promptId: "career-copilot-execution-intelligence-v1",
        }
      );

      // Parsing de la réponse
      const executionOutput: ExecutionOutput = JSON.parse(String(result.data));

      // Ajout du timestamp si non présent
      if (!executionOutput.executionMetadata.timestamp) {
        executionOutput.executionMetadata.timestamp = new Date().toISOString();
      }

      // Stockage de l'analyse
      this.lastExecutionAnalysis = executionOutput;
      this.executionHistory.push(executionOutput);

      // Sauvegarde dans CandidateAIBrain
      candidateAIBrain.addObservation({
        timestamp: new Date(),
        source: "CareerCopilotExecutionIntelligenceEngine",
        type: "career",
        data: executionOutput,
        confidence: executionOutput.executionConfidence.level === "very_high" ? 0.9 : 
                   executionOutput.executionConfidence.level === "high" ? 0.75 :
                   executionOutput.executionConfidence.level === "medium" ? 0.5 : 0.25,
      });

      // Publication d'événements via EventBus (utilise un type d'événement valide)
      eventBus.publish({
        id: `next-action-${Date.now()}`,
        timestamp: new Date(),
        type: "observation_created",
        payload: {
          source: "CareerCopilotExecutionIntelligenceEngine",
          observationType: "career",
          data: {
            action: executionOutput.nextBestAction.action,
            priority: executionOutput.priorityScore.score,
            confidence: executionOutput.executionConfidence.level,
            window: executionOutput.opportunityWindow.window,
          },
          confidence: executionOutput.executionConfidence.level === "very_high" ? 0.9 : 
                     executionOutput.executionConfidence.level === "high" ? 0.75 :
                     executionOutput.executionConfidence.level === "medium" ? 0.5 : 0.25,
        },
      });

      return executionOutput;
    } catch (error) {
      console.error("Erreur lors de la génération de l'exécution:", error);
      throw new Error(`Failed to generate execution: ${error}`);
    }
  }

  /**
   * Récupère la dernière analyse d'exécution
   */
  static getLastExecutionAnalysis(): ExecutionOutput | null {
    return this.lastExecutionAnalysis;
  }

  /**
   * Récupère l'historique des analyses d'exécution
   */
  static getExecutionHistory(): ExecutionOutput[] {
    return this.executionHistory;
  }

  /**
   * Récupère uniquement la Next Best Action
   */
  static getNextBestAction(): string | null {
    return this.lastExecutionAnalysis?.nextBestAction.action || null;
  }

  /**
   * Récupère le score de priorité
   */
  static getPriorityScore(): number | null {
    return this.lastExecutionAnalysis?.priorityScore.score || null;
  }

  /**
   * Récupère le niveau de confiance
   */
  static getExecutionConfidence(): string | null {
    return this.lastExecutionAnalysis?.executionConfidence.level || null;
  }

  /**
   * Récupère les facteurs de blocage
   */
  static getBlockingFactors(): {
    dependencies: string[];
    constraints: string[];
    immediateRisks: string[];
    missingInformation: string[];
  } | null {
    return this.lastExecutionAnalysis?.blockingFactors || null;
  }

  /**
   * Récupère la fenêtre d'opportunité
   */
  static getOpportunityWindow(): {
    window: string;
    justification: string;
    deadline?: string;
    consequenceIfDelayed: string;
  } | null {
    return this.lastExecutionAnalysis?.opportunityWindow || null;
  }

  /**
   * Récupère l'explicabilité de l'exécution
   */
  static getExecutionExplainability(): {
    intelligencesConsulted: string[];
    evidenceUsed: string[];
    candidateGraphConsulted: string;
    constraintsConsidered: string[];
    limitations: string[];
  } | null {
    return this.lastExecutionAnalysis?.executionExplainability || null;
  }

  /**
   * Récupère l'outcome attendu
   */
  static getExpectedOutcome(): {
    whatCandidateGets: string;
    whatItUnblocks: string;
    estimatedGain: string;
    timeToImpact: string;
  } | null {
    return this.lastExecutionAnalysis?.expectedOutcome || null;
  }

  /**
   * Récupère la justification
   */
  static getJustification(): {
    whyNow: string;
    whyNotOthers: string;
    expectedImpact: string;
    riskReduced: string;
    objectiveAdvanced: string;
  } | null {
    return this.lastExecutionAnalysis?.justification || null;
  }

  /**
   * Réinitialise l'historique (pour les tests)
   */
  static resetHistory(): void {
    this.lastExecutionAnalysis = null;
    this.executionHistory = [];
  }
}
