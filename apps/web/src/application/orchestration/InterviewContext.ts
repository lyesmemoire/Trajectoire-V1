/**
 * Interview Context
 * Complete context for an interview session
 * Contains: phase, timing, performance, candidate info, position details
 */

import { z } from "zod";

// Interview Phase
export enum InterviewPhase {
  INTRODUCTION = "introduction",
  ICE_BREAKER = "ice_breaker",
  CV = "cv",
  SOFT_SKILLS = "soft_skills",
  TECHNICAL = "technical",
  CASE_STUDY = "case_study",
  PRESSURE = "pressure",
  CANDIDATE_QUESTIONS = "candidate_questions",
  FINAL_DECISION = "final_decision",
  REPORT = "report",
}

// Interview Status
export enum InterviewStatus {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  PAUSED = "paused",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

// Candidate Info
export interface CandidateInfo {
  id: string;
  name: string;
  email: string;
  level: string; // junior, mid, senior, expert
  experience: number; // years
  currentRole?: string;
  targetRole: string;
  industry: string;
  skills: string[];
  cvData?: any;
}

// Position Details
export interface PositionDetails {
  title: string;
  level: string;
  department: string;
  location: string;
  type: string; // full-time, part-time, contract
  salaryRange?: string;
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
}

// Interview Metrics
export interface InterviewMetrics {
  totalDuration: number; // seconds
  questionCount: number;
  responseCount: number;
  averageResponseTime: number; // seconds
  overallScore: number; // 0-1
  skillScores: Record<string, number>;
  consistency: number; // 0-1
  improvement: number; // 0-1
}

// Interview Context
export interface InterviewContext {
  sessionId: string;
  candidate: CandidateInfo;
  position: PositionDetails;
  phase: InterviewPhase;
  status: InterviewStatus;
  
  // Timing
  startTime: Date;
  currentPhaseStartTime: Date;
  phaseDurations: Map<InterviewPhase, number>;
  totalElapsedTime: number;
  
  // Performance
  metrics: InterviewMetrics;
  currentPerformance: number; // 0-1
  
  // Stress detection
  stressLevel: number; // 0-1
  stressIndicators: string[];
  
  // Language
  language: string;
  
  // Recruiter
  recruiterPersonalityId: string;
  
  // Conversation
  messageCount: number;
  lastMessageTime: Date;
  
  // Goals
  phaseGoals: Map<InterviewPhase, string[]>;
  completedGoals: string[];
  
  // Constraints
  maxDuration: number; // seconds
  maxQuestions: number;
}

export class InterviewContextManager {
  private static instance: InterviewContextManager;
  private contexts: Map<string, InterviewContext> = new Map();

  private constructor() {}

  static getInstance(): InterviewContextManager {
    if (!InterviewContextManager.instance) {
      InterviewContextManager.instance = new InterviewContextManager();
    }
    return InterviewContextManager.instance;
  }

  /**
   * Create new interview context
   */
  createContext(
    sessionId: string,
    candidate: CandidateInfo,
    position: PositionDetails,
    recruiterPersonalityId: string,
    options: {
      maxDuration?: number;
      maxQuestions?: number;
      language?: string;
    } = {}
  ): InterviewContext {
    const now = new Date();
    const context: InterviewContext = {
      sessionId,
      candidate,
      position,
      phase: InterviewPhase.INTRODUCTION,
      status: InterviewStatus.NOT_STARTED,
      startTime: now,
      currentPhaseStartTime: now,
      phaseDurations: new Map(),
      totalElapsedTime: 0,
      metrics: {
        totalDuration: 0,
        questionCount: 0,
        responseCount: 0,
        averageResponseTime: 0,
        overallScore: 0.5,
        skillScores: {},
        consistency: 0.5,
        improvement: 0,
      },
      currentPerformance: 0.5,
      stressLevel: 0,
      stressIndicators: [],
      language: options.language || "fr",
      recruiterPersonalityId,
      messageCount: 0,
      lastMessageTime: now,
      phaseGoals: this.initializePhaseGoals(),
      completedGoals: [],
      maxDuration: options.maxDuration || 3600, // 1 hour default
      maxQuestions: options.maxQuestions || 20,
    };

    this.contexts.set(sessionId, context);
    return context;
  }

  /**
   * Get context by session ID
   */
  getContext(sessionId: string): InterviewContext | null {
    return this.contexts.get(sessionId) || null;
  }

  /**
   * Update context
   */
  updateContext(sessionId: string, updates: Partial<InterviewContext>): void {
    const context = this.contexts.get(sessionId);
    if (!context) return;

    Object.assign(context, updates);
    this.contexts.set(sessionId, context);
  }

  /**
   * Update phase
   */
  updatePhase(sessionId: string, newPhase: InterviewPhase): void {
    const context = this.contexts.get(sessionId);
    if (!context) return;

    // Calculate duration of current phase
    const now = new Date();
    const phaseDuration = (now.getTime() - context.currentPhaseStartTime.getTime()) / 1000;
    context.phaseDurations.set(context.phase, phaseDuration);

    // Update phase
    context.phase = newPhase;
    context.currentPhaseStartTime = now;
    context.status = InterviewStatus.IN_PROGRESS;

    this.contexts.set(sessionId, context);
  }

  /**
   * Update metrics
   */
  updateMetrics(sessionId: string, updates: Partial<InterviewMetrics>): void {
    const context = this.contexts.get(sessionId);
    if (!context) return;

    Object.assign(context.metrics, updates);
    this.contexts.set(sessionId, context);
  }

  /**
   * Update performance
   */
  updatePerformance(sessionId: string, performance: number): void {
    const context = this.contexts.get(sessionId);
    if (!context) return;

    context.currentPerformance = performance;
    context.metrics.overallScore = performance;
    this.contexts.set(sessionId, context);
  }

  /**
   * Update stress level
   */
  updateStressLevel(sessionId: string, stressLevel: number, indicators: string[] = []): void {
    const context = this.contexts.get(sessionId);
    if (!context) return;

    context.stressLevel = stressLevel;
    context.stressIndicators = indicators;
    this.contexts.set(sessionId, context);
  }

  /**
   * Increment message count
   */
  incrementMessageCount(sessionId: string): void {
    const context = this.contexts.get(sessionId);
    if (!context) return;

    context.messageCount++;
    context.lastMessageTime = new Date();
    this.contexts.set(sessionId, context);
  }

  /**
   * Complete goal
   */
  completeGoal(sessionId: string, goal: string): void {
    const context = this.contexts.get(sessionId);
    if (!context) return;

    if (!context.completedGoals.includes(goal)) {
      context.completedGoals.push(goal);
    }
    this.contexts.set(sessionId, context);
  }

  /**
   * Update status
   */
  updateStatus(sessionId: string, status: InterviewStatus): void {
    const context = this.contexts.get(sessionId);
    if (!context) return;

    context.status = status;
    this.contexts.set(sessionId, context);
  }

  /**
   * Get elapsed time
   */
  getElapsedTime(sessionId: string): number {
    const context = this.contexts.get(sessionId);
    if (!context) return 0;

    const now = new Date();
    return (now.getTime() - context.startTime.getTime()) / 1000;
  }

  /**
   * Get phase duration
   */
  getPhaseDuration(sessionId: string): number {
    const context = this.contexts.get(sessionId);
    if (!context) return 0;

    const now = new Date();
    return (now.getTime() - context.currentPhaseStartTime.getTime()) / 1000;
  }

  /**
   * Check if time limit exceeded
   */
  isTimeLimitExceeded(sessionId: string): boolean {
    const context = this.contexts.get(sessionId);
    if (!context) return false;

    return this.getElapsedTime(sessionId) > context.maxDuration;
  }

  /**
   * Check if question limit exceeded
   */
  isQuestionLimitExceeded(sessionId: string): boolean {
    const context = this.contexts.get(sessionId);
    if (!context) return false;

    return context.metrics.questionCount >= context.maxQuestions;
  }

  /**
   * Get remaining time
   */
  getRemainingTime(sessionId: string): number {
    const context = this.contexts.get(sessionId);
    if (!context) return 0;

    return Math.max(0, context.maxDuration - this.getElapsedTime(sessionId));
  }

  /**
   * Get remaining questions
   */
  getRemainingQuestions(sessionId: string): number {
    const context = this.contexts.get(sessionId);
    if (!context) return 0;

    return Math.max(0, context.maxQuestions - context.metrics.questionCount);
  }

  /**
   * Get phase progress
   */
  getPhaseProgress(sessionId: string): {
    currentPhase: InterviewPhase;
    phaseDuration: number;
    totalDuration: number;
    progress: number; // 0-1
  } {
    const context = this.contexts.get(sessionId);
    if (!context) {
      return {
        currentPhase: InterviewPhase.INTRODUCTION,
        phaseDuration: 0,
        totalDuration: 0,
        progress: 0,
      };
    }

    const phaseDuration = this.getPhaseDuration(sessionId);
    const totalDuration = this.getElapsedTime(sessionId);
    const totalPhases = Object.keys(InterviewPhase).length;
    const currentPhaseIndex = Object.keys(InterviewPhase).indexOf(context.phase);
    const progress = (currentPhaseIndex + phaseDuration / 300) / totalPhases; // Assume 5 min per phase

    return {
      currentPhase: context.phase,
      phaseDuration,
      totalDuration,
      progress: Math.min(1, Math.max(0, progress)),
    };
  }

  /**
   * Initialize phase goals
   */
  private initializePhaseGoals(): Map<InterviewPhase, string[]> {
    const goals = new Map<InterviewPhase, string[]>();

    goals.set(InterviewPhase.INTRODUCTION, [
      "Establish rapport",
      "Explain interview structure",
      "Set expectations",
    ]);

    goals.set(InterviewPhase.ICE_BREAKER, [
      "Make candidate comfortable",
      "Assess communication style",
      "Gauge initial engagement",
    ]);

    goals.set(InterviewPhase.CV, [
      "Review experience",
      "Validate skills",
      "Identify gaps",
    ]);

    goals.set(InterviewPhase.SOFT_SKILLS, [
      "Assess communication",
      "Evaluate teamwork",
      "Test problem-solving",
    ]);

    goals.set(InterviewPhase.TECHNICAL, [
      "Test technical knowledge",
      "Evaluate depth",
      "Check practical application",
    ]);

    goals.set(InterviewPhase.CASE_STUDY, [
      "Present realistic scenario",
      "Observe approach",
      "Evaluate decision-making",
    ]);

    goals.set(InterviewPhase.PRESSURE, [
      "Test under pressure",
      "Observe stress response",
      "Evaluate resilience",
    ]);

    goals.set(InterviewPhase.CANDIDATE_QUESTIONS, [
      "Answer candidate questions",
      "Provide clarity",
      "Assess interest",
    ]);

    goals.set(InterviewPhase.FINAL_DECISION, [
      "Summarize findings",
      "Make recommendation",
      "Explain next steps",
    ]);

    goals.set(InterviewPhase.REPORT, [
      "Generate report",
      "Document findings",
      "Provide feedback",
    ]);

    return goals;
  }

  /**
   * Get current phase goals
   */
  getCurrentPhaseGoals(sessionId: string): string[] {
    const context = this.contexts.get(sessionId);
    if (!context) return [];

    return context.phaseGoals.get(context.phase) || [];
  }

  /**
   * Get completed goals for current phase
   */
  getCompletedPhaseGoals(sessionId: string): string[] {
    const context = this.contexts.get(sessionId);
    if (!context) return [];

    const currentGoals = context.phaseGoals.get(context.phase) || [];
    return context.completedGoals.filter(goal => currentGoals.includes(goal));
  }

  /**
   * Check if phase goals completed
   */
  arePhaseGoalsCompleted(sessionId: string): boolean {
    const currentGoals = this.getCurrentPhaseGoals(sessionId);
    const completedGoals = this.getCompletedPhaseGoals(sessionId);

    return currentGoals.length === completedGoals.length;
  }

  /**
   * Delete context
   */
  deleteContext(sessionId: string): void {
    this.contexts.delete(sessionId);
  }

  /**
   * Get all contexts
   */
  getAllContexts(): InterviewContext[] {
    return Array.from(this.contexts.values());
  }

  /**
   * Clear all contexts
   */
  clearAll(): void {
    this.contexts.clear();
  }
}

export const interviewContextManager = InterviewContextManager.getInstance();
