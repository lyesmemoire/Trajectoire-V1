// @ts-nocheck
import { CandidateProfile } from "../types";
import { JobOfferGraph } from "../profile/JobOfferGraph";
import { InterviewPreparationContext } from "../engines/careerCopilotInterviewPreparationEngine";
import { VoiceInterviewContext } from "../engines/careerCopilotVoiceInterviewEngine";

/**
 * Voice Session Manager
 * 
 * Responsibilities:
 * - Create a session
 * - Initialize contexts
 * - Start the session
 * - Suspend the session
 * - Resume the session
 * - Terminate the session
 * - Propagate events
 * - Synchronize engines
 * - Maintain global state
 * - NO response analysis, NO STT, NO TTS, NO coaching, NO report generation
 * - ONLY session orchestration with explainability
 */

export type SessionState = 
  | "Idle"
  | "Initializing"
  | "Ready"
  | "Running"
  | "Paused"
  | "Recovering"
  | "Finishing"
  | "Finished"
  | "Cancelled"
  | "Error";

export type SessionEvent = 
  | "SessionCreated"
  | "SessionStarted"
  | "SessionPaused"
  | "SessionResumed"
  | "QuestionStarted"
  | "QuestionFinished"
  | "WaitingCandidate"
  | "CandidateSpeaking"
  | "CandidateFinished"
  | "NextQuestion"
  | "SessionFinished"
  | "SessionCancelled"
  | "SessionError";

export interface Explainability {
  source: string;
  proof: string;
  confidence: number;
  explanation: string;
}

export interface ActiveContexts {
  interviewPreparationContext: InterviewPreparationContext | null;
  voiceInterviewContext: VoiceInterviewContext | null;
  sttContext: Record<string, unknown> | null;
  ttsContext: Record<string, unknown> | null;
  liveAnalysisContext: Record<string, unknown> | null;
  liveCoachingContext: Record<string, unknown> | null;
}

export interface ConversationHistory {
  events: Array<{
    event: SessionEvent;
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
    from: SessionState;
    to: SessionState;
    timestamp: string;
    reason: string;
  }>;
}

export interface VoiceSessionContext {
  sessionId: string;
  status: SessionState;
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
  activeContexts: ActiveContexts;
  conversationHistory: ConversationHistory;
  metadata: {
    candidateId: string;
    jobOfferId: string;
    createdAt: string;
    startedAt: string | null;
    finishedAt: string | null;
    totalDuration: number;
  };
  state: SessionState;
  transitionHistory: Array<{
    from: SessionState;
    to: SessionState;
    timestamp: string;
    reason: string;
  }>;
  explainability: {
    source: string;
    proof: string;
    confidence: number;
    explanation: string;
    reasoning: string;
    consultedEngines: string[];
    limitations: string[];
  };
}

export class VoiceSessionManager {
  private static sessions: Map<string, VoiceSessionContext> = new Map();

  /**
   * Create a new session
   */
  static createSession(
    candidateProfile: CandidateProfile,
    jobOfferGraph: JobOfferGraph
  ): VoiceSessionContext {
    const sessionId = `session_${Date.now()}`;
    const createdAt = new Date(0).toISOString(); // Fixed date for determinism

    const session: VoiceSessionContext = {
      sessionId,
      status: "Idle",
      currentPhase: "Idle",
      currentQuestion: null,
      questionsAsked: 0,
      remainingQuestions: 0,
      elapsedTime: 0,
      estimatedRemaining: 0,
      activeContexts: {
        interviewPreparationContext: null,
        voiceInterviewContext: null,
        sttContext: null,
        ttsContext: null,
        liveAnalysisContext: null,
        liveCoachingContext: null
      },
      conversationHistory: {
        events: [],
        questions: [],
        transitions: []
      },
      metadata: {
        candidateId: candidateProfile.identity.id,
        jobOfferId: jobOfferGraph.id,
        createdAt,
        startedAt: null,
        finishedAt: null,
        totalDuration: 0
      },
      state: "Idle",
      transitionHistory: [],
      explainability: {
        source: "Voice Session Manager",
        proof: "Session created at " + createdAt,
        confidence: 100,
        explanation: "Session created in Idle state",
        reasoning: "Session created based on candidate profile and job offer",
        consultedEngines: [],
        limitations: ["Session not yet initialized"]
      }
    };

    // Add event
    session.conversationHistory.events.push({
      event: "SessionCreated",
      timestamp: createdAt,
      data: { sessionId }
    });

    // Store session
    this.sessions.set(sessionId, session);

    return session;
  }

  /**
   * Initialize session with interview preparation context
   */
  static initializeSession(
    sessionId: string,
    interviewPreparationContext: InterviewPreparationContext
  ): VoiceSessionContext {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const timestamp = new Date(0).toISOString();

    // Update status
    session.status = "Initializing";
    session.state = "Initializing";

    // Add transition
    session.transitionHistory.push({
      from: "Idle",
      to: "Initializing",
      timestamp,
      reason: "Session initialization started"
    });
    session.conversationHistory.transitions.push({
      from: "Idle",
      to: "Initializing",
      timestamp,
      reason: "Session initialization started"
    });

    // Update active contexts
    session.activeContexts.interviewPreparationContext = interviewPreparationContext;
    session.remainingQuestions = interviewPreparationContext.questionQueue.length;
    session.estimatedRemaining = interviewPreparationContext.interviewDurationEstimate.totalMinutes;

    // Update explainability
    session.explainability = {
      source: "Voice Session Manager",
      proof: "Session initialized with interview preparation context",
      confidence: 95,
      explanation: "Session initialized with interview preparation context",
      reasoning: "Session initialized based on interview preparation context",
      consultedEngines: ["Interview Preparation Intelligence"],
      limitations: ["Voice interview context not yet initialized"]
    };

    // Add event
    session.conversationHistory.events.push({
      event: "SessionCreated",
      timestamp,
      data: { sessionId, status: "Initializing" }
    });

    return session;
  }

  /**
   * Start the session
   */
  static startSession(sessionId: string, voiceInterviewContext: VoiceInterviewContext): VoiceSessionContext {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const timestamp = new Date(0).toISOString();

    // Update status
    session.status = "Running";
    session.state = "Running";
    session.metadata.startedAt = timestamp;

    // Add transition
    session.transitionHistory.push({
      from: session.transitionHistory[session.transitionHistory.length - 1]?.to || "Initializing",
      to: "Running",
      timestamp,
      reason: "Session started"
    });
    session.conversationHistory.transitions.push({
      from: session.transitionHistory[session.transitionHistory.length - 2]?.to || "Initializing",
      to: "Running",
      timestamp,
      reason: "Session started"
    });

    // Update active contexts
    session.activeContexts.voiceInterviewContext = voiceInterviewContext;
    session.currentPhase = voiceInterviewContext.currentPhase.name;
    session.currentQuestion = voiceInterviewContext.currentQuestion ? {
      id: voiceInterviewContext.currentQuestion.id,
      question: voiceInterviewContext.currentQuestion.question,
      category: voiceInterviewContext.currentQuestion.category
    } : null;

    // Update explainability
    session.explainability = {
      source: "Voice Session Manager",
      proof: "Session started with voice interview context",
      confidence: 95,
      explanation: "Session started with voice interview context",
      reasoning: "Session started based on voice interview engine initialization",
      consultedEngines: ["Interview Preparation Intelligence", "Voice Interview Engine"],
      limitations: ["STT and TTS contexts not yet initialized"]
    };

    // Add event
    session.conversationHistory.events.push({
      event: "SessionStarted",
      timestamp,
      data: { sessionId, status: "Running" }
    });

    return session;
  }

  /**
   * Pause the session
   */
  static pauseSession(sessionId: string): VoiceSessionContext {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const timestamp = new Date(0).toISOString();

    // Update status
    session.status = "Paused";
    session.state = "Paused";

    // Add transition
    session.transitionHistory.push({
      from: "Running",
      to: "Paused",
      timestamp,
      reason: "Session paused"
    });
    session.conversationHistory.transitions.push({
      from: "Running",
      to: "Paused",
      timestamp,
      reason: "Session paused"
    });

    // Update explainability
    session.explainability = {
      source: "Voice Session Manager",
      proof: "Session paused",
      confidence: 100,
      explanation: "Session paused by user or system",
      reasoning: "Session paused based on user or system request",
      consultedEngines: [],
      limitations: ["Session paused, no further progress"]
    };

    // Add event
    session.conversationHistory.events.push({
      event: "SessionPaused",
      timestamp,
      data: { sessionId, status: "Paused" }
    });

    return session;
  }

  /**
   * Resume the session
   */
  static resumeSession(sessionId: string): VoiceSessionContext {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const timestamp = new Date(0).toISOString();

    // Update status
    session.status = "Running";
    session.state = "Running";

    // Add transition
    session.transitionHistory.push({
      from: "Paused",
      to: "Running",
      timestamp,
      reason: "Session resumed"
    });
    session.conversationHistory.transitions.push({
      from: "Paused",
      to: "Running",
      timestamp,
      reason: "Session resumed"
    });

    // Update explainability
    session.explainability = {
      source: "Voice Session Manager",
      proof: "Session resumed",
      confidence: 100,
      explanation: "Session resumed by user or system",
      reasoning: "Session resumed based on user or system request",
      consultedEngines: [],
      limitations: ["Session resumed, progress continues"]
    };

    // Add event
    session.conversationHistory.events.push({
      event: "SessionResumed",
      timestamp,
      data: { sessionId, status: "Running" }
    });

    return session;
  }

  /**
   * Terminate the session
   */
  static terminateSession(sessionId: string): VoiceSessionContext {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const timestamp = new Date(0).toISOString();

    // Update status
    session.status = "Finished";
    session.state = "Finished";
    session.metadata.finishedAt = timestamp;
    session.metadata.totalDuration = session.elapsedTime;

    // Add transition
    session.transitionHistory.push({
      from: session.transitionHistory[session.transitionHistory.length - 1]?.to || "Running",
      to: "Finished",
      timestamp,
      reason: "Session terminated"
    });
    session.conversationHistory.transitions.push({
      from: session.transitionHistory[session.transitionHistory.length - 2]?.to || "Running",
      to: "Finished",
      timestamp,
      reason: "Session terminated"
    });

    // Update explainability
    session.explainability = {
      source: "Voice Session Manager",
      proof: "Session terminated",
      confidence: 100,
      explanation: "Session terminated successfully",
      reasoning: "Session terminated based on completion or user request",
      consultedEngines: ["Interview Preparation Intelligence", "Voice Interview Engine"],
      limitations: ["Session terminated, no further actions possible"]
    };

    // Add event
    session.conversationHistory.events.push({
      event: "SessionFinished",
      timestamp,
      data: { sessionId, status: "Finished", totalDuration: session.elapsedTime }
    });

    return session;
  }

  /**
   * Cancel the session
   */
  static cancelSession(sessionId: string): VoiceSessionContext {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const timestamp = new Date(0).toISOString();

    // Update status
    session.status = "Cancelled";
    session.state = "Cancelled";
    session.metadata.finishedAt = timestamp;

    // Add transition
    session.transitionHistory.push({
      from: session.transitionHistory[session.transitionHistory.length - 1]?.to || "Running",
      to: "Cancelled",
      timestamp,
      reason: "Session cancelled"
    });
    session.conversationHistory.transitions.push({
      from: session.transitionHistory[session.transitionHistory.length - 2]?.to || "Running",
      to: "Cancelled",
      timestamp,
      reason: "Session cancelled"
    });

    // Update explainability
    session.explainability = {
      source: "Voice Session Manager",
      proof: "Session cancelled",
      confidence: 100,
      explanation: "Session cancelled by user or system",
      reasoning: "Session cancelled based on user or system request",
      consultedEngines: [],
      limitations: ["Session cancelled, no further actions possible"]
    };

    // Add event
    session.conversationHistory.events.push({
      event: "SessionCancelled",
      timestamp,
      data: { sessionId, status: "Cancelled" }
    });

    return session;
  }

  /**
   * Propagate event to session
   */
  static propagateEvent(sessionId: string, event: SessionEvent, data: Record<string, unknown>): VoiceSessionContext {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const timestamp = new Date(0).toISOString();

    // Add event
    session.conversationHistory.events.push({
      event,
      timestamp,
      data
    });

    // Update session based on event
    switch (event) {
      case "QuestionStarted":
        session.questionsAsked++;
        session.remainingQuestions = Math.max(0, session.remainingQuestions - 1);
        if (session.activeContexts.voiceInterviewContext) {
          session.currentPhase = session.activeContexts.voiceInterviewContext.currentPhase.name;
          session.currentQuestion = session.activeContexts.voiceInterviewContext.currentQuestion ? {
            id: session.activeContexts.voiceInterviewContext.currentQuestion.id,
            question: session.activeContexts.voiceInterviewContext.currentQuestion.question,
            category: session.activeContexts.voiceInterviewContext.currentQuestion.category
          } : null;
        }
        break;
      case "QuestionFinished":
        // Update elapsed time based on question duration
        if (session.activeContexts.voiceInterviewContext) {
          session.elapsedTime = session.activeContexts.voiceInterviewContext.interviewTimer.elapsedTime;
          session.estimatedRemaining = session.activeContexts.voiceInterviewContext.interviewTimer.remainingTime;
        }
        break;
      case "NextQuestion":
        if (session.activeContexts.voiceInterviewContext) {
          session.currentPhase = session.activeContexts.voiceInterviewContext.currentPhase.name;
          session.currentQuestion = session.activeContexts.voiceInterviewContext.currentQuestion ? {
            id: session.activeContexts.voiceInterviewContext.currentQuestion.id,
            question: session.activeContexts.voiceInterviewContext.currentQuestion.question,
            category: session.activeContexts.voiceInterviewContext.currentQuestion.category
          } : null;
        }
        break;
    }

    return session;
  }

  /**
   * Get session by ID
   */
  static getSession(sessionId: string): VoiceSessionContext | undefined {
    return this.sessions.get(sessionId);
  }

  /**
   * Get all sessions
   */
  static getAllSessions(): VoiceSessionContext[] {
    return Array.from(this.sessions.values());
  }

  /**
   * Delete session
   */
  static deleteSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }
}
