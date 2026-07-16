// @ts-nocheck
import { aiOrchestrator } from "../../ai/AIOrchestrator";
import { careerCopilotConfidenceV1 } from "../../ai/Prompts/career-copilot-confidence-v1";
import { candidateAIBrain } from "../../ai/brain/CandidateAIBrain";
import { eventBus } from "../../ai/events/EventBus";
import { ObservationCreatedEvent } from "../../ai/events/BrainEvents";
import { CareerCopilotMetaIntelligenceEngine } from "./careerCopilotMetaIntelligenceEngine";
import { CareerCopilotAdaptiveStrategyEngine } from "./careerCopilotAdaptiveStrategyEngine";
import { CareerCopilotDecisionIntelligenceEngine } from "./careerCopilotDecisionIntelligenceEngine";
import { CareerCopilotAccountabilityEngine } from "./careerCopilotAccountabilityEngine";
import { CareerCopilotSelfReviewEngine } from "./careerCopilotSelfReviewEngine";
import { CareerCopilotOpportunityIntelligenceEngine } from "./careerCopilotOpportunityIntelligenceEngine";
import { CareerCopilotApplicationIntelligenceEngine } from "./careerCopilotApplicationIntelligenceEngine";
import { CareerCopilotSuccessIntelligenceEngine } from "./careerCopilotSuccessIntelligenceEngine";
import { CareerCopilotConstraintIntelligenceEngine } from "./careerCopilotConstraintIntelligenceEngine";
import { CareerCopilotResourceIntelligenceEngine } from "./careerCopilotResourceIntelligenceEngine";
import { CareerCopilotKnowledgeEvolutionEngine } from "./careerCopilotKnowledgeEvolutionEngine";

export interface DomainConfidence {
  domain: string;
  confidence: number;
  level: "very_high" | "high" | "moderate" | "low" | "insufficient";
  reason: string;
}

export interface ReliableDomain {
  domain: string;
  confidence: number;
  reason: string;
}

export interface UncertainDomain {
  domain: string;
  confidence: number;
  reason: string;
}

export interface MissingData {
  type: string;
  description: string;
  impact: string;
}

export interface SolidAnalysis {
  analysis: string;
  confidence: number;
  evidence: string[];
}

export interface RemainingHypothesis {
  hypothesis: string;
  confidence: number;
  evidence: string[];
}

export interface ConfidenceEvolution {
  previousConfidence: number;
  currentConfidence: number;
  change: number;
  reason: string;
}

export interface ImprovementAction {
  action: string;
  expectedImpact: string;
  priority: "high" | "medium" | "low";
}

export interface ConfidenceInput {
  candidateGraph: any;
}

export interface ConfidenceOutput {
  globalConfidence: number;
  confidenceLevel: "very_high" | "high" | "moderate" | "low" | "insufficient";
  domainConfidence: DomainConfidence[];
  reliableDomains: ReliableDomain[];
  uncertainDomains: UncertainDomain[];
  missingData: MissingData[];
  solidAnalyses: SolidAnalysis[];
  remainingHypotheses: RemainingHypothesis[];
  confidenceEvolution: ConfidenceEvolution;
  reasons: string[];
  limitations: string[];
  improvementActions: ImprovementAction[];
}

/**
 * Career Copilot Confidence & Uncertainty Engine
 * 
 * Evaluates the quality of available information, expresses confidence levels,
 * identifies uncertainty zones, and proposes actions to reduce uncertainty.
 * Reuses existing AIOrchestrator and CandidateAIBrain.
 */
export class CareerCopilotConfidenceEngine {
  /**
   * Evaluate confidence and uncertainty
   */
  static async evaluateConfidence(input: ConfidenceInput): Promise<ConfidenceOutput> {
    // Extract data from CandidateGraph
    const candidateProfile = {
      name: input.candidateGraph.identity?.name || "Candidat",
      currentRole: input.candidateGraph.career?.currentRole || "Non défini",
      careerLevel: input.candidateGraph.career?.careerLevel || "mid",
      overallScore: input.candidateGraph.overallScore || 0,
    };

    // Extract historical observations from Brain
    const historicalObservations = candidateAIBrain.getObservations()
      .slice(0, 20)
      .map(obs => `${obs.type}: ${JSON.stringify(obs.data).substring(0, 100)}...`);

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

    // Extract meta intelligence to account for analysis coherence
    const metaIntelligence = CareerCopilotMetaIntelligenceEngine.getCurrentMetaIntelligence();
    const globalCoherence = metaIntelligence
      ? metaIntelligence.globalCoherence
      : 0;
    const detectedIncoherencies = metaIntelligence
      ? metaIntelligence.detectedIncoherencies.map(inc => `${inc.type}: ${inc.description} (${inc.severity})`).join("\n")
      : "No incoherencies detected";
    const resolvedConflicts = metaIntelligence
      ? metaIntelligence.resolvedConflicts.map(conf => `${conf.type}: ${conf.resolution}`).join("\n")
      : "No conflicts resolved";

    // Extract recent events from Brain
    const recentEvents = candidateAIBrain.getObservations()
      .slice(-10)
      .map(obs => `${obs.timestamp.toISOString()}: ${obs.type} - ${JSON.stringify(obs.data).substring(0, 50)}...`);

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

    // Extract opportunity intelligence to evaluate confidence on opportunity assessments
    const opportunityIntelligence = CareerCopilotOpportunityIntelligenceEngine.getCurrentOpportunityIntelligence();
    const opportunityConfidence = opportunityIntelligence
      ? `Overall opportunity confidence: ${opportunityIntelligence.confidence.overallConfidence}, Data quality: ${opportunityIntelligence.confidence.dataQuality}, Missing data: ${opportunityIntelligence.confidence.missingData.map((d: any) => d.data).join(", ")}`
      : "No opportunity confidence available";
    const opportunityUncertainty = opportunityIntelligence
      ? opportunityIntelligence.confidence.missingData.map((d: any) => d.data).join(", ")
      : "No opportunity uncertainty domains available";

    // Extract application intelligence to evaluate confidence on application assessments
    const applicationIntelligence = CareerCopilotApplicationIntelligenceEngine.getCurrentApplicationIntelligence();
    const applicationConfidence = applicationIntelligence
      ? `Overall application confidence: ${applicationIntelligence.confidence.overallConfidence}, Data quality: ${applicationIntelligence.confidence.dataQuality}, Missing data: ${applicationIntelligence.confidence.missingData.map((d: any) => d.data).join(", ")}`
      : "No application confidence available";
    const applicationUncertainty = applicationIntelligence
      ? applicationIntelligence.confidence.missingData.map((d: any) => d.data).join(", ")
      : "No application uncertainty domains available";

    // Extract success intelligence for optimization context
    const successIntelligence = CareerCopilotSuccessIntelligenceEngine.getCurrentSuccessIntelligence();
    const successContext = successIntelligence
      ? `Overall confidence: ${successIntelligence.confidence.overallConfidence}, Data quality: ${successIntelligence.confidence.dataQuality}, Missing data: ${successIntelligence.confidence.missingData.map((d: any) => d.data).join(", ")}`
      : "No success intelligence available";

    // Get constraint intelligence for constraint-aware confidence evaluation
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

    // Get resource intelligence for resource-aware confidence evaluation
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

    // Get knowledge evolution for knowledge-aware confidence evaluation
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

    const result = await aiOrchestrator.execute<ConfidenceOutput>(
      careerCopilotConfidenceV1,
      {
        candidateProfile: JSON.stringify(candidateProfile),
        candidateGraph: candidateGraphData,
        historicalObservations: historicalObservations.join("\n"),
        currentConclusions: currentConclusionsText,
        conclusionHistory,
        recentEvents: recentEvents.join("\n"),
        currentStrategy,
        previousStrategy,
        currentPriority: currentPriorityText,
        previousPriorities: priorityHistory,
        currentCommitments: currentCommitmentsText,
        previousCommitments: commitmentHistory,
        globalCoherence: globalCoherence.toString(),
        detectedIncoherencies,
        resolvedConflicts,
        opportunityConfidence,
        opportunityUncertainty,
        applicationConfidence,
        applicationUncertainty,
        successContext,
        constraintContext: JSON.stringify(constraintContext, null, 2),
        resourceContext: JSON.stringify(resourceContext, null, 2),
        knowledgeEvolutionContext: JSON.stringify(knowledgeEvolutionContext, null, 2),
      },
      {
        provider: "openai",
        model: "gpt-4-turbo",
        promptId: "career-copilot-confidence",
        promptVersion: "v1",
        temperature: 0.7,
        maxTokens: 1500,
      }
    );

    if (!result.success || !result.data) {
      throw new Error("Failed to evaluate confidence");
    }

    const confidenceData = result.data;

    // Save confidence evaluation to Brain as observation
    candidateAIBrain.addObservation({
      timestamp: new Date(),
      source: "career-copilot-confidence",
      type: "career",
      data: confidenceData,
      confidence: confidenceData.globalConfidence / 100,
    });

    // Publish confidence change events to EventBus
    if (confidenceData.confidenceEvolution.change !== 0) {
      const confidenceChangeEvent: ObservationCreatedEvent = {
        id: `confidence-change-${Date.now()}`,
        timestamp: new Date(),
        type: "observation_created",
        payload: {
          source: "career-copilot-confidence",
          observationType: "career",
          data: {
            previousConfidence: confidenceData.confidenceEvolution.previousConfidence,
            currentConfidence: confidenceData.confidenceEvolution.currentConfidence,
            change: confidenceData.confidenceEvolution.change,
            reason: confidenceData.confidenceEvolution.reason,
          },
          confidence: confidenceData.globalConfidence / 100,
        },
      };

      eventBus.publish(confidenceChangeEvent);
    }

    return confidenceData;
  }

  /**
   * Get current confidence from Brain
   */
  static getCurrentConfidence(): ConfidenceOutput | null {
    const currentConfidenceObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-confidence")
      .slice(-1);

    if (currentConfidenceObs.length > 0 && currentConfidenceObs[0]) {
      return currentConfidenceObs[0].data as ConfidenceOutput;
    }

    return null;
  }

  /**
   * Get confidence history from Brain
   */
  static getConfidenceHistory(): ConfidenceOutput[] {
    const confidenceObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-confidence")
      .slice(-10);

    return confidenceObs.map(obs => obs.data as ConfidenceOutput);
  }
}
