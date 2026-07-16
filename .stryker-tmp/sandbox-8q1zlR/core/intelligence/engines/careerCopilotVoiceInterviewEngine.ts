// @ts-nocheck
import { CandidateProfile } from "../types";
import { JobOfferGraph } from "../profile/JobOfferGraph";
import { InterviewPreparationContext } from "./careerCopilotInterviewPreparationEngine";

/**
 * Voice Interview Engine
 * 
 * Responsibilities:
 * - Start the interview session
 * - Follow the conversation state
 * - Choose the next question
 * - Manage transitions
 * - Handle follow-ups
 * - Manage time
 * - Memorize the conversation
 * - Terminate the interview properly
 * - NO Speech-to-Text, NO Text-to-Speech, NO response scoring, NO coaching, NO final report generation
 * - ONLY interview flow management with explainability
 */

export interface Explainability {
  source: string;
  proof: string;
  confidence: number;
  explanation: string;
}

export interface InterviewSession {
  id: string;
  startedAt: string;
  currentState: "Waiting" | "Introduction" | "Warmup" | "Technical" | "Behavioral" | "Leadership" | "STAR" | "Challenge" | "Closing" | "CandidateQuestions" | "Finished" | "Paused" | "Recovery" | "Error";
  previousState: string;
  stateHistory: Array<{ state: string; timestamp: string }>;
  explainability: Explainability;
}

export interface CurrentPhase {
  name: string;
  objective: string;
  startedAt: string;
  expectedDuration: number;
  explainability: Explainability;
}

export interface CurrentQuestion {
  id: string;
  question: string;
  category: string;
  priority: "critical" | "high" | "medium" | "low";
  difficulty: "easy" | "medium" | "hard" | "expert";
  estimatedDuration: number;
  askedAt: string;
  followUpsAvailable: string[];
  explainability: {
    source: string;
    proof: string;
    confidence: number;
    explanation: string;
    reasoning: string;
    consultedIntelligences: string[];
    limitations: string[];
  };
}

export interface ConversationMemory {
  questionsAsked: Array<{ id: string; question: string; askedAt: string; phase: string }>;
  conversationTimeline: Array<{ event: string; timestamp: string; data: Record<string, unknown> }>;
  askedQuestions: string[];
  skippedQuestions: string[];
  followUpQueue: Array<{ parentQuestionId: string; followUps: string[] }>;
  elementsToVerify: string[];
  confirmedElements: string[];
  unknownElements: string[];
  explainability: Explainability;
}

export interface ConversationObjective {
  id: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "skipped";
  phase: string;
  explainability: Explainability;
}

export interface InterviewState {
  totalQuestions: number;
  askedQuestionsCount: number;
  skippedQuestionsCount: number;
  currentPhaseProgress: number;
  overallProgress: number;
  explainability: Explainability;
}

export interface InterviewProgress {
  phasesCompleted: string[];
  currentPhaseIndex: number;
  totalPhases: number;
  explainability: Explainability;
}

export interface InterviewTimer {
  elapsedTime: number;
  remainingTime: number;
  averageTimePerQuestion: number;
  timePerPhase: Record<string, number>;
  maximumTime: number;
  explainability: Explainability;
}

export interface CandidateInterruption {
  id: string;
  timestamp: string;
  type: string;
  handled: boolean;
  explainability: Explainability;
}

export interface SilenceCounter {
  count: number;
  lastSilenceTimestamp: string;
  totalSilenceDuration: number;
  explainability: Explainability;
}

export interface RetryCounter {
  count: number;
  lastRetryTimestamp: string;
  maxRetries: number;
  explainability: Explainability;
}

export interface ConversationMetadata {
  sessionId: string;
  candidateId: string;
  jobOfferId: string;
  interviewPreparationContextId: string;
  totalDuration: number;
  explainability: Explainability;
}

export interface VoiceInterviewContext {
  interviewSession: InterviewSession;
  currentPhase: CurrentPhase;
  currentQuestion: CurrentQuestion | null;
  remainingQuestions: string[];
  conversationMemory: ConversationMemory;
  conversationObjectives: ConversationObjective[];
  interviewState: InterviewState;
  interviewProgress: InterviewProgress;
  interviewTimer: InterviewTimer;
  candidateInterruptions: CandidateInterruption[];
  silenceCounter: SilenceCounter;
  retryCounter: RetryCounter;
  conversationMetadata: ConversationMetadata;
  voiceInterviewExplainability: {
    source: string;
    proof: string;
    confidence: number;
    explanation: string;
    reasoning: string;
    consultedIntelligences: string[];
    limitations: string[];
  };
}

export class CareerCopilotVoiceInterviewEngine {
  /**
   * Start the interview session
   */
  static startInterview(
    interviewPreparationContext: InterviewPreparationContext,
    candidateProfile: CandidateProfile,
    jobOfferGraph: JobOfferGraph
  ): VoiceInterviewContext {
    const sessionId = `interview_${Date.now()}`;
    const startedAt = new Date(0).toISOString(); // Fixed date for determinism

    // Initialize interview session
    const interviewSession: InterviewSession = {
      id: sessionId,
      startedAt,
      currentState: "Waiting",
      previousState: "",
      stateHistory: [{ state: "Waiting", timestamp: startedAt }],
      explainability: {
        source: "Voice Interview Engine",
        proof: "Interview session started at " + startedAt,
        confidence: 100,
        explanation: "Interview session initialized in Waiting state"
      }
    };

    // Initialize conversation memory
    const conversationMemory: ConversationMemory = {
      questionsAsked: [],
      conversationTimeline: [{ event: "InterviewStarted", timestamp: startedAt, data: { sessionId } }],
      askedQuestions: [],
      skippedQuestions: [],
      followUpQueue: [],
      elementsToVerify: interviewPreparationContext.expectedSkillsToDemonstrate.map(s => s.id),
      confirmedElements: [],
      unknownElements: [],
      explainability: {
        source: "Voice Interview Engine",
        proof: "Conversation memory initialized",
        confidence: 100,
        explanation: "Conversation memory initialized with expected skills to verify"
      }
    };

    // Initialize conversation objectives
    const conversationObjectives: ConversationObjective[] = interviewPreparationContext.interviewObjectives.map(obj => ({
      id: obj.id,
      description: obj.description,
      status: "pending" as const,
      phase: obj.category,
      explainability: {
        source: "Interview Preparation Intelligence",
        proof: `Objective ${obj.id} from interview preparation`,
        confidence: 90,
        explanation: `Objective ${obj.description} initialized as pending`
      }
    }));

    // Initialize interview state
    const interviewState: InterviewState = {
      totalQuestions: interviewPreparationContext.questionQueue.length,
      askedQuestionsCount: 0,
      skippedQuestionsCount: 0,
      currentPhaseProgress: 0,
      overallProgress: 0,
      explainability: {
        source: "Voice Interview Engine",
        proof: "Interview state initialized",
        confidence: 100,
        explanation: "Interview state initialized with total questions from preparation"
      }
    };

    // Initialize interview progress
    const interviewProgress: InterviewProgress = {
      phasesCompleted: [],
      currentPhaseIndex: 0,
      totalPhases: 8,
      explainability: {
        source: "Voice Interview Engine",
        proof: "Interview progress initialized",
        confidence: 100,
        explanation: "Interview progress initialized with 8 phases total"
      }
    };

    // Initialize interview timer
    const interviewTimer: InterviewTimer = {
      elapsedTime: 0,
      remainingTime: interviewPreparationContext.interviewDurationEstimate.totalMinutes,
      averageTimePerQuestion: 0,
      timePerPhase: interviewPreparationContext.interviewDurationEstimate.breakdown,
      maximumTime: interviewPreparationContext.interviewDurationEstimate.totalMinutes,
      explainability: {
        source: "Interview Preparation Intelligence",
        proof: "Timer initialized from interview preparation duration estimate",
        confidence: 95,
        explanation: "Timer initialized with maximum time from preparation"
      }
    };

    // Initialize counters
    const silenceCounter: SilenceCounter = {
      count: 0,
      lastSilenceTimestamp: "",
      totalSilenceDuration: 0,
      explainability: {
        source: "Voice Interview Engine",
        proof: "Silence counter initialized",
        confidence: 100,
        explanation: "Silence counter initialized at zero"
      }
    };

    const retryCounter: RetryCounter = {
      count: 0,
      lastRetryTimestamp: "",
      maxRetries: 3,
      explainability: {
        source: "Voice Interview Engine",
        proof: "Retry counter initialized",
        confidence: 100,
        explanation: "Retry counter initialized with maximum 3 retries"
      }
    };

    // Initialize metadata
    const conversationMetadata: ConversationMetadata = {
      sessionId,
      candidateId: candidateProfile.identity.id,
      jobOfferId: jobOfferGraph.id,
      interviewPreparationContextId: interviewPreparationContext.metadata.preparedAt,
      totalDuration: interviewPreparationContext.interviewDurationEstimate.totalMinutes,
      explainability: {
        source: "Voice Interview Engine",
        proof: "Metadata initialized from inputs",
        confidence: 100,
        explanation: "Metadata initialized with candidate, job offer, and preparation context IDs"
      }
    };

    return {
      interviewSession,
      currentPhase: {
        name: "Waiting",
        objective: "Waiting for interview to start",
        startedAt,
        expectedDuration: 0,
        explainability: {
          source: "Voice Interview Engine",
          proof: "Current phase set to Waiting",
          confidence: 100,
          explanation: "Interview in Waiting state, waiting to start"
        }
      },
      currentQuestion: null,
      remainingQuestions: interviewPreparationContext.questionQueue.map(q => q.id),
      conversationMemory,
      conversationObjectives,
      interviewState,
      interviewProgress,
      interviewTimer,
      candidateInterruptions: [],
      silenceCounter,
      retryCounter,
      conversationMetadata,
      voiceInterviewExplainability: {
        source: "Voice Interview Engine",
        proof: "Interview started with session " + sessionId,
        confidence: 95,
        explanation: "Interview session started successfully",
        reasoning: "Interview started based on interview preparation context",
        consultedIntelligences: ["Interview Preparation Intelligence"],
        limitations: ["Interview flow depends on conversation events"]
      }
    };
  }

  /**
   * Transition to next phase
   */
  static transitionToNextPhase(
    context: VoiceInterviewContext,
    interviewPreparationContext: InterviewPreparationContext
  ): VoiceInterviewContext {
    const currentState = context.interviewSession.currentState;
    let nextState: typeof currentState = currentState;
    let nextPhaseName = "";
    let nextPhaseObjective = "";
    let nextPhaseDuration = 0;

    // Explicit transitions
    switch (currentState) {
      case "Waiting":
        nextState = "Introduction";
        nextPhaseName = "Introduction";
        nextPhaseObjective = "Welcome and introduction";
        nextPhaseDuration = interviewPreparationContext.interviewDurationEstimate.breakdown.warmup * 0.3;
        break;
      case "Introduction":
        nextState = "Warmup";
        nextPhaseName = "Warmup";
        nextPhaseObjective = "Warmup questions to build rapport";
        nextPhaseDuration = interviewPreparationContext.interviewDurationEstimate.breakdown.warmup * 0.7;
        break;
      case "Warmup":
        nextState = "Technical";
        nextPhaseName = "Technical";
        nextPhaseObjective = "Technical deep dive";
        nextPhaseDuration = interviewPreparationContext.interviewDurationEstimate.breakdown.technical;
        break;
      case "Technical":
        nextState = "Behavioral";
        nextPhaseName = "Behavioral";
        nextPhaseObjective = "Behavioral assessment";
        nextPhaseDuration = interviewPreparationContext.interviewDurationEstimate.breakdown.behavioral;
        break;
      case "Behavioral":
        // Check if leadership questions exist
        if (interviewPreparationContext.leadershipQuestions.length > 0) {
          nextState = "Leadership";
          nextPhaseName = "Leadership";
          nextPhaseObjective = "Leadership assessment";
          nextPhaseDuration = interviewPreparationContext.interviewDurationEstimate.breakdown.advanced * 0.5;
        } else {
          nextState = "Closing";
          nextPhaseName = "Closing";
          nextPhaseObjective = "Closing and candidate questions";
          nextPhaseDuration = interviewPreparationContext.interviewDurationEstimate.breakdown.closing;
        }
        break;
      case "Leadership":
        nextState = "Closing";
        nextPhaseName = "Closing";
        nextPhaseObjective = "Closing and candidate questions";
        nextPhaseDuration = interviewPreparationContext.interviewDurationEstimate.breakdown.closing;
        break;
      case "Closing":
        nextState = "Finished";
        nextPhaseName = "Finished";
        nextPhaseObjective = "Interview finished";
        nextPhaseDuration = 0;
        break;
      default:
        nextState = currentState;
        nextPhaseName = currentState;
        nextPhaseObjective = "Current phase";
        nextPhaseDuration = 0;
    }

    // Update session state
    const timestamp = new Date(0).toISOString();
    context.interviewSession.previousState = currentState;
    context.interviewSession.currentState = nextState;
    context.interviewSession.stateHistory.push({ state: nextState, timestamp });

    // Update current phase
    context.currentPhase = {
      name: nextPhaseName,
      objective: nextPhaseObjective,
      startedAt: timestamp,
      expectedDuration: nextPhaseDuration,
      explainability: {
        source: "Voice Interview Engine",
        proof: `Transition from ${currentState} to ${nextState}`,
        confidence: 95,
        explanation: `Transitioned to ${nextPhaseName} phase based on explicit transition rules`
      }
    };

    // Update progress
    if (currentState !== nextState && currentState !== "Waiting") {
      context.interviewProgress.phasesCompleted.push(currentState);
      context.interviewProgress.currentPhaseIndex++;
    }

    // Update timeline
    context.conversationMemory.conversationTimeline.push({
      event: "PhaseTransition",
      timestamp,
      data: { from: currentState, to: nextState }
    });

    return context;
  }

  /**
   * Select next question
   */
  static selectNextQuestion(
    context: VoiceInterviewContext,
    interviewPreparationContext: InterviewPreparationContext
  ): VoiceInterviewContext {
    const currentPhase = context.currentPhase.name;
    const remainingQuestions = context.remainingQuestions;

    // Filter questions for current phase
    const phaseQuestions = interviewPreparationContext.questionQueue.filter(q => {
      switch (currentPhase) {
        case "Introduction":
        case "Warmup":
          return ["presentation", "parcours"].includes(q.category);
        case "Technical":
          return ["hardSkills", "architecture", "problemSolving"].includes(q.category);
        case "Behavioral":
          return ["softSkills", "communication"].includes(q.category);
        case "Leadership":
          return ["leadership"].includes(q.category);
        case "Closing":
          return ["closing", "candidateQuestions"].includes(q.category);
        default:
          return false;
      }
    });

    // Find first question in remaining questions that matches current phase
    const nextQuestion = phaseQuestions.find(q => remainingQuestions.includes(q.id));

    if (!nextQuestion) {
      // No question for current phase, transition to next phase
      return this.transitionToNextPhase(context, interviewPreparationContext);
    }

    // Remove from remaining questions
    context.remainingQuestions = remainingQuestions.filter(id => id !== nextQuestion.id);

    // Update current question
    const timestamp = new Date(0).toISOString();
    context.currentQuestion = {
      id: nextQuestion.id,
      question: nextQuestion.question,
      category: nextQuestion.category,
      priority: nextQuestion.priority,
      difficulty: nextQuestion.difficulty,
      estimatedDuration: nextQuestion.estimatedDuration,
      askedAt: timestamp,
      followUpsAvailable: nextQuestion.followUps,
      explainability: {
        source: "Interview Preparation Intelligence",
        proof: `Question ${nextQuestion.id} selected from interview preparation`,
        confidence: 90,
        explanation: `Question selected for ${currentPhase} phase`,
        reasoning: `Question matches current phase ${currentPhase} and is next in queue`,
        consultedIntelligences: ["Interview Preparation Intelligence"],
        limitations: ["Question selection depends on interview preparation quality"]
      }
    };

    // Update memory
    context.conversationMemory.questionsAsked.push({
      id: nextQuestion.id,
      question: nextQuestion.question,
      askedAt: timestamp,
      phase: currentPhase
    });
    context.conversationMemory.askedQuestions.push(nextQuestion.id);

    // Update state
    context.interviewState.askedQuestionsCount++;
    context.interviewState.currentPhaseProgress++;

    // Update timeline
    context.conversationMemory.conversationTimeline.push({
      event: "QuestionAsked",
      timestamp,
      data: { questionId: nextQuestion.id, question: nextQuestion.question }
    });

    // Update timer
    context.interviewTimer.elapsedTime += nextQuestion.estimatedDuration;
    context.interviewTimer.remainingTime -= nextQuestion.estimatedDuration;
    if (context.interviewState.askedQuestionsCount > 0) {
      context.interviewTimer.averageTimePerQuestion = context.interviewTimer.elapsedTime / context.interviewState.askedQuestionsCount;
    }

    return context;
  }

  /**
   * Handle follow-up
   */
  static handleFollowUp(
    context: VoiceInterviewContext,
    questionId: string
  ): VoiceInterviewContext {
    const currentQuestion = context.currentQuestion;
    if (!currentQuestion || currentQuestion.id !== questionId) {
      return context;
    }

    // Check if follow-ups are available
    if (currentQuestion.followUpsAvailable.length === 0) {
      return context;
    }

    // Get next follow-up
    const nextFollowUp = currentQuestion.followUpsAvailable[0];
    const remainingFollowUps = currentQuestion.followUpsAvailable.slice(1);

    // Update current question with follow-up
    const timestamp = new Date(0).toISOString();
    context.currentQuestion = {
      ...currentQuestion,
      question: nextFollowUp,
      followUpsAvailable: remainingFollowUps,
      askedAt: timestamp
    };

    // Update follow-up queue
    context.conversationMemory.followUpQueue.push({
      parentQuestionId: questionId,
      followUps: [nextFollowUp]
    });

    // Update retry counter
    context.retryCounter.count++;
    context.retryCounter.lastRetryTimestamp = timestamp;

    // Update timeline
    context.conversationMemory.conversationTimeline.push({
      event: "FollowUpTriggered",
      timestamp,
      data: { parentQuestionId: questionId, followUp: nextFollowUp }
    });

    return context;
  }

  /**
   * Skip question
   */
  static skipQuestion(
    context: VoiceInterviewContext,
    questionId: string
  ): VoiceInterviewContext {
    // Add to skipped questions
    context.conversationMemory.skippedQuestions.push(questionId);

    // Update state
    context.interviewState.skippedQuestionsCount++;

    // Update timeline
    const timestamp = new Date(0).toISOString();
    context.conversationMemory.conversationTimeline.push({
      event: "QuestionSkipped",
      timestamp,
      data: { questionId }
    });

    // Select next question
    return this.selectNextQuestion(context, {} as InterviewPreparationContext);
  }

  /**
   * Handle silence
   */
  static handleSilence(
    context: VoiceInterviewContext,
    duration: number
  ): VoiceInterviewContext {
    // Update silence counter
    const timestamp = new Date(0).toISOString();
    context.silenceCounter.count++;
    context.silenceCounter.lastSilenceTimestamp = timestamp;
    context.silenceCounter.totalSilenceDuration += duration;

    // Update timeline
    context.conversationMemory.conversationTimeline.push({
      event: "SilenceDetected",
      timestamp,
      data: { duration }
    });

    // If silence is too long, trigger follow-up or skip
    if (duration > 30 && context.currentQuestion) {
      if (context.currentQuestion.followUpsAvailable.length > 0 && context.retryCounter.count < context.retryCounter.maxRetries) {
        return this.handleFollowUp(context, context.currentQuestion.id);
      } else {
        return this.skipQuestion(context, context.currentQuestion.id);
      }
    }

    return context;
  }

  /**
   * Handle interruption
   */
  static handleInterruption(
    context: VoiceInterviewContext,
    type: string
  ): VoiceInterviewContext {
    const timestamp = new Date(0).toISOString();
    const interruption: CandidateInterruption = {
      id: `interruption_${Date.now()}`,
      timestamp,
      type,
      handled: false,
      explainability: {
        source: "Voice Interview Engine",
        proof: `Interruption of type ${type} detected`,
        confidence: 85,
        explanation: `Interruption detected and logged`
      }
    };

    context.candidateInterruptions.push(interruption);

    // Update timeline
    context.conversationMemory.conversationTimeline.push({
      event: "InterruptionDetected",
      timestamp,
      data: { type }
    });

    return context;
  }

  /**
   * Terminate interview
   */
  static terminateInterview(context: VoiceInterviewContext): VoiceInterviewContext {
    const timestamp = new Date(0).toISOString();

    // Update session state
    context.interviewSession.previousState = context.interviewSession.currentState;
    context.interviewSession.currentState = "Finished";
    context.interviewSession.stateHistory.push({ state: "Finished", timestamp });

    // Update current phase
    context.currentPhase = {
      name: "Finished",
      objective: "Interview finished",
      startedAt: timestamp,
      expectedDuration: 0,
      explainability: {
        source: "Voice Interview Engine",
        proof: "Interview terminated",
        confidence: 100,
        explanation: "Interview terminated successfully"
      }
    };

    // Clear current question
    context.currentQuestion = null;

    // Update timeline
    context.conversationMemory.conversationTimeline.push({
      event: "InterviewFinished",
      timestamp,
      data: { totalDuration: context.interviewTimer.elapsedTime }
    });

    // Update overall progress
    context.interviewState.overallProgress = 100;

    return context;
  }

  /**
   * Pause interview
   */
  static pauseInterview(context: VoiceInterviewContext): VoiceInterviewContext {
    const timestamp = new Date(0).toISOString();

    // Update session state
    context.interviewSession.previousState = context.interviewSession.currentState;
    context.interviewSession.currentState = "Paused";
    context.interviewSession.stateHistory.push({ state: "Paused", timestamp });

    // Update timeline
    context.conversationMemory.conversationTimeline.push({
      event: "InterviewPaused",
      timestamp,
      data: {}
    });

    return context;
  }

  /**
   * Resume interview
   */
  static resumeInterview(context: VoiceInterviewContext): VoiceInterviewContext {
    const timestamp = new Date(0).toISOString();

    // Update session state
    const validStates: Array<typeof context.interviewSession.currentState> = ["Waiting", "Introduction", "Warmup", "Technical", "Behavioral", "Leadership", "STAR", "Challenge", "Closing", "CandidateQuestions", "Finished", "Paused", "Recovery", "Error"];
    const previousState = context.interviewSession.previousState;
    const validPreviousState = validStates.includes(previousState as typeof context.interviewSession.currentState) ? previousState as typeof context.interviewSession.currentState : "Waiting";
    
    context.interviewSession.previousState = context.interviewSession.currentState;
    context.interviewSession.currentState = validPreviousState;
    context.interviewSession.stateHistory.push({ state: context.interviewSession.currentState, timestamp });

    // Update timeline
    context.conversationMemory.conversationTimeline.push({
      event: "InterviewResumed",
      timestamp,
      data: {}
    });

    return context;
  }
}
