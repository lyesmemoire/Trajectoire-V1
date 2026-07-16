// @ts-nocheck
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { User, TrendingUp, AlertTriangle, CheckCircle, Clock, ArrowRight, Sparkles, Zap, RefreshCw, TrendingDown, Shield, AlertCircle, Target, Plus, Trash2, Award, Lightbulb, Brain, Compass, Database, Search, Info, Lock as LockIcon, Archive, BookOpen, Fingerprint, Activity, GitBranch, Radar, Scale, AlertOctagon, Route, MapPin, Flag } from "lucide-react";

export interface DigitalTwin {
  currentPortrait: {
    description: string[];
    evolution: string;
    scoreExplanation: string;
  };
  dominantStrengths: {
    naturalStrengths: string[];
    emergingStrengths: string[];
  };
  fragilities: {
    persistentFragilities: string[];
    situationalFragilities: string[];
  };
  habits: {
    positiveHabits: string[];
    negativeHabits: string[];
    recurringBehaviors: string[];
  };
  professionalStyle: {
    communicationStyle: string;
    leadershipStyle: string;
    decisionStyle: string;
    relationshipStyle: string;
    learningStyle: string;
  };
  whatChanges: {
    evolves: string[];
    staysStable: string[];
    regresses: string[];
    surprises: string[];
  };
  temporalComparison: {
    today: string;
    oneWeekAgo: string;
    oneMonthAgo: string;
    firstSimulation: string;
  };
  naturalSynthesis: string;
  priorityDecision?: {
    absolutePriority: string;
    priorityReason: string;
    expectedImpact: string;
    urgency: string;
  };
  behavioralHabits?: {
    keepsCommitments: boolean;
    actsQuickly: boolean;
    procrastinates: boolean;
    oftenAbandons: boolean;
    persists: boolean;
    progressesRegularly: boolean;
    worksUnderPressure: boolean;
    learnsQuickly: boolean;
  };
  confirmedBeliefs?: {
    belief: string;
    reason: string;
    observations: string[];
  }[];
  revisedBeliefs?: {
    oldBelief: string;
    newBelief: string;
    reason: string;
    observations: string[];
  }[];
  certainKnowledge?: {
    knowledge: string;
    confidence: number;
    evidence: string[];
  }[];
  probableTrends?: {
    trend: string;
    confidence: number;
    evidence: string[];
  }[];
  toConfirm?: {
    hypothesis: string;
    confidence: number;
    evidence: string[];
  }[];
  synchronizationStatus?: {
    isCoherent: boolean;
    globalCoherence: number;
    coherentAnalyses: string[];
    incoherentAnalyses?: string[];
    reason: string;
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
    profileCompetitiveness: string;
    differentiatingSkills: string[];
    lessDifferentiatingSkills: string[];
    marketDemand: string;
    reason: string;
  };
  outcomeInsights?: {
    whatWorksBest: string[];
    whatWorksLeast: string[];
    candidateSpecificPatterns: string[];
    observedROI: {
      action: string;
      roi: string;
      evidence: string;
    }[];
    recentLearnings: string[];
    confidenceInRecommendations: number;
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
  executionContext?: {
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
      urgency: string;
      importance: string;
    };
    executionConfidence: {
      level: string;
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
      window: string;
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
  };
  coachingContext?: {
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
  };
  learningProfile?: {
    autonomy: {
      level: "high" | "medium" | "low";
      confidence: number;
    };
    guidancePreference: {
      explanationLength: "short" | "medium" | "long";
      detailLevel: "minimal" | "moderate" | "comprehensive";
      examplePreference: "none" | "few" | "many";
    };
    learningCharacteristics: {
      learningSpeed: string;
      executionSpeed: string;
      complexityTolerance: string;
      planningCapability: string;
      habitStability: string;
    };
    reactionPatterns: {
      failureReaction: string;
      successReaction: string;
    };
    optimalCoachingStyle: {
      responseLength: string;
      detailLevel: string;
      goalDifficulty: string;
      autonomyLevel: string;
      encouragementLevel: string;
      progressionSpeed: string;
    };
    howYouLearnBest: string[];
  };
  resources?: {
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
    futureCapacity: string;
    limitingFactors: string[];
    underutilizedResources: string[];
    overutilizedResources: string[];
    resourceOptimizations: string[];
  };
  missionProgression?: {
    currentMission: string;
    currentPhase: string;
    overallProgress: number;
    phaseProgress: number;
    milestonesAchieved: number;
    milestonesTotal: number;
    timeRemaining: string;
    progressVelocity: string;
    nextMilestone: string;
    successProbability: number;
    onTimeProbability: number;
    topRisks: string[];
    keyAchievements: string[];
    focusAreas: string[];
  };
  evidenceKnowledge?: {
    certitudes: string[];
    trends: string[];
    hypotheses: string[];
    toConfirm: string[];
    overallEvidenceQuality: string;
    overallConfidence: number;
    evidenceCount: number;
    strongEvidence: number;
    weakEvidence: number;
  };
  constraintInfluences?: {
    activeConstraints: string[];
    criticalConstraints: string[];
    constraintImpactOnDecisions: string[];
    constraintImpactOnStrategy: string[];
    constraintImpactOnOpportunities: string[];
    constraintImpactOnGoals: string[];
    constraintEvolution: string[];
    constraintRecommendations: string[];
  };
  knowledgeEvolution?: {
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
  };
  jobOfferContext?: {
    generalInfo: {
      title?: string;
      company?: string;
      location?: string;
      salary?: string;
      contractType?: string;
      remoteWork?: string;
    };
    seniority: {
      level: string;
    };
    hardSkills: Array<{ name: string; category: string }>;
    softSkills: Array<{ name: string }>;
    requirements: Array<{ description: string; priority: string }>;
    difficulty: {
      technicalComplexity: number;
      businessComplexity: number;
      expectedAutonomy: number;
    };
    extractedAt: string;
    confidence: number;
  };
  matchingCoreContext?: {
    hardSkills: {
      matched: Array<{ name: string; category: string }>;
      missing: Array<{ name: string; category: string }>;
      additional: Array<{ name: string; category: string }>;
    };
    softSkills: {
      matched: Array<{ name: string }>;
      missing: Array<{ name: string }>;
      additional: Array<{ name: string }>;
    };
    technologies: {
      matched: string[];
      missing: string[];
      additional: string[];
    };
    languages: {
      matched: Array<{ language: string; level: string }>;
      missing: Array<{ language: string; requiredLevel: string }>;
    };
    certifications: {
      matched: Array<{ name: string }>;
      missing: Array<{ name: string }>;
    };
    experience: {
      candidateYears: number;
      requiredYears?: string;
      candidateSectors: string[];
      requiredSector?: string;
    };
    comparedAt: string;
    confidence: number;
  };
  transferableSkillsContext?: {
    directTransferable: Array<{
      missingSkill: string;
      sourceSkill: string;
      transferConfidence: number;
      transferExplanation: string;
    }>;
    partialTransferable: Array<{
      missingSkill: string;
      sourceSkill: string;
      transferConfidence: number;
      transferExplanation: string;
    }>;
    notTransferable: Array<{
      missingSkill: string;
      transferExplanation: string;
    }>;
    averageConfidence: number;
    analyzedAt: string;
    confidence: number;
  };
  gapContext?: {
    hardSkillGaps: Array<{
      id: string;
      title: string;
      description: string;
      severity: "low" | "medium" | "high" | "critical";
      blocking: boolean;
      compensable: boolean;
      transferable: boolean;
      learningPossible: boolean;
      learningTimeEstimate: string;
      businessImpact: string;
      explanation: string;
    }>;
    softSkillGaps: Array<{
      id: string;
      title: string;
      description: string;
      severity: "low" | "medium" | "high" | "critical";
      blocking: boolean;
      compensable: boolean;
      transferable: boolean;
      learningPossible: boolean;
      learningTimeEstimate: string;
      businessImpact: string;
      explanation: string;
    }>;
    technologyGaps: Array<{
      id: string;
      title: string;
      description: string;
      severity: "low" | "medium" | "high" | "critical";
      blocking: boolean;
      compensable: boolean;
      transferable: boolean;
      learningPossible: boolean;
      learningTimeEstimate: string;
      businessImpact: string;
      explanation: string;
    }>;
    experienceGaps: Array<{
      id: string;
      title: string;
      description: string;
      severity: "low" | "medium" | "high" | "critical";
      blocking: boolean;
      compensable: boolean;
      transferable: boolean;
      learningPossible: boolean;
      learningTimeEstimate: string;
      businessImpact: string;
      explanation: string;
    }>;
    educationGaps: Array<{
      id: string;
      title: string;
      description: string;
      severity: "low" | "medium" | "high" | "critical";
      blocking: boolean;
      compensable: boolean;
      transferable: boolean;
      learningPossible: boolean;
      learningTimeEstimate: string;
      businessImpact: string;
      explanation: string;
    }>;
    languageGaps: Array<{
      id: string;
      title: string;
      description: string;
      severity: "low" | "medium" | "high" | "critical";
      blocking: boolean;
      compensable: boolean;
      transferable: boolean;
      learningPossible: boolean;
      learningTimeEstimate: string;
      businessImpact: string;
      explanation: string;
    }>;
    businessGaps: Array<{
      id: string;
      title: string;
      description: string;
      severity: "low" | "medium" | "high" | "critical";
      blocking: boolean;
      compensable: boolean;
      transferable: boolean;
      learningPossible: boolean;
      learningTimeEstimate: string;
      businessImpact: string;
      explanation: string;
    }>;
    cultureGaps: Array<{
      id: string;
      title: string;
      description: string;
      severity: "low" | "medium" | "high" | "critical";
      blocking: boolean;
      compensable: boolean;
      transferable: boolean;
      learningPossible: boolean;
      learningTimeEstimate: string;
      businessImpact: string;
      explanation: string;
    }>;
    mobilityGaps: Array<{
      id: string;
      title: string;
      description: string;
      severity: "low" | "medium" | "high" | "critical";
      blocking: boolean;
      compensable: boolean;
      transferable: boolean;
      learningPossible: boolean;
      learningTimeEstimate: string;
      businessImpact: string;
      explanation: string;
    }>;
    criticalGaps: string[];
    blockingGaps: string[];
    transferableGaps: string[];
    learningGaps: string[];
    summary: {
      totalGaps: number;
      criticalGapsCount: number;
      blockingGapsCount: number;
      compensableGapsCount: number;
      totalLearningTimeEstimate: string;
    };
    analyzedAt: string;
    confidence: number;
  };
  interviewPreparationContext?: {
    interviewStrategy: {
      approach: string;
      openingStrategy: string;
      progressionStrategy: string;
      closingStrategy: string;
    };
    questionQueue: Array<{
      id: string;
      category: string;
      priority: "critical" | "high" | "medium" | "low";
      difficulty: "easy" | "medium" | "hard" | "expert";
      estimatedDuration: number;
      question: string;
      whyAsked: string;
      whatItMeasures: string;
    }>;
    priorityQueue: {
      critical: string[];
      high: string[];
      medium: string[];
      low: string[];
    };
    difficultyLevel: {
      overall: "easy" | "medium" | "hard" | "expert";
      rationale: string;
    };
    interviewDurationEstimate: {
      totalMinutes: number;
      breakdown: {
        warmup: number;
        validation: number;
        technical: number;
        behavioral: number;
        advanced: number;
        culture: number;
        critical: number;
        closing: number;
      };
    };
    expectedSkillsToDemonstrate: Array<{
      id: string;
      name: string;
      category: string;
      level: string;
      importance: "critical" | "high" | "medium" | "low";
    }>;
    preparedAt: string;
    confidence: number;
  };
  voiceInterviewContext?: {
    interviewSession: {
      id: string;
      currentState: string;
      startedAt: string;
      previousState: string;
      stateHistory: Array<{ state: string; timestamp: string }>;
    };
    currentPhase: {
      name: string;
      objective: string;
      startedAt: string;
      expectedDuration: number;
    };
    currentQuestion: {
      id: string;
      question: string;
      category: string;
      priority: string;
      difficulty: string;
      estimatedDuration: number;
      askedAt: string;
      followUpsAvailable: string[];
    } | null;
    remainingQuestions: string[];
    conversationMemory: {
      questionsAsked: Array<{ id: string; question: string; askedAt: string; phase: string }>;
      conversationTimeline: Array<{ event: string; timestamp: string; data: any }>;
      askedQuestions: string[];
      skippedQuestions: string[];
      followUpQueue: Array<{ parentQuestionId: string; followUps: string[] }>;
      elementsToVerify: string[];
      confirmedElements: string[];
      unknownElements: string[];
    };
    interviewState: {
      totalQuestions: number;
      askedQuestionsCount: number;
      skippedQuestionsCount: number;
      currentPhaseProgress: number;
      overallProgress: number;
    };
    interviewProgress: {
      phasesCompleted: string[];
      currentPhaseIndex: number;
      totalPhases: number;
    };
    interviewTimer: {
      elapsedTime: number;
      remainingTime: number;
      averageTimePerQuestion: number;
      timePerPhase: Record<string, number>;
      maximumTime: number;
    };
    candidateInterruptions: Array<{
      id: string;
      timestamp: string;
      type: string;
      handled: boolean;
    }>;
    silenceCounter: {
      count: number;
      lastSilenceTimestamp: string;
      totalSilenceDuration: number;
    };
    retryCounter: {
      count: number;
      lastRetryTimestamp: string;
      maxRetries: number;
    };
    conversationMetadata: {
      sessionId: string;
      candidateId: string;
      jobOfferId: string;
      interviewPreparationContextId: string;
      totalDuration: number;
    };
  };
  voiceSessionContext?: {
    sessionId: string;
    status: string;
    currentPhase: string;
    currentQuestion: {
      id: string;
      question: string;
      category: string;
    } | null;
    questionsAsked: number;
    remainingQuestions: number;
    elapsedTime: number;
    estimatedRemaining: number;
    activeContexts: {
      interviewPreparationContext: Record<string, unknown> | null;
      voiceInterviewContext: Record<string, unknown> | null;
      sttContext: Record<string, unknown> | null;
      ttsContext: Record<string, unknown> | null;
      liveAnalysisContext: Record<string, unknown> | null;
      liveCoachingContext: Record<string, unknown> | null;
    };
    conversationHistory: {
      events: Array<{
        event: string;
        timestamp: string;
        data: Record<string, unknown>;
      }>;
      questions: Array<{
        id: string;
        question: string;
        askedAt: string;
        phase: string;
      }>;
      transitions: Array<{
        from: string;
        to: string;
        timestamp: string;
        reason: string;
      }>;
    };
    metadata: {
      candidateId: string;
      jobOfferId: string;
      createdAt: string;
      startedAt: string | null;
      finishedAt: string | null;
      totalDuration: number;
    };
    state: string;
    transitionHistory: Array<{
      from: string;
      to: string;
      timestamp: string;
      reason: string;
    }>;
  };
  liveAnswerAnalysisContext?: {
    overallQuality: {
      score: number;
      level: string;
    };
    technicalQuality: {
      score: number;
      level: string;
    };
    behavioralQuality: {
      score: number;
      level: string;
    };
    communicationQuality: {
      score: number;
      level: string;
    };
    starCompliance: {
      score: number;
      level: string;
    };
    answerCompleteness: {
      score: number;
      level: string;
    };
    evidenceScore: {
      score: number;
      level: string;
    };
    credibilityScore: {
      score: number;
      level: string;
    };
    recruiterConfidence: {
      score: number;
      level: string;
    };
    dimensionScores: Record<string, { score: number; explainability: Record<string, unknown> }>;
    missingElements: string[];
    strongElements: string[];
    risksDetected: string[];
    opportunitiesDetected: string[];
    contradictions: Array<{
      type: string;
      description: string;
      severity: string;
      explainability: Record<string, unknown>;
    }>;
    followUpSuggestions: string[];
    analysisMetadata: {
      questionId: string;
      responseId: string;
      analyzedAt: string;
      analysisDuration: number;
      explainability: Record<string, unknown>;
    };
  };
  liveCoachingContext?: {
    coachingNeeded: boolean;
    coachingPriority: "critical" | "high" | "medium" | "low";
    recommendedHint: {
      type: string;
      message: string;
      priority: string;
      urgency: string;
      timing: string;
      why: string;
      expectedBenefit: string;
      riskIfIgnored: string;
      confidence: number;
    } | null;
    recommendedTiming: "now" | "after response" | "next question";
    recommendedMessage: string;
    coachingHistory: Array<{
      timestamp: string;
      type: string;
      message: string;
      delivered: boolean;
      effectiveness: number;
    }>;
    interventionReason: string;
    expectedImprovement: string;
    confidence: number;
    metadata: {
      sessionId: string;
      questionId: string;
      responseId: string;
      coachingGeneratedAt: string;
      explainability: Record<string, unknown>;
    };
  };
  finalInterviewReportContext?: {
    executiveSummary: {
      overview: string;
      highlights: string[];
      overallAssessment: string;
    };
    recruiterDecision: {
      decision: string;
      justification: string;
      keyFactors: string[];
    };
    globalScore: {
      overall: number;
      technical: number;
      behavioral: number;
      communication: number;
      leadership: number;
      business: number;
      confidence: number;
      star: number;
      evidence: number;
    };
    demonstratedStrengths: Array<{ name: string; evidence: string }>;
    observedWeaknesses: Array<{ name: string; evidence: string }>;
    demonstratedSkills: Array<{ skill: string; evidence: string }>;
    insufficientlyDemonstratedSkills: Array<{ skill: string; evidence: string }>;
    criticalGaps: Array<{ gap: string; impact: string }>;
    compensatingTransferableSkills: Array<{ name: string; evidence: string }>;
    successfulQuestions: Array<{ name: string; evidence: string }>;
    difficultQuestions: Array<{ name: string; evidence: string }>;
    detectedContradictions: Array<{ name: string; evidence: string }>;
    missedOpportunities: Array<{ name: string; evidence: string }>;
    remarkableMoments: Array<{ name: string; evidence: string }>;
    personalizedAdvice: Array<{ name: string; evidence: string }>;
    recruiterTakeaways: Array<{ name: string; evidence: string }>;
    improvementPlan: {
      shortTerm: Array<{ improvement: string; priority: string }>;
      mediumTerm: Array<{ improvement: string; priority: string }>;
      longTerm: Array<{ improvement: string; priority: string }>;
    };
    finalSynthesis: {
      conclusion: string;
      keyTakeaways: string[];
      nextSteps: string[];
    };
    metadata: {
      reportId: string;
      sessionId: string;
      generatedAt: string;
      candidateId: string;
      jobOfferId: string;
    };
  };
  pipelineContext?: {
    currentStage: string;
    previousStage: string;
    startedAt: string;
    completedAt: string | null;
    error: string | null;
    cancelled: boolean;
    candidateProfile: any | null;
    candidateGraph: any | null;
    jobOfferGraph: any | null;
    matchingCoreContext: any | null;
    transferableSkillsContext: any | null;
    gapContext: any | null;
    interviewPreparationContext: any | null;
    voiceSessionContext: any | null;
    voiceInterviewContext: any | null;
    liveAnswerAnalysisContext: any | null;
    liveCoachingContext: any | null;
    finalInterviewReportContext: any | null;
  };
  realtimeContext?: {
    sessionId: string;
    currentState: string;
    stateDetails: any | null;
    currentTurn: any | null;
    latencyMetrics: any[];
    streamStats: {
      chunksReceived: number;
      chunksSent: number;
      bytesReceived: number;
      bytesSent: number;
    };
    connectionStatus: string;
    heartbeatStatus: {
      lastHeartbeat: number;
      interval: number;
      missed: number;
    };
    error: string | null;
  };
  providerContext?: {
    currentProvider: string | null;
    providerType: string | null;
    providerStatus: string | null;
    providerMetadata: any | null;
  };
  providerHealthContext?: {
    healthStatus: string;
    uptime: number;
    errorRate: number;
    latency: number;
    lastCheck: number;
  };
  providerMetricsContext?: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageLatency: number;
    totalCost: number;
    totalTokens: number;
  };
  openAIRealtimeContext?: {
    state: string;
    sessionId: string;
    connectedAt: number | null;
    lastHeartbeat: number | null;
    latency: number;
    reconnectAttempts: number;
    audioState: string;
    transcriptState: string;
    streamingState: string;
  };
  speechProviderContext?: {
    state: string;
    sessionId: string;
    startedAt: number | null;
    endedAt: number | null;
    duration: number;
    language: string;
    format: string;
    sampleRate: number;
  };
  speechTranscriptContext?: {
    partialTranscript: string;
    finalTranscripts: Array<{
      id: string;
      text: string;
      timestamp: number;
      confidence: number;
      language: string;
    }>;
    isProcessing: boolean;
  };
  speechMetricsContext?: {
    currentConfidence: number;
    averageConfidence: number;
    audioLatency: number;
    transcriptLatency: number;
    totalLatency: number;
    errorRate: number;
  };
  ttsProviderContext?: {
    state: string;
    sessionId: string;
    startedAt: number | null;
    endedAt: number | null;
    duration: number;
    voice: string;
    language: string;
    format: string;
    sampleRate: number;
  };
  ttsPlaybackContext?: {
    state: string;
    duration: number;
    position: number;
    volume: number;
    speed: number;
    pitch: number;
  };
  ttsMetricsContext?: {
    synthesisLatency: number;
    streamingLatency: number;
    totalLatency: number;
    averageLatency: number;
    errorRate: number;
  };
  embeddingProviderContext?: {
    state: string;
    sessionId: string;
    startedAt: number | null;
    endedAt: number | null;
    duration: number;
    model: string;
    language: string;
    dimensions: number;
  };
  embeddingMetricsContext?: {
    totalEmbeddings: number;
    totalTokens: number;
    totalDimensions: number;
    averageLatency: number;
    batchSize: number;
    successRate: number;
  };
  embeddingHealthContext?: {
    embeddingHealth: {
      status: string;
      uptime: number;
      errorRate: number;
      latency: number;
    };
    batchHealth: {
      status: string;
      uptime: number;
      errorRate: number;
      latency: number;
    };
    lastCheck: number;
  };
  moderationProviderContext?: {
    state: string;
    sessionId: string;
    startedAt: number | null;
    endedAt: number | null;
    duration: number;
    model: string;
    threshold: number;
  };
  moderationMetricsContext?: {
    totalModerations: number;
    totalTexts: number;
    totalImages: number;
    averageLatency: number;
    batchSize: number;
    successRate: number;
  };
  moderationHealthContext?: {
    textHealth: {
      status: string;
      uptime: number;
      errorRate: number;
      latency: number;
    };
    imageHealth: {
      status: string;
      uptime: number;
      errorRate: number;
      latency: number;
    };
    lastCheck: number;
  };
  providerRegistryContext?: {
    state: string;
    totalProviders: number;
    enabledProviders: number;
    disabledProviders: number;
  };
  providerResolverContext?: {
    state: string;
    resolvedProvider: string | null;
    requirements: {
      type: string;
      capabilities: string[];
    };
  };
  providerLifecycleContext?: {
    state: string;
    providers: Array<{
      id: string;
      name: string;
      status: string;
      uptime: number;
    }>;
  };
  runtimeContext?: {
    state: string;
    activeProviders: number;
    inactiveProviders: number;
    circuitBreakerOpen: boolean;
    lastEvent: string;
  };
}

interface DigitalTwinProps {
  twin: DigitalTwin;
}

export function DigitalTwin({ twin }: DigitalTwinProps) {
  return (
    <div className="space-y-6">
      {/* Current Portrait */}
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 shadow-sm">
        <CardHeader className="border-b border-purple-200">
          <CardTitle className="text-purple-900 flex items-center gap-2">
            <User className="w-5 h-5" />
            Portrait Actuel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <p className="font-medium text-purple-900 mb-2">Aujourd'hui tu es :</p>
              <ul className="space-y-2 text-sm text-purple-800">
                {twin.currentPortrait.description.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-purple-500">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-medium text-purple-900 mb-1">Évolution</p>
              <p className="text-sm text-purple-800">{twin.currentPortrait.evolution}</p>
            </div>
            <div>
              <p className="font-medium text-purple-900 mb-1">Pourquoi ce score ?</p>
              <p className="text-sm text-purple-800">{twin.currentPortrait.scoreExplanation}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dominant Strengths */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Forces Dominantes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {twin.dominantStrengths.naturalStrengths.length > 0 && (
              <div>
                <p className="font-medium text-green-700 mb-2">Forces naturelles</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  {twin.dominantStrengths.naturalStrengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {twin.dominantStrengths.emergingStrengths.length > 0 && (
              <div>
                <p className="font-medium text-blue-700 mb-2">Forces émergentes</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  {twin.dominantStrengths.emergingStrengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Fragilities */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Fragilités
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {twin.fragilities.persistentFragilities.length > 0 && (
              <div>
                <p className="font-medium text-red-700 mb-2">Fragilités persistantes</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  {twin.fragilities.persistentFragilities.map((fragility, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>{fragility}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {twin.fragilities.situationalFragilities.length > 0 && (
              <div>
                <p className="font-medium text-amber-700 mb-2">Fragilités situationnelles</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  {twin.fragilities.situationalFragilities.map((fragility, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-gray-400">•</span>
                      <span>{fragility}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Habits */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Habitudes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {twin.habits.positiveHabits.length > 0 && (
              <div>
                <p className="font-medium text-green-700 mb-2">Habitudes positives</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  {twin.habits.positiveHabits.map((habit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{habit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {twin.habits.negativeHabits.length > 0 && (
              <div>
                <p className="font-medium text-red-700 mb-2">Habitudes négatives</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  {twin.habits.negativeHabits.map((habit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>{habit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {twin.habits.recurringBehaviors.length > 0 && (
              <div>
                <p className="font-medium text-blue-700 mb-2">Comportements récurrents</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  {twin.habits.recurringBehaviors.map((behavior, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>{behavior}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Professional Style */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5" />
            Style Professionnel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-medium text-gray-900 mb-1">Style de communication</p>
              <p className="text-gray-700">{twin.professionalStyle.communicationStyle}</p>
            </div>
            <div>
              <p className="font-medium text-gray-900 mb-1">Style de leadership</p>
              <p className="text-gray-700">{twin.professionalStyle.leadershipStyle}</p>
            </div>
            <div>
              <p className="font-medium text-gray-900 mb-1">Style décisionnel</p>
              <p className="text-gray-700">{twin.professionalStyle.decisionStyle}</p>
            </div>
            <div>
              <p className="font-medium text-gray-900 mb-1">Style relationnel</p>
              <p className="text-gray-700">{twin.professionalStyle.relationshipStyle}</p>
            </div>
            <div>
              <p className="font-medium text-gray-900 mb-1">Style d'apprentissage</p>
              <p className="text-gray-700">{twin.professionalStyle.learningStyle}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What Changes */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Ce Qui Change
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {twin.whatChanges.evolves.length > 0 && (
              <div>
                <p className="font-medium text-green-700 mb-2">Évolue</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  {twin.whatChanges.evolves.map((change, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {twin.whatChanges.staysStable.length > 0 && (
              <div>
                <p className="font-medium text-blue-700 mb-2">Reste stable</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  {twin.whatChanges.staysStable.map((change, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-gray-400">•</span>
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {twin.whatChanges.regresses.length > 0 && (
              <div>
                <p className="font-medium text-red-700 mb-2">Régresse</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  {twin.whatChanges.regresses.map((change, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {twin.whatChanges.surprises.length > 0 && (
              <div>
                <p className="font-medium text-amber-700 mb-2">Surprend</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  {twin.whatChanges.surprises.map((change, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Temporal Comparison */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Comparaison Temporelle
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-24 flex-shrink-0">
                <p className="font-medium text-purple-900">Aujourd'hui</p>
              </div>
              <p className="text-gray-700">{twin.temporalComparison.today}</p>
            </div>
            <div className="flex items-start gap-3">
              <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
            </div>
            <div className="flex items-start gap-3">
              <div className="w-24 flex-shrink-0">
                <p className="font-medium text-gray-700">Il y a 1 semaine</p>
              </div>
              <p className="text-gray-600">{twin.temporalComparison.oneWeekAgo}</p>
            </div>
            <div className="flex items-start gap-3">
              <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
            </div>
            <div className="flex items-start gap-3">
              <div className="w-24 flex-shrink-0">
                <p className="font-medium text-gray-700">Il y a 1 mois</p>
              </div>
              <p className="text-gray-600">{twin.temporalComparison.oneMonthAgo}</p>
            </div>
            <div className="flex items-start gap-3">
              <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
            </div>
            <div className="flex items-start gap-3">
              <div className="w-24 flex-shrink-0">
                <p className="font-medium text-gray-700">Première simulation</p>
              </div>
              <p className="text-gray-600">{twin.temporalComparison.firstSimulation}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Natural Synthesis */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-blue-900 mb-2">Si je devais te décrire aujourd'hui en tant que professionnel...</p>
              <p className="text-sm text-blue-800">{twin.naturalSynthesis}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Priority Decision */}
      {twin.priorityDecision && (
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 shadow-sm">
          <CardHeader className="border-b border-amber-200">
            <CardTitle className="text-amber-900 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Décision la plus rentable
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-amber-600 font-medium mb-1">Priorité absolue</p>
                <p className="text-sm font-bold text-amber-900">{twin.priorityDecision.absolutePriority}</p>
              </div>
              <div>
                <p className="text-xs text-amber-600 font-medium mb-1">Raison</p>
                <p className="text-sm text-amber-800">{twin.priorityDecision.priorityReason}</p>
              </div>
              <div>
                <p className="text-xs text-amber-600 font-medium mb-1">Impact attendu</p>
                <p className="text-sm text-amber-800">{twin.priorityDecision.expectedImpact}</p>
              </div>
              <div>
                <p className="text-xs text-amber-600 font-medium mb-1">Urgence</p>
                <p className="text-sm text-amber-800">{twin.priorityDecision.urgency}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Behavioral Habits */}
      {twin.behavioralHabits && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 shadow-sm">
          <CardHeader className="border-b border-purple-200">
            <CardTitle className="text-purple-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Habitudes comportementales
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-3 rounded-lg border ${twin.behavioralHabits.keepsCommitments ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                <p className="text-xs font-medium mb-1">Tient ses engagements</p>
                <p className="text-sm font-bold">{twin.behavioralHabits.keepsCommitments ? "Oui" : "Non"}</p>
              </div>
              <div className={`p-3 rounded-lg border ${twin.behavioralHabits.actsQuickly ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                <p className="text-xs font-medium mb-1">Agit rapidement</p>
                <p className="text-sm font-bold">{twin.behavioralHabits.actsQuickly ? "Oui" : "Non"}</p>
              </div>
              <div className={`p-3 rounded-lg border ${twin.behavioralHabits.procrastinates ? "bg-amber-50 border-amber-200" : "bg-green-50 border-green-200"}`}>
                <p className="text-xs font-medium mb-1">Procrastine</p>
                <p className="text-sm font-bold">{twin.behavioralHabits.procrastinates ? "Oui" : "Non"}</p>
              </div>
              <div className={`p-3 rounded-lg border ${twin.behavioralHabits.oftenAbandons ? "bg-amber-50 border-amber-200" : "bg-green-50 border-green-200"}`}>
                <p className="text-xs font-medium mb-1">Abandonne souvent</p>
                <p className="text-sm font-bold">{twin.behavioralHabits.oftenAbandons ? "Oui" : "Non"}</p>
              </div>
              <div className={`p-3 rounded-lg border ${twin.behavioralHabits.persists ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                <p className="text-xs font-medium mb-1">Persévère</p>
                <p className="text-sm font-bold">{twin.behavioralHabits.persists ? "Oui" : "Non"}</p>
              </div>
              <div className={`p-3 rounded-lg border ${twin.behavioralHabits.progressesRegularly ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                <p className="text-xs font-medium mb-1">Progresse régulièrement</p>
                <p className="text-sm font-bold">{twin.behavioralHabits.progressesRegularly ? "Oui" : "Non"}</p>
              </div>
              <div className={`p-3 rounded-lg border ${twin.behavioralHabits.worksUnderPressure ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                <p className="text-xs font-medium mb-1">Travaille sous pression</p>
                <p className="text-sm font-bold">{twin.behavioralHabits.worksUnderPressure ? "Oui" : "Non"}</p>
              </div>
              <div className={`p-3 rounded-lg border ${twin.behavioralHabits.learnsQuickly ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                <p className="text-xs font-medium mb-1">Apprend vite</p>
                <p className="text-sm font-bold">{twin.behavioralHabits.learnsQuickly ? "Oui" : "Non"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirmed Beliefs */}
      {twin.confirmedBeliefs && twin.confirmedBeliefs.length > 0 && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-sm">
          <CardHeader className="border-b border-green-200">
            <CardTitle className="text-green-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Croyances confirmées
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {twin.confirmedBeliefs.map((belief, index) => (
                <div key={index} className="p-3 bg-white rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-900 mb-1">{belief.belief}</p>
                  <p className="text-xs text-green-800 mb-1">{belief.reason}</p>
                  {belief.observations.length > 0 && (
                    <p className="text-xs text-green-700">
                      Observations: {belief.observations.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Revised Beliefs */}
      {twin.revisedBeliefs && twin.revisedBeliefs.length > 0 && (
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 shadow-sm">
          <CardHeader className="border-b border-amber-200">
            <CardTitle className="text-amber-900 flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Croyances révisées
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {twin.revisedBeliefs.map((belief, index) => (
                <div key={index} className="p-3 bg-white rounded-lg border border-amber-200">
                  <p className="text-xs text-amber-600 mb-1">Ancienne croyance:</p>
                  <p className="text-sm text-amber-800 mb-1">{belief.oldBelief}</p>
                  <p className="text-xs text-amber-600 mb-1">Nouvelle croyance:</p>
                  <p className="text-sm font-medium text-amber-900 mb-1">{belief.newBelief}</p>
                  <p className="text-xs text-amber-800 mb-1">{belief.reason}</p>
                  {belief.observations.length > 0 && (
                    <p className="text-xs text-amber-700">
                      Observations: {belief.observations.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Certain Knowledge */}
      {twin.certainKnowledge && twin.certainKnowledge.length > 0 && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-sm">
          <CardHeader className="border-b border-green-200">
            <CardTitle className="text-green-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Ce que je sais avec certitude
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {twin.certainKnowledge.map((knowledge, index) => (
                <div key={index} className="p-3 bg-white rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-green-900">{knowledge.knowledge}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800`}>
                      {knowledge.confidence}%
                    </span>
                  </div>
                  {knowledge.evidence.length > 0 && (
                    <p className="text-xs text-green-700">
                      Preuves: {knowledge.evidence.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Probable Trends */}
      {twin.probableTrends && twin.probableTrends.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 shadow-sm">
          <CardHeader className="border-b border-blue-200">
            <CardTitle className="text-blue-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Ce que j'observe probablement
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {twin.probableTrends.map((trend, index) => (
                <div key={index} className="p-3 bg-white rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-blue-900">{trend.trend}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800`}>
                      {trend.confidence}%
                    </span>
                  </div>
                  {trend.evidence.length > 0 && (
                    <p className="text-xs text-blue-700">
                      Preuves: {trend.evidence.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* To Confirm */}
      {twin.toConfirm && twin.toConfirm.length > 0 && (
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 shadow-sm">
          <CardHeader className="border-b border-amber-200">
            <CardTitle className="text-amber-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Ce que je dois encore confirmer
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {twin.toConfirm.map((hypothesis, index) => (
                <div key={index} className="p-3 bg-white rounded-lg border border-amber-200">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-amber-900">{hypothesis.hypothesis}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800`}>
                      {hypothesis.confidence}%
                    </span>
                  </div>
                  {hypothesis.evidence.length > 0 && (
                    <p className="text-xs text-amber-700">
                      Preuves: {hypothesis.evidence.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Synchronization Status */}
      {twin.synchronizationStatus && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 shadow-sm">
          <CardHeader className="border-b border-purple-200">
            <CardTitle className="text-purple-900 flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Statut de synchronisation
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-purple-200">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-600" />
                  <p className="text-sm text-purple-600">Cohérence globale</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-lg font-bold ${twin.synchronizationStatus.globalCoherence >= 90 ? "bg-green-100 text-green-800" : twin.synchronizationStatus.globalCoherence >= 70 ? "bg-blue-100 text-blue-800" : twin.synchronizationStatus.globalCoherence >= 50 ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"}`}>
                  {twin.synchronizationStatus.globalCoherence}%
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-purple-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                  <p className="text-sm text-purple-600">Cohérent</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${twin.synchronizationStatus.isCoherent ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {twin.synchronizationStatus.isCoherent ? "Oui" : "Non"}
                </span>
              </div>
              <div className="p-4 bg-white rounded-lg border border-purple-200">
                <p className="text-sm font-medium text-purple-900 mb-2">Analyses cohérentes</p>
                <div className="space-y-1">
                  {twin.synchronizationStatus.coherentAnalyses.map((analysis, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-purple-800">{analysis}</p>
                    </div>
                  ))}
                </div>
              </div>
              {twin.synchronizationStatus.incoherentAnalyses && twin.synchronizationStatus.incoherentAnalyses.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-red-200">
                  <p className="text-sm font-medium text-red-900 mb-2">Analyses incohérentes</p>
                  <div className="space-y-1">
                    {twin.synchronizationStatus.incoherentAnalyses.map((analysis, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800">{analysis}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="p-4 bg-white rounded-lg border border-purple-200">
                <p className="text-sm font-medium text-purple-900 mb-1">Raison</p>
                <p className="text-sm text-purple-800">{twin.synchronizationStatus.reason}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Goal Status */}
      {twin.goalStatus && (
        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 shadow-sm">
          <CardHeader className="border-b border-blue-200">
            <CardTitle className="text-blue-900 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Statut des objectifs
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-900 mb-1">Objectif principal</p>
                <p className="text-sm text-blue-800">{twin.goalStatus.primaryGoal}</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-purple-600" />
                  <p className="text-sm font-medium text-purple-900">Objectif du moment</p>
                </div>
                <p className="text-sm text-purple-800">{twin.goalStatus.goalOfTheMoment}</p>
              </div>
              {twin.goalStatus.newGoals.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-900 mb-2">Nouveaux objectifs</p>
                  <div className="space-y-1">
                    {twin.goalStatus.newGoals.map((goal, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Plus className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-green-800">{goal}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {twin.goalStatus.completedGoals.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-teal-200">
                  <p className="text-sm font-medium text-teal-900 mb-2">Objectifs terminés</p>
                  <div className="space-y-1">
                    {twin.goalStatus.completedGoals.map((goal, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-teal-800">{goal}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {twin.goalStatus.mergedGoals.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-purple-200">
                  <p className="text-sm font-medium text-purple-900 mb-2">Objectifs fusionnés</p>
                  <div className="space-y-1">
                    {twin.goalStatus.mergedGoals.map((goal, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <RefreshCw className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-purple-800">{goal}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {twin.goalStatus.deletedGoals.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-red-200">
                  <p className="text-sm font-medium text-red-900 mb-2">Objectifs supprimés</p>
                  <div className="space-y-1">
                    {twin.goalStatus.deletedGoals.map((goal, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Trash2 className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800">{goal}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {twin.goalStatus.postponedGoals.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-amber-200">
                  <p className="text-sm font-medium text-amber-900 mb-2">Objectifs reportés</p>
                  <div className="space-y-1">
                    {twin.goalStatus.postponedGoals.map((goal, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800">{goal}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="p-4 bg-white rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-900 mb-1">Raison</p>
                <p className="text-sm text-blue-800">{twin.goalStatus.reason}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Market Context */}
      {twin.marketContext && (
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 shadow-sm">
          <CardHeader className="border-b border-emerald-200">
            <CardTitle className="text-emerald-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Contexte du Marché
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border border-emerald-200">
                <p className="text-sm font-medium text-emerald-900 mb-1">Compétitivité du profil</p>
                <p className="text-sm text-emerald-800">{twin.marketContext.profileCompetitiveness}</p>
              </div>
              {twin.marketContext.differentiatingSkills.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-900 mb-2">Compétences différenciantes</p>
                  <div className="space-y-1">
                    {twin.marketContext.differentiatingSkills.map((skill, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-green-800">{skill}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {twin.marketContext.lessDifferentiatingSkills.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-amber-200">
                  <p className="text-sm font-medium text-amber-900 mb-2">Compétences moins différenciantes</p>
                  <div className="space-y-1">
                    {twin.marketContext.lessDifferentiatingSkills.map((skill, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <TrendingDown className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800">{skill}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="p-4 bg-white rounded-lg border border-emerald-200">
                <p className="text-sm font-medium text-emerald-900 mb-1">Demande du marché</p>
                <p className="text-sm text-emerald-800">{twin.marketContext.marketDemand}</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-emerald-200">
                <p className="text-sm font-medium text-emerald-900 mb-1">Raison</p>
                <p className="text-sm text-emerald-800">{twin.marketContext.reason}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Outcome Insights */}
      {twin.outcomeInsights && (
        <Card className="bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200 shadow-sm">
          <CardHeader className="border-b border-violet-200">
            <CardTitle className="text-violet-900 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Insights sur les résultats
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border border-violet-200">
                <p className="text-sm font-medium text-violet-900 mb-2">Ce qui fonctionne le mieux pour toi</p>
                <div className="space-y-1">
                  {twin.outcomeInsights.whatWorksBest.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-violet-800">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-violet-200">
                <p className="text-sm font-medium text-violet-900 mb-2">Ce qui fonctionne le moins</p>
                <div className="space-y-1">
                  {twin.outcomeInsights.whatWorksLeast.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <TrendingDown className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-violet-800">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-violet-200">
                <p className="text-sm font-medium text-violet-900 mb-2">Patterns spécifiques à ton profil</p>
                <div className="space-y-1">
                  {twin.outcomeInsights.candidateSpecificPatterns.map((pattern, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-violet-800">{pattern}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-violet-200">
                <p className="text-sm font-medium text-violet-900 mb-2">ROI observé</p>
                <div className="space-y-2">
                  {twin.outcomeInsights.observedROI.map((roi, index) => (
                    <div key={index} className="p-2 bg-violet-50 rounded border border-violet-100">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-violet-900">{roi.action}</p>
                        <span className="text-xs text-violet-600">{roi.roi}</span>
                      </div>
                      <p className="text-xs text-violet-700">{roi.evidence}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-violet-200">
                <p className="text-sm font-medium text-violet-900 mb-2">Apprentissages récents</p>
                <div className="space-y-1">
                  {twin.outcomeInsights.recentLearnings.map((learning, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-violet-800">{learning}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-violet-200">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-violet-600" />
                  <p className="text-sm text-violet-600">Confiance dans les recommandations</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-lg font-bold ${twin.outcomeInsights.confidenceInRecommendations >= 90 ? "bg-green-100 text-green-800" : twin.outcomeInsights.confidenceInRecommendations >= 70 ? "bg-blue-100 text-blue-800" : twin.outcomeInsights.confidenceInRecommendations >= 50 ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"}`}>
                  {twin.outcomeInsights.confidenceInRecommendations}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Learning Profile */}
      {twin.learningProfile && (
        <Card className="bg-gradient-to-r from-cyan-50 to-sky-50 border-cyan-200 shadow-sm">
          <CardHeader className="border-b border-cyan-200">
            <CardTitle className="text-cyan-900 flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Comment tu apprends le mieux
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border border-cyan-200">
                <p className="text-sm font-medium text-cyan-900 mb-3">Caractéristiques d'apprentissage</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-cyan-600">Autonomie</p>
                    <p className="text-sm font-medium text-cyan-900 capitalize">{twin.learningProfile.autonomy.level}</p>
                    <p className="text-xs text-cyan-700">{twin.learningProfile.autonomy.confidence}% confiance</p>
                  </div>
                  <div>
                    <p className="text-xs text-cyan-600">Vitesse d'apprentissage</p>
                    <p className="text-sm font-medium text-cyan-900 capitalize">{twin.learningProfile.learningCharacteristics.learningSpeed.replace("_", " ")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-cyan-600">Vitesse d'exécution</p>
                    <p className="text-sm font-medium text-cyan-900 capitalize">{twin.learningProfile.learningCharacteristics.executionSpeed.replace("_", " ")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-cyan-600">Tolérance complexité</p>
                    <p className="text-sm font-medium text-cyan-900 capitalize">{twin.learningProfile.learningCharacteristics.complexityTolerance}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border border-cyan-200">
                <p className="text-sm font-medium text-cyan-900 mb-3">Préférences de guidage</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-cyan-600">Longueur explication</p>
                    <p className="text-sm font-medium text-cyan-900 capitalize">{twin.learningProfile.guidancePreference.explanationLength}</p>
                  </div>
                  <div>
                    <p className="text-xs text-cyan-600">Niveau détail</p>
                    <p className="text-sm font-medium text-cyan-900 capitalize">{twin.learningProfile.guidancePreference.detailLevel}</p>
                  </div>
                  <div>
                    <p className="text-xs text-cyan-600">Préférence exemples</p>
                    <p className="text-sm font-medium text-cyan-900 capitalize">{twin.learningProfile.guidancePreference.examplePreference}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border border-cyan-200">
                <p className="text-sm font-medium text-cyan-900 mb-3">Réactions</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-cyan-600">Réaction aux échecs</p>
                    <p className="text-sm font-medium text-cyan-900 capitalize">{twin.learningProfile.reactionPatterns.failureReaction}</p>
                  </div>
                  <div>
                    <p className="text-xs text-cyan-600">Réaction aux succès</p>
                    <p className="text-sm font-medium text-cyan-900 capitalize">{twin.learningProfile.reactionPatterns.successReaction}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border border-cyan-200">
                <p className="text-sm font-medium text-cyan-900 mb-3">Style de coaching optimal</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-cyan-600">Longueur réponse</p>
                    <p className="text-sm font-medium text-cyan-900 capitalize">{twin.learningProfile.optimalCoachingStyle.responseLength}</p>
                  </div>
                  <div>
                    <p className="text-xs text-cyan-600">Difficulté objectifs</p>
                    <p className="text-sm font-medium text-cyan-900 capitalize">{twin.learningProfile.optimalCoachingStyle.goalDifficulty.replace("_", " ")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-cyan-600">Niveau autonomie</p>
                    <p className="text-sm font-medium text-cyan-900 capitalize">{twin.learningProfile.optimalCoachingStyle.autonomyLevel}</p>
                  </div>
                  <div>
                    <p className="text-xs text-cyan-600">Vitesse progression</p>
                    <p className="text-sm font-medium text-cyan-900 capitalize">{twin.learningProfile.optimalCoachingStyle.progressionSpeed.replace("_", " ")}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border border-cyan-200">
                <p className="text-sm font-medium text-cyan-900 mb-2">Comment tu apprends le mieux</p>
                <div className="space-y-1">
                  {twin.learningProfile.howYouLearnBest.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-cyan-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-cyan-800">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resources */}
      {twin.resources && (
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 shadow-sm">
          <CardHeader className="border-b border-emerald-200">
            <CardTitle className="text-emerald-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Mes ressources
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border border-emerald-200">
                <p className="text-sm font-medium text-emerald-900 mb-3">Ressources disponibles</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-emerald-600">Temps</p>
                    <p className="text-sm font-medium text-emerald-900">{twin.resources.availableResources.time}</p>
                  </div>
                  <div>
                    <p className="text-xs text-emerald-600">Énergie</p>
                    <p className="text-sm font-medium text-emerald-900">{twin.resources.availableResources.energy}</p>
                  </div>
                  <div>
                    <p className="text-xs text-emerald-600">Budget</p>
                    <p className="text-sm font-medium text-emerald-900">{twin.resources.availableResources.budget}</p>
                  </div>
                  <div>
                    <p className="text-xs text-emerald-600">Réseau</p>
                    <p className="text-sm font-medium text-emerald-900">{twin.resources.availableResources.network}</p>
                  </div>
                </div>
                {twin.resources.availableResources.skills.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-emerald-600 mb-1">Compétences</p>
                    <div className="flex flex-wrap gap-1">
                      {twin.resources.availableResources.skills.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {twin.resources.resourceStrengths.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-900 mb-2">Forces de ressources</p>
                  <div className="space-y-1">
                    {twin.resources.resourceStrengths.map((strength, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-green-800">{strength}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {twin.resources.resourceWeaknesses.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-red-200">
                  <p className="text-sm font-medium text-red-900 mb-2">Faiblesses de ressources</p>
                  <div className="space-y-1">
                    {twin.resources.resourceWeaknesses.map((weakness, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <TrendingDown className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800">{weakness}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-white rounded-lg border border-emerald-200">
                  <p className="text-sm font-medium text-emerald-900 mb-1">Capacité actuelle</p>
                  <p className="text-sm text-emerald-800">{twin.resources.currentCapacity}</p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-emerald-200">
                  <p className="text-sm font-medium text-emerald-900 mb-1">Capacité future</p>
                  <p className="text-sm text-emerald-800">{twin.resources.futureCapacity}</p>
                </div>
              </div>

              {twin.resources.limitingFactors.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-orange-200">
                  <p className="text-sm font-medium text-orange-900 mb-2">Facteurs limitants</p>
                  <div className="space-y-1">
                    {twin.resources.limitingFactors.map((factor, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-orange-800">{factor}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {twin.resources.underutilizedResources.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-amber-200">
                  <p className="text-sm font-medium text-amber-900 mb-2">Ressources sous-utilisées</p>
                  <div className="space-y-1">
                    {twin.resources.underutilizedResources.map((resource, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800">{resource}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {twin.resources.overutilizedResources.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-red-200">
                  <p className="text-sm font-medium text-red-900 mb-2">Ressources sur-utilisées</p>
                  <div className="space-y-1">
                    {twin.resources.overutilizedResources.map((resource, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Zap className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800">{resource}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {twin.resources.resourceOptimizations.length > 0 && (
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-900 mb-2">Optimisations proposées</p>
                  <div className="space-y-1">
                    {twin.resources.resourceOptimizations.map((optimization, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-green-800">{optimization}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mission Progression */}
      {twin.missionProgression && (
        <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 shadow-sm">
          <CardHeader className="border-b border-purple-200">
            <CardTitle className="text-purple-900 flex items-center gap-2">
              <Compass className="w-5 h-5" />
              Comment tu progresses vers ta mission
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border border-purple-200">
                <p className="text-sm font-medium text-purple-900 mb-2">Mission actuelle</p>
                <p className="text-lg font-bold text-purple-900 mb-3">{twin.missionProgression.currentMission}</p>
                
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <p className="text-xs text-purple-600">Phase actuelle</p>
                    <p className="text-sm font-medium text-purple-900">{twin.missionProgression.currentPhase}</p>
                  </div>
                  <div>
                    <p className="text-xs text-purple-600">Temps restant</p>
                    <p className="text-sm font-medium text-purple-900">{twin.missionProgression.timeRemaining}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-purple-700">Progression globale</span>
                      <span className="text-xs font-medium text-purple-900">{twin.missionProgression.overallProgress}%</span>
                    </div>
                    <div className="w-full bg-purple-100 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${twin.missionProgression.overallProgress}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-purple-700">Progression phase</span>
                      <span className="text-xs font-medium text-purple-900">{twin.missionProgression.phaseProgress}%</span>
                    </div>
                    <div className="w-full bg-purple-100 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${twin.missionProgression.phaseProgress}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-lg border border-purple-200">
                  <p className="text-xs text-purple-600">Jalons atteints</p>
                  <p className="text-sm font-medium text-purple-900">{twin.missionProgression.milestonesAchieved} / {twin.missionProgression.milestonesTotal}</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-purple-200">
                  <p className="text-xs text-purple-600">Vitesse</p>
                  <p className="text-sm font-medium text-purple-900 capitalize">{twin.missionProgression.progressVelocity.replace("_", " ")}</p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border border-purple-200">
                <p className="text-sm font-medium text-purple-900 mb-2">Prochain jalon</p>
                <p className="text-sm text-purple-800">{twin.missionProgression.nextMilestone}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-lg border border-purple-200">
                  <p className="text-xs text-purple-600">Probabilité succès</p>
                  <p className="text-lg font-bold text-purple-900">{twin.missionProgression.successProbability}%</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-purple-200">
                  <p className="text-xs text-purple-600">À temps</p>
                  <p className="text-lg font-bold text-purple-900">{twin.missionProgression.onTimeProbability}%</p>
                </div>
              </div>

              {twin.missionProgression.topRisks.length > 0 && (
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm font-medium text-amber-900 mb-2">Principaux risques</p>
                  <div className="space-y-1">
                    {twin.missionProgression.topRisks.map((risk, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <AlertTriangle className="w-3 h-3 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-800">{risk}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {twin.missionProgression.keyAchievements.length > 0 && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-900 mb-2">Réalisations clés</p>
                  <div className="space-y-1">
                    {twin.missionProgression.keyAchievements.map((achievement, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-green-800">{achievement}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {twin.missionProgression.focusAreas.length > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-900 mb-2">Zones de focus</p>
                  <div className="space-y-1">
                    {twin.missionProgression.focusAreas.map((area, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Target className="w-3 h-3 text-blue-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-800">{area}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Evidence Knowledge */}
      {twin.evidenceKnowledge && (
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 shadow-sm">
          <CardHeader className="border-b border-amber-200">
            <CardTitle className="text-amber-900 flex items-center gap-2">
              <Database className="w-5 h-5" />
              Ce que je sais réellement de toi
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="p-3 bg-white rounded-lg border border-amber-200">
                  <p className="text-xs text-amber-600">Total preuves</p>
                  <p className="text-lg font-bold text-amber-900">{twin.evidenceKnowledge.evidenceCount}</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-amber-200">
                  <p className="text-xs text-amber-600">Fortes</p>
                  <p className="text-lg font-bold text-green-600">{twin.evidenceKnowledge.strongEvidence}</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-amber-200">
                  <p className="text-xs text-amber-600">Faibles</p>
                  <p className="text-lg font-bold text-red-600">{twin.evidenceKnowledge.weakEvidence}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 bg-white rounded-lg border border-amber-200">
                  <p className="text-xs text-amber-600">Qualité globale</p>
                  <p className="text-sm font-medium text-amber-900 capitalize">{twin.evidenceKnowledge.overallEvidenceQuality.replace("_", " ")}</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-amber-200">
                  <p className="text-xs text-amber-600">Confiance</p>
                  <p className="text-lg font-bold text-amber-900">{twin.evidenceKnowledge.overallConfidence}%</p>
                </div>
              </div>

              {twin.evidenceKnowledge.certitudes.length > 0 && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Certitudes
                  </p>
                  <div className="space-y-1">
                    {twin.evidenceKnowledge.certitudes.map((certitude: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-green-800">{certitude}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {twin.evidenceKnowledge.trends.length > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Tendances
                  </p>
                  <div className="space-y-1">
                    {twin.evidenceKnowledge.trends.map((trend: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <TrendingUp className="w-3 h-3 text-blue-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-800">{trend}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {twin.evidenceKnowledge.hypotheses.length > 0 && (
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm font-medium text-purple-900 mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Hypothèses
                  </p>
                  <div className="space-y-1">
                    {twin.evidenceKnowledge.hypotheses.map((hypothesis: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <Lightbulb className="w-3 h-3 text-purple-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-purple-800">{hypothesis}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {twin.evidenceKnowledge.toConfirm.length > 0 && (
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm font-medium text-amber-900 mb-2 flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    À confirmer
                  </p>
                  <div className="space-y-1">
                    {twin.evidenceKnowledge.toConfirm.map((item: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <Search className="w-3 h-3 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-800">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Constraint Influences */}
      {twin.constraintInfluences && (
        <Card className="bg-gradient-to-r from-rose-50 to-pink-50 border-rose-200 shadow-sm">
          <CardHeader className="border-b border-rose-200">
            <CardTitle className="text-rose-900 flex items-center gap-2">
              <LockIcon className="w-5 h-5" />
              Ce qui influence réellement tes décisions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {twin.constraintInfluences.activeConstraints.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-rose-200">
                  <p className="text-sm font-medium text-rose-900 mb-2 flex items-center gap-2">
                    <LockIcon className="w-4 h-4" />
                    Contraintes actives
                  </p>
                  <div className="space-y-1">
                    {twin.constraintInfluences.activeConstraints.map((constraint: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <LockIcon className="w-3 h-3 text-rose-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-rose-800">{constraint}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {twin.constraintInfluences.criticalConstraints.length > 0 && (
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm font-medium text-red-900 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Contraintes critiques
                  </p>
                  <div className="space-y-1">
                    {twin.constraintInfluences.criticalConstraints.map((constraint: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <AlertTriangle className="w-3 h-3 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-red-800">{constraint}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {twin.constraintInfluences.constraintImpactOnDecisions.length > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <Compass className="w-4 h-4" />
                    Impact sur tes décisions
                  </p>
                  <div className="space-y-1">
                    {twin.constraintInfluences.constraintImpactOnDecisions.map((impact: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <Compass className="w-3 h-3 text-blue-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-800">{impact}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {twin.constraintInfluences.constraintImpactOnStrategy.length > 0 && (
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm font-medium text-purple-900 mb-2 flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    Impact sur ta stratégie
                  </p>
                  <div className="space-y-1">
                    {twin.constraintInfluences.constraintImpactOnStrategy.map((impact: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <Brain className="w-3 h-3 text-purple-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-purple-800">{impact}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {twin.constraintInfluences.constraintImpactOnOpportunities.length > 0 && (
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm font-medium text-amber-900 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Impact sur les opportunités
                  </p>
                  <div className="space-y-1">
                    {twin.constraintInfluences.constraintImpactOnOpportunities.map((impact: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <Target className="w-3 h-3 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-800">{impact}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {twin.constraintInfluences.constraintImpactOnGoals.length > 0 && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-900 mb-2 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Impact sur tes objectifs
                  </p>
                  <div className="space-y-1">
                    {twin.constraintInfluences.constraintImpactOnGoals.map((impact: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <Award className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-green-800">{impact}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {twin.constraintInfluences.constraintEvolution.length > 0 && (
                <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                  <p className="text-sm font-medium text-cyan-900 mb-2 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Évolution des contraintes
                  </p>
                  <div className="space-y-1">
                    {twin.constraintInfluences.constraintEvolution.map((evolution: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <RefreshCw className="w-3 h-3 text-cyan-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-cyan-800">{evolution}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {twin.constraintInfluences.constraintRecommendations.length > 0 && (
                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                  <p className="text-sm font-medium text-indigo-900 mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Recommandations sur les contraintes
                  </p>
                  <div className="space-y-1">
                    {twin.constraintInfluences.constraintRecommendations.map((recommendation: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <Lightbulb className="w-3 h-3 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-indigo-800">{recommendation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Knowledge Evolution */}
      {twin.knowledgeEvolution && (
        <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200 shadow-sm">
          <CardHeader className="border-b border-cyan-200">
            <CardTitle className="text-cyan-900 flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Ce que je sais de moi-même
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {twin.knowledgeEvolution.certainKnowledge.length > 0 && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Ce que je sais avec certitude
                  </p>
                  <div className="space-y-2">
                    {twin.knowledgeEvolution.certainKnowledge.map((item, index) => (
                      <div key={index} className="p-2 bg-white rounded border border-green-200">
                        <p className="text-xs text-green-800 mb-1">{item.knowledge}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-green-600">Confiance: {item.confidence}%</span>
                          {item.evidence.length > 0 && (
                            <span className="text-xs text-green-500">{item.evidence.length} preuves</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {twin.knowledgeEvolution.strengthenedKnowledge.length > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Ce que je renforce
                  </p>
                  <div className="space-y-2">
                    {twin.knowledgeEvolution.strengthenedKnowledge.map((item, index) => (
                      <div key={index} className="p-2 bg-white rounded border border-blue-200">
                        <p className="text-xs text-blue-800 mb-1">{item.knowledge}</p>
                        <p className="text-xs text-blue-600">{item.reason}</p>
                        <span className="text-xs text-blue-500">Confiance: {item.confidence}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {twin.knowledgeEvolution.obsoleteKnowledge.length > 0 && (
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm font-medium text-red-900 mb-2 flex items-center gap-2">
                    <Archive className="w-4 h-4" />
                    Ce qui devient obsolète
                  </p>
                  <div className="space-y-2">
                    {twin.knowledgeEvolution.obsoleteKnowledge.map((item, index) => (
                      <div key={index} className="p-2 bg-white rounded border border-red-200">
                        <p className="text-xs text-red-800 mb-1">{item.knowledge}</p>
                        <p className="text-xs text-red-600">{item.reason}</p>
                        {item.replacedBy && (
                          <p className="text-xs text-red-500">Remplacé par: {item.replacedBy}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {twin.knowledgeEvolution.toConfirm.length > 0 && (
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm font-medium text-amber-900 mb-2 flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    Ce qui reste à confirmer
                  </p>
                  <div className="space-y-2">
                    {twin.knowledgeEvolution.toConfirm.map((item, index) => (
                      <div key={index} className="p-2 bg-white rounded border border-amber-200">
                        <p className="text-xs text-amber-800 mb-1">{item.knowledge}</p>
                        <p className="text-xs text-amber-600">{item.needsValidation}</p>
                        <span className="text-xs text-amber-500">Confiance: {item.confidence}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {twin.careerNarrativeContext && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 shadow-sm">
          <CardHeader className="border-b border-purple-200">
            <CardTitle className="text-purple-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Mon Histoire Professionnelle
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-purple-100 rounded-lg border border-purple-200">
                <p className="text-sm font-medium text-purple-900 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Identité professionnelle
                </p>
                <p className="text-sm text-purple-800 mb-1">{twin.careerNarrativeContext.careerIdentity.dominantIdentity}</p>
                <p className="text-xs text-purple-600">{twin.careerNarrativeContext.careerIdentity.selfDefinition}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-purple-500">Confiance: {twin.careerNarrativeContext.careerIdentity.confidence}%</span>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Histoire de carrière
                </p>
                <p className="text-sm text-blue-800 mb-1">{twin.careerNarrativeContext.careerStory.summary}</p>
                <p className="text-xs text-blue-600">{twin.careerNarrativeContext.careerStory.thread}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-blue-500">Confiance: {twin.careerNarrativeContext.careerStory.confidence}%</span>
                </div>
              </div>

              {twin.careerNarrativeContext.professionalThemes.length > 0 && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-900 mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Thèmes professionnels
                  </p>
                  <div className="space-y-2">
                    {twin.careerNarrativeContext.professionalThemes.map((theme, index) => (
                      <div key={index} className="p-2 bg-white rounded border border-green-200">
                        <p className="text-xs text-green-800 mb-1">{theme.theme}</p>
                        <p className="text-xs text-green-600">{theme.description}</p>
                        <span className="text-xs text-green-500">Confiance: {theme.confidence}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {twin.careerNarrativeContext.narrativeFingerprint && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Fingerprint className="w-4 h-4" />
                    Empreinte narrative
                  </p>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600">Hash: {twin.careerNarrativeContext.narrativeFingerprint.hash}</p>
                    <p className="text-xs text-gray-600">Stabilité: {twin.careerNarrativeContext.narrativeFingerprint.stability}</p>
                    <p className="text-xs text-gray-500">Modifié: {new Date(twin.careerNarrativeContext.narrativeFingerprint.lastModified).toLocaleDateString()}</p>
                  </div>
                </div>
              )}

              {twin.careerNarrativeContext.consistencyScore && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Score de cohérence
                  </p>
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-blue-800">{twin.careerNarrativeContext.consistencyScore.overall}/100</p>
                    <p className="text-xs text-blue-600">{twin.careerNarrativeContext.consistencyScore.explanation}</p>
                  </div>
                </div>
              )}

              {twin.careerNarrativeContext.narrativeEvolution && (
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm font-medium text-amber-900 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Évolution narrative
                  </p>
                  <div className="space-y-2">
                    {twin.careerNarrativeContext.narrativeEvolution.identityEvolution && (
                      <div className="p-2 bg-white rounded border border-amber-200">
                        <p className="text-xs font-medium text-amber-800 mb-1">Identité</p>
                        <p className="text-xs text-amber-600">{twin.careerNarrativeContext.narrativeEvolution.identityEvolution.changeExplanation}</p>
                      </div>
                    )}
                    {twin.careerNarrativeContext.narrativeEvolution.strengthsEvolution && (
                      <div className="p-2 bg-white rounded border border-amber-200">
                        <p className="text-xs font-medium text-amber-800 mb-1">Forces</p>
                        <p className="text-xs text-amber-600">{twin.careerNarrativeContext.narrativeEvolution.strengthsEvolution.evolutionExplanation}</p>
                      </div>
                    )}
                    {twin.careerNarrativeContext.narrativeEvolution.motivationsEvolution && (
                      <div className="p-2 bg-white rounded border border-amber-200">
                        <p className="text-xs font-medium text-amber-800 mb-1">Motivations</p>
                        <p className="text-xs text-amber-600">{twin.careerNarrativeContext.narrativeEvolution.motivationsEvolution.evolutionExplanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {twin.careerNarrativeContext.narrativeEvidence && (
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm font-medium text-purple-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Preuves narratives
                  </p>
                  <div className="space-y-2">
                    {twin.careerNarrativeContext.narrativeEvidence.careerIdentityEvidence && (
                      <div className="p-2 bg-white rounded border border-purple-200">
                        <p className="text-xs font-medium text-purple-800 mb-1">Identité</p>
                        <div className="space-y-1">
                          {twin.careerNarrativeContext.narrativeEvidence.careerIdentityEvidence.experiences.length > 0 && (
                            <p className="text-xs text-purple-600">Expériences: {twin.careerNarrativeContext.narrativeEvidence.careerIdentityEvidence.experiences.length}</p>
                          )}
                          {twin.careerNarrativeContext.narrativeEvidence.careerIdentityEvidence.skills.length > 0 && (
                            <p className="text-xs text-purple-600">Compétences: {twin.careerNarrativeContext.narrativeEvidence.careerIdentityEvidence.skills.length}</p>
                          )}
                          {twin.careerNarrativeContext.narrativeEvidence.careerIdentityEvidence.achievements.length > 0 && (
                            <p className="text-xs text-purple-600">Réalisations: {twin.careerNarrativeContext.narrativeEvidence.careerIdentityEvidence.achievements.length}</p>
                          )}
                        </div>
                      </div>
                    )}
                    {twin.careerNarrativeContext.narrativeEvidence.careerStoryEvidence && (
                      <div className="p-2 bg-white rounded border border-purple-200">
                        <p className="text-xs font-medium text-purple-800 mb-1">Histoire</p>
                        <div className="space-y-1">
                          {twin.careerNarrativeContext.narrativeEvidence.careerStoryEvidence.experiences.length > 0 && (
                            <p className="text-xs text-purple-600">Expériences: {twin.careerNarrativeContext.narrativeEvidence.careerStoryEvidence.experiences.length}</p>
                          )}
                          {twin.careerNarrativeContext.narrativeEvidence.careerStoryEvidence.transitions.length > 0 && (
                            <p className="text-xs text-purple-600">Transitions: {twin.careerNarrativeContext.narrativeEvidence.careerStoryEvidence.transitions.length}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {twin.reflectionContext && (
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 shadow-sm">
          <CardHeader className="border-b border-indigo-200">
            <CardTitle className="text-indigo-900 flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Contexte de Réflexion
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border border-indigo-200">
                <p className="text-sm font-medium text-indigo-900 mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Synthèse de réflexion
                </p>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-indigo-800">{twin.reflectionContext.reflectionSummary.overallReflectionQuality}%</p>
                  <p className="text-xs text-indigo-600">Dernière réflexion: {new Date(twin.reflectionContext.reflectionSummary.reflectionTimestamp).toLocaleDateString()}</p>
                </div>
              </div>

              {twin.reflectionContext.validatedRecommendations.length > 0 && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Recommandations validées
                  </p>
                  <div className="space-y-1">
                    {twin.reflectionContext.validatedRecommendations.map((rec, index) => (
                      <p key={index} className="text-xs text-green-600">• {rec}</p>
                    ))}
                  </div>
                </div>
              )}

              {twin.reflectionContext.alternativeOptions.length > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <GitBranch className="w-4 h-4" />
                    Alternatives proposées
                  </p>
                  <div className="space-y-1">
                    {twin.reflectionContext.alternativeOptions.map((alt, index) => (
                      <p key={index} className="text-xs text-blue-600">• {alt}</p>
                    ))}
                  </div>
                </div>
              )}

              {twin.reflectionContext.blindSpots.length > 0 && (
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm font-medium text-red-900 mb-2 flex items-center gap-2">
                    <Radar className="w-4 h-4" />
                    Angles morts détectés
                  </p>
                  <div className="space-y-1">
                    {twin.reflectionContext.blindSpots.map((spot, index) => (
                      <p key={index} className="text-xs text-red-600">• {spot}</p>
                    ))}
                  </div>
                </div>
              )}

              {twin.reflectionContext.assumptions.length > 0 && (
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm font-medium text-amber-900 mb-2 flex items-center gap-2">
                    <AlertOctagon className="w-4 h-4" />
                    Hypothèses détectées
                  </p>
                  <div className="space-y-1">
                    {twin.reflectionContext.assumptions.map((assumption, index) => (
                      <p key={index} className="text-xs text-amber-600">• {assumption}</p>
                    ))}
                  </div>
                </div>
              )}

              {twin.reflectionContext.contradictionsDetected.length > 0 && (
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm font-medium text-purple-900 mb-2 flex items-center gap-2">
                    <AlertOctagon className="w-4 h-4" />
                    Contradictions identifiées
                  </p>
                  <div className="space-y-1">
                    {twin.reflectionContext.contradictionsDetected.map((contradiction, index) => (
                      <p key={index} className="text-xs text-purple-600">• {contradiction}</p>
                    ))}
                  </div>
                </div>
              )}

              {twin.reflectionContext.evidenceReview && (
                <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                  <p className="text-sm font-medium text-teal-900 mb-2 flex items-center gap-2">
                    <Scale className="w-4 h-4" />
                    Revue des preuves
                  </p>
                  <div className="space-y-1">
                    <p className="text-xs text-teal-600">Qualité globale: {twin.reflectionContext.evidenceReview.overallEvidenceQuality}%</p>
                    {twin.reflectionContext.evidenceReview.conclusionsNeedingStrengthening.length > 0 && (
                      <p className="text-xs text-teal-600">À renforcer: {twin.reflectionContext.evidenceReview.conclusionsNeedingStrengthening.length}</p>
                    )}
                  </div>
                </div>
              )}

              {twin.reflectionContext.confidenceCalibration && (
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-sm font-medium text-slate-900 mb-2 flex items-center gap-2">
                    <Scale className="w-4 h-4" />
                    Recalibrage de confiance
                  </p>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-600">Confiance globale: {twin.reflectionContext.confidenceCalibration.overallConfidence}%</p>
                    {twin.reflectionContext.confidenceCalibration.calibrations.length > 0 && (
                      <div className="space-y-1">
                        {twin.reflectionContext.confidenceCalibration.calibrations.map((cal, index) => (
                          <p key={index} className="text-xs text-slate-600">• {cal.recommendation}: {cal.originalConfidence}% → {cal.calibratedConfidence}%</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {twin.planningContext && (
        <Card className="bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200 shadow-sm">
          <CardHeader className="border-b border-teal-200">
            <CardTitle className="text-teal-900 flex items-center gap-2">
              <Route className="w-5 h-5" />
              Contexte de Planification
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border border-teal-200">
                <p className="text-sm font-medium text-teal-900 mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Confiance du plan
                </p>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-teal-800">{twin.planningContext.planningConfidence.overallConfidence}%</p>
                  <p className="text-xs text-teal-600">Écarts identifiés: {twin.planningContext.gapAnalysis.gaps.length}</p>
                  <p className="text-xs text-teal-600">Jalons: {twin.planningContext.milestones.length}</p>
                </div>
              </div>

              {twin.planningContext.currentPosition && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Position actuelle
                  </p>
                  <div className="space-y-1">
                    <p className="text-xs text-blue-600">Rôle: {twin.planningContext.currentPosition.role}</p>
                    <p className="text-xs text-blue-600">Expérience: {twin.planningContext.currentPosition.experience}</p>
                    <p className="text-xs text-blue-600">Compétences: {twin.planningContext.currentPosition.skills.length}</p>
                  </div>
                </div>
              )}

              {twin.planningContext.targetPosition && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-900 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Position cible
                  </p>
                  <div className="space-y-1">
                    <p className="text-xs text-green-600">Rôle: {twin.planningContext.targetPosition.role}</p>
                    <p className="text-xs text-green-600">Expérience requise: {twin.planningContext.targetPosition.requiredExperience}</p>
                    <p className="text-xs text-green-600">Compétences requises: {twin.planningContext.targetPosition.requiredSkills.length}</p>
                  </div>
                </div>
              )}

              {twin.planningContext.gapAnalysis.gaps.length > 0 && (
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm font-medium text-red-900 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Écarts identifiés
                  </p>
                  <div className="space-y-1">
                    {twin.planningContext.gapAnalysis.gaps.map((gap, index) => (
                      <p key={index} className="text-xs text-red-600">• {gap.category}: {gap.gapSize} ({gap.priority})</p>
                    ))}
                  </div>
                </div>
              )}

              {twin.planningContext.milestones.length > 0 && (
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm font-medium text-purple-900 mb-2 flex items-center gap-2">
                    <Flag className="w-4 h-4" />
                    Jalons
                  </p>
                  <div className="space-y-1">
                    {twin.planningContext.milestones.map((milestone, index) => (
                      <p key={index} className="text-xs text-purple-600">• {milestone.objective} ({milestone.estimatedCompletion})</p>
                    ))}
                  </div>
                </div>
              )}

              {twin.planningContext.priorities.length > 0 && (
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm font-medium text-orange-900 mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Priorités
                  </p>
                  <div className="space-y-1">
                    {twin.planningContext.priorities.map((priority, index) => (
                      <p key={index} className="text-xs text-orange-600">• {priority.action} ({priority.priority})</p>
                    ))}
                  </div>
                </div>
              )}

              {twin.planningContext.dependencies.length > 0 && (
                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                  <p className="text-sm font-medium text-indigo-900 mb-2 flex items-center gap-2">
                    <GitBranch className="w-4 h-4" />
                    Dépendances
                  </p>
                  <div className="space-y-1">
                    {twin.planningContext.dependencies.map((dep, index) => (
                      <p key={index} className="text-xs text-indigo-600">• {dep.sourceAction} → {dep.dependentAction}</p>
                    ))}
                  </div>
                </div>
              )}

              {twin.planningContext.riskAnalysis.risks.length > 0 && (
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm font-medium text-amber-900 mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Risques
                  </p>
                  <div className="space-y-1">
                    {twin.planningContext.riskAnalysis.risks.map((risk, index) => (
                      <p key={index} className="text-xs text-amber-600">• {risk.description} ({risk.probability}, {risk.impact})</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
