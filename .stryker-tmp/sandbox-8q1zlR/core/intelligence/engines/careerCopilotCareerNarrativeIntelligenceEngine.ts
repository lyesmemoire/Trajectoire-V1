// @ts-nocheck
import { aiOrchestrator } from "../../ai/AIOrchestrator";
import { careerCopilotCareerNarrativeIntelligenceV1 } from "../../ai/Prompts/career-copilot-career-narrative-intelligence-v1";
import { candidateAIBrain } from "../../ai/brain/CandidateAIBrain";
import { eventBus } from "../../ai/events/EventBus";
import { CareerCopilotOpportunityIntelligenceEngine } from "./careerCopilotOpportunityIntelligenceEngine";
import { CareerCopilotApplicationIntelligenceEngine } from "./careerCopilotApplicationIntelligenceEngine";
import { CareerCopilotConstraintIntelligenceEngine } from "./careerCopilotConstraintIntelligenceEngine";
import { CareerCopilotResourceIntelligenceEngine } from "./careerCopilotResourceIntelligenceEngine";
import { CareerCopilotKnowledgeEvolutionEngine } from "./careerCopilotKnowledgeEvolutionEngine";
import { CareerCopilotMissionIntelligenceEngine } from "./careerCopilotMissionIntelligenceEngine";
import { CareerCopilotEvidenceIntelligenceEngine } from "./careerCopilotEvidenceIntelligenceEngine";

export interface CareerNarrativeInput {
  candidateGraph: any;
  currentEvent?: {
    type: string;
    description: string;
    timestamp: Date;
  };
}

export interface CareerNarrativeOutput {
  careerStory: {
    summary: string;
    thread: string;
    keyTurningPoints: Array<{
      point: string;
      significance: string;
      evidence: string[];
      confidence: number;
    }>;
    currentDirection: string;
    confidence: number;
  };
  careerThemes: Array<{
    theme: string;
    description: string;
    evidence: string[];
    confidence: number;
  }>;
  evolutionNarrative: {
    professionalEvolution: string;
    progression: string;
    skillDevelopment: string;
    growthTrajectory: string;
    confidence: number;
  };
  transitionAnalysis: Array<{
    transition: string;
    reason: string;
    learned: string;
    skillsTransferred: string[];
    positiveFraming: string;
    evidence: string[];
    confidence: number;
  }>;
  strengthNarrative: {
    recurringStrengths: Array<{
      strength: string;
      appearance: string;
      evidence: string[];
      confidence: number;
    }>;
    valueDelivery: string;
    uniqueValue: string;
    confidence: number;
  };
  motivationNarrative: {
    evolution: string;
    currentDrivers: string;
    goalConnection: string;
    aspirations: string;
    confidence: number;
  };
  careerIdentity: {
    dominantIdentity: string;
    selfDefinition: string;
    coreNarrative: string;
    uniqueStory: string;
    authenticVoice: string;
    confidence: number;
  };
  consistencyAnalysis: {
    overallCoherence: string;
    coherenceBreaks: Array<{
      break: string;
      impact: string;
      suggestion: string;
      confidence: number;
    }>;
    gaps: Array<{
      gap: string;
      needs: string;
      confidence: number;
    }>;
    confidence: number;
  };
  missingNarrative: Array<{
    element: string;
    why: string;
    suggestion: string;
    confidence: number;
  }>;
  contextAdaptedNarratives: {
    cv: {
      summary: string;
      keyPoints: string[];
      achievements: string[];
      confidence: number;
    };
    linkedin: {
      summary: string;
      keyPoints: string[];
      story: string;
      confidence: number;
    };
    interview: {
      story: string;
      keyAnecdotes: string[];
      transitionExplanations: string[];
      confidence: number;
    };
    networking: {
      elevatorPitch: string;
      conversationStarters: string[];
      memorablePoints: string[];
      confidence: number;
    };
    coverLetter: {
      narrative: string;
      connection: string;
      valueProposition: string;
      confidence: number;
    };
    starResponses: {
      situations: string[];
      achievements: string[];
      challenges: string[];
      confidence: number;
    };
  };
  confidence: {
    overall: number;
    byElement: {
      careerStory: number;
      careerThemes: number;
      evolutionNarrative: number;
      transitionAnalysis: number;
      strengthNarrative: number;
      motivationNarrative: number;
      careerIdentity: number;
      consistencyAnalysis: number;
      missingNarrative: number;
    };
    informationGaps: string[];
  };
  explainability: {
    careerStory: {
      conclusion: string;
      evidence: string[];
      reasoning: string;
      alternatives: string[];
      confidence: number;
    };
    careerIdentity: {
      conclusion: string;
      evidence: string[];
      reasoning: string;
      alternatives: string[];
      confidence: number;
    };
  };
  narrativeFingerprint: {
    hash: string;
    dataSources: string[];
    lastModified: string;
    stability: string;
  };
  consistencyScore: {
    overall: number;
    contradictionsDetected: number;
    transitionsUnexplained: number;
    periodsUndocumented: number;
    skillsIncoherent: number;
    goalsIncompatible: number;
    experiencesContradictory: number;
    narrationIncomplete: number;
    explanation: string;
  };
  narrativeEvolution: {
    identityEvolution: {
      previousIdentity: string;
      currentIdentity: string;
      changeExplanation: string;
      confidence: number;
    };
    strengthsEvolution: {
      previousStrengths: string[];
      currentStrengths: string[];
      evolutionExplanation: string;
      confidence: number;
    };
    motivationsEvolution: {
      previousMotivations: string[];
      currentMotivations: string[];
      evolutionExplanation: string;
      confidence: number;
    };
    goalsEvolution: {
      previousGoals: string[];
      currentGoals: string[];
      evolutionExplanation: string;
      confidence: number;
    };
    coherenceEvolution: {
      previousCoherence: number;
      currentCoherence: number;
      evolutionExplanation: string;
      confidence: number;
    };
    confidenceEvolution: {
      previousConfidence: number;
      currentConfidence: number;
      evolutionExplanation: string;
      confidence: number;
    };
  };
  narrativeEvidence: {
    careerIdentityEvidence: {
      experiences: string[];
      skills: string[];
      certifications: string[];
      conversations: string[];
      achievements: string[];
      goals: string[];
      applications: string[];
      recommendations: string[];
    };
    careerStoryEvidence: {
      experiences: string[];
      transitions: string[];
      achievements: string[];
      gaps: string[];
    };
    strengthsEvidence: {
      experiences: string[];
      achievements: string[];
      skills: string[];
    };
    motivationsEvidence: {
      goals: string[];
      decisions: string[];
      applications: string[];
    };
  };
}

export class CareerCopilotCareerNarrativeIntelligenceEngine {
  private static lastNarrativeAnalysis: CareerNarrativeOutput | null = null;
  private static narrativeHistory: Array<{
    timestamp: Date;
    event: string;
    output: CareerNarrativeOutput;
  }> = [];

  /**
   * Analyze career narrative
   */
  static async analyzeCareerNarrative(
    input: CareerNarrativeInput
  ): Promise<CareerNarrativeOutput> {
    // Extract candidate profile from CandidateGraph (PRIMARY SOURCE)
    const candidateProfile = {
      name: input.candidateGraph.name || "",
      currentRole: input.candidateGraph.currentRole || "",
      targetRole: input.candidateGraph.targetRole || "",
      experience: input.candidateGraph.experience || "",
      education: input.candidateGraph.education || [],
      skills: input.candidateGraph.skills || [],
      achievements: input.candidateGraph.achievements || [],
    };

    // Extract career timeline from CandidateGraph (PRIMARY SOURCE)
    const careerTimeline = input.candidateGraph.careerTimeline || [];
    const careerTimelineText = careerTimeline
      .map((item: any) => {
        return `${item.role} at ${item.company} (${item.startDate} - ${item.endDate || 'Present'})\n${item.description || ''}`;
      })
      .join("\n\n");

    // Extract skills evolution from CandidateGraph (PRIMARY SOURCE)
    const skillsEvolution = input.candidateGraph.skillsEvolution || [];
    const skillsEvolutionText = skillsEvolution
      .map((item: any) => {
        return `${item.skill}: ${item.level} (acquired: ${item.acquiredDate})`;
      })
      .join("\n");

    // Extract achievements from CandidateGraph (PRIMARY SOURCE)
    const achievements = input.candidateGraph.achievements || [];
    const achievementsText = achievements
      .map((item: any) => {
        return `${item.title}: ${item.description}`;
      })
      .join("\n");

    // Extract goals from CandidateGraph (PRIMARY SOURCE)
    const goals = input.candidateGraph.goals || [];
    const goalsText = goals
      .map((item: any) => {
        return `${item.title}: ${item.description}`;
      })
      .join("\n");

    // Generate deterministic fingerprint from CandidateGraph data
    const fingerprint = this.generateNarrativeFingerprint(input.candidateGraph);

    // Get previous narrative analysis for evolution comparison
    const previousNarrativeAnalysis = this.lastNarrativeAnalysis;

    // Get secondary intelligences for enrichment (OPTIONAL - narrative can be constructed without them)
    let opportunityContext = null;
    try {
      const opportunityIntelligence = CareerCopilotOpportunityIntelligenceEngine.getCurrentOpportunityIntelligence();
      if (opportunityIntelligence) {
        opportunityContext = {
          priorityOpportunity: opportunityIntelligence.priorityOpportunity,
          opportunitiesToPrepare: opportunityIntelligence.opportunitiesToPrepare,
        };
      }
    } catch (error) {
      console.error("Failed to get opportunity intelligence (non-critical):", error);
    }

    let applicationContext = null;
    try {
      const applicationIntelligence = CareerCopilotApplicationIntelligenceEngine.getCurrentApplicationIntelligence();
      if (applicationIntelligence) {
        applicationContext = {
          priorityApplication: applicationIntelligence.priorityApplication,
          applicationsToFollowUp: applicationIntelligence.applicationsToFollowUp,
        };
      }
    } catch (error) {
      console.error("Failed to get application intelligence (non-critical):", error);
    }

    let forecastContext = null;
    try {
      const scenarioObs = candidateAIBrain.getObservations()
        .filter(obs => obs.source === "career-copilot-scenario-intelligence")
        .slice(-1);
      if (scenarioObs.length > 0 && scenarioObs[0]) {
        const scenarioData = scenarioObs[0].data as any;
        forecastContext = {
          currentTrajectory: scenarioData.currentTrajectory,
          probableFuture: scenarioData.probableFuture,
          successProbability: scenarioData.successProbability,
        };
      }
    } catch (error) {
      console.error("Failed to get forecast (non-critical):", error);
    }

    let marketContext = null;
    try {
      const marketObs = candidateAIBrain.getObservations()
        .filter(obs => obs.source === "career-copilot-market-intelligence")
        .slice(-1);
      if (marketObs.length > 0 && marketObs[0]) {
        const marketData = marketObs[0].data as any;
        marketContext = {
          marketConditions: marketData.marketConditions,
          marketTrends: marketData.marketTrends,
          competitivePosition: marketData.competitivePosition,
        };
      }
    } catch (error) {
      console.error("Failed to get market intelligence (non-critical):", error);
    }

    let decisionContext = null;
    try {
      const decisionObs = candidateAIBrain.getObservations()
        .filter(obs => obs.source === "career-copilot-decision-intelligence")
        .slice(-1);
      if (decisionObs.length > 0 && decisionObs[0]) {
        const decisionData = decisionObs[0].data as any;
        decisionContext = {
          recentDecisions: decisionData.recentDecisions,
          decisionPatterns: decisionData.decisionPatterns,
          decisionQuality: decisionData.decisionQuality,
        };
      }
    } catch (error) {
      console.error("Failed to get decision intelligence (non-critical):", error);
    }

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
          knowledgeHealthScore: knowledgeEvolution.knowledgeSummary.healthScore,
        };
      }
    } catch (error) {
      console.error("Failed to get knowledge evolution (non-critical):", error);
    }

    let missionContext = null;
    try {
      const missionIntelligence = CareerCopilotMissionIntelligenceEngine.getLastMissionAnalysis();
      if (missionIntelligence) {
        missionContext = {
          mission: missionIntelligence.mission,
          currentPhase: missionIntelligence.currentPhase,
        };
      }
    } catch (error) {
      console.error("Failed to get mission intelligence (non-critical):", error);
    }

    let evidenceContext = null;
    try {
      const evidenceIntelligence = CareerCopilotEvidenceIntelligenceEngine.getLastEvidenceAnalysis();
      if (evidenceIntelligence) {
        evidenceContext = {
          evidenceSummary: evidenceIntelligence.evidenceSummary,
          strongEvidence: evidenceIntelligence.evidenceByCategory.directObservations,
          criticalEvidence: evidenceIntelligence.evidenceSummary.criticalEvidence,
        };
      }
    } catch (error) {
      console.error("Failed to get evidence intelligence (non-critical):", error);
    }

    let resourceContext = null;
    try {
      const resourceIntelligence = CareerCopilotResourceIntelligenceEngine.getLastResourceAnalysis();
      if (resourceIntelligence) {
        resourceContext = {
          resourceSummary: resourceIntelligence.resourceSummary,
          availableResources: resourceIntelligence.resourcesByCategory.reduce((acc, cat) => {
            acc[cat.category] = cat.resources.map(r => ({ name: r.name, availability: r.availability }));
            return acc;
          }, {} as Record<string, any>),
        };
      }
    } catch (error) {
      console.error("Failed to get resource intelligence (non-critical):", error);
    }

    let constraintContext = null;
    try {
      const constraintIntelligence = CareerCopilotConstraintIntelligenceEngine.getLastConstraintAnalysis();
      if (constraintIntelligence) {
        constraintContext = {
          activeConstraints: constraintIntelligence.constraintsByCategory.flatMap(c => c.constraints.filter(con => con.active).map(con => con.name)),
          criticalConstraints: constraintIntelligence.constraintsByCategory.flatMap(c => c.constraints.filter(con => con.strength === "strong" && !con.negotiable).map(con => con.name)),
          constraintImpact: constraintIntelligence.constraintImpact,
        };
      }
    } catch (error) {
      console.error("Failed to get constraint intelligence (non-critical):", error);
    }

    // Call AI Orchestrator with career narrative intelligence prompt
    const result = await aiOrchestrator.execute(
      careerCopilotCareerNarrativeIntelligenceV1,
      {
        candidateProfile: JSON.stringify(candidateProfile, null, 2),
        careerTimeline: careerTimelineText,
        skillsEvolution: skillsEvolutionText,
        achievements: achievementsText,
        goals: goalsText,
        applications: JSON.stringify(applicationContext, null, 2),
        forecast: JSON.stringify(forecastContext, null, 2),
        marketIntelligence: JSON.stringify(marketContext, null, 2),
        opportunityIntelligence: JSON.stringify(opportunityContext, null, 2),
        decisionIntelligence: JSON.stringify(decisionContext, null, 2),
        knowledgeEvolution: JSON.stringify(knowledgeEvolutionContext, null, 2),
        missionIntelligence: JSON.stringify(missionContext, null, 2),
        evidenceIntelligence: JSON.stringify(evidenceContext, null, 2),
        resourceIntelligence: JSON.stringify(resourceContext, null, 2),
        constraintIntelligence: JSON.stringify(constraintContext, null, 2),
        previousNarrativeAnalysis: JSON.stringify(previousNarrativeAnalysis, null, 2),
        narrativeFingerprint: JSON.stringify(fingerprint, null, 2),
      },
      {
        provider: "anthropic",
        model: "claude-3-5-sonnet-20241022",
        promptId: "career-copilot-career-narrative-intelligence-v1",
      }
    );

    if (!result.success || !result.data) {
      throw new Error("Failed to analyze career narrative");
    }

    const output: CareerNarrativeOutput = result.data as CareerNarrativeOutput;

    // Override AI-generated fingerprint with our deterministic one
    output.narrativeFingerprint = fingerprint;

    // Save narrative analysis to Brain as observation
    candidateAIBrain.addObservation({
      timestamp: new Date(),
      source: "career-copilot-career-narrative-intelligence",
      type: "career",
      data: output,
      confidence: output.confidence.overall / 100,
    });

    // Publish narrative analysis events to EventBus
    eventBus.publish({
      id: `career-story-updated-${Date.now()}`,
      timestamp: new Date(),
      type: "observation_created",
      payload: {
        source: "career-copilot-career-narrative-intelligence",
        observationType: "career",
        data: {
          careerStory: output.careerStory,
          confidence: output.careerStory.confidence,
        },
        confidence: output.careerStory.confidence / 100,
      },
    });

    eventBus.publish({
      id: `narrative-improved-${Date.now()}`,
      timestamp: new Date(),
      type: "observation_created",
      payload: {
        source: "career-copilot-career-narrative-intelligence",
        observationType: "career",
        data: {
          careerIdentity: output.careerIdentity,
          confidence: output.careerIdentity.confidence,
        },
        confidence: output.careerIdentity.confidence / 100,
      },
    });

    eventBus.publish({
      id: `career-identity-updated-${Date.now()}`,
      timestamp: new Date(),
      type: "observation_created",
      payload: {
        source: "career-copilot-career-narrative-intelligence",
        observationType: "career",
        data: {
          careerIdentity: output.careerIdentity,
          confidence: output.careerIdentity.confidence,
        },
        confidence: output.careerIdentity.confidence / 100,
      },
    });

    if (output.transitionAnalysis.length > 0) {
      eventBus.publish({
        id: `career-transition-explained-${Date.now()}`,
        timestamp: new Date(),
        type: "observation_created",
        payload: {
          source: "career-copilot-career-narrative-intelligence",
          observationType: "career",
          data: {
            transitions: output.transitionAnalysis,
            confidence: output.transitionAnalysis.reduce((min, t) => Math.min(min, t.confidence), 100),
          },
          confidence: output.transitionAnalysis.reduce((min, t) => Math.min(min, t.confidence), 100) / 100,
        },
      });
    }

    eventBus.publish({
      id: `narrative-confidence-updated-${Date.now()}`,
      timestamp: new Date(),
      type: "observation_created",
      payload: {
        source: "career-copilot-career-narrative-intelligence",
        observationType: "career",
        data: {
          confidence: output.confidence,
        },
        confidence: output.confidence.overall / 100,
      },
    });

    // New events for hardening features
    eventBus.publish({
      id: `narrative-fingerprint-updated-${Date.now()}`,
      timestamp: new Date(),
      type: "observation_created",
      payload: {
        source: "career-copilot-career-narrative-intelligence",
        observationType: "career",
        data: {
          fingerprint: output.narrativeFingerprint,
          stability: output.narrativeFingerprint.stability,
        },
        confidence: 1.0,
      },
    });

    eventBus.publish({
      id: `narrative-consistency-updated-${Date.now()}`,
      timestamp: new Date(),
      type: "observation_created",
      payload: {
        source: "career-copilot-career-narrative-intelligence",
        observationType: "career",
        data: {
          consistencyScore: output.consistencyScore,
        },
        confidence: output.consistencyScore.overall / 100,
      },
    });

    if (previousNarrativeAnalysis && output.narrativeEvolution) {
      eventBus.publish({
        id: `narrative-evolution-detected-${Date.now()}`,
        timestamp: new Date(),
        type: "observation_created",
        payload: {
          source: "career-copilot-career-narrative-intelligence",
          observationType: "career",
          data: {
            evolution: output.narrativeEvolution,
          },
          confidence: 0.8,
        },
      });
    }

    eventBus.publish({
      id: `narrative-evidence-updated-${Date.now()}`,
      timestamp: new Date(),
      type: "observation_created",
      payload: {
        source: "career-copilot-career-narrative-intelligence",
        observationType: "career",
        data: {
          evidence: output.narrativeEvidence,
        },
        confidence: 0.9,
      },
    });

    // Update last narrative analysis and history
    this.lastNarrativeAnalysis = output;
    this.narrativeHistory.push({
      timestamp: new Date(),
      event: input.currentEvent?.type || "manual_analysis",
      output,
    });

    // Keep only last 50 analyses in history
    if (this.narrativeHistory.length > 50) {
      this.narrativeHistory = this.narrativeHistory.slice(-50);
    }

    return output;
  }

  /**
   * Generate deterministic narrative fingerprint from CandidateGraph data
   */
  private static generateNarrativeFingerprint(candidateGraph: any): {
    hash: string;
    dataSources: string[];
    lastModified: string;
    stability: string;
  } {
    // Extract key data elements for fingerprint
    const keyData = {
      name: candidateGraph.name || "",
      currentRole: candidateGraph.currentRole || "",
      careerTimeline: candidateGraph.careerTimeline?.map((t: any) => ({
        role: t.role,
        company: t.company,
        startDate: t.startDate,
        endDate: t.endDate,
      })) || [],
      skills: candidateGraph.skills?.map((s: any) => s.name) || [],
      achievements: candidateGraph.achievements?.map((a: any) => a.title) || [],
      goals: candidateGraph.goals?.map((g: any) => g.title) || [],
    };

    // Create a simple hash from the data
    const dataString = JSON.stringify(keyData);
    let hash = 0;
    for (let i = 0; i < dataString.length; i++) {
      const char = dataString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    const hashString = Math.abs(hash).toString(16);

    // Determine stability by comparing with previous fingerprint
    let stability = "stable";
    if (this.lastNarrativeAnalysis && this.lastNarrativeAnalysis.narrativeFingerprint) {
      stability = this.lastNarrativeAnalysis.narrativeFingerprint.hash === hashString ? "stable" : "changed";
    }

    return {
      hash: hashString,
      dataSources: ["CandidateGraph", "careerTimeline", "skills", "achievements", "goals"],
      lastModified: new Date().toISOString(),
      stability,
    };
  }

  /**
   * Get the last career narrative analysis
   */
  static getLastNarrativeAnalysis(): CareerNarrativeOutput | null {
    return this.lastNarrativeAnalysis;
  }

  /**
   * Get narrative analysis history
   */
  static getHistory(): Array<{
    timestamp: Date;
    event: string;
    output: CareerNarrativeOutput;
  }> {
    return this.narrativeHistory;
  }

  /**
   * Get career identity
   */
  static getCareerIdentity(): {
    dominantIdentity: string;
    selfDefinition: string;
    coreNarrative: string;
    confidence: number;
  } | null {
    if (!this.lastNarrativeAnalysis) {
      return null;
    }
    return {
      dominantIdentity: this.lastNarrativeAnalysis.careerIdentity.dominantIdentity,
      selfDefinition: this.lastNarrativeAnalysis.careerIdentity.selfDefinition,
      coreNarrative: this.lastNarrativeAnalysis.careerIdentity.coreNarrative,
      confidence: this.lastNarrativeAnalysis.careerIdentity.confidence,
    };
  }

  /**
   * Get professional themes
   */
  static getProfessionalThemes(): Array<{
    theme: string;
    description: string;
    confidence: number;
  }> | null {
    if (!this.lastNarrativeAnalysis) {
      return null;
    }
    return this.lastNarrativeAnalysis.careerThemes.map(theme => ({
      theme: theme.theme,
      description: theme.description,
      confidence: theme.confidence,
    }));
  }

  /**
   * Get career story
   */
  static getCareerStory(): {
    summary: string;
    thread: string;
    currentDirection: string;
    confidence: number;
  } | null {
    if (!this.lastNarrativeAnalysis) {
      return null;
    }
    return {
      summary: this.lastNarrativeAnalysis.careerStory.summary,
      thread: this.lastNarrativeAnalysis.careerStory.thread,
      currentDirection: this.lastNarrativeAnalysis.careerStory.currentDirection,
      confidence: this.lastNarrativeAnalysis.careerStory.confidence,
    };
  }

  /**
   * Get narrative confidence score
   */
  static getNarrativeConfidence(): number | null {
    if (!this.lastNarrativeAnalysis) {
      return null;
    }
    return this.lastNarrativeAnalysis.confidence.overall;
  }

  /**
   * Get context-adapted narrative for specific context
   */
  static getContextAdaptedNarrative(
    context: "cv" | "linkedin" | "interview" | "networking" | "coverLetter" | "starResponses"
  ): any | null {
    if (!this.lastNarrativeAnalysis) {
      return null;
    }
    return this.lastNarrativeAnalysis.contextAdaptedNarratives[context];
  }

  /**
   * Get transition explanations
   */
  static getTransitionExplanations(): Array<{
    transition: string;
    reason: string;
    positiveFraming: string;
    confidence: number;
  }> | null {
    if (!this.lastNarrativeAnalysis) {
      return null;
    }
    return this.lastNarrativeAnalysis.transitionAnalysis.map(t => ({
      transition: t.transition,
      reason: t.reason,
      positiveFraming: t.positiveFraming,
      confidence: t.confidence,
    }));
  }

  /**
   * Get missing narrative elements
   */
  static getMissingNarrative(): Array<{
    element: string;
    why: string;
    suggestion: string;
    confidence: number;
  }> | null {
    if (!this.lastNarrativeAnalysis) {
      return null;
    }
    return this.lastNarrativeAnalysis.missingNarrative;
  }

  /**
   * Get consistency analysis
   */
  static getConsistencyAnalysis(): {
    overallCoherence: string;
    coherenceBreaks: Array<{
      break: string;
      suggestion: string;
      confidence: number;
    }>;
    gaps: Array<{
      gap: string;
      needs: string;
      confidence: number;
    }>;
    confidence: number;
  } | null {
    if (!this.lastNarrativeAnalysis) {
      return null;
    }
    return {
      overallCoherence: this.lastNarrativeAnalysis.consistencyAnalysis.overallCoherence,
      coherenceBreaks: this.lastNarrativeAnalysis.consistencyAnalysis.coherenceBreaks.map(b => ({
        break: b.break,
        suggestion: b.suggestion,
        confidence: b.confidence,
      })),
      gaps: this.lastNarrativeAnalysis.consistencyAnalysis.gaps.map(g => ({
        gap: g.gap,
        needs: g.needs,
        confidence: g.confidence,
      })),
      confidence: this.lastNarrativeAnalysis.consistencyAnalysis.confidence,
    };
  }
}
