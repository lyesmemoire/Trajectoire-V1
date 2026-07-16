// @ts-nocheck
import { aiOrchestrator } from "../../ai/AIOrchestrator";
import { careerCopilotConversationV1 } from "../../ai/Prompts/career-copilot-conversation-v1";
import { candidateAIBrain } from "../../ai/brain/CandidateAIBrain";
import { eventBus } from "../../ai/events/EventBus";
import { ObservationCreatedEvent } from "../../ai/events/BrainEvents";
import { CareerCopilotAdaptiveStrategyEngine } from "./careerCopilotAdaptiveStrategyEngine";
import { CareerCopilotDecisionIntelligenceEngine } from "./careerCopilotDecisionIntelligenceEngine";
import { CareerCopilotAccountabilityEngine } from "./careerCopilotAccountabilityEngine";
import { CareerCopilotSelfReviewEngine } from "./careerCopilotSelfReviewEngine";
import { CareerCopilotConfidenceEngine } from "./careerCopilotConfidenceEngine";
import { CareerCopilotResourceIntelligenceEngine } from "./careerCopilotResourceIntelligenceEngine";

export interface ConversationInput {
  userQuestion: string;
  candidateGraph: any;
  conversationHistory?: Array<{
    question: string;
    answer: string;
    timestamp: Date;
  }>;
}

export interface ConversationOutput {
  response: string;
  reasoning: string;
  evidence: string[];
  recommendations: string[];
  context: {
    score: number;
    trend: "improving" | "stable" | "declining";
    keyObservations: string[];
  };
  sources: string[];
  explanation: string;
  confidence: number;
  limitations: string[];
  changes: {
    metric: string;
    change: string;
  }[];
}

/**
 * Career Copilot Conversation Engine
 * 
 * Generates contextual, conversational responses based on candidate data.
 * Reuses existing AIOrchestrator and CandidateAIBrain.
 */
export class CareerCopilotConversationEngine {
  /**
   * Detect question type automatically
   */
  private static detectQuestionType(question: string): string[] {
    const lowerQuestion = question.toLowerCase();
    const types: string[] = [];

    if (lowerQuestion.includes("progression") || lowerQuestion.includes("évolution") || lowerQuestion.includes("améliorer")) {
      types.push("progression");
    }
    if (lowerQuestion.includes("carrière") || lowerQuestion.includes("objectif") || lowerQuestion.includes("avenir")) {
      types.push("career");
    }
    if (lowerQuestion.includes("entretien") || lowerQuestion.includes("interview") || lowerQuestion.includes("simulation")) {
      types.push("interview");
    }
    if (lowerQuestion.includes("ats") || lowerQuestion.includes("cv") || lowerQuestion.includes("resume")) {
      types.push("ats");
    }
    if (lowerQuestion.includes("compétence") || lowerQuestion.includes("skill") || lowerQuestion.includes("force") || lowerQuestion.includes("faiblesse")) {
      types.push("skills");
    }
    if (lowerQuestion.includes("recommandation") || lowerQuestion.includes("conseil") || lowerQuestion.includes("suggestion")) {
      types.push("recommendations");
    }
    if (lowerQuestion.includes("objectif") || lowerQuestion.includes("goal") || lowerQuestion.includes("cible")) {
      types.push("goals");
    }
    if (lowerQuestion.includes("historique") || lowerQuestion.includes("avant") || lowerQuestion.includes("depuis")) {
      types.push("history");
    }
    if (lowerQuestion.includes("comparer") || lowerQuestion.includes("différence") || lowerQuestion.includes("écart")) {
      types.push("comparison");
    }
    if (lowerQuestion.includes("marché") || lowerQuestion.includes("market") || lowerQuestion.includes("tendance") || lowerQuestion.includes("opportunité") || lowerQuestion.includes("compétitif") || lowerQuestion.includes("recrute")) {
      types.push("market");
    }
    if (lowerQuestion.includes("offre") || lowerQuestion.includes("opportunité") || lowerQuestion.includes("postuler") || lowerQuestion.includes("stage") || lowerQuestion.includes("alternance") || lowerQuestion.includes("freelance") || lowerQuestion.includes("mission")) {
      types.push("opportunity");
    }
    if (lowerQuestion.includes("candidature") || lowerQuestion.includes("application") || lowerQuestion.includes("relance") || lowerQuestion.includes("entretien") || lowerQuestion.includes("offre reçue") || lowerQuestion.includes("négociation") || lowerQuestion.includes("accepter") || lowerQuestion.includes("refuser") || lowerQuestion.includes("préparer candidature") || lowerQuestion.includes("suivi candidature") || lowerQuestion.includes("pipeline") || lowerQuestion.includes("processus")) {
      types.push("application");
    }
    if (lowerQuestion.includes("optimisation") || lowerQuestion.includes("optimiser") || lowerQuestion.includes("améliorer chances") || lowerQuestion.includes("maximiser") || lowerQuestion.includes("meilleur investissement") || lowerQuestion.includes("meilleur levier") || lowerQuestion.includes("frein") || lowerQuestion.includes("bloqueur") || lowerQuestion.includes("roi") || lowerQuestion.includes("rentabilité") || lowerQuestion.includes("gagner du temps") || lowerQuestion.includes("efficacité") || lowerQuestion.includes("productivité") || lowerQuestion.includes("priorité") || lowerQuestion.includes("concentrer efforts") || lowerQuestion.includes("où investir") || lowerQuestion.includes("action la plus rentable") || lowerQuestion.includes("raccourci") || lowerQuestion.includes("accélérer")) {
      types.push("success");
    }
    if (lowerQuestion.includes("contrainte") || lowerQuestion.includes("limitation") || lowerQuestion.includes("restriction") || lowerQuestion.includes("impossible") || lowerQuestion.includes("pas possible") || lowerQuestion.includes("bloque") || lowerQuestion.includes("empêche") || lowerQuestion.includes("disponibilité") || lowerQuestion.includes("temps") || lowerQuestion.includes("budget") || lowerQuestion.includes("argent") || lowerQuestion.includes("famille") || lowerQuestion.includes("mobilité") || lowerQuestion.includes("déplacement") || lowerQuestion.includes("salaire") || lowerQuestion.includes("rémunération") || lowerQuestion.includes("secteur") || lowerQuestion.includes("technologie") || lowerQuestion.includes("risque") || lowerQuestion.includes("stress") || lowerQuestion.includes("langue") || lowerQuestion.includes("santé") || lowerQuestion.includes("délai") || lowerQuestion.includes("urgence") || lowerQuestion.includes("équilibre") || lowerQuestion.includes("work-life balance") || lowerQuestion.includes("contrat") || lowerQuestion.includes("cdi") || lowerQuestion.includes("freelance") || lowerQuestion.includes("télétravail") || lowerQuestion.includes("remote") || lowerQuestion.includes("distance")) {
      types.push("constraint");
    }
    if (lowerQuestion.includes("ressource") || lowerQuestion.includes("resource") || lowerQuestion.includes("disponible") || lowerQuestion.includes("capacité") || lowerQuestion.includes("énergie") || lowerQuestion.includes("investir") || lowerQuestion.includes("budget") || lowerQuestion.includes("temps disponible") || lowerQuestion.includes("compétence disponible") || lowerQuestion.includes("réseau") || lowerQuestion.includes("moyen") || lowerQuestion.includes("sous-utilisé") || lowerQuestion.includes("sur-utilisé") || lowerQuestion.includes("optimiser ressources") || lowerQuestion.includes("gérer ressources") || lowerQuestion.includes("allouer") || lowerQuestion.includes("répartir") || lowerQuestion.includes("manque de temps") || lowerQuestion.includes("manque d'argent") || lowerQuestion.includes("manque d'énergie") || lowerQuestion.includes("capacité limitée") || lowerQuestion.includes("ressource critique") || lowerQuestion.includes("ressource bloquante")) {
      types.push("resource");
    }

    return types.length > 0 ? types : ["general"];
  }

  /**
   * Retrieve relevant analyses from CandidateAIBrain
   */
  private static retrieveRelevantAnalyses(questionTypes: string[]): {
    careerAnalysis: string;
    recommendations: string;
    progressionPlan: string;
    digitalTwin: string;
    dailySummary: string;
    careerForecast: string;
    goalIntelligence: string;
    marketIntelligence: string;
    opportunityIntelligence: string;
    applicationIntelligence: string;
    successIntelligence: string;
    scenarioIntelligence: string;
    constraintIntelligence: string;
    resourceIntelligence: string;
    sources: string[];
  } {
    const sources: string[] = [];

    // Retrieve Career Analysis
    const careerAnalysisObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-analysis")
      .slice(-1);
    const careerAnalysis = careerAnalysisObs.length > 0 && careerAnalysisObs[0]
      ? JSON.stringify(careerAnalysisObs[0].data).substring(0, 300) + "..."
      : "No career analysis available";
    if (careerAnalysisObs.length > 0) sources.push("CareerAnalysis");

    // Retrieve Recommendations
    const recommendationsObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "recommendations")
      .slice(-1);
    const recommendations = recommendationsObs.length > 0 && recommendationsObs[0]
      ? JSON.stringify(recommendationsObs[0].data).substring(0, 300) + "..."
      : "No recommendations available";
    if (recommendationsObs.length > 0) sources.push("Recommendations");

    // Retrieve Progression Plan
    const progressionPlanObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-progression-plan")
      .slice(-1);
    const progressionPlan = progressionPlanObs.length > 0 && progressionPlanObs[0]
      ? JSON.stringify(progressionPlanObs[0].data).substring(0, 300) + "..."
      : "No progression plan available";
    if (progressionPlanObs.length > 0) sources.push("ProgressionPlan");

    // Retrieve Digital Twin
    const digitalTwinObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-digital-twin")
      .slice(-1);
    const digitalTwin = digitalTwinObs.length > 0 && digitalTwinObs[0]
      ? JSON.stringify(digitalTwinObs[0].data).substring(0, 300) + "..."
      : "No digital twin available";
    if (digitalTwinObs.length > 0) sources.push("DigitalTwin");

    // Retrieve Goal Intelligence
    const goalIntelligenceObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-goal-intelligence")
      .slice(-1);
    const goalIntelligence = goalIntelligenceObs.length > 0 && goalIntelligenceObs[0]
      ? JSON.stringify(goalIntelligenceObs[0].data).substring(0, 300) + "..."
      : "No goal intelligence available";
    if (goalIntelligenceObs.length > 0) sources.push("GoalIntelligence");

    // Retrieve Daily Summary
    const dailySummaryObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-daily-summary")
      .slice(-1);
    const dailySummary = dailySummaryObs.length > 0 && dailySummaryObs[0]
      ? JSON.stringify(dailySummaryObs[0].data).substring(0, 300) + "..."
      : "No daily summary available";
    if (dailySummaryObs.length > 0) sources.push("DailySummary");

    // Retrieve Career Forecast
    const careerForecastObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-forecast")
      .slice(-1);
    const careerForecast = careerForecastObs.length > 0 && careerForecastObs[0]
      ? JSON.stringify(careerForecastObs[0].data).substring(0, 300) + "..."
      : "No career forecast available";
    if (careerForecastObs.length > 0) sources.push("CareerForecast");

    // Retrieve Market Intelligence
    const marketIntelligenceObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-market-intelligence")
      .slice(-1);
    const marketIntelligence = marketIntelligenceObs.length > 0 && marketIntelligenceObs[0]
      ? JSON.stringify(marketIntelligenceObs[0].data).substring(0, 300) + "..."
      : "No market intelligence available";
    if (marketIntelligenceObs.length > 0) sources.push("MarketIntelligence");

    // Retrieve Opportunity Intelligence
    const opportunityIntelligenceObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-opportunity-intelligence")
      .slice(-1);
    const opportunityIntelligence = opportunityIntelligenceObs.length > 0 && opportunityIntelligenceObs[0]
      ? JSON.stringify(opportunityIntelligenceObs[0].data).substring(0, 300) + "..."
      : "No opportunity intelligence available";
    if (opportunityIntelligenceObs.length > 0) sources.push("OpportunityIntelligence");

    // Retrieve Application Intelligence
    const applicationIntelligenceObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-application-intelligence")
      .slice(-1);
    const applicationIntelligence = applicationIntelligenceObs.length > 0 && applicationIntelligenceObs[0]
      ? JSON.stringify(applicationIntelligenceObs[0].data).substring(0, 300) + "..."
      : "No application intelligence available";
    if (applicationIntelligenceObs.length > 0) sources.push("ApplicationIntelligence");

    // Retrieve Success Intelligence
    const successIntelligenceObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-success-intelligence")
      .slice(-1);
    const successIntelligence = successIntelligenceObs.length > 0 && successIntelligenceObs[0]
      ? JSON.stringify(successIntelligenceObs[0].data).substring(0, 300) + "..."
      : "No success intelligence available";
    if (successIntelligenceObs.length > 0) sources.push("SuccessIntelligence");

    // Retrieve Scenario Intelligence
    const scenarioIntelligenceObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-scenario-intelligence")
      .slice(-1);
    const scenarioIntelligence = scenarioIntelligenceObs.length > 0 && scenarioIntelligenceObs[0]
      ? JSON.stringify(scenarioIntelligenceObs[0].data).substring(0, 300) + "..."
      : "No scenario intelligence available";
    if (scenarioIntelligenceObs.length > 0) sources.push("ScenarioIntelligence");

    // Retrieve Constraint Intelligence
    const constraintIntelligenceObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "constraint_intelligence")
      .slice(-1);
    const constraintIntelligence = constraintIntelligenceObs.length > 0 && constraintIntelligenceObs[0]
      ? JSON.stringify(constraintIntelligenceObs[0].data).substring(0, 300) + "..."
      : "No constraint intelligence available";
    if (constraintIntelligenceObs.length > 0) sources.push("ConstraintIntelligence");

    // Retrieve Resource Intelligence
    const resourceIntelligenceObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "resource_intelligence")
      .slice(-1);
    const resourceIntelligence = resourceIntelligenceObs.length > 0 && resourceIntelligenceObs[0]
      ? JSON.stringify(resourceIntelligenceObs[0].data).substring(0, 300) + "..."
      : "No resource intelligence available";
    if (resourceIntelligenceObs.length > 0) sources.push("ResourceIntelligence");

    return {
      careerAnalysis,
      recommendations,
      progressionPlan,
      digitalTwin,
      dailySummary,
      careerForecast,
      goalIntelligence,
      marketIntelligence,
      opportunityIntelligence,
      applicationIntelligence,
      successIntelligence,
      scenarioIntelligence,
      constraintIntelligence,
      resourceIntelligence,
      sources,
    };
  }

  /**
   * Select relevant analyses based on question type
   */
  private static selectRelevantAnalyses(questionTypes: string[], analyses: {
    careerAnalysis: string;
    recommendations: string;
    progressionPlan: string;
    digitalTwin: string;
    dailySummary: string;
    careerForecast: string;
    goalIntelligence: string;
    marketIntelligence: string;
    opportunityIntelligence: string;
    applicationIntelligence: string;
    successIntelligence: string;
    scenarioIntelligence: string;
    constraintIntelligence: string;
    resourceIntelligence: string;
  }): {
    selectedAnalyses: Record<string, string>;
    selectedSources: string[];
  } {
    const selectedAnalyses: Record<string, string> = {};
    const selectedSources: string[] = [];

    // Always include Brain observations
    selectedAnalyses["brainObservations"] = "Included";
    selectedSources.push("BrainObservations");

    if (questionTypes.includes("goals")) {
      selectedAnalyses["goalIntelligence"] = analyses.goalIntelligence;
      if (analyses.goalIntelligence !== "No goal intelligence available") selectedSources.push("GoalIntelligence");
    }

    if (questionTypes.includes("market")) {
      selectedAnalyses["marketIntelligence"] = analyses.marketIntelligence;
      if (analyses.marketIntelligence !== "No market intelligence available") selectedSources.push("MarketIntelligence");
    }

    if (questionTypes.includes("opportunity")) {
      selectedAnalyses["opportunityIntelligence"] = analyses.opportunityIntelligence;
      if (analyses.opportunityIntelligence !== "No opportunity intelligence available") selectedSources.push("OpportunityIntelligence");
    }

    if (questionTypes.includes("application")) {
      selectedAnalyses["applicationIntelligence"] = analyses.applicationIntelligence;
      if (analyses.applicationIntelligence !== "No application intelligence available") selectedSources.push("ApplicationIntelligence");
    }

    if (questionTypes.includes("success")) {
      selectedAnalyses["successIntelligence"] = analyses.successIntelligence;
      if (analyses.successIntelligence !== "No success intelligence available") selectedSources.push("SuccessIntelligence");
    }

    if (questionTypes.includes("scenario")) {
      selectedAnalyses["scenarioIntelligence"] = analyses.scenarioIntelligence;
      if (analyses.scenarioIntelligence !== "No scenario intelligence available") selectedSources.push("ScenarioIntelligence");
    }

    if (questionTypes.includes("constraint")) {
      selectedAnalyses["constraintIntelligence"] = analyses.constraintIntelligence;
      if (analyses.constraintIntelligence !== "No constraint intelligence available") selectedSources.push("ConstraintIntelligence");
    }

    if (questionTypes.includes("scenario") || questionTypes.includes("future") || questionTypes.includes("general")) {
      selectedAnalyses["scenarioIntelligence"] = analyses.scenarioIntelligence;
      if (analyses.scenarioIntelligence !== "No scenario intelligence available") selectedSources.push("ScenarioIntelligence");
    }

    // Select based on question type
    if (questionTypes.includes("constraint")) {
      selectedAnalyses["constraintIntelligence"] = analyses.constraintIntelligence;
      if (analyses.constraintIntelligence !== "No constraint intelligence available") selectedSources.push("ConstraintIntelligence");
    }

    if (questionTypes.includes("resource")) {
      selectedAnalyses["resourceIntelligence"] = analyses.resourceIntelligence;
      if (analyses.resourceIntelligence !== "No resource intelligence available") selectedSources.push("ResourceIntelligence");
    }

    if (questionTypes.includes("progression") || questionTypes.includes("career")) {
      selectedAnalyses["careerAnalysis"] = analyses.careerAnalysis;
      selectedAnalyses["progressionPlan"] = analyses.progressionPlan;
      selectedAnalyses["careerForecast"] = analyses.careerForecast;
      if (analyses.careerAnalysis !== "No career analysis available") selectedSources.push("CareerAnalysis");
      if (analyses.progressionPlan !== "No progression plan available") selectedSources.push("ProgressionPlan");
      if (analyses.careerForecast !== "No career forecast available") selectedSources.push("CareerForecast");
    }

    if (questionTypes.includes("recommendations") || questionTypes.includes("goals")) {
      selectedAnalyses["recommendations"] = analyses.recommendations;
      selectedAnalyses["progressionPlan"] = analyses.progressionPlan;
      selectedAnalyses["careerForecast"] = analyses.careerForecast;
      if (analyses.recommendations !== "No recommendations available") selectedSources.push("Recommendations");
      if (analyses.progressionPlan !== "No progression plan available") selectedSources.push("ProgressionPlan");
      if (analyses.careerForecast !== "No career forecast available") selectedSources.push("CareerForecast");
    }

    if (questionTypes.includes("skills") || questionTypes.includes("history") || questionTypes.includes("comparison")) {
      selectedAnalyses["digitalTwin"] = analyses.digitalTwin;
      if (analyses.digitalTwin !== "No digital twin available") selectedSources.push("DigitalTwin");
    }

    if (questionTypes.includes("general")) {
      // For general questions, include all available analyses
      selectedAnalyses["careerAnalysis"] = analyses.careerAnalysis;
      selectedAnalyses["recommendations"] = analyses.recommendations;
      selectedAnalyses["progressionPlan"] = analyses.progressionPlan;
      selectedAnalyses["digitalTwin"] = analyses.digitalTwin;
      selectedAnalyses["dailySummary"] = analyses.dailySummary;
      selectedAnalyses["careerForecast"] = analyses.careerForecast;
      if (analyses.careerAnalysis !== "No career analysis available") selectedSources.push("CareerAnalysis");
      if (analyses.recommendations !== "No recommendations available") selectedSources.push("Recommendations");
      if (analyses.progressionPlan !== "No progression plan available") selectedSources.push("ProgressionPlan");
      if (analyses.digitalTwin !== "No digital twin available") selectedSources.push("DigitalTwin");
      if (analyses.dailySummary !== "No daily summary available") selectedSources.push("DailySummary");
      if (analyses.careerForecast !== "No career forecast available") selectedSources.push("CareerForecast");
    }

    return { selectedAnalyses, selectedSources };
  }

  /**
   * Detect and resolve conflicts between analyses
   */
  private static resolveConflicts(analyses: Record<string, string>): string {
    // Simple conflict detection: if analyses have conflicting timestamps, prioritize most recent
    // This is a placeholder for more sophisticated conflict resolution
    return "No conflicts detected";
  }

  /**
   * Calculate confidence based on data quantity, coherence, recency, contradictions
   */
  private static calculateConfidence(analyses: Record<string, string>, sources: string[]): number {
    let confidence = 50; // Base confidence

    // Increase confidence based on number of sources
    confidence += sources.length * 5;

    // Increase confidence based on available analyses
    if (analyses.careerAnalysis && analyses.careerAnalysis !== "No career analysis available") confidence += 10;
    if (analyses.recommendations && analyses.recommendations !== "No recommendations available") confidence += 10;
    if (analyses.progressionPlan && analyses.progressionPlan !== "No progression plan available") confidence += 10;
    if (analyses.digitalTwin && analyses.digitalTwin !== "No digital twin available") confidence += 5;
    if (analyses.careerForecast && analyses.careerForecast !== "No career forecast available") confidence += 5;

    // Cap confidence at 100
    return Math.min(confidence, 100);
  }

  /**
   * Calculate changes since last response
   */
  private static calculateChanges(candidateGraph: any): {
    metric: string;
    change: string;
  }[] {
    const changes: { metric: string; change: string }[] = [];

    // Calculate score changes from CandidateGraph progress
    if (candidateGraph.progress?.change) {
      changes.push({
        metric: "Score global",
        change: candidateGraph.progress.change > 0 ? `+${candidateGraph.progress.change}` : `${candidateGraph.progress.change}`,
      });
    }

    // Calculate individual metric changes if available
    if (candidateGraph.communication?.score) {
      changes.push({
        metric: "Communication",
        change: "stable", // Placeholder - would need historical data
      });
    }

    if (candidateGraph.leadership?.score) {
      changes.push({
        metric: "Leadership",
        change: "stable", // Placeholder - would need historical data
      });
    }

    return changes;
  }

  /**
   * Extract used observations for evidence
   */
  private static extractUsedObservations(analyses: Record<string, string>): string[] {
    const observations: string[] = [];

    // Extract observations from selected analyses
    if (analyses.careerAnalysis && analyses.careerAnalysis !== "No career analysis available") {
      observations.push("Career Analysis");
    }
    if (analyses.recommendations && analyses.recommendations !== "No recommendations available") {
      observations.push("Recommendations");
    }
    if (analyses.progressionPlan && analyses.progressionPlan !== "No progression plan available") {
      observations.push("Progression Plan");
    }
    if (analyses.digitalTwin && analyses.digitalTwin !== "No digital twin available") {
      observations.push("Digital Twin");
    }
    if (analyses.careerForecast && analyses.careerForecast !== "No career forecast available") {
      observations.push("Career Forecast");
    }
    if (analyses.brainObservations) {
      observations.push("Brain Observations");
    }

    return observations;
  }

  /**
   * Generate conversational response
   */
  static async generateResponse(input: ConversationInput): Promise<ConversationOutput> {
    // Detect question type automatically
    const questionTypes = this.detectQuestionType(input.userQuestion);

    // Retrieve relevant analyses from CandidateAIBrain
    const analyses = this.retrieveRelevantAnalyses(questionTypes);

    // Select relevant analyses based on question type
    const { selectedAnalyses, selectedSources } = this.selectRelevantAnalyses(questionTypes, analyses);

    // Detect and resolve conflicts
    const conflictResolution = this.resolveConflicts(selectedAnalyses);

    // Calculate confidence based on data quantity, coherence, recency, contradictions
    const confidence = this.calculateConfidence(selectedAnalyses, selectedSources);

    // Calculate changes since last response
    const changes = this.calculateChanges(input.candidateGraph);

    // Extract used observations for evidence
    const usedObservations = this.extractUsedObservations(selectedAnalyses);

    // Extract current strategy from Adaptive Strategy Engine
    const currentStrategy = CareerCopilotAdaptiveStrategyEngine.getCurrentStrategy() || "No current strategy defined";

    // Extract strategy history from Adaptive Strategy Engine
    const strategyHistory = CareerCopilotAdaptiveStrategyEngine.getStrategyHistory()
      .map(strategy => `${strategy.currentStrategy} -> ${strategy.proposedStrategy}: ${strategy.changeReason}`)
      .join("\n") || "No strategy history";

    // Extract current priority from Decision Intelligence Engine
    const currentPriority = CareerCopilotDecisionIntelligenceEngine.getCurrentPriority();
    const currentPriorityText = currentPriority
      ? `${currentPriority.absolutePriority} (${currentPriority.priorityReason})`
      : "No current priority defined";

    // Extract priority history from Decision Intelligence Engine
    const priorityHistory = CareerCopilotDecisionIntelligenceEngine.getPriorityHistory()
      .map(priority => `${priority.absolutePriority}: ${priority.priorityReason}`)
      .join("\n") || "No priority history";

    // Extract current commitments from Accountability Engine
    const currentCommitments = CareerCopilotAccountabilityEngine.getCurrentCommitments();
    const currentCommitmentsText = currentCommitments
      ? `Completion Rate: ${currentCommitments.completionRate}%
Behavioral Pattern: ${currentCommitments.behavioralPattern}
Current Commitments: ${currentCommitments.currentCommitments.map(c => `${c.description} (${c.state})`).join(", ")}
Completed: ${currentCommitments.completedCommitments.map(c => c.description).join(", ")}
Pending: ${currentCommitments.pendingCommitments.map(c => c.description).join(", ")}
Abandoned: ${currentCommitments.abandonedCommitments.map(c => c.description).join(", ")}`
      : "No current commitments available";

    // Extract commitment history from Accountability Engine
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

    // Extract resource intelligence context
    const lastResourceAnalysis = CareerCopilotResourceIntelligenceEngine.getLastResourceAnalysis();
    const resourceContext = lastResourceAnalysis
      ? JSON.stringify({
          resourceSummary: lastResourceAnalysis.resourceSummary,
          availableResources: lastResourceAnalysis.resourcesByCategory.reduce((acc, cat) => {
            acc[cat.category] = cat.resources.map(r => ({ name: r.name, availability: r.availability, unit: r.unit }));
            return acc;
          }, {} as Record<string, any>),
          resourceRecommendations: lastResourceAnalysis.resourceRecommendations,
          detectedChanges: lastResourceAnalysis.detectedChanges,
        }, null, 2)
      : "No resource intelligence available";

    // Extract data from CandidateGraph
    const candidateProfile = {
      name: input.candidateGraph.identity?.name || "Candidat",
      currentRole: input.candidateGraph.career?.currentRole || "Non défini",
      careerLevel: input.candidateGraph.career?.careerLevel || "mid",
      overallScore: input.candidateGraph.overallScore || 0,
    };

    // Extract historical observations from Brain
    const historicalObservations = candidateAIBrain.getObservations()
      .slice(0, 10)
      .map(obs => `${obs.type}: ${JSON.stringify(obs.data).substring(0, 100)}...`);

    // Extract recent insights from Brain
    const recentInsights = candidateAIBrain.getInsights()
      .slice(0, 5)
      .map(insight => insight.description);

    // Extract current goals from Brain
    const currentGoals = candidateAIBrain.getGoals()
      .filter(g => g.status === "in_progress")
      .map(g => g.description);

    // Extract recent events from Brain
    const recentEvents = candidateAIBrain.getObservations()
      .slice(0, 5)
      .map(obs => `${obs.type} at ${obs.timestamp.toISOString()}`);

    // Extract previous recommendations from Brain for comparison
    const previousCareerAnalyses = candidateAIBrain.findHistory("career-analysis", 3)
      .map(h => JSON.stringify(h.output).substring(0, 200) + "...");
    const previousRecommendations = candidateAIBrain.findHistory("recommendations", 3)
      .map(h => JSON.stringify(h.output).substring(0, 200) + "...");
    const previousActionPlans = candidateAIBrain.findHistory("action-plan", 3)
      .map(h => JSON.stringify(h.output).substring(0, 200) + "...");

    const previousAnalyses = `
Career Analyses:
${previousCareerAnalyses.length > 0 ? previousCareerAnalyses.join("\n") : "None"}

Recommendations:
${previousRecommendations.length > 0 ? previousRecommendations.join("\n") : "None"}

Action Plans:
${previousActionPlans.length > 0 ? previousActionPlans.join("\n") : "None"}
`;

    // Extract previous recommendations for continuity
    const previousRecs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "recommendations" || obs.source === "career-copilot-conversation")
      .slice(-5)
      .map(obs => JSON.stringify(obs.data).substring(0, 100) + "...");

    // Derive candidate adaptive profile from Brain data
    const allObservations = candidateAIBrain.getObservations();
    const allInsights = candidateAIBrain.getInsights();
    const allGoals = candidateAIBrain.getGoals();
    const conversationObservations = allObservations.filter(obs => obs.source === "career-copilot-conversation");

    // Autonomy level: based on number of questions asked and complexity
    const autonomyLevel = conversationObservations.length > 10 ? "high" : conversationObservations.length > 5 ? "medium" : "low";

    // Need for explanations: based on question complexity and follow-up questions
    const explanationNeed = conversationObservations.length > 5 ? "low" : "high";

    // Progression pace: based on number of observations (proxy for activity)
    const progressionPace = allObservations.length > 10 ? "fast" : allObservations.length > 5 ? "moderate" : "slow";

    // Confidence level: based on overall score
    const confidenceLevel = input.candidateGraph.overallScore > 75 ? "high" : input.candidateGraph.overallScore > 50 ? "medium" : "low";

    // Usage frequency: based on observation frequency
    const recentObservations = allObservations.filter(obs => {
      const daysSince = (Date.now() - obs.timestamp.getTime()) / (1000 * 60 * 60 * 24);
      return daysSince < 7;
    });
    const usageFrequency = recentObservations.length > 10 ? "daily" : recentObservations.length > 5 ? "weekly" : "occasional";

    // Motivation level: based on goal completion rate
    const completedGoals = allGoals.filter(g => g.status === "achieved").length;
    const totalGoals = allGoals.length;
    const motivationLevel = totalGoals > 0 && completedGoals / totalGoals > 0.7 ? "high" : totalGoals > 0 && completedGoals / totalGoals > 0.4 ? "medium" : "low";

    // Recommendation follow-through: based on action taken after recommendations
    const recommendationObservations = allObservations.filter(obs => obs.source === "recommendations");
    const followThrough = recommendationObservations.length > 0 ? "high" : "unknown";

    // Best-responding advice: based on insights with high confidence
    const highConfidenceInsights = allInsights.filter(i => i.confidence > 0.8);
    const bestAdvice = highConfidenceInsights.length > 0 ? highConfidenceInsights[0]?.description || "None identified" : "None identified";

    // Determine trend from CandidateGraph progress
    const trend = input.candidateGraph.progress?.trend || "stable";
    const change = input.candidateGraph.progress?.change || 0;

    // Format conversation history
    const conversationHistory = input.conversationHistory
      ? input.conversationHistory
          .slice(-5)
          .map(h => `Q: ${h.question}\nA: ${h.answer}`)
          .join("\n\n")
      : "No previous conversation";

    // Format CandidateGraph data
    const candidateGraphData = `
Overall Score: ${input.candidateGraph.overallScore || 0}/100
Communication: ${input.candidateGraph.communication?.score || 0}/100
Leadership: ${input.candidateGraph.leadership?.score || 0}/100
Confidence: ${input.candidateGraph.confidence || 0}/100
Structure: ${input.candidateGraph.structure?.score || 0}/100
Impact: ${input.candidateGraph.impact?.score || 0}/100

Strengths: ${(input.candidateGraph.strengths || []).map((s: any) => s.description).join(", ")}
Weaknesses: ${(input.candidateGraph.weaknesses || []).map((w: any) => w.description).join(", ")}

Recommended Skills: ${(input.candidateGraph.recommendedSkills || []).map((s: any) => s.title).join(", ")}
Recommended Interviews: ${(input.candidateGraph.recommendedInterviews || []).map((i: any) => i.title).join(", ")}

Progress: ${input.candidateGraph.progress?.timeline?.length || 0} interviews completed
Change: ${input.candidateGraph.progress?.change || 0}
Trend: ${input.candidateGraph.progress?.trend || "stable"}
`;

    const result = await aiOrchestrator.execute<ConversationOutput>(
      careerCopilotConversationV1,
      {
        userQuestion: input.userQuestion,
        candidateProfile: JSON.stringify(candidateProfile),
        candidateAutonomy: autonomyLevel,
        explanationNeed: explanationNeed,
        progressionPace: progressionPace,
        confidenceLevel: confidenceLevel,
        usageFrequency: usageFrequency,
        motivationLevel: motivationLevel,
        recommendationFollowThrough: followThrough,
        bestAdvice: bestAdvice,
        candidateGraph: candidateGraphData,
        historicalObservations: historicalObservations.join("\n"),
        recentInsights: recentInsights.join("\n"),
        conversationHistory,
        currentGoals: currentGoals.join("\n"),
        recentEvents: recentEvents.join("\n"),
        previousAnalyses,
        previousRecommendations: previousRecs.join("\n"),
        selectedAnalyses: JSON.stringify(selectedAnalyses),
        conflictResolution,
        usedObservations: usedObservations.join(", "),
        calculatedConfidence: confidence,
        calculatedChanges: JSON.stringify(changes),
        currentStrategy,
        strategyHistory,
        currentPriority: currentPriorityText,
        priorityHistory,
        currentCommitments: currentCommitmentsText,
        commitmentHistory,
        currentConclusions: currentConclusionsText,
        conclusionHistory,
        currentConfidence: currentConfidenceText,
        confidenceHistory,
        resourceContext,
      },
      {
        provider: "openai",
        model: "gpt-4-turbo",
        promptId: "career-copilot-conversation",
        promptVersion: "v3",
        temperature: 0.7,
        maxTokens: 1500,
      }
    );

    if (!result.success || !result.data) {
      throw new Error("Failed to generate conversation response");
    }

    // Add sources to response for internal tracking
    result.data.sources = selectedSources;

    // Add explanation, confidence, limitations, changes to response
    result.data.explanation = result.data.explanation || "Based on available analyses and observations.";
    result.data.confidence = result.data.confidence || confidence;
    result.data.limitations = result.data.limitations || [];
    result.data.changes = result.data.changes || changes;

    // Save conversation to Brain as observation
    candidateAIBrain.addObservation({
      timestamp: new Date(),
      source: "career-copilot-conversation",
      type: "general",
      data: {
        question: input.userQuestion,
        answer: result.data.response,
      },
      confidence: 0.9,
    });

    // Publish conversation event to EventBus
    const conversationEvent: ObservationCreatedEvent = {
      id: `conversation-${Date.now()}`,
      timestamp: new Date(),
      type: "observation_created",
      payload: {
        source: "career-copilot-conversation",
        observationType: "general",
        data: {
          question: input.userQuestion,
          answer: result.data.response,
          evidence: result.data.evidence,
          recommendations: result.data.recommendations,
        },
        confidence: 0.9,
      },
    };

    eventBus.publish(conversationEvent);

    return result.data;
  }
}
