/**
 * DirectorDecision - Value Object
 * 
 * Decisions made by the Conversation Director.
 * The Director NEVER generates text, only strategic decisions.
 */

import { z } from 'zod';
import { CompetencyName } from '../evaluation/value-objects/CompetencyEvaluation';
import { InterviewStage } from '../interview/entities/InterviewSession';
import { PersonaTone, FollowupStrategy } from '../persona/value-objects/PersonaParameters';

export enum DirectorAction {
  CONTINUE_CURRENT_TOPIC = 'continue_current_topic',
  CHANGE_TOPIC = 'change_topic',
  DEEPEN_CURRENT_TOPIC = 'deepen_current_topic',
  INTERRUPT = 'interrupt',
  FOLLOW_UP = 'follow_up',
  CHALLENGE = 'challenge',
  REQUEST_METRICS = 'request_metrics',
  REQUEST_EVIDENCE = 'request_evidence',
  SLOW_DOWN = 'slow_down',
  SPEED_UP = 'speed_up',
  INCREASE_PRESSURE = 'increase_pressure',
  DECREASE_PRESSURE = 'decrease_pressure',
  REVISIT_TOPIC = 'revisit_topic',
  DETECT_EVASION = 'detect_evasion',
  DETECT_AI_RESPONSE = 'detect_ai_response',
  DETECT_VAGUE_RESPONSE = 'detect_vague_response',
  CONCLUDE_STAGE = 'conclude_stage',
  MOVE_TO_NEXT_STAGE = 'move_to_next_stage',
  REQUEST_CLARIFICATION = 'request_clarification',
  VALIDATE_UNDERSTANDING = 'validate_understanding',
  PROVIDE_HINT = 'provide_hint',
  END_INTERVIEW = 'end_interview',
}

export interface DirectorDecision {
  id: string;
  sessionId: string;
  timestamp: Date;
  action: DirectorAction;
  
  // Context
  currentStage: InterviewStage;
  currentCompetency: CompetencyName;
  candidateState: CandidateStateSnapshot;
  
  // Decision parameters
  targetCompetency?: CompetencyName;
  targetStage?: InterviewStage;
  strategy?: string;
  intensity?: number; // 0-10
  reasoning: string;
  
  // Persona adjustments (if any)
  personaAdjustments?: PersonaAdjustments;
  
  // Validation
  confidence: number; // 0-100
  requiresApproval: boolean;
}

export interface CandidateStateSnapshot {
  stressLevel: number; // 0-100
  confidence: number; // 0-100
  engagement: number; // 0-100
  speakingRate: number; // words per minute
  lastResponseQuality: 'excellent' | 'good' | 'fair' | 'poor';
  timeInCurrentStage: number; // seconds
  totalElapsedTime: number; // seconds
  recentTopics: string[];
  pendingTopics: string[];
}

export interface PersonaAdjustments {
  warmth?: number; // -5 to +5 adjustment
  pressure?: number; // -5 to +5 adjustment
  aggressiveness?: number; // -5 to +5 adjustment
  interruptions?: number; // -5 to +5 adjustment
  tone?: PersonaTone;
  followupStrategy?: FollowupStrategy;
}

export interface ConversationStrategy {
  id: string;
  name: string;
  description: string;
  applicableStages: InterviewStage[];
  applicableCompetencies: CompetencyName[];
  actions: DirectorAction[];
  conditions: StrategyCondition[];
}

export interface StrategyCondition {
  type: 'stress_threshold' | 'confidence_threshold' | 'time_threshold' | 'competency_threshold' | 'evasion_detected';
  operator: 'gte' | 'lte' | 'eq' | 'gt' | 'lt';
  value: number;
}

export const DirectorDecisionSchema = z.object({
  id: z.string().uuid(),
  sessionId: z.string().uuid(),
  timestamp: z.date(),
  action: z.enum([
    'continue_current_topic',
    'change_topic',
    'deepen_current_topic',
    'interrupt',
    'follow_up',
    'challenge',
    'request_metrics',
    'request_evidence',
    'slow_down',
    'speed_up',
    'increase_pressure',
    'decrease_pressure',
    'revisit_topic',
    'detect_evasion',
    'detect_ai_response',
    'detect_vague_response',
    'conclude_stage',
    'move_to_next_stage',
    'request_clarification',
    'validate_understanding',
    'provide_hint',
    'end_interview',
  ]),
  currentStage: z.enum([
    'introduction',
    'ice_breaker',
    'presentation',
    'experience',
    'leadership',
    'conflict',
    'architecture',
    'system_design',
    'algorithms',
    'behavioral',
    'culture_fit',
    'candidate_questions',
    'conclusion',
  ]),
  currentCompetency: z.enum([
    'leadership',
    'ownership',
    'communication',
    'architecture',
    'algorithms',
    'problem_solving',
    'debugging',
    'product_sense',
    'mentoring',
    'learning',
    'conflict',
    'influence',
    'decision_making',
    'technical_depth',
    'business_impact',
  ]),
  candidateState: z.any(),
  targetCompetency: z.enum([
    'leadership',
    'ownership',
    'communication',
    'architecture',
    'algorithms',
    'problem_solving',
    'debugging',
    'product_sense',
    'mentoring',
    'learning',
    'conflict',
    'influence',
    'decision_making',
    'technical_depth',
    'business_impact',
  ]).optional(),
  targetStage: z.enum([
    'introduction',
    'ice_breaker',
    'presentation',
    'experience',
    'leadership',
    'conflict',
    'architecture',
    'system_design',
    'algorithms',
    'behavioral',
    'culture_fit',
    'candidate_questions',
    'conclusion',
  ]).optional(),
  strategy: z.string().optional(),
  intensity: z.number().min(0).max(10).optional(),
  reasoning: z.string(),
  personaAdjustments: z.any().optional(),
  confidence: z.number().min(0).max(100),
  requiresApproval: z.boolean(),
});

// Predefined conversation strategies
export const CONVERSATION_STRATEGIES: ConversationStrategy[] = [
  {
    id: 'strategy-build-confidence',
    name: 'Build Confidence',
    description: 'Reduce pressure and provide positive reinforcement for low-confidence candidates',
    applicableStages: [InterviewStage.INTRODUCTION, InterviewStage.ICE_BREAKER],
    applicableCompetencies: [CompetencyName.COMMUNICATION, CompetencyName.LEADERSHIP],
    actions: [DirectorAction.DECREASE_PRESSURE, DirectorAction.SLOW_DOWN, DirectorAction.PROVIDE_HINT],
    conditions: [
      { type: 'confidence_threshold', operator: 'lte', value: 40 },
      { type: 'stress_threshold', operator: 'gte', value: 70 },
    ],
  },
  {
    id: 'strategy-pressure-test',
    name: 'Pressure Test',
    description: 'Increase pressure to test stress handling for senior roles',
    applicableStages: [InterviewStage.LEADERSHIP, InterviewStage.CONFLICT, InterviewStage.ARCHITECTURE],
    applicableCompetencies: [CompetencyName.LEADERSHIP, CompetencyName.DECISION_MAKING],
    actions: [DirectorAction.INCREASE_PRESSURE, DirectorAction.CHALLENGE, DirectorAction.INTERRUPT],
    conditions: [
      { type: 'confidence_threshold', operator: 'gte', value: 60 },
      { type: 'stress_threshold', operator: 'lte', value: 50 },
    ],
  },
  {
    id: 'strategy-deep-dive',
    name: 'Deep Dive',
    description: 'Drill down into technical details when candidate shows expertise',
    applicableStages: [InterviewStage.ARCHITECTURE, InterviewStage.SYSTEM_DESIGN, InterviewStage.ALGORITHMS],
    applicableCompetencies: [CompetencyName.TECHNICAL_DEPTH, CompetencyName.ARCHITECTURE],
    actions: [DirectorAction.DEEPEN_CURRENT_TOPIC, DirectorAction.REQUEST_EVIDENCE, DirectorAction.REQUEST_METRICS],
    conditions: [
      { type: 'competency_threshold', operator: 'gte', value: 70 },
    ],
  },
  {
    id: 'strategy-evasion-handler',
    name: 'Evasion Handler',
    description: 'Detect and address evasive responses',
    applicableStages: Object.values(InterviewStage),
    applicableCompetencies: Object.values(CompetencyName),
    actions: [DirectorAction.DETECT_EVASION, DirectorAction.REQUEST_CLARIFICATION, DirectorAction.CHALLENGE],
    conditions: [
      { type: 'evasion_detected', operator: 'eq', value: 1 },
    ],
  },
  {
    id: 'strategy-time-press',
    name: 'Time Press',
    description: 'Speed up when running low on time',
    applicableStages: Object.values(InterviewStage),
    applicableCompetencies: Object.values(CompetencyName),
    actions: [DirectorAction.SPEED_UP, DirectorAction.CONCLUDE_STAGE, DirectorAction.MOVE_TO_NEXT_STAGE],
    conditions: [
      { type: 'time_threshold', operator: 'gte', value: 80 }, // 80% of stage time elapsed
    ],
  },
];
