/**
 * IHIIOSKernel - Interfaces pour le Kernel de HIIOS v4.0
 * Layer 0 : Noyau central du moteur cognitif
 */

// ============================================================================
// TYPES DE BASE
// ============================================================================

export type Skill = string;
export type Topic = string;
export type InterviewState = string;
export type Timestamp = number;

// ============================================================================
// EVIDENCE TYPES
// ============================================================================

export enum EvidenceType {
  CITATION = "CITATION",
  BEHAVIOR = "BEHAVIOR",
  ABSENCE = "ABSENCE",
  PATTERN = "PATTERN",
}

export enum EvidenceReliability {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export enum EvidenceDirection {
  CONFIRMS = "CONFIRMS",
  INFIRMS = "INFIRMS",
  NEUTRAL = "NEUTRAL",
}

export interface BiasCheck {
  hasBias: boolean;
  biasType?: BiasType;
  penalty?: number;
}

export interface Evidence {
  id: string;
  turn: number;
  timestamp: Timestamp;
  type: EvidenceType;
  rawContent: string;
  weight: number; // 0.0 → 1.0
  reliability: EvidenceReliability;
  context: string;
  skillsImpacted: Skill[];
  hypothesesImpacted: string[];
  direction: EvidenceDirection;
  biasCheck: BiasCheck;
}

// ============================================================================
// HYPOTHESIS TYPES
// ============================================================================

export enum HypothesisStatus {
  GENERATED = "GENERATED",
  ACTIVE = "ACTIVE",
  CONFIRMED = "CONFIRMED",
  INFIRMED = "INFIRMED",
  SUSPENDED = "SUSPENDED",
}

export interface Hypothesis {
  id: string;
  label: string;
  skillNode: Skill;
  status: HypothesisStatus;
  prior: number;
  posterior: number;
  evidenceFor: Evidence[];
  evidenceAgainst: Evidence[];
  contradictions: Contradiction[];
  openQuestions: Question[];
  createdAtTurn: number;
  lastUpdated: number;
  confidence: number; // = posterior
}

// ============================================================================
// CONTRADICTION TYPES
// ============================================================================

export enum ContradictionType {
  DIRECT = "DIRECT",
  IMPLICIT = "IMPLICIT",
  PATTERN_BREAK = "PATTERN_BREAK",
}

export enum ContradictionSeverity {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  FATAL = "FATAL",
}

export enum ContradictionResolution {
  PENDING = "PENDING",
  EXPLORED = "EXPLORED",
  EXPLAINED = "EXPLAINED",
  UNRESOLVED = "UNRESOLVED",
}

export interface Contradiction {
  id: string;
  hypothesisId: string;
  evidenceId: string;
  type: ContradictionType;
  severity: ContradictionSeverity;
  bayesianImpact: number;
  resolution: ContradictionResolution;
}

// ============================================================================
// BIAS TYPES
// ============================================================================

export enum BiasType {
  HALO_EFFECT = "HALO_EFFECT",
  SIMILARITY_BIAS = "SIMILARITY_BIAS",
  CONFIRMATION_BIAS = "CONFIRMATION_BIAS",
  ANCHORING = "ANCHORING",
  CONTRAST_EFFECT = "CONTRAST_EFFECT",
  ATTRIBUTION_ERROR = "ATTRIBUTION_ERROR",
}

export interface BiasEvent {
  id: string;
  turn: number;
  biasType: BiasType;
  trigger: string;
  affectedHypothesis: string;
  confidencePenalty: number;
  mandatoryAction: string;
  resolved: boolean;
}

// ============================================================================
// CONFIDENCE LEVELS
// ============================================================================

export enum ConfidenceLevel {
  VERY_LOW = "VERY_LOW", // 0.00 — 0.39
  LOW = "LOW", // 0.40 — 0.59
  MODERATE = "MODERATE", // 0.60 — 0.74
  HIGH = "HIGH", // 0.75 — 0.89
  VERY_HIGH = "VERY_HIGH", // 0.90 — 1.00
}

export function getConfidenceLevel(confidence: number): ConfidenceLevel {
  if (confidence < 0.40) return ConfidenceLevel.VERY_LOW;
  if (confidence < 0.60) return ConfidenceLevel.LOW;
  if (confidence < 0.75) return ConfidenceLevel.MODERATE;
  if (confidence < 0.90) return ConfidenceLevel.HIGH;
  return ConfidenceLevel.VERY_HIGH;
}

// ============================================================================
// QUESTION TYPES
// ============================================================================

export interface Question {
  id: string;
  text: string;
  informationGain: number;
  targetHypothesesIds: string[];
  interviewState: InterviewState;
  empathyLevelRequired: number;
  contradictionTrigger: boolean;
  coachingTrigger: boolean;
}

export interface PlannedQuestion extends Question {
  targetHypotheses: Hypothesis[];
}

// ============================================================================
// SKILL GRAPH TYPES
// ============================================================================

export interface SkillNode {
  id: string;
  name: string;
  parent?: string;
  children: string[];
  weight: number;
  confidence: number;
}

export interface SkillGraph {
  nodes: Map<string, SkillNode>;
  edges: Map<string, { from: string; to: string; weight: number }[]>;
}

// ============================================================================
// TIMELINE TYPES
// ============================================================================

export interface Observation {
  id: string;
  type: string;
  content: string;
  timestamp: Timestamp;
}

export interface HypothesisUpdate {
  hypothesisId: string;
  oldPosterior: number;
  newPosterior: number;
  delta: number;
}

export interface TechniqueUsed {
  name: string;
  effectiveness: number;
}

export interface Turn {
  id: number;
  timestamp: Timestamp;
  interviewState: InterviewState;
  questionAsked: PlannedQuestion;
  candidateResponse: string;
  observations: Observation[];
  hypothesesUpdated: HypothesisUpdate[];
  evidenceAdded: Evidence[];
  contradictionsFound: Contradiction[];
  biasEvents: BiasEvent[];
  confidenceDelta: Map<string, number>;
  communicationTechnique: TechniqueUsed;
  empathyLevel: number;
  pressureLevel: number;
}

// ============================================================================
// CANDIDATE MEMORY TYPES
// ============================================================================

export interface Interview {
  id: string;
  date: Timestamp;
  turns: number;
  finalState: InterviewState;
}

export interface CandidateHistory {
  interviews: Interview[];
  totalTurns: number;
  resolvedQuestions: Question[];
  openQuestions: Question[];
  abandonedHypotheses: Hypothesis[];
}

export interface CurrentInterview {
  state: InterviewState;
  currentTopic: Topic;
  currentTurn: number;
  timeline: Turn[];
  activeHypotheses: Hypothesis[];
  evidenceStore: Evidence[];
  contradictionLog: Contradiction[];
  biasLog: BiasEvent[];
  confidenceMap: Map<Skill, number>;
}

export interface CandidateArchetype {
  id: string;
  name: string;
  description: string;
  baseRates: Map<Skill, number>;
}

export interface GrowthProfile {
  id: string;
  skills: Map<Skill, { current: number; target: number; trajectory: number }>;
}

export interface Candidate {
  id: string;
  sessionId: string;
  createdAt: Timestamp;
  history: CandidateHistory;
  currentInterview: CurrentInterview;
  archetype: CandidateArchetype;
  skillGraph: SkillGraph;
  growthProfile: GrowthProfile;
}

// ============================================================================
// KERNEL INTERFACE
// ============================================================================

export interface IHIIOSKernel {
  // Memory Engine
  getCandidate(candidateId: string): Candidate | null;
  updateCandidate(candidateId: string, update: Partial<Candidate>): void;
  getTimeline(candidateId: string): Turn[];
  addTurn(candidateId: string, turn: Turn): void;

  // Bayesian Engine
  calculatePosterior(
    prior: number,
    likelihood: number,
    evidenceProbability: number
  ): number;
  updateHypothesisConfidence(
    hypothesisId: string,
    evidence: Evidence,
    contradiction?: Contradiction
  ): number;

  // Evidence Engine
  addEvidence(candidateId: string, evidence: Evidence): void;
  getEvidence(candidateId: string, hypothesisId?: string): Evidence[];
  calculateEvidenceWeight(evidence: Evidence): number;

  // Hypothesis Engine
  generateHypotheses(observation: Observation): Hypothesis[];
  updateHypothesisStatus(hypothesisId: string, status: HypothesisStatus): void;
  getActiveHypotheses(candidateId: string): Hypothesis[];

  // Contradiction Engine
  generateContradiction(hypothesisId: string): Contradiction | null;
  resolveContradiction(contradictionId: string, resolution: ContradictionResolution): void;
  getContradictions(candidateId: string): Contradiction[];

  // Bias Engine
  detectBias(observation: Observation, hypothesisId: string): BiasEvent | null;
  resolveBias(biasId: string): void;
  getBiasEvents(candidateId: string): BiasEvent[];

  // Confidence Engine
  calculateConfidence(hypothesisId: string): number;
  getConfidenceLevel(hypothesisId: string): ConfidenceLevel;
  canConclude(candidateId: string): boolean;

  // Question Planner
  planNextQuestion(candidateId: string): PlannedQuestion;
  calculateInformationGain(question: Question, hypothesisId: string): number;

  // Skill Graph
  getSkillGraph(candidateId: string): SkillGraph;
  updateSkillConfidence(skill: string, delta: number): void;
  propagateEvidence(evidence: Evidence): void;

  // Timeline Engine
  getTurn(candidateId: string, turnId: number): Turn | null;
  explainDecision(candidateId: string, hypothesisId: string): string;
}

// ============================================================================
// DECISION TYPES
// ============================================================================

export enum DecisionType {
  STRONG_HIRE = "STRONG_HIRE",
  HIRE = "HIRE",
  MAYBE = "MAYBE",
  NO_HIRE = "NO_HIRE",
  STRONG_NO_HIRE = "STRONG_NO_HIRE",
}

export enum DecisionConfidence {
  VERY_LOW = "VERY_LOW",
  LOW = "LOW",
  MODERATE = "MODERATE",
  HIGH = "HIGH",
  VERY_HIGH = "VERY_HIGH",
}

export interface Decision {
  id: string;
  candidateId: string;
  sessionId: string;
  type: DecisionType;
  confidence: DecisionConfidence;
  overallScore: number;
  skillScores: Map<Skill, number>;
  reasoning: string;
  timestamp: Timestamp;
}
