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

export interface DigitalTwinProps {
  twin: DigitalTwin;
}
