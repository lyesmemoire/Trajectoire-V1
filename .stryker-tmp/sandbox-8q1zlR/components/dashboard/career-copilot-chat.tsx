// @ts-nocheck
"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Send, MessageSquare, Loader2 } from "lucide-react";
import { CareerCopilotConversationEngine } from "@/core/intelligence/engines/careerCopilotConversationEngine";
import { CareerCopilotAutonomousIntelligenceEngine } from "@/core/intelligence/engines/careerCopilotAutonomousIntelligenceEngine";
import { CareerCopilotOutcomeIntelligenceEngine } from "@/core/intelligence/engines/careerCopilotOutcomeIntelligenceEngine";
import { CareerCopilotPersonalizationIntelligenceEngine } from "@/core/intelligence/engines/careerCopilotPersonalizationIntelligenceEngine";
import { CareerCopilotEvidenceIntelligenceEngine } from "@/core/intelligence/engines/careerCopilotEvidenceIntelligenceEngine";
import { CareerCopilotConstraintIntelligenceEngine } from "@/core/intelligence/engines/careerCopilotConstraintIntelligenceEngine";
import { CareerCopilotResourceIntelligenceEngine } from "@/core/intelligence/engines/careerCopilotResourceIntelligenceEngine";
import { CareerCopilotKnowledgeEvolutionEngine } from "@/core/intelligence/engines/careerCopilotKnowledgeEvolutionEngine";
import { CareerCopilotCareerNarrativeIntelligenceEngine } from "@/core/intelligence/engines/careerCopilotCareerNarrativeIntelligenceEngine";
import { CareerCopilotReflectionIntelligenceEngine } from "@/core/intelligence/engines/careerCopilotReflectionIntelligenceEngine";
import { CareerCopilotPlanningIntelligenceEngine } from "@/core/intelligence/engines/careerCopilotPlanningIntelligenceEngine";
import { CareerCopilotExecutionIntelligenceEngine } from "@/core/intelligence/engines/careerCopilotExecutionIntelligenceEngine";
import { CareerCopilotCoachingIntelligenceEngine } from "@/core/intelligence/engines/careerCopilotCoachingIntelligenceEngine";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  evidence?: string[];
  recommendations?: string[];
  explanation?: string;
  confidence?: number;
  limitations?: string[];
  changes?: {
    metric: string;
    change: string;
  }[];
  strategyChange?: {
    hasChanged: boolean;
    oldStrategy: string;
    newStrategy: string;
    reason: string;
  };
  priorityDecision?: {
    absolutePriority: string;
    priorityReason: string;
    whyNotOthers: string;
    whyNow: string;
  };
  followUpExplanation?: {
    action: string;
    explanation: string;
    urgency: "high" | "medium" | "low";
  };
  conclusionChange?: {
    oldConclusion: string;
    newConclusion: string;
    reason: string;
    confidence: number;
  };
  confidenceLevel?: {
    level: "very_high" | "high" | "moderate" | "low" | "insufficient";
    confidence: number;
    reason: string;
    uncertainDomains: string[];
  };
  coherenceStatus?: {
    globalCoherence: number;
    isSynchronized: boolean;
    synchronizedAnalyses: number;
    totalAnalyses: number;
    detectedIncoherencies?: string[];
    resolvedConflicts?: string[];
    reason: string;
  };
  goalStatus?: {
    primaryGoal: string;
    goalOfTheMoment: string;
    newGoals: string[];
    completedGoals: string[];
    mergedGoals: string[];
    deletedGoals: string[];
    postponedGoals: string[];
    reason: string;
  };
  marketContext?: {
    marketTrends: string[];
    emergingSkills: string[];
    opportunities: string[];
    risks: string[];
    strategyImpact: string;
    reason: string;
  };
  opportunityContext?: {
    priorityOpportunity: string;
    compatibleOpportunities: string[];
    opportunitiesToPrepare: string[];
    opportunitiesToAvoid: string[];
    recentlyDetected: string[];
    strategyImpact: string;
    goalImpact: string;
    accountabilityTracking: string;
    reason: string;
  };
  applicationContext?: {
    priorityApplication: string;
    applicationsToFollowUp: string[];
    applicationsToPrepare: string[];
    applicationsToAbandon: string[];
    recentlySubmitted: string[];
    interviewsScheduled: string[];
    strategyImpact: string;
    goalImpact: string;
    accountabilityTracking: string;
    reason: string;
  };
  autonomousContext?: {
    eventClassification: {
      type: "major" | "minor" | "no_impact";
      reason: string;
      affectedAreas: string[];
    };
    executed: string[];
    reused: string[];
    ignored: string[];
    optimization: {
      llmCallsAvoided: number;
      costSaved: number;
      timeSaved: number;
      reusedAnalyses: number;
    };
  };
  outcomeContext?: {
    topPerformingActions: Array<{
      action: string;
      successRate: number;
      confidence: number;
    }>;
    underperformingActions: Array<{
      action: string;
      successRate: number;
      recommendation: string;
    }>;
    candidatePatterns: Array<{
      pattern: string;
      implications: string;
    }>;
    recentLearnings: Array<{
      learning: string;
      confidence: number;
    }>;
  };
  personalizationContext?: {
    coachingStyle: {
      responseLength: string;
      detailLevel: string;
      encouragementLevel: string;
      autonomyLevel: string;
      progressionSpeed: string;
    };
    learningProfile: {
      autonomy: string;
      learningSpeed: string;
      executionSpeed: string;
      complexityTolerance: string;
    };
    adaptationNeeded: boolean;
    adaptationType?: string;
    whyThisCoachingStyle: string;
  };
  evidenceContext?: {
    supportingEvidence: string[];
    evidenceQuality: string;
    evidenceFreshness: string;
    evidenceStability: string;
    confidence: number;
    missingEvidence: string[];
    evidenceExplanation: string;
  };
  resourceContext?: {
    availableResources: {
      time: string;
      energy: string;
      budget: string;
      skills: string[];
      network: string;
    };
    resourceStrengths: string[];
    resourceWeaknesses: string[];
    currentCapacity: string;
    limitingFactors: string[];
    underutilizedResources: string[];
    overutilizedResources: string[];
    resourceOptimizations: string[];
    resourceFeasibility: {
      feasible: boolean;
      missingResources: string[];
      resourceEfficiency: number;
    };
  };
  knowledgeEvolutionContext?: {
    certainKnowledge: {
      knowledge: string;
      confidence: number;
      evidence: string[];
    }[];
    strengthenedKnowledge: {
      knowledge: string;
      reason: string;
      confidence: number;
    }[];
    obsoleteKnowledge: {
      knowledge: string;
      reason: string;
      replacedBy?: string;
    }[];
    toConfirm: {
      knowledge: string;
      confidence: number;
      needsValidation: string;
    }[];
    knowledgeHealthScore: number;
    mostImportantKnowledge: {
      knowledge: string;
      importance: number;
      confidence: number;
    }[];
  };
  careerNarrativeContext?: {
    careerIdentity: {
      dominantIdentity: string;
      selfDefinition: string;
      coreNarrative: string;
      confidence: number;
    };
    professionalThemes: {
      theme: string;
      description: string;
      confidence: number;
    }[];
    careerStory: {
      summary: string;
      thread: string;
      currentDirection: string;
      confidence: number;
    };
    narrativeConfidence: number;
    narrativeFingerprint: {
      hash: string;
      stability: string;
      lastModified: string;
    };
    consistencyScore: {
      overall: number;
      explanation: string;
    };
    narrativeEvolution: {
      identityEvolution: {
        previousIdentity: string;
        currentIdentity: string;
        changeExplanation: string;
      };
      strengthsEvolution: {
        evolutionExplanation: string;
      };
      motivationsEvolution: {
        evolutionExplanation: string;
      };
    };
    narrativeEvidence: {
      careerIdentityEvidence: {
        experiences: string[];
        skills: string[];
        achievements: string[];
      };
      careerStoryEvidence: {
        experiences: string[];
        transitions: string[];
      };
    };
  };
  reflectionContext?: {
    reflectionSummary: {
      confirmed: string[];
      improved: string[];
      uncertain: string[];
      needsMoreInfo: string[];
      overallReflectionQuality: number;
      reflectionTimestamp: string;
    };
    validatedRecommendations: string[];
    alternativeOptions: string[];
    blindSpots: string[];
    assumptions: string[];
    contradictionsDetected: string[];
    evidenceReview: {
      overallEvidenceQuality: number;
      conclusionsNeedingStrengthening: string[];
    };
    confidenceCalibration: {
      overallConfidence: number;
      calibrations: Array<{
        recommendation: string;
        originalConfidence: number;
        calibratedConfidence: number;
      }>;
    };
  };
  planningContext?: {
    currentPosition: {
      role: string;
      responsibilities: string[];
      skills: string[];
      experience: string;
      constraints: string[];
      resources: string[];
      marketPosition: string;
    };
    targetPosition: {
      role: string;
      requiredSkills: string[];
      requiredExperience: string;
      requiredCertifications: string[];
      requiredPortfolio: string[];
      requiredNetwork: string[];
      requiredVisibility: string[];
    };
    gapAnalysis: {
      gaps: Array<{
        category: string;
        currentState: string;
        requiredState: string;
        gapSize: string;
        priority: string;
        closingStrategy: string;
      }>;
    };
    planningRoadmap: {
      today: {
        actions: string[];
        expectedOutcomes: string[];
        successCriteria: string[];
        dependencies: string[];
        timeAllocation: string;
      };
      thisWeek: {
        actions: string[];
        expectedOutcomes: string[];
        successCriteria: string[];
        dependencies: string[];
        timeAllocation: string;
      };
      thisMonth: {
        actions: string[];
        expectedOutcomes: string[];
        successCriteria: string[];
        dependencies: string[];
        timeAllocation: string;
      };
      "90Days": {
        actions: string[];
        expectedOutcomes: string[];
        successCriteria: string[];
        dependencies: string[];
        timeAllocation: string;
      };
      "6Months": {
        actions: string[];
        expectedOutcomes: string[];
        successCriteria: string[];
        dependencies: string[];
        timeAllocation: string;
      };
      "12Months": {
        actions: string[];
        expectedOutcomes: string[];
        successCriteria: string[];
        dependencies: string[];
        timeAllocation: string;
      };
    };
    milestones: Array<{
      objective: string;
      justification: string;
      dependencies: string[];
      validationCriteria: string[];
      estimatedCompletion: string;
      successIndicators: string[];
    }>;
    priorities: Array<{
      action: string;
      priority: string;
      justification: string;
      dependencies: string[];
      deadline: string;
    }>;
    dependencies: Array<{
      sourceAction: string;
      dependentAction: string;
      dependencyType: string;
      resolutionStrategy: string;
      estimatedImpact: string;
    }>;
    riskAnalysis: {
      risks: Array<{
        description: string;
        probability: string;
        impact: string;
        mitigationStrategy: string;
        contingencyPlan: string;
        monitoringIndicators: string[];
      }>;
    };
    alternativePlans: {
      planA: {
        advantages: string[];
        limitations: string[];
        confidence: number;
        activationConditions: string[];
        expectedOutcomes: string[];
      };
      planB: {
        advantages: string[];
        limitations: string[];
        confidence: number;
        activationConditions: string[];
        expectedOutcomes: string[];
      };
      planC: {
        advantages: string[];
        limitations: string[];
        confidence: number;
        activationConditions: string[];
        expectedOutcomes: string[];
      };
    };
    checkpoints: {
      "7Days": {
        expectedObjectives: string[];
        keyIndicators: string[];
        successConditions: string[];
        correctiveActions: string[];
        adjustmentTriggers: string[];
      };
      "30Days": {
        expectedObjectives: string[];
        keyIndicators: string[];
        successConditions: string[];
        correctiveActions: string[];
        adjustmentTriggers: string[];
      };
      "60Days": {
        expectedObjectives: string[];
        keyIndicators: string[];
        successConditions: string[];
        correctiveActions: string[];
        adjustmentTriggers: string[];
      };
      "90Days": {
        expectedObjectives: string[];
        keyIndicators: string[];
        successConditions: string[];
        correctiveActions: string[];
        adjustmentTriggers: string[];
      };
      "180Days": {
        expectedObjectives: string[];
        keyIndicators: string[];
        successConditions: string[];
        correctiveActions: string[];
        adjustmentTriggers: string[];
      };
      "365Days": {
        expectedObjectives: string[];
        keyIndicators: string[];
        successConditions: string[];
        correctiveActions: string[];
        adjustmentTriggers: string[];
      };
    };
    adaptationRules: Array<{
      triggerEvent: string;
      revisionRequired: string;
      adjustmentProcess: string;
      impactAssessment: string;
    }>;
    planningConfidence: {
      overallConfidence: number;
      confidenceByStep: Array<{ step: string; confidence: number }>;
      confidenceByMilestone: Array<{ milestone: string; confidence: number }>;
      confidenceByTimeframe: Array<{ timeframe: string; confidence: number }>;
      factors: string[];
    };
  };
}

interface CareerCopilotChatProps {
  candidateGraph: any;
}

export function CareerCopilotChat({ candidateGraph }: CareerCopilotChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const conversationHistory = messages
        .filter((m) => m.role === "user")
        .map((m) => ({
          question: m.content,
          answer: messages[messages.indexOf(m) + 1]?.content || "",
          timestamp: m.timestamp,
        }));

      // Get autonomous intelligence context for explainability
      let autonomousContext = null;
      try {
        const autonomousIntelligence = await CareerCopilotAutonomousIntelligenceEngine.getLastOrchestration();
        if (autonomousIntelligence) {
          autonomousContext = {
            eventClassification: autonomousIntelligence.eventClassification,
            executed: autonomousIntelligence.explanation.executed,
            reused: autonomousIntelligence.explanation.reused,
            ignored: autonomousIntelligence.explanation.ignored,
            optimization: autonomousIntelligence.optimization,
          };
        }
      } catch (error) {
        console.error("Failed to get autonomous intelligence context:", error);
      }

      // Get outcome intelligence context for learning-based responses
      let outcomeContext = null;
      try {
        const outcomeIntelligence = await CareerCopilotOutcomeIntelligenceEngine.getLastOutcomeAnalysis();
        if (outcomeIntelligence) {
          outcomeContext = {
            topPerformingActions: outcomeIntelligence.topPerformingActions.map(a => ({
              action: a.action,
              successRate: a.successRate,
              confidence: a.confidence,
            })),
            underperformingActions: outcomeIntelligence.underperformingActions.map(a => ({
              action: a.action,
              successRate: a.successRate,
              recommendation: a.recommendation,
            })),
            candidatePatterns: outcomeIntelligence.candidatePatterns.map(p => ({
              pattern: p.pattern,
              implications: p.implications,
            })),
            recentLearnings: outcomeIntelligence.recentLearnings.map(l => ({
              learning: l.learning,
              confidence: l.confidence,
            })),
          };
        }
      } catch (error) {
        console.error("Failed to get outcome intelligence context:", error);
      }

      // Get personalization intelligence context for adaptive coaching
      let personalizationContext = null;
      try {
        const personalizationIntelligence = await CareerCopilotPersonalizationIntelligenceEngine.getLastPersonalization();
        if (personalizationIntelligence) {
          personalizationContext = {
            coachingStyle: {
              responseLength: personalizationIntelligence.currentCoachingStyle.responseLength,
              detailLevel: personalizationIntelligence.currentCoachingStyle.detailLevel,
              encouragementLevel: personalizationIntelligence.currentCoachingStyle.encouragementLevel,
              autonomyLevel: personalizationIntelligence.currentCoachingStyle.autonomyLevel,
              progressionSpeed: personalizationIntelligence.currentCoachingStyle.progressionSpeed,
            },
            learningProfile: {
              autonomy: personalizationIntelligence.learningProfile.autonomy.level,
              learningSpeed: personalizationIntelligence.learningProfile.learningCharacteristics.learningSpeed,
              executionSpeed: personalizationIntelligence.learningProfile.learningCharacteristics.executionSpeed,
              complexityTolerance: personalizationIntelligence.learningProfile.learningCharacteristics.complexityTolerance,
            },
            adaptationNeeded: personalizationIntelligence.adaptationRecommendations.shouldAdapt,
            adaptationType: personalizationIntelligence.adaptationRecommendations.adaptationType,
            whyThisCoachingStyle: personalizationIntelligence.explainability.whyThisCoachingStyle,
          };
        }
      } catch (error) {
        console.error("Failed to get personalization intelligence context:", error);
      }

      // Get evidence intelligence context for evidence-based responses
      let evidenceContext = null;
      try {
        const evidenceIntelligence = await CareerCopilotEvidenceIntelligenceEngine.getLastEvidenceAnalysis();
        if (evidenceIntelligence) {
          evidenceContext = {
            supportingEvidence: evidenceIntelligence.confidenceMapping.confidenceByEvidence.flatMap(c => c.supportingEvidence).slice(0, 5),
            evidenceQuality: evidenceIntelligence.globalQuality.overallEvidenceQuality,
            evidenceFreshness: evidenceIntelligence.globalQuality.overallFreshness,
            evidenceStability: evidenceIntelligence.globalQuality.overallStability,
            confidence: evidenceIntelligence.globalQuality.overallConfidence,
            missingEvidence: evidenceIntelligence.detectedIssues.missingEvidence.flatMap(m => m.requiredEvidence).slice(0, 5),
            evidenceExplanation: evidenceIntelligence.explainability.whyThisEvidence,
          };
        }
      } catch (error) {
        console.error("Failed to get evidence intelligence context:", error);
      }

      // Get constraint intelligence context for constraint-aware responses
      let constraintContext = null;
      try {
        const constraintIntelligence = await CareerCopilotConstraintIntelligenceEngine.getLastConstraintAnalysis();
        if (constraintIntelligence) {
          constraintContext = {
            activeConstraints: constraintIntelligence.constraintsByCategory.flatMap(c => c.constraints.filter(con => con.active).map(con => con.name)),
            criticalConstraints: constraintIntelligence.constraintsByCategory.flatMap(c => c.constraints.filter(con => con.strength === "strong" && !con.negotiable).map(con => con.name)),
            constraintImpact: constraintIntelligence.constraintImpact,
            constraintRecommendations: constraintIntelligence.constraintRecommendations,
            constraintClarity: constraintIntelligence.globalQuality.overallConstraintClarity,
            constraintStability: constraintIntelligence.globalQuality.overallConstraintStability,
            constraintConfidence: constraintIntelligence.globalQuality.overallConstraintConfidence,
          };
        }
      } catch (error) {
        console.error("Failed to get constraint intelligence context:", error);
      }

      // Get resource intelligence context for resource-aware responses
      let resourceContext = null;
      try {
        const resourceIntelligence = await CareerCopilotResourceIntelligenceEngine.getLastResourceAnalysis();
        if (resourceIntelligence) {
          const availableResources = resourceIntelligence.resourcesByCategory.reduce((acc, cat) => {
            cat.resources.forEach(res => {
              acc[res.name] = `${res.availability} ${res.unit}`;
            });
            return acc;
          }, {} as Record<string, string>);

          resourceContext = {
            availableResources: {
              time: availableResources["time"] || "non spécifié",
              energy: availableResources["energy"] || "non spécifié",
              budget: availableResources["budget"] || "non spécifié",
              skills: resourceIntelligence.resourcesByCategory.find(c => c.category === "skills")?.resources.map(r => r.name) || [],
              network: availableResources["network"] || "non spécifié",
            },
            resourceStrengths: resourceIntelligence.resourcesByCategory.flatMap(c => c.resources.filter(r => r.criticality === "critical").map(r => r.name)),
            resourceWeaknesses: resourceIntelligence.resourcesByCategory.flatMap(c => c.resources.filter(r => r.underutilized).map(r => r.name)),
            currentCapacity: `${resourceIntelligence.resourceSummary.availableResources}/${resourceIntelligence.resourceSummary.totalResources} ressources disponibles`,
            limitingFactors: resourceIntelligence.resourceEvaluation.blockingResources.map(b => b.resource),
            underutilizedResources: resourceIntelligence.resourcesByCategory.flatMap(c => c.resources.filter(r => r.underutilized).map(r => r.name)),
            overutilizedResources: resourceIntelligence.resourcesByCategory.flatMap(c => c.resources.filter(r => r.overutilized).map(r => r.name)),
            resourceOptimizations: resourceIntelligence.resourceRecommendations.toUse.map(r => r.resource),
            resourceFeasibility: {
              feasible: resourceIntelligence.resourceEvaluation.blockingResources.length === 0,
              missingResources: resourceIntelligence.resourceEvaluation.blockingResources.map(b => b.resource),
              resourceEfficiency: resourceIntelligence.globalQuality.resourceCoverage,
            },
          };
        }
      } catch (error) {
        console.error("Failed to get resource intelligence context:", error);
      }

      // Get knowledge evolution context for knowledge-aware responses
      let knowledgeEvolutionContext = null;
      try {
        const knowledgeEvolution = await CareerCopilotKnowledgeEvolutionEngine.getLastKnowledgeEvolution();
        if (knowledgeEvolution) {
          knowledgeEvolutionContext = {
            certainKnowledge: knowledgeEvolution.knowledgeByState.find(s => s.state === "confirmed")?.knowledgeItems.slice(0, 5).map(k => ({
              knowledge: k.description,
              confidence: k.confidence.current,
              evidence: [k.reasonForState],
            })) || [],
            strengthenedKnowledge: knowledgeEvolution.knowledgeByState.find(s => s.state === "strengthened")?.knowledgeItems.slice(0, 5).map(k => ({
              knowledge: k.description,
              reason: k.reasonForState,
              confidence: k.confidence.current,
            })) || [],
            obsoleteKnowledge: knowledgeEvolution.knowledgeByState.find(s => s.state === "obsolete")?.knowledgeItems.slice(0, 5).map(k => ({
              knowledge: k.description,
              reason: k.reasonForState,
            })) || [],
            toConfirm: knowledgeEvolution.knowledgeByState.find(s => s.state === "very_uncertain")?.knowledgeItems.slice(0, 5).map(k => ({
              knowledge: k.description,
              confidence: k.confidence.current,
              needsValidation: k.reasonForState,
            })) || [],
            knowledgeHealthScore: knowledgeEvolution.knowledgeSummary.healthScore,
            mostImportantKnowledge: knowledgeEvolution.mostImportantKnowledge.slice(0, 3).map(k => ({
              knowledge: k.description,
              importance: k.importance,
              confidence: k.confidence,
            })),
          };
        }
      } catch (error) {
        console.error("Failed to get knowledge evolution context:", error);
      }

      // Get career narrative context for narrative-aware responses
      let careerNarrativeContext = null;
      try {
        const careerNarrative = await CareerCopilotCareerNarrativeIntelligenceEngine.getLastNarrativeAnalysis();
        if (careerNarrative) {
          careerNarrativeContext = {
            careerIdentity: {
              dominantIdentity: careerNarrative.careerIdentity.dominantIdentity,
              selfDefinition: careerNarrative.careerIdentity.selfDefinition,
              coreNarrative: careerNarrative.careerIdentity.coreNarrative,
              confidence: careerNarrative.careerIdentity.confidence,
            },
            professionalThemes: careerNarrative.careerThemes.map(t => ({
              theme: t.theme,
              description: t.description,
              confidence: t.confidence,
            })),
            careerStory: {
              summary: careerNarrative.careerStory.summary,
              thread: careerNarrative.careerStory.thread,
              currentDirection: careerNarrative.careerStory.currentDirection,
              confidence: careerNarrative.careerStory.confidence,
            },
            narrativeConfidence: careerNarrative.confidence.overall,
            narrativeFingerprint: careerNarrative.narrativeFingerprint ? {
              hash: careerNarrative.narrativeFingerprint.hash,
              stability: careerNarrative.narrativeFingerprint.stability,
              lastModified: careerNarrative.narrativeFingerprint.lastModified,
            } : undefined,
            consistencyScore: careerNarrative.consistencyScore ? {
              overall: careerNarrative.consistencyScore.overall,
              explanation: careerNarrative.consistencyScore.explanation,
            } : undefined,
            narrativeEvolution: careerNarrative.narrativeEvolution ? {
              identityEvolution: careerNarrative.narrativeEvolution.identityEvolution ? {
                previousIdentity: careerNarrative.narrativeEvolution.identityEvolution.previousIdentity,
                currentIdentity: careerNarrative.narrativeEvolution.identityEvolution.currentIdentity,
                changeExplanation: careerNarrative.narrativeEvolution.identityEvolution.changeExplanation,
              } : undefined,
              strengthsEvolution: careerNarrative.narrativeEvolution.strengthsEvolution ? {
                evolutionExplanation: careerNarrative.narrativeEvolution.strengthsEvolution.evolutionExplanation,
              } : undefined,
              motivationsEvolution: careerNarrative.narrativeEvolution.motivationsEvolution ? {
                evolutionExplanation: careerNarrative.narrativeEvolution.motivationsEvolution.evolutionExplanation,
              } : undefined,
            } : undefined,
            narrativeEvidence: careerNarrative.narrativeEvidence ? {
              careerIdentityEvidence: {
                experiences: careerNarrative.narrativeEvidence.careerIdentityEvidence.experiences,
                skills: careerNarrative.narrativeEvidence.careerIdentityEvidence.skills,
                achievements: careerNarrative.narrativeEvidence.careerIdentityEvidence.achievements,
              },
              careerStoryEvidence: {
                experiences: careerNarrative.narrativeEvidence.careerStoryEvidence.experiences,
                transitions: careerNarrative.narrativeEvidence.careerStoryEvidence.transitions,
              },
            } : undefined,
          };
        }
      } catch (error) {
        console.error("Failed to get career narrative context:", error);
      }

      // Get reflection intelligence context for reflection-aware responses
      let reflectionContext = null;
      try {
        const reflection = await CareerCopilotReflectionIntelligenceEngine.getLastReflectionAnalysis();
        if (reflection) {
          reflectionContext = {
            reflectionSummary: {
              confirmed: reflection.reflectionSummary.confirmed,
              improved: reflection.reflectionSummary.improved,
              uncertain: reflection.reflectionSummary.uncertain,
              needsMoreInfo: reflection.reflectionSummary.needsMoreInfo,
              overallReflectionQuality: reflection.reflectionSummary.overallReflectionQuality,
              reflectionTimestamp: reflection.reflectionSummary.reflectionTimestamp,
            },
            validatedRecommendations: reflection.recommendationReview.recommendations.map((r: any) => r.recommendation),
            alternativeOptions: reflection.alternativeAnalysis.alternatives.map((a: any) => a.alternative),
            blindSpots: reflection.blindSpotDetection.blindSpots.map((b: any) => b.blindSpot),
            assumptions: reflection.assumptionDetection.assumptions.map((a: any) => a.assumption),
            contradictionsDetected: reflection.contradictionDetection.contradictions.map((c: any) => c.contradiction),
            evidenceReview: {
              overallEvidenceQuality: reflection.evidenceReview.overallEvidenceQuality,
              conclusionsNeedingStrengthening: reflection.evidenceReview.conclusions.filter((c: any) => c.needsStrengthening).map((c: any) => c.conclusion),
            },
            confidenceCalibration: {
              overallConfidence: reflection.confidenceCalibration.overallConfidence,
              calibrations: reflection.confidenceCalibration.calibrations.map((c: any) => ({
                recommendation: c.recommendation,
                originalConfidence: c.originalConfidence,
                calibratedConfidence: c.calibratedConfidence,
              })),
            },
          };
        }
      } catch (error) {
        console.error("Failed to get reflection context:", error);
      }

      // Get planning intelligence context for planning-aware responses
      let planningContext = null;
      try {
        const planning = await CareerCopilotPlanningIntelligenceEngine.getLastPlanningAnalysis();
        if (planning) {
          planningContext = {
            currentPosition: planning.currentPosition,
            targetPosition: planning.targetPosition,
            gapAnalysis: {
              gaps: planning.gapAnalysis.gaps.map((g: any) => ({
                category: g.category,
                currentState: g.currentState,
                requiredState: g.requiredState,
                gapSize: g.gapSize,
                priority: g.priority,
                closingStrategy: g.closingStrategy,
              })),
            },
            planningRoadmap: planning.planningRoadmap,
            milestones: planning.milestones,
            priorities: planning.priorities,
            dependencies: planning.dependencies,
            riskAnalysis: planning.riskAnalysis,
            alternativePlans: planning.alternativePlans,
            checkpoints: planning.checkpoints,
            adaptationRules: planning.adaptationRules,
            planningConfidence: planning.planningConfidence,
          };
        }
      } catch (error) {
        console.error("Failed to get planning context:", error);
      }

      // Get execution intelligence context for execution-aware responses
      let executionContext = null;
      try {
        const execution = await CareerCopilotExecutionIntelligenceEngine.getLastExecutionAnalysis();
        if (execution) {
          executionContext = {
            nextBestAction: execution.nextBestAction,
            justification: execution.justification,
            priorityScore: execution.priorityScore,
            executionConfidence: execution.executionConfidence,
            blockingFactors: execution.blockingFactors,
            expectedOutcome: execution.expectedOutcome,
            opportunityWindow: execution.opportunityWindow,
            executionExplainability: execution.executionExplainability,
            executionMetadata: execution.executionMetadata,
          };
        }
      } catch (error) {
        console.error("Failed to get execution context:", error);
      }

      // Get coaching intelligence context for coaching-aware responses
      let coachingContext = null;
      try {
        const coaching = await CareerCopilotCoachingIntelligenceEngine.getLastCoachingAnalysis();
        if (coaching) {
          coachingContext = {
            coachingGuidance: coaching.coachingGuidance,
            motivationStrategy: coaching.motivationStrategy,
            microObjectives: coaching.microObjectives,
            learningTips: coaching.learningTips,
            encouragement: coaching.encouragement,
            riskPrevention: coaching.riskPrevention,
            adaptiveCoaching: coaching.adaptiveCoaching,
            coachingExplainability: coaching.coachingExplainability,
            coachingMetadata: coaching.coachingMetadata,
          };
        }
      } catch (error) {
        console.error("Failed to get coaching context:", error);
      }

      const response = await CareerCopilotConversationEngine.generateResponse({
        userQuestion: input,
        candidateGraph,
        conversationHistory,
      });

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response.response,
        timestamp: new Date(),
        evidence: response.evidence,
        recommendations: response.recommendations,
        explanation: response.explanation,
        confidence: response.confidence,
        limitations: response.limitations,
        changes: response.changes,
      };

      if (autonomousContext) {
        (assistantMessage as any).autonomousContext = autonomousContext;
      }
      if (outcomeContext) {
        (assistantMessage as any).outcomeContext = outcomeContext;
      }
      if (personalizationContext) {
        (assistantMessage as any).personalizationContext = personalizationContext;
      }
      if (evidenceContext) {
        (assistantMessage as any).evidenceContext = evidenceContext;
      }
      if (executionContext) {
        (assistantMessage as any).executionContext = executionContext;
      }
      if (coachingContext) {
        (assistantMessage as any).coachingContext = coachingContext;
      }
      if (constraintContext) {
        (assistantMessage as any).constraintContext = constraintContext;
      }
      if (resourceContext) {
        (assistantMessage as any).resourceContext = resourceContext;
      }
      if (knowledgeEvolutionContext) {
        (assistantMessage as any).knowledgeEvolutionContext = knowledgeEvolutionContext;
      }
      if (careerNarrativeContext) {
        (assistantMessage as any).careerNarrativeContext = careerNarrativeContext;
      }
      if (reflectionContext) {
        (assistantMessage as any).reflectionContext = reflectionContext;
      }
      if (planningContext) {
        (assistantMessage as any).planningContext = planningContext;
      }
      if (executionContext) {
        (assistantMessage as any).executionContext = executionContext;
      }

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Failed to generate response:", error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "Je n'ai pas pu générer une réponse. Veuillez réessayer.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm h-[600px] flex flex-col">
      <CardHeader className="border-b border-gray-200/60">
        <CardTitle className="text-gray-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Career Copilot
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-4 overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          <AnimatePresence>
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-gray-500 py-8"
              >
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-sm">
                  Posez-moi vos questions sur votre carrière, vos progrès, ou vos objectifs.
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Exemples: "Pourquoi mon score a diminué ?", "Que dois-je travailler cette semaine ?"
                </p>
              </motion.div>
            )}
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    message.role === "user"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.explanation && (
                    <div className="mt-3 pt-3 border-t border-gray-300">
                      <p className="text-xs font-medium mb-1">Pourquoi:</p>
                      <p className="text-xs text-gray-700">{message.explanation}</p>
                    </div>
                  )}
                  {message.evidence && message.evidence.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-300">
                      <p className="text-xs font-medium mb-1">Preuves:</p>
                      <ul className="text-xs space-y-1">
                        {message.evidence.map((evidence, i) => (
                          <li key={i} className="text-gray-700">
                            • {evidence}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {message.confidence && (
                    <div className="mt-3 pt-3 border-t border-gray-300">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium">Confiance:</p>
                        <p className="text-xs font-bold">{message.confidence}%</p>
                      </div>
                    </div>
                  )}
                  {message.limitations && message.limitations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-300">
                      <p className="text-xs font-medium mb-1">Limitations:</p>
                      <ul className="text-xs space-y-1">
                        {message.limitations.map((limitation, i) => (
                          <li key={i} className="text-gray-700">
                            • {limitation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {message.changes && message.changes.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-300">
                      <p className="text-xs font-medium mb-1">Changements:</p>
                      <ul className="text-xs space-y-1">
                        {message.changes.map((change, i) => (
                          <li key={i} className="text-gray-700">
                            • {change.metric}: {change.change}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {message.strategyChange && message.strategyChange.hasChanged && (
                    <div className="mt-3 pt-3 border-t border-purple-300">
                      <p className="text-xs font-medium mb-1 text-purple-900">Changement de stratégie:</p>
                      <div className="space-y-1">
                        <p className="text-xs text-purple-800">
                          <span className="font-medium">Ancienne:</span> {message.strategyChange.oldStrategy}
                        </p>
                        <p className="text-xs text-purple-800">
                          <span className="font-medium">Nouvelle:</span> {message.strategyChange.newStrategy}
                        </p>
                        <p className="text-xs text-purple-800">
                          <span className="font-medium">Raison:</span> {message.strategyChange.reason}
                        </p>
                      </div>
                    </div>
                  )}
                  {message.priorityDecision && (
                    <div className="mt-3 pt-3 border-t border-amber-300">
                      <p className="text-xs font-medium mb-1 text-amber-900">Décision de priorité:</p>
                      <div className="space-y-1">
                        <p className="text-xs text-amber-800">
                          <span className="font-medium">Priorité absolue:</span> {message.priorityDecision.absolutePriority}
                        </p>
                        <p className="text-xs text-amber-800">
                          <span className="font-medium">Raison:</span> {message.priorityDecision.priorityReason}
                        </p>
                        <p className="text-xs text-amber-800">
                          <span className="font-medium">Pourquoi les autres attendent:</span> {message.priorityDecision.whyNotOthers}
                        </p>
                        <p className="text-xs text-amber-800">
                          <span className="font-medium">Pourquoi maintenant:</span> {message.priorityDecision.whyNow}
                        </p>
                      </div>
                    </div>
                  )}
                  {message.followUpExplanation && (
                    <div className="mt-3 pt-3 border-t border-teal-300">
                      <p className="text-xs font-medium mb-1 text-teal-900">Relance explicative:</p>
                      <div className="space-y-1">
                        <p className="text-xs text-teal-800">
                          <span className="font-medium">Action:</span> {message.followUpExplanation.action}
                        </p>
                        <p className="text-xs text-teal-800">
                          <span className="font-medium">Explication:</span> {message.followUpExplanation.explanation}
                        </p>
                        <p className="text-xs text-teal-800">
                          <span className="font-medium">Urgence:</span> {message.followUpExplanation.urgency === "high" ? "Urgent" : message.followUpExplanation.urgency === "medium" ? "Moyen" : "Faible"}
                        </p>
                      </div>
                    </div>
                  )}
                  {message.conclusionChange && (
                    <div className="mt-3 pt-3 border-t border-indigo-300">
                      <p className="text-xs font-medium mb-1 text-indigo-900">Changement de conclusion:</p>
                      <div className="space-y-1">
                        <p className="text-xs text-indigo-800">
                          <span className="font-medium">Ancienne conclusion:</span> {message.conclusionChange.oldConclusion}
                        </p>
                        <p className="text-xs text-indigo-800">
                          <span className="font-medium">Nouvelle conclusion:</span> {message.conclusionChange.newConclusion}
                        </p>
                        <p className="text-xs text-indigo-800">
                          <span className="font-medium">Raison:</span> {message.conclusionChange.reason}
                        </p>
                        <p className="text-xs text-indigo-800">
                          <span className="font-medium">Confiance:</span> {message.conclusionChange.confidence}%
                        </p>
                      </div>
                    </div>
                  )}
                  {message.confidenceLevel && (
                    <div className="mt-3 pt-3 border-t border-teal-300">
                      <p className="text-xs font-medium mb-1 text-teal-900">Niveau de confiance:</p>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-teal-800">
                            <span className="font-medium">Niveau:</span> {message.confidenceLevel.level === "very_high" ? "Très élevée" : message.confidenceLevel.level === "high" ? "Élevée" : message.confidenceLevel.level === "moderate" ? "Modérée" : message.confidenceLevel.level === "low" ? "Faible" : "Insuffisante"}
                          </p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${message.confidenceLevel.confidence >= 90 ? "bg-green-100 text-green-800" : message.confidenceLevel.confidence >= 70 ? "bg-blue-100 text-blue-800" : message.confidenceLevel.confidence >= 50 ? "bg-amber-100 text-amber-800" : message.confidenceLevel.confidence >= 30 ? "bg-orange-100 text-orange-800" : "bg-red-100 text-red-800"}`}>
                            {message.confidenceLevel.confidence}%
                          </span>
                        </div>
                        <p className="text-xs text-teal-800">
                          <span className="font-medium">Raison:</span> {message.confidenceLevel.reason}
                        </p>
                        {message.confidenceLevel.uncertainDomains.length > 0 && (
                          <p className="text-xs text-teal-800">
                            <span className="font-medium">Domaines incertains:</span> {message.confidenceLevel.uncertainDomains.join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  {message.coherenceStatus && (
                    <div className="mt-3 pt-3 border-t border-purple-300">
                      <p className="text-xs font-medium mb-1 text-purple-900">Statut de cohérence</p>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-purple-800">
                            <span className="font-medium">Cohérence globale:</span> {message.coherenceStatus.globalCoherence}%
                          </p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${message.coherenceStatus.globalCoherence >= 90 ? "bg-green-100 text-green-800" : message.coherenceStatus.globalCoherence >= 70 ? "bg-blue-100 text-blue-800" : message.coherenceStatus.globalCoherence >= 50 ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"}`}>
                            {message.coherenceStatus.isSynchronized ? "Synchronisé" : "Non synchronisé"}
                          </span>
                        </div>
                        <p className="text-xs text-purple-800">
                          <span className="font-medium">Analyses synchronisées:</span> {message.coherenceStatus.synchronizedAnalyses} / {message.coherenceStatus.totalAnalyses}
                        </p>
                        {message.coherenceStatus.detectedIncoherencies && message.coherenceStatus.detectedIncoherencies.length > 0 && (
                          <p className="text-xs text-purple-800">
                            <span className="font-medium">Incohérences détectées:</span> {message.coherenceStatus.detectedIncoherencies.join(", ")}
                          </p>
                        )}
                        {message.coherenceStatus.resolvedConflicts && message.coherenceStatus.resolvedConflicts.length > 0 && (
                          <p className="text-xs text-purple-800">
                            <span className="font-medium">Conflits résolus:</span> {message.coherenceStatus.resolvedConflicts.join(", ")}
                          </p>
                        )}
                        <p className="text-xs text-purple-800">
                          <span className="font-medium">Raison:</span> {message.coherenceStatus.reason}
                        </p>
                      </div>
                    </div>
                  )}
                  {message.goalStatus && (
                    <div className="mt-3 pt-3 border-t border-blue-300">
                      <p className="text-xs font-medium mb-1 text-blue-900">Statut des objectifs</p>
                      <div className="space-y-1">
                        <p className="text-xs text-blue-800">
                          <span className="font-medium">Objectif principal:</span> {message.goalStatus.primaryGoal}
                        </p>
                        <p className="text-xs text-blue-800">
                          <span className="font-medium">Objectif du moment:</span> {message.goalStatus.goalOfTheMoment}
                        </p>
                        {message.goalStatus.newGoals.length > 0 && (
                          <p className="text-xs text-blue-800">
                            <span className="font-medium">Nouveaux objectifs:</span> {message.goalStatus.newGoals.join(", ")}
                          </p>
                        )}
                        {message.goalStatus.completedGoals.length > 0 && (
                          <p className="text-xs text-blue-800">
                            <span className="font-medium">Objectifs terminés:</span> {message.goalStatus.completedGoals.join(", ")}
                          </p>
                        )}
                        {message.goalStatus.mergedGoals.length > 0 && (
                          <p className="text-xs text-blue-800">
                            <span className="font-medium">Objectifs fusionnés:</span> {message.goalStatus.mergedGoals.join(", ")}
                          </p>
                        )}
                        {message.goalStatus.deletedGoals.length > 0 && (
                          <p className="text-xs text-blue-800">
                            <span className="font-medium">Objectifs supprimés:</span> {message.goalStatus.deletedGoals.join(", ")}
                          </p>
                        )}
                        {message.goalStatus.postponedGoals.length > 0 && (
                          <p className="text-xs text-blue-800">
                            <span className="font-medium">Objectifs reportés:</span> {message.goalStatus.postponedGoals.join(", ")}
                          </p>
                        )}
                        <p className="text-xs text-blue-800">
                          <span className="font-medium">Raison:</span> {message.goalStatus.reason}
                        </p>
                      </div>
                    </div>
                  )}
                  {message.marketContext && (
                    <div className="mt-3 pt-3 border-t border-emerald-300">
                      <p className="text-xs font-medium mb-1 text-emerald-900">Contexte du marché</p>
                      <div className="space-y-1">
                        {message.marketContext.marketTrends.length > 0 && (
                          <p className="text-xs text-emerald-800">
                            <span className="font-medium">Tendances:</span> {message.marketContext.marketTrends.join(", ")}
                          </p>
                        )}
                        {message.marketContext.emergingSkills.length > 0 && (
                          <p className="text-xs text-emerald-800">
                            <span className="font-medium">Compétences émergentes:</span> {message.marketContext.emergingSkills.join(", ")}
                          </p>
                        )}
                        {message.marketContext.opportunities.length > 0 && (
                          <p className="text-xs text-emerald-800">
                            <span className="font-medium">Opportunités:</span> {message.marketContext.opportunities.join(", ")}
                          </p>
                        )}
                        {message.marketContext.risks.length > 0 && (
                          <p className="text-xs text-emerald-800">
                            <span className="font-medium">Risques:</span> {message.marketContext.risks.join(", ")}
                          </p>
                        )}
                        <p className="text-xs text-emerald-800">
                          <span className="font-medium">Impact stratégie:</span> {message.marketContext.strategyImpact}
                        </p>
                        <p className="text-xs text-emerald-800">
                          <span className="font-medium">Raison:</span> {message.marketContext.reason}
                        </p>
                      </div>
                    </div>
                  )}
                  {message.opportunityContext && (
                    <div className="mt-3 pt-3 border-t border-amber-300">
                      <p className="text-xs font-medium mb-1 text-amber-900">Contexte des opportunités</p>
                      <div className="space-y-1">
                        <p className="text-xs text-amber-800">
                          <span className="font-medium">Opportunité prioritaire:</span> {message.opportunityContext.priorityOpportunity}
                        </p>
                        {message.opportunityContext.compatibleOpportunities.length > 0 && (
                          <p className="text-xs text-amber-800">
                            <span className="font-medium">Opportunités compatibles:</span> {message.opportunityContext.compatibleOpportunities.join(", ")}
                          </p>
                        )}
                        {message.opportunityContext.opportunitiesToPrepare.length > 0 && (
                          <p className="text-xs text-amber-800">
                            <span className="font-medium">À préparer:</span> {message.opportunityContext.opportunitiesToPrepare.join(", ")}
                          </p>
                        )}
                        {message.opportunityContext.opportunitiesToAvoid.length > 0 && (
                          <p className="text-xs text-amber-800">
                            <span className="font-medium">À éviter:</span> {message.opportunityContext.opportunitiesToAvoid.join(", ")}
                          </p>
                        )}
                        {message.opportunityContext.recentlyDetected.length > 0 && (
                          <p className="text-xs text-amber-800">
                            <span className="font-medium">Récemment détectées:</span> {message.opportunityContext.recentlyDetected.join(", ")}
                          </p>
                        )}
                        <p className="text-xs text-amber-800">
                          <span className="font-medium">Impact stratégie:</span> {message.opportunityContext.strategyImpact}
                        </p>
                        <p className="text-xs text-amber-800">
                          <span className="font-medium">Impact objectifs:</span> {message.opportunityContext.goalImpact}
                        </p>
                        <p className="text-xs text-amber-800">
                          <span className="font-medium">Suivi:</span> {message.opportunityContext.accountabilityTracking}
                        </p>
                        <p className="text-xs text-amber-800">
                          <span className="font-medium">Raison:</span> {message.opportunityContext.reason}
                        </p>
                      </div>
                    </div>
                  )}
                  {message.applicationContext && (
                    <div className="mt-3 pt-3 border-t border-pink-300">
                      <p className="text-xs font-medium mb-1 text-pink-900">Contexte des candidatures</p>
                      <div className="space-y-1">
                        <p className="text-xs text-pink-800">
                          <span className="font-medium">Candidature prioritaire:</span> {message.applicationContext.priorityApplication}
                        </p>
                        {message.applicationContext.applicationsToFollowUp.length > 0 && (
                          <p className="text-xs text-pink-800">
                            <span className="font-medium">À relancer:</span> {message.applicationContext.applicationsToFollowUp.join(", ")}
                          </p>
                        )}
                        {message.applicationContext.applicationsToPrepare.length > 0 && (
                          <p className="text-xs text-pink-800">
                            <span className="font-medium">À préparer:</span> {message.applicationContext.applicationsToPrepare.join(", ")}
                          </p>
                        )}
                        {message.applicationContext.applicationsToAbandon.length > 0 && (
                          <p className="text-xs text-pink-800">
                            <span className="font-medium">À abandonner:</span> {message.applicationContext.applicationsToAbandon.join(", ")}
                          </p>
                        )}
                        {message.applicationContext.recentlySubmitted.length > 0 && (
                          <p className="text-xs text-pink-800">
                            <span className="font-medium">Récemment soumises:</span> {message.applicationContext.recentlySubmitted.join(", ")}
                          </p>
                        )}
                        {message.applicationContext.interviewsScheduled.length > 0 && (
                          <p className="text-xs text-pink-800">
                            <span className="font-medium">Entretiens planifiés:</span> {message.applicationContext.interviewsScheduled.join(", ")}
                          </p>
                        )}
                        <p className="text-xs text-pink-800">
                          <span className="font-medium">Impact stratégie:</span> {message.applicationContext.strategyImpact}
                        </p>
                        <p className="text-xs text-pink-800">
                          <span className="font-medium">Impact objectifs:</span> {message.applicationContext.goalImpact}
                        </p>
                        <p className="text-xs text-pink-800">
                          <span className="font-medium">Suivi:</span> {message.applicationContext.accountabilityTracking}
                        </p>
                        <p className="text-xs text-pink-800">
                          <span className="font-medium">Raison:</span> {message.applicationContext.reason}
                        </p>
                      </div>
                    </div>
                  )}
                  {message.recommendations && message.recommendations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-300">
                      <p className="text-xs font-medium mb-1">Recommandations:</p>
                      <ul className="text-xs space-y-1">
                        {message.recommendations.map((rec, i) => (
                          <li key={i} className="text-gray-700">
                            • {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <p className="text-xs mt-2 opacity-70">
                    {message.timestamp.toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-gray-100 rounded-2xl p-4">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Posez votre question..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
