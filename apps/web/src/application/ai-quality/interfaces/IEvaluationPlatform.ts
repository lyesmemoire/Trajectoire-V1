/**
 * AI Quality Platform - Core Interfaces
 * Defines the core interfaces for the AI evaluation platform
 */

import { z } from "zod";

// ============================================================================
// PART 1: SCENARIOS
// ============================================================================

export interface CandidateProfile {
  id: string;
  name: string;
  role: string;
  experience: number; // years
  softSkills: string[];
  hardSkills: string[];
  personality: string;
  stressLevel: number; // 0-10
  confidenceLevel: number; // 0-10
  communicationAbility: number; // 0-10
  language: string;
  accent?: string;
  frequentErrors: string[];
  strengths: string[];
  weaknesses: string[];
  responseStyle: "formal" | "casual" | "technical" | "enthusiastic";
}

export interface InterviewScenario {
  id: string;
  name: string;
  description: string;
  candidateProfile: CandidateProfile;
  jobTitle: string;
  level: "junior" | "mid" | "senior" | "expert";
  difficulty: "easy" | "medium" | "hard";
  duration: number; // minutes
  expectedTopics: string[];
  evaluationCriteria: string[];
}

export const CandidateProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  experience: z.number().min(0),
  softSkills: z.array(z.string()),
  hardSkills: z.array(z.string()),
  personality: z.string(),
  stressLevel: z.number().min(0).max(10),
  confidenceLevel: z.number().min(0).max(10),
  communicationAbility: z.number().min(0).max(10),
  language: z.string(),
  accent: z.string().optional(),
  frequentErrors: z.array(z.string()),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  responseStyle: z.enum(["formal", "casual", "technical", "enthusiastic"]),
});

export const InterviewScenarioSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  candidateProfile: CandidateProfileSchema,
  jobTitle: z.string(),
  level: z.enum(["junior", "mid", "senior", "expert"]),
  difficulty: z.enum(["easy", "medium", "hard"]),
  duration: z.number().min(1),
  expectedTopics: z.array(z.string()),
  evaluationCriteria: z.array(z.string()),
});

// ============================================================================
// PART 2: SYNTHETIC CANDIDATES
// ============================================================================

export interface SyntheticCandidate {
  id: string;
  profile: CandidateProfile;
  behavior: "excellent" | "good" | "average" | "poor" | "stressed" | "verbose" | "timid" | "overconfident" | "beginner" | "expert";
  responseStrategy: ResponseStrategy;
}

export interface ResponseStrategy {
  thinkingTime: number; // seconds
  responseLength: "short" | "medium" | "long";
  detailLevel: number; // 0-10
  honestyLevel: number; // 0-10
  questionFrequency: number; // questions asked per 10 turns
  hesitationRate: number; // 0-1
}

export const SyntheticCandidateSchema = z.object({
  id: z.string(),
  profile: CandidateProfileSchema,
  behavior: z.enum(["excellent", "good", "average", "poor", "stressed", "verbose", "timid", "overconfident", "beginner", "expert"]),
  responseStrategy: z.object({
    thinkingTime: z.number().min(0),
    responseLength: z.enum(["short", "medium", "long"]),
    detailLevel: z.number().min(0).max(10),
    honestyLevel: z.number().min(0).max(10),
    questionFrequency: z.number().min(0),
    hesitationRate: z.number().min(0).max(1),
  }),
});

// ============================================================================
// PART 3: EVALUATION
// ============================================================================

export interface ConversationEvaluation {
  id: string;
  conversationId: string;
  scenarioId: string;
  timestamp: Date;
  overallScore: number; // 0-100
  criteriaScores: CriteriaScores;
  metrics: QualityMetrics;
  feedback: string;
  passed: boolean;
}

export interface CriteriaScores {
  coherence: number; // 0-10
  relevance: number; // 0-10
  variety: number; // 0-10
  naturalness: number; // 0-10
  fluency: number; // 0-10
  personality: number; // 0-10
  realism: number; // 0-10
  listeningAbility: number; // 0-10
  followUpQuality: number; // 0-10
  silenceManagement: number; // 0-10
  stressManagement: number; // 0-10
  adaptation: number; // 0-10
  repetitionAvoidance: number; // 0-10
  cvRespect: number; // 0-10
  contextRespect: number; // 0-10
  difficultyRespect: number; // 0-10
}

export const CriteriaScoresSchema = z.object({
  coherence: z.number().min(0).max(10),
  relevance: z.number().min(0).max(10),
  variety: z.number().min(0).max(10),
  naturalness: z.number().min(0).max(10),
  fluency: z.number().min(0).max(10),
  personality: z.number().min(0).max(10),
  realism: z.number().min(0).max(10),
  listeningAbility: z.number().min(0).max(10),
  followUpQuality: z.number().min(0).max(10),
  silenceManagement: z.number().min(0).max(10),
  stressManagement: z.number().min(0).max(10),
  adaptation: z.number().min(0).max(10),
  repetitionAvoidance: z.number().min(0).max(10),
  cvRespect: z.number().min(0).max(10),
  contextRespect: z.number().min(0).max(10),
  difficultyRespect: z.number().min(0).max(10),
});

// ============================================================================
// PART 4: QUALITY METRICS
// ============================================================================

export interface QualityMetrics {
  questionRepetitionRate: number; // 0-1
  promptSize: number; // tokens
  promptCost: number; // USD
  conversationLength: number; // turns
  averageTurns: number;
  averageTokens: number;
  openaiCost: number; // USD
  hallucinationRate: number; // 0-1
  relevanceScore: number; // 0-1
  conversationFlowScore: number; // 0-1
  humanLikeScore: number; // 0-1
  recruiterConsistency: number; // 0-1
  emotionConsistency: number; // 0-1
  followUpQuality: number; // 0-1
  interviewCoverage: number; // 0-1
  evaluationAccuracy: number; // 0-1
  reportAccuracy: number; // 0-1
  coachingAccuracy: number; // 0-1
  latency: number; // ms
  throughput: number; // conversations/minute
}

export const QualityMetricsSchema = z.object({
  questionRepetitionRate: z.number().min(0).max(1),
  promptSize: z.number().min(0),
  promptCost: z.number().min(0),
  conversationLength: z.number().min(0),
  averageTurns: z.number().min(0),
  averageTokens: z.number().min(0),
  openaiCost: z.number().min(0),
  hallucinationRate: z.number().min(0).max(1),
  relevanceScore: z.number().min(0).max(1),
  conversationFlowScore: z.number().min(0).max(1),
  humanLikeScore: z.number().min(0).max(1),
  recruiterConsistency: z.number().min(0).max(1),
  emotionConsistency: z.number().min(0).max(1),
  followUpQuality: z.number().min(0).max(1),
  interviewCoverage: z.number().min(0).max(1),
  evaluationAccuracy: z.number().min(0).max(1),
  reportAccuracy: z.number().min(0).max(1),
  coachingAccuracy: z.number().min(0).max(1),
  latency: z.number().min(0),
  throughput: z.number().min(0),
});

// ============================================================================
// PART 5: GOLDEN DATASET
// ============================================================================

export interface GoldenConversation {
  id: string;
  scenarioId: string;
  conversation: ConversationTurn[];
  expectedEvaluation: CriteriaScores;
  expectedMetrics: QualityMetrics;
  createdAt: Date;
  version: string;
  isImmutable: boolean;
}

export interface ConversationTurn {
  id: string;
  role: "recruiter" | "candidate";
  content: string;
  timestamp: Date;
  tokens?: number;
  latency?: number;
  metadata?: Record<string, unknown>;
}

export const ConversationTurnSchema = z.object({
  id: z.string(),
  role: z.enum(["recruiter", "candidate"]),
  content: z.string(),
  timestamp: z.date(),
  tokens: z.number().optional(),
  latency: z.number().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const GoldenConversationSchema = z.object({
  id: z.string(),
  scenarioId: z.string(),
  conversation: z.array(ConversationTurnSchema),
  expectedEvaluation: CriteriaScoresSchema,
  expectedMetrics: QualityMetricsSchema,
  createdAt: z.date(),
  version: z.string(),
  isImmutable: z.boolean(),
});

// ============================================================================
// PART 6: REGRESSION
// ============================================================================

export interface RegressionTestResult {
  testId: string;
  timestamp: Date;
  version: string;
  previousVersion: string;
  totalSimulations: number;
  passedSimulations: number;
  failedSimulations: number;
  overallScore: number;
  previousScore: number;
  scoreDelta: number;
  metricsComparison: MetricsComparison;
  criteriaComparison: CriteriaComparison;
  passed: boolean;
  failures: RegressionFailure[];
}

export interface MetricsComparison {
  current: QualityMetrics;
  previous: QualityMetrics;
  deltas: Partial<Record<keyof QualityMetrics, number>>;
  improved: (keyof QualityMetrics)[];
  degraded: (keyof QualityMetrics)[];
}

export interface CriteriaComparison {
  current: CriteriaScores;
  previous: CriteriaScores;
  deltas: Partial<Record<keyof CriteriaScores, number>>;
  improved: (keyof CriteriaScores)[];
  degraded: (keyof CriteriaScores)[];
}

export interface RegressionFailure {
  scenarioId: string;
  reason: string;
  metric?: keyof QualityMetrics;
  criterion?: keyof CriteriaScores;
  expected: number;
  actual: number;
  threshold: number;
}

export const RegressionTestResultSchema = z.object({
  testId: z.string(),
  timestamp: z.date(),
  version: z.string(),
  previousVersion: z.string(),
  totalSimulations: z.number().min(0),
  passedSimulations: z.number().min(0),
  failedSimulations: z.number().min(0),
  overallScore: z.number().min(0).max(100),
  previousScore: z.number().min(0).max(100),
  scoreDelta: z.number(),
  metricsComparison: z.object({
    current: QualityMetricsSchema,
    previous: QualityMetricsSchema,
    deltas: z.record(z.string(), z.number()),
    improved: z.array(z.string()),
    degraded: z.array(z.string()),
  }),
  criteriaComparison: z.object({
    current: CriteriaScoresSchema,
    previous: CriteriaScoresSchema,
    deltas: z.record(z.string(), z.number()),
    improved: z.array(z.string()),
    degraded: z.array(z.string()),
  }),
  passed: z.boolean(),
  failures: z.array(z.object({
    scenarioId: z.string(),
    reason: z.string(),
    metric: z.string().optional(),
    criterion: z.string().optional(),
    expected: z.number(),
    actual: z.number(),
    threshold: z.number(),
  })),
});

// ============================================================================
// PART 7: PROMPT VERSIONING
// ============================================================================

export interface PromptVersion {
  id: string;
  promptId: string;
  version: string;
  createdAt: Date;
  createdBy: string;
  objective: string;
  variables: string[];
  template: string;
  cost: number; // USD per 1000 tokens
  qualityScore: number; // 0-100
  history: PromptVersionHistory[];
  isActive: boolean;
}

export interface PromptVersionHistory {
  version: string;
  timestamp: Date;
  change: string;
  author: string;
  metrics?: QualityMetrics;
}

export const PromptVersionSchema = z.object({
  id: z.string(),
  promptId: z.string(),
  version: z.string(),
  createdAt: z.date(),
  createdBy: z.string(),
  objective: z.string(),
  variables: z.array(z.string()),
  template: z.string(),
  cost: z.number().min(0),
  qualityScore: z.number().min(0).max(100),
  history: z.array(z.object({
    version: z.string(),
    timestamp: z.date(),
    change: z.string(),
    author: z.string(),
    metrics: QualityMetricsSchema.optional(),
  })),
  isActive: z.boolean(),
});

// ============================================================================
// PART 8: A/B TESTING
// ============================================================================

export interface ABTest {
  id: string;
  name: string;
  description: string;
  promptA: PromptVersion;
  promptB: PromptVersion;
  createdAt: Date;
  status: "running" | "completed" | "paused";
  totalParticipants: number;
  participantsA: number;
  participantsB: number;
  results: ABTestResults;
}

export interface ABTestResults {
  qualityScoreA: number;
  qualityScoreB: number;
  costA: number;
  costB: number;
  latencyA: number;
  latencyB: number;
  satisfactionA: number;
  satisfactionB: number;
  successRateA: number;
  successRateB: number;
  winner: "A" | "B" | "tie" | "inconclusive";
  confidence: number; // 0-1
  statisticalSignificance: boolean;
}

export const ABTestSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  promptA: PromptVersionSchema,
  promptB: PromptVersionSchema,
  createdAt: z.date(),
  status: z.enum(["running", "completed", "paused"]),
  totalParticipants: z.number().min(0),
  participantsA: z.number().min(0),
  participantsB: z.number().min(0),
  results: z.object({
    qualityScoreA: z.number().min(0).max(100),
    qualityScoreB: z.number().min(0).max(100),
    costA: z.number().min(0),
    costB: z.number().min(0),
    latencyA: z.number().min(0),
    latencyB: z.number().min(0),
    satisfactionA: z.number().min(0).max(100),
    satisfactionB: z.number().min(0).max(100),
    successRateA: z.number().min(0).max(1),
    successRateB: z.number().min(0).max(1),
    winner: z.enum(["A", "B", "tie", "inconclusive"]),
    confidence: z.number().min(0).max(1),
    statisticalSignificance: z.boolean(),
  }),
});

// ============================================================================
// PART 9: REPLAY
// ============================================================================

export interface ConversationReplay {
  id: string;
  originalConversationId: string;
  replayedAt: Date;
  originalVersion: string;
  replayVersion: string;
  turns: ReplayTurn[];
  comparison: ReplayComparison;
}

export interface ReplayTurn {
  original: ConversationTurn;
  replayed: ConversationTurn;
  difference: string;
  similarity: number; // 0-1
}

export interface ReplayComparison {
  overallSimilarity: number; // 0-1
  qualityDelta: number;
  costDelta: number;
  latencyDelta: number;
  differences: string[];
}

export const ConversationReplaySchema = z.object({
  id: z.string(),
  originalConversationId: z.string(),
  replayedAt: z.date(),
  originalVersion: z.string(),
  replayVersion: z.string(),
  turns: z.array(z.object({
    original: ConversationTurnSchema,
    replayed: ConversationTurnSchema,
    difference: z.string(),
    similarity: z.number().min(0).max(1),
  })),
  comparison: z.object({
    overallSimilarity: z.number().min(0).max(1),
    qualityDelta: z.number(),
    costDelta: z.number(),
    latencyDelta: z.number(),
    differences: z.array(z.string()),
  }),
});

// ============================================================================
// PART 10: EVALUATION HISTORY
// ============================================================================

export interface EvaluationHistory {
  evaluationId: string;
  timestamp: Date;
  version: string;
  overallScore: number;
  criteriaScores: CriteriaScores;
  metrics: QualityMetrics;
  scenarioId: string;
  conversationId: string;
}

export const EvaluationHistorySchema = z.object({
  evaluationId: z.string(),
  timestamp: z.date(),
  version: z.string(),
  overallScore: z.number().min(0).max(100),
  criteriaScores: CriteriaScoresSchema,
  metrics: QualityMetricsSchema,
  scenarioId: z.string(),
  conversationId: z.string(),
});

// ============================================================================
// PART 11: VERSION COMPARATOR
// ============================================================================

export interface VersionComparison {
  versionA: string;
  versionB: string;
  timestamp: Date;
  overallScoreA: number;
  overallScoreB: number;
  scoreDelta: number;
  criteriaComparison: CriteriaComparison;
  metricsComparison: MetricsComparison;
  recommendation: "deploy" | "hold" | "rollback";
  reason: string;
}

export const VersionComparisonSchema = z.object({
  versionA: z.string(),
  versionB: z.string(),
  timestamp: z.date(),
  overallScoreA: z.number().min(0).max(100),
  overallScoreB: z.number().min(0).max(100),
  scoreDelta: z.number(),
  criteriaComparison: z.object({
    current: CriteriaScoresSchema,
    previous: CriteriaScoresSchema,
    deltas: z.record(z.string(), z.number()),
    improved: z.array(z.string()),
    degraded: z.array(z.string()),
  }),
  metricsComparison: z.object({
    current: QualityMetricsSchema,
    previous: QualityMetricsSchema,
    deltas: z.record(z.string(), z.number()),
    improved: z.array(z.string()),
    degraded: z.array(z.string()),
  }),
  recommendation: z.enum(["deploy", "hold", "rollback"]),
  reason: z.string(),
});
