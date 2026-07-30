// ===================================================================
// COGNITIVE DOMAIN — Barrel Export
// All cognitive entities for the Interview Operating System
// ===================================================================

// Primitives
export { KnowledgeNodeSchema, NodeStatusSchema, NodeTypeSchema } from "./Node";
export type { KnowledgeNode, NodeStatus, NodeType } from "./Node";

export { KnowledgeEdgeSchema, EdgeRelationSchema } from "./Edge";
export type { KnowledgeEdge, EdgeRelation } from "./Edge";

// Evidence & Confidence
export {
  EvidenceSchema,
  EvidenceStrengthSchema,
  ConfidenceFactorsSchema,
  ConfidenceDeltaSchema,
  computeConfidence,
} from "./Evidence";
export type { Evidence, EvidenceStrength, ConfidenceFactors, ConfidenceDelta } from "./Evidence";

export {
  CompetencyConfidenceSchema,
  ConfidenceMatrixSchema,
  createInitialConfidence,
  applyConfidenceDelta,
} from "./Confidence";
export type { CompetencyConfidence, ConfidenceMatrix } from "./Confidence";

// Competency
export {
  CompetencySchema,
  CompetencyStatusSchema,
  deriveCompetencyStatus,
  createCompetency,
} from "./Competency";
export type { Competency, CompetencyStatus } from "./Competency";

// Hypothesis
export {
  HypothesisSchema,
  HypothesisStatusSchema,
  deriveHypothesisStatus,
} from "./Hypothesis";
export type { Hypothesis, HypothesisStatus } from "./Hypothesis";

// Unknown
export {
  UnknownSchema,
  UnknownPrioritySchema,
  isUnknownResolved,
  computeInvestigationPriority,
} from "./Unknown";
export type { Unknown, UnknownPriority } from "./Unknown";

// Weak Signal
export {
  WeakSignalSchema,
  WeakSignalTypeSchema,
  WeakSignalSeveritySchema,
  computeWeakSignalPenalty,
} from "./WeakSignal";
export type { WeakSignal, WeakSignalType, WeakSignalSeverity } from "./WeakSignal";

// Interview Budget
export {
  InterviewBudgetSchema,
  createInitialBudget,
  consumeBudget,
  isBudgetExhausted,
} from "./InterviewBudget";
export type { InterviewBudget } from "./InterviewBudget";

// Interview Goal
export { InterviewGoalSchema, GoalHorizonSchema } from "./InterviewGoal";
export type { InterviewGoal, GoalHorizon } from "./InterviewGoal";

// Decision
export { DecisionSchema, DecisionTypeSchema } from "./Decision";
export type { Decision, DecisionType } from "./Decision";

// Strategy
export {
  StrategySchema,
  InterviewTempoSchema,
  QuestionDepthSchema,
  ChallengeLevelSchema,
} from "./Strategy";
export type { Strategy, InterviewTempo, QuestionDepth, ChallengeLevel } from "./Strategy";

// Risk
export {
  RiskSchema,
  RiskTypeSchema,
  RiskLevelSchema,
  computeGlobalRiskLevel,
} from "./Risk";
export type { Risk, RiskType, RiskLevel } from "./Risk";

// Knowledge Graph
export { KnowledgeGraph, KnowledgeGraphSchema } from "./KnowledgeGraph";
export type { KnowledgeGraphData } from "./KnowledgeGraph";

// Cognitive State (Top-level aggregate)
export {
  CognitiveState,
  CognitiveStateSchema,
  InterviewPhaseSchema,
} from "./CognitiveState";
export type { CognitiveStateData, InterviewPhase } from "./CognitiveState";
