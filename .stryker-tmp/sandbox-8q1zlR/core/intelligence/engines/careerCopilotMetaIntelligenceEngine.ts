// @ts-nocheck
import { aiOrchestrator } from "../../ai/AIOrchestrator";
import { careerCopilotMetaIntelligenceV1 } from "../../ai/Prompts/career-copilot-meta-intelligence-v1";
import { candidateAIBrain } from "../../ai/brain/CandidateAIBrain";
import { eventBus } from "../../ai/events/EventBus";
import { ObservationCreatedEvent } from "../../ai/events/BrainEvents";
import { CareerCopilotAdaptiveStrategyEngine } from "./careerCopilotAdaptiveStrategyEngine";
import { CareerCopilotDecisionIntelligenceEngine } from "./careerCopilotDecisionIntelligenceEngine";
import { CareerCopilotAccountabilityEngine } from "./careerCopilotAccountabilityEngine";
import { CareerCopilotSelfReviewEngine } from "./careerCopilotSelfReviewEngine";
import { CareerCopilotConfidenceEngine } from "./careerCopilotConfidenceEngine";
import { CareerCopilotOpportunityIntelligenceEngine } from "./careerCopilotOpportunityIntelligenceEngine";
import { CareerCopilotApplicationIntelligenceEngine } from "./careerCopilotApplicationIntelligenceEngine";
import { CareerCopilotSuccessIntelligenceEngine } from "./careerCopilotSuccessIntelligenceEngine";
import { CareerCopilotConstraintIntelligenceEngine } from "./careerCopilotConstraintIntelligenceEngine";
import { CareerCopilotResourceIntelligenceEngine } from "./careerCopilotResourceIntelligenceEngine";
import { CareerCopilotKnowledgeEvolutionEngine } from "./careerCopilotKnowledgeEvolutionEngine";

export interface DetectedIncoherence {
  type: string;
  description: string;
  severity: "high" | "medium" | "low";
  involvedAnalyses: string[];
  impact: string;
}

export interface ResolvedConflict {
  type: string;
  description: string;
  resolution: string;
  reason: string;
  selectedAnalysis: string;
  replacedAnalysis: string;
}

export interface SynchronizationAction {
  action: string;
  targetAnalysis: string;
  sourceAnalysis: string;
  reason: string;
}

export interface AnalysisWaitingConfirmation {
  analysis: string;
  reason: string;
  confidence: number;
}

export interface MetaIntelligenceInput {
  candidateGraph: any;
  currentForecast?: any;
  currentProgressionPlan?: any;
  currentDigitalTwin?: any;
}

export interface MetaIntelligenceOutput {
  globalCoherence: number;
  synchronizedAnalyses: number;
  totalAnalyses: number;
  lastSyncTime: string;
  detectedIncoherencies: DetectedIncoherence[];
  resolvedConflicts: ResolvedConflict[];
  synchronizationActions: SynchronizationAction[];
  analysesWaitingConfirmation: AnalysisWaitingConfirmation[];
  coherenceReason: string;
  recommendationsForSync: string[];
}

/**
 * Career Copilot Meta Intelligence Engine
 * 
 * Coordinates all existing intelligences to ensure they remain coherent,
 * detect contradictions, and converge toward a unified view of the candidate.
 * Reuses existing AIOrchestrator and CandidateAIBrain.
 */
export class CareerCopilotMetaIntelligenceEngine {
  /**
   * Coordinate all intelligences to detect incoherencies and ensure synchronization
   */
  static async coordinateIntelligences(input: MetaIntelligenceInput): Promise<MetaIntelligenceOutput> {
    // Extract data from CandidateGraph
    const candidateProfile = {
      name: input.candidateGraph.identity?.name || "Candidat",
      currentRole: input.candidateGraph.career?.currentRole || "Non défini",
      careerLevel: input.candidateGraph.career?.careerLevel || "mid",
      overallScore: input.candidateGraph.overallScore || 0,
    };

    // Extract current strategy from Adaptive Strategy Engine
    const currentStrategy = CareerCopilotAdaptiveStrategyEngine.getCurrentStrategy() || "No current strategy defined";

    // Extract previous strategy from Adaptive Strategy Engine
    const strategyHistory = CareerCopilotAdaptiveStrategyEngine.getStrategyHistory();
    const previousStrategy = strategyHistory.length > 1 ? JSON.stringify(strategyHistory[strategyHistory.length - 2]) : "No previous strategy";

    // Extract current priority from Decision Intelligence Engine
    const currentPriority = CareerCopilotDecisionIntelligenceEngine.getCurrentPriority();
    const currentPriorityText = currentPriority
      ? `${currentPriority.absolutePriority} (${currentPriority.priorityReason})`
      : "No current priority defined";

    // Extract previous priorities from Decision Intelligence Engine
    const priorityHistory = CareerCopilotDecisionIntelligenceEngine.getPriorityHistory()
      .map(priority => `${priority.absolutePriority}: ${priority.priorityReason}`)
      .join("\n") || "No priority history";

    // Extract current commitments from Accountability Engine
    const currentCommitments = CareerCopilotAccountabilityEngine.getCurrentCommitments();
    const currentCommitmentsText = currentCommitments
      ? `Completion Rate: ${currentCommitments.completionRate}%
Behavioral Pattern: ${currentCommitments.behavioralPattern}
Current Commitments: ${currentCommitments.currentCommitments.map(c => `${c.description} (${c.state})`).join(", ")}`
      : "No current commitments available";

    // Extract previous commitments from Accountability Engine
    const commitmentHistory = CareerCopilotAccountabilityEngine.getCommitmentHistory()
      .map(commitment => `Completion Rate: ${commitment.completionRate}%, Pattern: ${commitment.behavioralPattern}`)
      .join("\n") || "No commitment history";

    // Extract current conclusions from Self Review Engine
    const currentConclusions = CareerCopilotSelfReviewEngine.getCurrentConclusions();
    const currentConclusionsText = currentConclusions
      ? `Confirmed: ${currentConclusions.confirmedConclusions.length}
Revised: ${currentConclusions.revisedConclusions.length}
Abandoned: ${currentConclusions.abandonedConclusions.length}
New: ${currentConclusions.newConclusions.length}
Overall Confidence: ${currentConclusions.overallConfidence}%`
      : "No current conclusions available";

    // Extract conclusion history from Self Review Engine
    const conclusionHistory = CareerCopilotSelfReviewEngine.getConclusionHistory()
      .map(conclusion => `Confirmed: ${conclusion.confirmedConclusions.length}, Revised: ${conclusion.revisedConclusions.length}, Abandoned: ${conclusion.abandonedConclusions.length}`)
      .join("\n") || "No conclusion history";

    // Extract current confidence from Confidence Engine
    const currentConfidence = CareerCopilotConfidenceEngine.getCurrentConfidence();
    const currentConfidenceText = currentConfidence
      ? `Global Confidence: ${currentConfidence.globalConfidence}%
Level: ${currentConfidence.confidenceLevel}
Reliable Domains: ${currentConfidence.reliableDomains.map(d => d.domain).join(", ") || "None"}
Uncertain Domains: ${currentConfidence.uncertainDomains.map(d => d.domain).join(", ") || "None"}`
      : "No current confidence available";

    // Extract confidence history from Confidence Engine
    const confidenceHistory = CareerCopilotConfidenceEngine.getConfidenceHistory()
      .map(confidence => `Global: ${confidence.globalConfidence}%, Level: ${confidence.confidenceLevel}`)
      .join("\n") || "No confidence history";

    // Extract current forecast if provided
    const currentForecastText = input.currentForecast
      ? JSON.stringify(input.currentForecast).substring(0, 500) + "..."
      : "No current forecast available";

    // Extract current progression plan if provided
    const currentProgressionPlanText = input.currentProgressionPlan
      ? JSON.stringify(input.currentProgressionPlan).substring(0, 500) + "..."
      : "No current progression plan available";

    // Extract current digital twin if provided
    const currentDigitalTwinText = input.currentDigitalTwin
      ? JSON.stringify(input.currentDigitalTwin).substring(0, 500) + "..."
      : "No current digital twin available";

    // Extract opportunity intelligence to verify coherence with opportunity assessments
    const opportunityIntelligence = CareerCopilotOpportunityIntelligenceEngine.getCurrentOpportunityIntelligence();
    const opportunityCoherence = opportunityIntelligence
      ? `Priority opportunity: ${opportunityIntelligence.priorityOpportunity.title}, Compatible: ${opportunityIntelligence.compatibleOpportunities.map((o: any) => o.title).join(", ")}, To prepare: ${opportunityIntelligence.opportunitiesToPrepare.map((o: any) => o.title).join(", ")}, To avoid: ${opportunityIntelligence.opportunitiesToAvoid.map((o: any) => o.title).join(", ")}`
      : "No opportunity coherence available";
    const opportunityConfidence = opportunityIntelligence
      ? `Overall confidence: ${opportunityIntelligence.confidence.overallConfidence}, Data quality: ${opportunityIntelligence.confidence.dataQuality}`
      : "No opportunity confidence available";

    // Extract application intelligence to verify coherence with application assessments
    const applicationIntelligence = CareerCopilotApplicationIntelligenceEngine.getCurrentApplicationIntelligence();
    const applicationCoherence = applicationIntelligence
      ? `Priority application: ${applicationIntelligence.priorityApplication.title}, To follow up: ${applicationIntelligence.applicationsToFollowUp.map((a: any) => a.title).join(", ")}, To prepare: ${applicationIntelligence.applicationsToPrepare.map((a: any) => a.title).join(", ")}, To abandon: ${applicationIntelligence.applicationsToAbandon.map((a: any) => a.title).join(", ")}`
      : "No application coherence available";
    const applicationConfidence = applicationIntelligence
      ? `Overall confidence: ${applicationIntelligence.confidence.overallConfidence}, Data quality: ${applicationIntelligence.confidence.dataQuality}`
      : "No application confidence available";

    // Extract success intelligence for optimization context
    const successIntelligence = CareerCopilotSuccessIntelligenceEngine.getCurrentSuccessIntelligence();
    const successContext = successIntelligence
      ? `Main lever: ${successIntelligence.mainLever.lever}, Main blocker: ${successIntelligence.mainBlocker.blocker}, Best investment: ${successIntelligence.bestInvestment.investment}, Recommended optimizations: ${successIntelligence.recommendedOptimizations.map((o: any) => o.optimization).join(", ")}`
      : "No success intelligence available";

    // Get constraint intelligence for constraint-aware meta coordination
    let constraintContext = null;
    try {
      const constraintIntelligence = CareerCopilotConstraintIntelligenceEngine.getLastConstraintAnalysis();
      if (constraintIntelligence) {
        constraintContext = {
          activeConstraints: constraintIntelligence.constraintsByCategory.flatMap(c => c.constraints.filter(con => con.active).map(con => con.name)),
          criticalConstraints: constraintIntelligence.constraintsByCategory.flatMap(c => c.constraints.filter(con => con.strength === "strong" && !con.negotiable).map(con => con.name)),
          constraintImpact: constraintIntelligence.constraintImpact,
          constraintRecommendations: constraintIntelligence.constraintRecommendations,
          detectedChanges: constraintIntelligence.detectedChanges,
        };
      }
    } catch (error) {
      console.error("Failed to get constraint intelligence:", error);
    }

    // Get resource intelligence for resource-aware meta coordination
    let resourceContext = null;
    try {
      const resourceIntelligence = CareerCopilotResourceIntelligenceEngine.getLastResourceAnalysis();
      if (resourceIntelligence) {
        resourceContext = {
          resourceSummary: resourceIntelligence.resourceSummary,
          availableResources: resourceIntelligence.resourcesByCategory.reduce((acc, cat) => {
            acc[cat.category] = cat.resources.map(r => ({ name: r.name, availability: r.availability, unit: r.unit, criticality: r.criticality }));
            return acc;
          }, {} as Record<string, any>),
          resourceOptimization: resourceIntelligence.resourceOptimization,
          resourceRecommendations: resourceIntelligence.resourceRecommendations,
          detectedChanges: resourceIntelligence.detectedChanges,
        };
      }
    } catch (error) {
      console.error("Failed to get resource intelligence:", error);
    }

    // Get knowledge evolution for knowledge-aware meta coordination
    let knowledgeEvolutionContext = null;
    try {
      const knowledgeEvolution = CareerCopilotKnowledgeEvolutionEngine.getLastKnowledgeEvolution();
      if (knowledgeEvolution) {
        knowledgeEvolutionContext = {
          knowledgeSummary: knowledgeEvolution.knowledgeSummary,
          certainKnowledge: knowledgeEvolution.knowledgeByState.find(s => s.state === "confirmed")?.knowledgeItems.map(k => ({
            description: k.description,
            confidence: k.confidence.current,
          })) || [],
          uncertainKnowledge: knowledgeEvolution.knowledgeByState.find(s => s.state === "very_uncertain")?.knowledgeItems.map(k => ({
            description: k.description,
            confidence: k.confidence.current,
          })) || [],
          knowledgeHealthScore: knowledgeEvolution.knowledgeSummary.healthScore,
        };
      }
    } catch (error) {
      console.error("Failed to get knowledge evolution:", error);
    }

    // Extract recent events from Brain
    const recentEvents = candidateAIBrain.getObservations()
      .slice(-10)
      .map(obs => `${obs.timestamp.toISOString()}: ${obs.type} - ${JSON.stringify(obs.data).substring(0, 50)}...`);

    // Format CandidateGraph data
    const candidateGraphData = `
Overall Score: ${input.candidateGraph.overallScore || 0}/100
Communication: ${input.candidateGraph.communication?.score || 0}/100
Leadership: ${input.candidateGraph.leadership?.score || 0}/100
Confidence: ${input.candidateGraph.confidence || 0}/100
Structure: ${input.candidateGraph.structure?.score || 0}/100
Impact: ${input.candidateGraph.impact?.score || 0}/100

Progress: ${input.candidateGraph.progress?.timeline?.length || 0} interviews completed
Change: ${input.candidateGraph.progress?.change || 0}
Trend: ${input.candidateGraph.progress?.trend || "stable"}

Strengths: ${(input.candidateGraph.strengths || []).map((s: any) => s.description).join(", ")}
Weaknesses: ${(input.candidateGraph.weaknesses || []).map((w: any) => w.description).join(", ")}
`;

    const result = await aiOrchestrator.execute<MetaIntelligenceOutput>(
      careerCopilotMetaIntelligenceV1,
      {
        candidateProfile: JSON.stringify(candidateProfile),
        candidateGraph: candidateGraphData,
        currentStrategy,
        previousStrategy,
        currentPriority: currentPriorityText,
        previousPriorities: priorityHistory,
        currentCommitments: currentCommitmentsText,
        previousCommitments: commitmentHistory,
        currentConclusions: currentConclusionsText,
        conclusionHistory,
        currentConfidence: currentConfidenceText,
        confidenceHistory,
        currentForecast: currentForecastText,
        currentProgressionPlan: currentProgressionPlanText,
        currentDigitalTwin: currentDigitalTwinText,
        recentEvents: recentEvents.join("\n"),
        opportunityCoherence,
        opportunityConfidence,
        applicationCoherence,
        applicationConfidence,
        successContext,
        constraintContext: JSON.stringify(constraintContext, null, 2),
        resourceContext: JSON.stringify(resourceContext, null, 2),
        knowledgeEvolutionContext: JSON.stringify(knowledgeEvolutionContext, null, 2),
      },
      {
        provider: "openai",
        model: "gpt-4-turbo",
        promptId: "career-copilot-meta-intelligence",
        promptVersion: "v1",
        temperature: 0.7,
        maxTokens: 1500,
      }
    );

    if (!result.success || !result.data) {
      throw new Error("Failed to coordinate intelligences");
    }

    const metaIntelligenceData = result.data;

    // Save meta intelligence evaluation to Brain as observation
    candidateAIBrain.addObservation({
      timestamp: new Date(),
      source: "career-copilot-meta-intelligence",
      type: "career",
      data: metaIntelligenceData,
      confidence: metaIntelligenceData.globalCoherence / 100,
    });

    // Publish meta intelligence events to EventBus
    if (metaIntelligenceData.detectedIncoherencies.length > 0) {
      const incoherenceEvent: ObservationCreatedEvent = {
        id: `incoherence-detected-${Date.now()}`,
        timestamp: new Date(),
        type: "observation_created",
        payload: {
          source: "career-copilot-meta-intelligence",
          observationType: "career",
          data: {
            incoherencies: metaIntelligenceData.detectedIncoherencies,
            globalCoherence: metaIntelligenceData.globalCoherence,
          },
          confidence: metaIntelligenceData.globalCoherence / 100,
        },
      };

      eventBus.publish(incoherenceEvent);
    }

    if (metaIntelligenceData.resolvedConflicts.length > 0) {
      const conflictResolutionEvent: ObservationCreatedEvent = {
        id: `conflict-resolved-${Date.now()}`,
        timestamp: new Date(),
        type: "observation_created",
        payload: {
          source: "career-copilot-meta-intelligence",
          observationType: "career",
          data: {
            resolvedConflicts: metaIntelligenceData.resolvedConflicts,
            globalCoherence: metaIntelligenceData.globalCoherence,
          },
          confidence: metaIntelligenceData.globalCoherence / 100,
        },
      };

      eventBus.publish(conflictResolutionEvent);
    }

    return metaIntelligenceData;
  }

  /**
   * Get current meta intelligence from Brain
   */
  static getCurrentMetaIntelligence(): MetaIntelligenceOutput | null {
    const currentMetaIntelligenceObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-meta-intelligence")
      .slice(-1);

    if (currentMetaIntelligenceObs.length > 0 && currentMetaIntelligenceObs[0]) {
      return currentMetaIntelligenceObs[0].data as MetaIntelligenceOutput;
    }

    return null;
  }

  /**
   * Get meta intelligence history from Brain
   */
  static getMetaIntelligenceHistory(): MetaIntelligenceOutput[] {
    const metaIntelligenceObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-meta-intelligence")
      .slice(-10);

    return metaIntelligenceObs.map(obs => obs.data as MetaIntelligenceOutput);
  }
}
