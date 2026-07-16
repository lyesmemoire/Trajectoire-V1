import { CandidateProfile } from "../intelligence/types";
import { JobOfferGraph } from "../intelligence/profile/JobOfferGraph";
import { MatchingCoreOutput } from "../intelligence/engines/careerCopilotMatchingIntelligenceEngine";
import { TransferableSkillsOutput } from "../intelligence/engines/careerCopilotTransferableSkillsIntelligenceEngine";
import { GapIntelligenceOutput } from "../intelligence/engines/careerCopilotGapIntelligenceEngine";
import { InterviewPreparationContext } from "../intelligence/engines/careerCopilotInterviewPreparationEngine";
import { VoiceInterviewContext } from "../intelligence/engines/careerCopilotVoiceInterviewEngine";
import { VoiceSessionContext } from "../intelligence/session/VoiceSessionManager";
import { LiveAnswerAnalysisContext } from "../intelligence/engines/careerCopilotLiveInterviewAnalysisEngine";
import { LiveCoachingContext } from "../intelligence/engines/careerCopilotLiveCoachingIntelligenceEngine";
import { FinalInterviewReportContext } from "../intelligence/engines/careerCopilotFinalInterviewReportEngine";

/**
 * Application Orchestrator
 * 
 * Responsibilities:
 * - Orchestrate all existing intelligences in the correct order
 * - Trigger engines, wait for results, transmit contexts
 * - Publish events, manage errors, handle transitions
 * - NO new intelligence, NO new reasoning, NO new scores, NO new analysis
 * - ONLY orchestration of existing intelligences
 */

// Pipeline States
export type PipelineStage =
  | "Idle"
  | "CVUploaded"
  | "CandidateProfileCreated"
  | "JobOfferUploaded"
  | "JobOfferGraphCreated"
  | "MatchingCompleted"
  | "TransferableSkillsCompleted"
  | "GapAnalysisCompleted"
  | "InterviewPreparationCompleted"
  | "VoiceSessionCreated"
  | "VoiceInterviewStarted"
  | "LiveAnalysisInProgress"
  | "LiveCoachingInProgress"
  | "VoiceInterviewCompleted"
  | "FinalReportGenerated"
  | "Error"
  | "Cancelled";

export interface PipelineState {
  currentStage: PipelineStage;
  previousStage: PipelineStage;
  startedAt: string;
  completedAt: string | null;
  error: string | null;
  cancelled: boolean;
}

// Pipeline Context
export interface PipelineContext {
  candidateProfile: CandidateProfile | null;
  candidateGraph: Record<string, unknown> | null;
  jobOfferGraph: JobOfferGraph | null;
  matchingCoreContext: MatchingCoreOutput | null;
  transferableSkillsContext: TransferableSkillsOutput | null;
  gapContext: GapIntelligenceOutput | null;
  interviewPreparationContext: InterviewPreparationContext | null;
  voiceSessionContext: VoiceSessionContext | null;
  voiceInterviewContext: VoiceInterviewContext | null;
  liveAnswerAnalysisContext: LiveAnswerAnalysisContext | null;
  liveCoachingContext: LiveCoachingContext | null;
  finalInterviewReportContext: FinalInterviewReportContext | null;
}

// Pipeline Events
export type PipelineEventType =
  | "PipelineStarted"
  | "CVUploaded"
  | "CandidateProfileCreated"
  | "JobOfferUploaded"
  | "JobOfferGraphCreated"
  | "MatchingCompleted"
  | "TransferableSkillsCompleted"
  | "GapAnalysisCompleted"
  | "InterviewPreparationCompleted"
  | "VoiceSessionCreated"
  | "VoiceInterviewStarted"
  | "LiveAnalysisStarted"
  | "LiveAnalysisCompleted"
  | "LiveCoachingStarted"
  | "LiveCoachingCompleted"
  | "VoiceInterviewCompleted"
  | "FinalReportGenerated"
  | "PipelineCompleted"
  | "PipelineError"
  | "PipelineCancelled";

export interface PipelineEvent {
  id: string;
  type: PipelineEventType;
  timestamp: string;
  stage: PipelineStage;
  data: Record<string, unknown>;
  metadata: {
    pipelineId: string;
    userId?: string;
    sessionId?: string;
  };
}

// Execution Order
export interface ExecutionStep {
  id: string;
  name: string;
  order: number;
  dependencies: string[];
  engine: string;
  inputContext: string[];
  outputContext: string;
  required: boolean;
}

export const EXECUTION_ORDER: ExecutionStep[] = [
  {
    id: "upload_cv",
    name: "Upload CV",
    order: 1,
    dependencies: [],
    engine: "CandidateProfileIntelligence",
    inputContext: [],
    outputContext: "candidateProfile",
    required: true
  },
  {
    id: "create_candidate_graph",
    name: "Create CandidateGraph",
    order: 2,
    dependencies: ["upload_cv"],
    engine: "CandidateProfileIntelligence",
    inputContext: ["candidateProfile"],
    outputContext: "candidateGraph",
    required: true
  },
  {
    id: "upload_job_offer",
    name: "Upload Job Offer",
    order: 3,
    dependencies: [],
    engine: "JobOfferIntelligence",
    inputContext: [],
    outputContext: "jobOfferGraph",
    required: true
  },
  {
    id: "matching_core",
    name: "Matching Core",
    order: 4,
    dependencies: ["create_candidate_graph", "upload_job_offer"],
    engine: "MatchingIntelligence",
    inputContext: ["candidateGraph", "jobOfferGraph"],
    outputContext: "matchingCoreContext",
    required: true
  },
  {
    id: "transferable_skills",
    name: "Transferable Skills",
    order: 5,
    dependencies: ["matching_core"],
    engine: "TransferableSkillsIntelligence",
    inputContext: ["matchingCoreContext"],
    outputContext: "transferableSkillsContext",
    required: true
  },
  {
    id: "gap_analysis",
    name: "Gap Analysis",
    order: 6,
    dependencies: ["matching_core", "transferable_skills"],
    engine: "GapIntelligence",
    inputContext: ["matchingCoreContext", "transferableSkillsContext"],
    outputContext: "gapContext",
    required: true
  },
  {
    id: "interview_preparation",
    name: "Interview Preparation",
    order: 7,
    dependencies: ["gap_analysis"],
    engine: "InterviewPreparationIntelligence",
    inputContext: ["candidateGraph", "jobOfferGraph", "matchingCoreContext", "transferableSkillsContext", "gapContext"],
    outputContext: "interviewPreparationContext",
    required: true
  },
  {
    id: "voice_session_create",
    name: "Create Voice Session",
    order: 8,
    dependencies: ["interview_preparation"],
    engine: "VoiceSessionManager",
    inputContext: ["candidateProfile", "jobOfferGraph", "interviewPreparationContext"],
    outputContext: "voiceSessionContext",
    required: true
  },
  {
    id: "voice_interview_start",
    name: "Start Voice Interview",
    order: 9,
    dependencies: ["voice_session_create"],
    engine: "VoiceInterviewEngine",
    inputContext: ["interviewPreparationContext", "voiceSessionContext"],
    outputContext: "voiceInterviewContext",
    required: true
  },
  {
    id: "live_analysis",
    name: "Live Analysis",
    order: 10,
    dependencies: ["voice_interview_start"],
    engine: "LiveInterviewAnalysisEngine",
    inputContext: ["candidateGraph", "jobOfferGraph", "matchingCoreContext", "transferableSkillsContext", "gapContext", "interviewPreparationContext", "voiceInterviewContext", "voiceSessionContext"],
    outputContext: "liveAnswerAnalysisContext",
    required: false // Optional per response
  },
  {
    id: "live_coaching",
    name: "Live Coaching",
    order: 11,
    dependencies: ["live_analysis"],
    engine: "LiveCoachingIntelligenceEngine",
    inputContext: ["candidateGraph", "jobOfferGraph", "matchingCoreContext", "transferableSkillsContext", "gapContext", "interviewPreparationContext", "voiceInterviewContext", "voiceSessionContext", "liveAnswerAnalysisContext"],
    outputContext: "liveCoachingContext",
    required: false // Optional per response
  },
  {
    id: "final_report",
    name: "Final Interview Report",
    order: 12,
    dependencies: ["voice_interview_start"],
    engine: "FinalInterviewReportEngine",
    inputContext: ["candidateGraph", "jobOfferGraph", "matchingCoreContext", "transferableSkillsContext", "gapContext", "interviewPreparationContext", "voiceInterviewContext", "voiceSessionContext", "liveAnswerAnalysisContext", "liveCoachingContext"],
    outputContext: "finalInterviewReportContext",
    required: true
  }
];

// Transition Rules
export interface TransitionRule {
  from: PipelineStage;
  to: PipelineStage;
  condition: string;
  requiredContext: string[];
}

export const TRANSITION_RULES: TransitionRule[] = [
  { from: "Idle", to: "CVUploaded", condition: "CV uploaded", requiredContext: [] },
  { from: "CVUploaded", to: "CandidateProfileCreated", condition: "Candidate profile created", requiredContext: ["candidateProfile"] },
  { from: "CandidateProfileCreated", to: "JobOfferUploaded", condition: "Job offer upload required", requiredContext: [] },
  { from: "JobOfferUploaded", to: "JobOfferGraphCreated", condition: "Job offer graph created", requiredContext: ["jobOfferGraph"] },
  { from: "JobOfferGraphCreated", to: "MatchingCompleted", condition: "Matching completed", requiredContext: ["matchingCoreContext"] },
  { from: "MatchingCompleted", to: "TransferableSkillsCompleted", condition: "Transferable skills completed", requiredContext: ["transferableSkillsContext"] },
  { from: "TransferableSkillsCompleted", to: "GapAnalysisCompleted", condition: "Gap analysis completed", requiredContext: ["gapContext"] },
  { from: "GapAnalysisCompleted", to: "InterviewPreparationCompleted", condition: "Interview preparation completed", requiredContext: ["interviewPreparationContext"] },
  { from: "InterviewPreparationCompleted", to: "VoiceSessionCreated", condition: "Voice session created", requiredContext: ["voiceSessionContext"] },
  { from: "VoiceSessionCreated", to: "VoiceInterviewStarted", condition: "Voice interview started", requiredContext: ["voiceInterviewContext"] },
  { from: "VoiceInterviewStarted", to: "LiveAnalysisInProgress", condition: "Response received", requiredContext: [] },
  { from: "LiveAnalysisInProgress", to: "LiveCoachingInProgress", condition: "Analysis completed", requiredContext: ["liveAnswerAnalysisContext"] },
  { from: "LiveCoachingInProgress", to: "VoiceInterviewStarted", condition: "Coaching delivered", requiredContext: ["liveCoachingContext"] },
  { from: "VoiceInterviewStarted", to: "VoiceInterviewCompleted", condition: "Interview finished", requiredContext: [] },
  { from: "VoiceInterviewCompleted", to: "FinalReportGenerated", condition: "Final report generated", requiredContext: ["finalInterviewReportContext"] },
  { from: "FinalReportGenerated", to: "Idle", condition: "Pipeline completed", requiredContext: [] },
  { from: "Error", to: "Idle", condition: "Error recovered", requiredContext: [] },
  { from: "Cancelled", to: "Idle", condition: "Pipeline cancelled", requiredContext: [] }
];

// Application Orchestrator
export class ApplicationOrchestrator {
  private static pipelineState: PipelineState = {
    currentStage: "Idle",
    previousStage: "Idle",
    startedAt: new Date(0).toISOString(),
    completedAt: null,
    error: null,
    cancelled: false
  };

  private static pipelineContext: PipelineContext = {
    candidateProfile: null,
    candidateGraph: null,
    jobOfferGraph: null,
    matchingCoreContext: null,
    transferableSkillsContext: null,
    gapContext: null,
    interviewPreparationContext: null,
    voiceSessionContext: null,
    voiceInterviewContext: null,
    liveAnswerAnalysisContext: null,
    liveCoachingContext: null,
    finalInterviewReportContext: null
  };

  private static events: PipelineEvent[] = [];
  private static eventListeners: Map<string, ((event: PipelineEvent) => void)[]> = new Map();

  /**
   * Start pipeline
   */
  static startPipeline(pipelineId: string, userId?: string): void {
    this.pipelineState = {
      currentStage: "Idle",
      previousStage: "Idle",
      startedAt: new Date(0).toISOString(),
      completedAt: null,
      error: null,
      cancelled: false
    };

    this.pipelineContext = {
      candidateProfile: null,
      candidateGraph: null,
      jobOfferGraph: null,
      matchingCoreContext: null,
      transferableSkillsContext: null,
      gapContext: null,
      interviewPreparationContext: null,
      voiceSessionContext: null,
      voiceInterviewContext: null,
      liveAnswerAnalysisContext: null,
      liveCoachingContext: null,
      finalInterviewReportContext: null
    };

    this.events = [];

    this.publishEvent({
      id: `event_${Date.now()}`,
      type: "PipelineStarted",
      timestamp: new Date(0).toISOString(),
      stage: "Idle",
      data: { pipelineId },
      metadata: { pipelineId, userId }
    });
  }

  /**
   * Upload CV
   */
  static uploadCV(candidateProfile: CandidateProfile, candidateGraph: Record<string, unknown>): void {
    this.pipelineContext.candidateProfile = candidateProfile;
    this.pipelineContext.candidateGraph = candidateGraph;

    this.transitionTo("CandidateProfileCreated");

    this.publishEvent({
      id: `event_${Date.now()}`,
      type: "CVUploaded",
      timestamp: new Date(0).toISOString(),
      stage: "CandidateProfileCreated",
      data: { candidateProfileId: candidateProfile.identity.id },
      metadata: { pipelineId: this.getPipelineId() }
    });

    this.publishEvent({
      id: `event_${Date.now()}`,
      type: "CandidateProfileCreated",
      timestamp: new Date(0).toISOString(),
      stage: "CandidateProfileCreated",
      data: { candidateGraphId: candidateGraph.id },
      metadata: { pipelineId: this.getPipelineId() }
    });
  }

  /**
   * Upload Job Offer
   */
  static uploadJobOffer(jobOfferGraph: JobOfferGraph): void {
    this.pipelineContext.jobOfferGraph = jobOfferGraph;

    this.transitionTo("JobOfferGraphCreated");

    this.publishEvent({
      id: `event_${Date.now()}`,
      type: "JobOfferUploaded",
      timestamp: new Date(0).toISOString(),
      stage: "JobOfferGraphCreated",
      data: { jobOfferId: jobOfferGraph.id },
      metadata: { pipelineId: this.getPipelineId() }
    });

    this.publishEvent({
      id: `event_${Date.now()}`,
      type: "JobOfferGraphCreated",
      timestamp: new Date(0).toISOString(),
      stage: "JobOfferGraphCreated",
      data: { jobOfferGraphId: jobOfferGraph.id },
      metadata: { pipelineId: this.getPipelineId() }
    });
  }

  /**
   * Complete Matching
   */
  static completeMatching(matchingCoreContext: MatchingCoreOutput): void {
    this.pipelineContext.matchingCoreContext = matchingCoreContext;

    this.transitionTo("MatchingCompleted");

    this.publishEvent({
      id: `event_${Date.now()}`,
      type: "MatchingCompleted",
      timestamp: new Date(0).toISOString(),
      stage: "MatchingCompleted",
      data: { matchingCoreId: matchingCoreContext.metadata.comparedAt },
      metadata: { pipelineId: this.getPipelineId() }
    });
  }

  /**
   * Complete Transferable Skills
   */
  static completeTransferableSkills(transferableSkillsContext: TransferableSkillsOutput): void {
    this.pipelineContext.transferableSkillsContext = transferableSkillsContext;

    this.transitionTo("TransferableSkillsCompleted");

    this.publishEvent({
      id: `event_${Date.now()}`,
      type: "TransferableSkillsCompleted",
      timestamp: new Date(0).toISOString(),
      stage: "TransferableSkillsCompleted",
      data: { transferableSkillsId: transferableSkillsContext.metadata.analyzedAt },
      metadata: { pipelineId: this.getPipelineId() }
    });
  }

  /**
   * Complete Gap Analysis
   */
  static completeGapAnalysis(gapContext: GapIntelligenceOutput): void {
    this.pipelineContext.gapContext = gapContext;

    this.transitionTo("GapAnalysisCompleted");

    this.publishEvent({
      id: `event_${Date.now()}`,
      type: "GapAnalysisCompleted",
      timestamp: new Date(0).toISOString(),
      stage: "GapAnalysisCompleted",
      data: { gapAnalysisId: gapContext.metadata.analyzedAt },
      metadata: { pipelineId: this.getPipelineId() }
    });
  }

  /**
   * Complete Interview Preparation
   */
  static completeInterviewPreparation(interviewPreparationContext: InterviewPreparationContext): void {
    this.pipelineContext.interviewPreparationContext = interviewPreparationContext;

    this.transitionTo("InterviewPreparationCompleted");

    this.publishEvent({
      id: `event_${Date.now()}`,
      type: "InterviewPreparationCompleted",
      timestamp: new Date(0).toISOString(),
      stage: "InterviewPreparationCompleted",
      data: { interviewPreparationId: interviewPreparationContext.metadata.preparedAt },
      metadata: { pipelineId: this.getPipelineId() }
    });
  }

  /**
   * Create Voice Session
   */
  static createVoiceSession(voiceSessionContext: VoiceSessionContext): void {
    this.pipelineContext.voiceSessionContext = voiceSessionContext;

    this.transitionTo("VoiceSessionCreated");

    this.publishEvent({
      id: `event_${Date.now()}`,
      type: "VoiceSessionCreated",
      timestamp: new Date(0).toISOString(),
      stage: "VoiceSessionCreated",
      data: { sessionId: voiceSessionContext.sessionId },
      metadata: { pipelineId: this.getPipelineId(), sessionId: voiceSessionContext.sessionId }
    });
  }

  /**
   * Start Voice Interview
   */
  static startVoiceInterview(voiceInterviewContext: VoiceInterviewContext): void {
    this.pipelineContext.voiceInterviewContext = voiceInterviewContext;

    this.transitionTo("VoiceInterviewStarted");

    this.publishEvent({
      id: `event_${Date.now()}`,
      type: "VoiceInterviewStarted",
      timestamp: new Date(0).toISOString(),
      stage: "VoiceInterviewStarted",
      data: { interviewId: voiceInterviewContext.interviewSession.id },
      metadata: { pipelineId: this.getPipelineId(), sessionId: voiceInterviewContext.interviewSession.id }
    });
  }

  /**
   * Start Live Analysis
   */
  static startLiveAnalysis(liveAnswerAnalysisContext: LiveAnswerAnalysisContext): void {
    this.pipelineContext.liveAnswerAnalysisContext = liveAnswerAnalysisContext;

    this.transitionTo("LiveAnalysisInProgress");

    this.publishEvent({
      id: `event_${Date.now()}`,
      type: "LiveAnalysisStarted",
      timestamp: new Date(0).toISOString(),
      stage: "LiveAnalysisInProgress",
      data: { analysisId: liveAnswerAnalysisContext.analysisMetadata.analyzedAt },
      metadata: { pipelineId: this.getPipelineId() }
    });

    this.publishEvent({
      id: `event_${Date.now()}`,
      type: "LiveAnalysisCompleted",
      timestamp: new Date(0).toISOString(),
      stage: "LiveAnalysisInProgress",
      data: { analysisId: liveAnswerAnalysisContext.analysisMetadata.analyzedAt },
      metadata: { pipelineId: this.getPipelineId() }
    });
  }

  /**
   * Start Live Coaching
   */
  static startLiveCoaching(liveCoachingContext: LiveCoachingContext): void {
    this.pipelineContext.liveCoachingContext = liveCoachingContext;

    this.transitionTo("LiveCoachingInProgress");

    this.publishEvent({
      id: `event_${Date.now()}`,
      type: "LiveCoachingStarted",
      timestamp: new Date(0).toISOString(),
      stage: "LiveCoachingInProgress",
      data: { coachingId: liveCoachingContext.metadata.coachingGeneratedAt },
      metadata: { pipelineId: this.getPipelineId() }
    });

    this.publishEvent({
      id: `event_${Date.now()}`,
      type: "LiveCoachingCompleted",
      timestamp: new Date(0).toISOString(),
      stage: "LiveCoachingInProgress",
      data: { coachingId: liveCoachingContext.metadata.coachingGeneratedAt },
      metadata: { pipelineId: this.getPipelineId() }
    });
  }

  /**
   * Complete Voice Interview
   */
  static completeVoiceInterview(): void {
    this.transitionTo("VoiceInterviewCompleted");

    this.publishEvent({
      id: `event_${Date.now()}`,
      type: "VoiceInterviewCompleted",
      timestamp: new Date(0).toISOString(),
      stage: "VoiceInterviewCompleted",
      data: {},
      metadata: { pipelineId: this.getPipelineId() }
    });
  }

  /**
   * Generate Final Report
   */
  static generateFinalReport(finalInterviewReportContext: FinalInterviewReportContext): void {
    this.pipelineContext.finalInterviewReportContext = finalInterviewReportContext;

    this.transitionTo("FinalReportGenerated");

    this.publishEvent({
      id: `event_${Date.now()}`,
      type: "FinalReportGenerated",
      timestamp: new Date(0).toISOString(),
      stage: "FinalReportGenerated",
      data: { reportId: finalInterviewReportContext.metadata.reportId },
      metadata: { pipelineId: this.getPipelineId() }
    });

    this.pipelineState.completedAt = new Date(0).toISOString();

    this.publishEvent({
      id: `event_${Date.now()}`,
      type: "PipelineCompleted",
      timestamp: new Date(0).toISOString(),
      stage: "FinalReportGenerated",
      data: { completedAt: this.pipelineState.completedAt },
      metadata: { pipelineId: this.getPipelineId() }
    });
  }

  /**
   * Handle Error
   */
  static handleError(error: string): void {
    this.pipelineState.error = error;
    this.transitionTo("Error");

    this.publishEvent({
      id: `event_${Date.now()}`,
      type: "PipelineError",
      timestamp: new Date(0).toISOString(),
      stage: "Error",
      data: { error },
      metadata: { pipelineId: this.getPipelineId() }
    });
  }

  /**
   * Cancel Pipeline
   */
  static cancelPipeline(): void {
    this.pipelineState.cancelled = true;
    this.transitionTo("Cancelled");

    this.publishEvent({
      id: `event_${Date.now()}`,
      type: "PipelineCancelled",
      timestamp: new Date(0).toISOString(),
      stage: "Cancelled",
      data: { cancelledAt: new Date(0).toISOString() },
      metadata: { pipelineId: this.getPipelineId() }
    });
  }

  /**
   * Transition to stage
   */
  private static transitionTo(stage: PipelineStage): void {
    const rule = TRANSITION_RULES.find(r => r.from === this.pipelineState.currentStage && r.to === stage);

    if (!rule) {
      // Set error state directly without calling handleError to avoid recursion
      this.pipelineState.error = `Invalid transition from ${this.pipelineState.currentStage} to ${stage}`;
      this.pipelineState.currentStage = "Error";
      return;
    }

    // Check required context
    for (const contextKey of rule.requiredContext) {
      if (!this.pipelineContext[contextKey as keyof PipelineContext]) {
        // Set error state directly without calling handleError to avoid recursion
        this.pipelineState.error = `Missing required context: ${contextKey}`;
        this.pipelineState.currentStage = "Error";
        return;
      }
    }

    this.pipelineState.previousStage = this.pipelineState.currentStage;
    this.pipelineState.currentStage = stage;
  }

  /**
   * Publish event
   */
  private static publishEvent(event: PipelineEvent): void {
    this.events.push(event);

    const listeners = this.eventListeners.get(event.type);
    if (listeners) {
      listeners.forEach(listener => listener(event));
    }
  }

  /**
   * Subscribe to events
   */
  static subscribe(eventType: PipelineEventType, listener: (event: PipelineEvent) => void): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)!.push(listener);
  }

  /**
   * Unsubscribe from events
   */
  static unsubscribe(eventType: PipelineEventType, listener: (event: PipelineEvent) => void): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Get pipeline state
   */
  static getPipelineState(): PipelineState {
    return { ...this.pipelineState };
  }

  /**
   * Get pipeline context
   */
  static getPipelineContext(): PipelineContext {
    return { ...this.pipelineContext };
  }

  /**
   * Get events
   */
  static getEvents(): PipelineEvent[] {
    return [...this.events];
  }

  /**
   * Get execution order
   */
  static getExecutionOrder(): ExecutionStep[] {
    return [...EXECUTION_ORDER];
  }

  /**
   * Get transition rules
   */
  static getTransitionRules(): TransitionRule[] {
    return [...TRANSITION_RULES];
  }

  /**
   * Get pipeline ID
   */
  private static getPipelineId(): string {
    return this.events[0]?.metadata.pipelineId || "unknown";
  }

  /**
   * Reset pipeline
   */
  static resetPipeline(): void {
    this.pipelineState = {
      currentStage: "Idle",
      previousStage: "Idle",
      startedAt: new Date(0).toISOString(),
      completedAt: null,
      error: null,
      cancelled: false
    };

    this.pipelineContext = {
      candidateProfile: null,
      candidateGraph: null,
      jobOfferGraph: null,
      matchingCoreContext: null,
      transferableSkillsContext: null,
      gapContext: null,
      interviewPreparationContext: null,
      voiceSessionContext: null,
      voiceInterviewContext: null,
      liveAnswerAnalysisContext: null,
      liveCoachingContext: null,
      finalInterviewReportContext: null
    };

    this.events = [];
    this.eventListeners.clear();
  }
}
