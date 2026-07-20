/**
 * Conversation State Entity
 * Represents the complete state of an interview conversation
 * Tracks personal information, emotional state, interview progress, and evaluated competencies
 */

import { z } from "zod";

// Personal Information
export const PersonalInfoSchema = z.object({
  name: z.string().optional(),
  jobTitle: z.string(),
  level: z.string(),
  experience: z.string().optional(),
  language: z.string().default("fr"),
  sector: z.string().optional(),
});

export type PersonalInfo = z.infer<typeof PersonalInfoSchema>;

// Emotional State
export const EmotionalStateSchema = z.object({
  stress: z.number().min(0).max(1).default(0.5), // 0-1 scale
  confidence: z.number().min(0).max(1).default(0.5),
  hesitation: z.number().min(0).max(1).default(0.5),
  fluidity: z.number().min(0).max(1).default(0.5),
  fatigue: z.number().min(0).max(1).default(0),
  motivation: z.number().min(0).max(1).default(0.5),
});

export type EmotionalState = z.infer<typeof EmotionalStateSchema>;

// Interview Phase
export enum InterviewPhase {
  INTRODUCTION = "introduction",
  GENERAL_QUESTIONS = "general_questions",
  COMPETENCIES = "competencies",
  PROJECTS = "projects",
  DIFFICULTIES = "difficulties",
  SITUATIONAL = "situational",
  FINAL_QUESTIONS = "final_questions",
  CONCLUSION = "conclusion",
}

// Competency with confidence score
export const CompetencyEvaluationSchema = z.object({
  name: z.string(),
  score: z.number().min(0).max(1), // 0-1 confidence score
  evaluated: z.boolean().default(false),
  examples: z.array(z.string()).default([]),
  strengths: z.array(z.string()).default([]),
  weaknesses: z.array(z.string()).default([]),
  lastEvaluatedAt: z.date().optional(),
});

export type CompetencyEvaluation = z.infer<typeof CompetencyEvaluationSchema>;

// Predefined competencies
export const COMPETENCIES = [
  "communication",
  "leadership",
  "organization",
  "time_management",
  "problem_solving",
  "teamwork",
  "adaptability",
  "autonomy",
  "motivation",
  "company_culture",
] as const;

export type CompetencyName = typeof COMPETENCIES[number];

// Conversation State
export const ConversationStateSchema = z.object({
  sessionId: z.string(),
  userId: z.string(),
  personalInfo: PersonalInfoSchema,
  emotionalState: EmotionalStateSchema,
  currentPhase: z.nativeEnum(InterviewPhase).default(InterviewPhase.INTRODUCTION),
  evaluatedCompetencies: z.record(z.string(), CompetencyEvaluationSchema).default({}),
  startTime: z.date(),
  endTime: z.date().optional(),
  durationMinutes: z.number().default(30),
  messagesCount: z.number().default(0),
  lastQuestionId: z.string().optional(),
  lastTopic: z.string().optional(),
  memory: z.record(z.string(), z.any()).default({}), // Intelligent memory of projects, technologies, etc.
});

export type ConversationState = z.infer<typeof ConversationStateSchema>;

export class ConversationStateEntity {
  private state: ConversationState;

  constructor(props: ConversationState) {
    this.state = ConversationStateSchema.parse(props);
  }

  // Getters
  get sessionId(): string {
    return this.state.sessionId;
  }

  get userId(): string {
    return this.state.userId;
  }

  get personalInfo(): PersonalInfo {
    return this.state.personalInfo;
  }

  get emotionalState(): EmotionalState {
    return this.state.emotionalState;
  }

  get currentPhase(): InterviewPhase {
    return this.state.currentPhase;
  }

  get evaluatedCompetencies(): Record<string, CompetencyEvaluation> {
    return this.state.evaluatedCompetencies;
  }

  get startTime(): Date {
    return this.state.startTime;
  }

  get endTime(): Date | undefined {
    return this.state.endTime;
  }

  get durationMinutes(): number {
    return this.state.durationMinutes;
  }

  get messagesCount(): number {
    return this.state.messagesCount;
  }

  get memory(): Record<string, any> {
    return this.state.memory;
  }

  // Setters
  setPersonalInfo(info: Partial<PersonalInfo>): void {
    this.state.personalInfo = { ...this.state.personalInfo, ...info };
  }

  setEmotionalState(state: Partial<EmotionalState>): void {
    this.state.emotionalState = { ...this.state.emotionalState, ...state };
  }

  setCurrentPhase(phase: InterviewPhase): void {
    this.state.currentPhase = phase;
  }

  setCompetencyEvaluation(
    competency: string,
    evaluation: Partial<CompetencyEvaluation>
  ): void {
    const current = this.state.evaluatedCompetencies[competency] || {
      name: competency,
      score: 0,
      evaluated: false,
      examples: [],
      strengths: [],
      weaknesses: [],
    };
    this.state.evaluatedCompetencies[competency] = {
      ...current,
      ...evaluation,
      lastEvaluatedAt: new Date(),
    };
  }

  incrementMessagesCount(): void {
    this.state.messagesCount++;
  }

  setMemory(key: string, value: any): void {
    this.state.memory[key] = value;
  }

  getMemory(key: string): any {
    return this.state.memory[key];
  }

  // Business logic
  getCompetencyScore(competency: string): number {
    return this.state.evaluatedCompetencies[competency]?.score || 0;
  }

  isCompetencyEvaluated(competency: string): boolean {
    return this.state.evaluatedCompetencies[competency]?.evaluated || false;
  }

  getEvaluatedCompetenciesCount(): number {
    return Object.values(this.state.evaluatedCompetencies).filter((c) => c.evaluated).length;
  }

  getTotalCompetenciesCount(): number {
    return COMPETENCIES.length;
  }

  getProgress(): number {
    return this.getEvaluatedCompetenciesCount() / this.getTotalCompetenciesCount();
  }

  getElapsedTime(): number {
    const now = this.state.endTime || new Date();
    return (now.getTime() - this.state.startTime.getTime()) / 1000 / 60; // minutes
  }

  getTimeRemaining(): number {
    return Math.max(0, this.state.durationMinutes - this.getElapsedTime());
  }

  isTimeRunningLow(): boolean {
    return this.getTimeRemaining() < 5; // Less than 5 minutes
  }

  shouldAdvancePhase(): boolean {
    const phaseProgress = this.getPhaseProgress();
    return phaseProgress >= 0.8; // 80% progress in current phase
  }

  getPhaseProgress(): number {
    // Simplified logic - in reality this would be more sophisticated
    switch (this.state.currentPhase) {
      case InterviewPhase.INTRODUCTION:
        return this.state.messagesCount > 2 ? 1 : 0.5;
      case InterviewPhase.COMPETENCIES:
        return this.getProgress();
      default:
        return 0.5;
    }
  }

  // Serialization
  toPersistence(): ConversationState {
    return { ...this.state };
  }

  static fromPersistence(data: ConversationState): ConversationStateEntity {
    return new ConversationStateEntity(data);
  }
}
