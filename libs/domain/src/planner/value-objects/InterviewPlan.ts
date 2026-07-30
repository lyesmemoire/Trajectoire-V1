/**
 * InterviewPlan - Value Object
 * 
 * Complete interview plan with stages, objectives, and transitions.
 * Created by the Interview Planner, executed by the Orchestrator.
 */

import { z } from 'zod';
import { InterviewStage, Competency } from '../interview/entities/InterviewSession';

export interface StageObjective {
  id: string;
  stage: InterviewStage;
  name: string;
  description: string;
  order: number;
  
  // Objectives
  primaryObjective: string;
  secondaryObjectives: string[];
  
  // Competencies
  requiredCompetencies: Competency[];
  optionalCompetencies: Competency[];
  
  // Timing
  minDuration: number; // seconds
  maxDuration: number; // seconds
  targetDuration: number; // seconds
  
  // Exit conditions
  exitConditions: ExitCondition[];
  successCriteria: string[];
  
  // Questions
  questionCount: {
    min: number;
    max: number;
    target: number;
  };
  
  // Difficulty
  difficulty: {
    min: number; // 0-100
    max: number; // 0-100
    target: number; // 0-100
  };
  
  // Dependencies
  dependsOnStages: InterviewStage[];
  blocksStages: InterviewStage[];
}

export interface ExitCondition {
  id: string;
  type: ExitConditionType;
  value: number;
  operator: 'gte' | 'lte' | 'eq' | 'gt' | 'lt';
  description: string;
  mandatory: boolean;
}

export enum ExitConditionType {
  COMPETENCY_THRESHOLD = 'competency_threshold',
  TIME_ELAPSED = 'time_elapsed',
  QUESTION_COUNT = 'question_count',
  STRESS_LEVEL = 'stress_level',
  CONFIDENCE_LEVEL = 'confidence_level',
  MANUAL = 'manual',
  TOPIC_COVERAGE = 'topic_coverage',
}

export interface InterviewTransition {
  id: string;
  fromStage: InterviewStage;
  toStage: InterviewStage;
  trigger: TransitionTrigger;
  conditions: TransitionCondition[];
  version: number;
}

export interface TransitionTrigger {
  type: 'automatic' | 'manual' | 'conditional' | 'time_based';
  value?: number;
  description: string;
}

export interface TransitionCondition {
  type: string;
  operator: string;
  value: unknown;
}

export interface InterviewPlan {
  id: string;
  version: string;
  name: string;
  description: string;
  
  // Target
  targetRole: string;
  targetLevel: string;
  targetSeniority: 'junior' | 'mid' | 'senior' | 'staff' | 'principal';
  
  // Overall parameters
  totalDuration: number; // seconds
  difficulty: number; // 0-100
  intensity: number; // 0-100
  
  // Stages
  stages: StageObjective[];
  transitions: InterviewTransition[];
  
  // Persona
  defaultPersona: string;
  personaVariations: {
    stage: InterviewStage;
    persona: string;
  }[];
  
  // Difficulty progression
  difficultyProgression: {
    stage: InterviewStage;
    difficulty: number;
  }[];
  
  // Metadata
  createdAt: Date;
  createdBy: string;
  tags: string[];
}

export interface PlanTemplate {
  id: string;
  name: string;
  description: string;
  targetRoles: string[];
  targetLevels: string[];
  basePlan: Partial<InterviewPlan>;
  customizations: PlanCustomization[];
}

export interface PlanCustomization {
  type: 'add_stage' | 'remove_stage' | 'modify_stage' | 'add_transition' | 'modify_difficulty';
  target: InterviewStage;
  config: unknown;
}

export const StageObjectiveSchema = z.object({
  id: z.string().uuid(),
  stage: z.enum([
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
  name: z.string(),
  description: z.string(),
  order: z.number().min(0),
  primaryObjective: z.string(),
  secondaryObjectives: z.array(z.string()),
  requiredCompetencies: z.array(z.enum([
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
  ])),
  optionalCompetencies: z.array(z.enum([
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
  ])),
  minDuration: z.number().min(0),
  maxDuration: z.number().min(0),
  targetDuration: z.number().min(0),
  exitConditions: z.array(z.any()),
  successCriteria: z.array(z.string()),
  questionCount: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
    target: z.number().min(0),
  }),
  difficulty: z.object({
    min: z.number().min(0).max(100),
    max: z.number().min(0).max(100),
    target: z.number().min(0).max(100),
  }),
  dependsOnStages: z.array(z.enum([
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
  ])),
  blocksStages: z.array(z.enum([
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
  ])),
});

export const InterviewPlanSchema = z.object({
  id: z.string().uuid(),
  version: z.string(),
  name: z.string(),
  description: z.string(),
  targetRole: z.string(),
  targetLevel: z.string(),
  targetSeniority: z.enum(['junior', 'mid', 'senior', 'staff', 'principal']),
  totalDuration: z.number().min(0),
  difficulty: z.number().min(0).max(100),
  intensity: z.number().min(0).max(100),
  stages: z.array(StageObjectiveSchema),
  transitions: z.array(z.any()),
  defaultPersona: z.string(),
  personaVariations: z.array(z.any()),
  difficultyProgression: z.array(z.any()),
  createdAt: z.date(),
  createdBy: z.string(),
  tags: z.array(z.string()),
});

// Predefined plan templates
export const PLAN_TEMPLATES: PlanTemplate[] = [
  {
    id: 'template-senior-engineer',
    name: 'Senior Engineer Interview',
    description: 'Comprehensive interview for senior software engineers',
    targetRoles: ['Senior Software Engineer', 'Senior Engineer', 'Staff Engineer'],
    targetLevels: ['senior', 'staff'],
    basePlan: {
      totalDuration: 3600, // 60 minutes
      difficulty: 70,
      intensity: 60,
      defaultPersona: 'technical_lead',
      stages: [
        {
          id: 'stage-intro',
          stage: InterviewStage.INTRODUCTION,
          name: 'Introduction',
          description: 'Welcome and overview',
          order: 0,
          primaryObjective: 'Establish rapport and set expectations',
          secondaryObjectives: ['Explain interview structure', 'Answer candidate questions'],
          requiredCompetencies: [Competency.COMMUNICATION],
          optionalCompetencies: [],
          minDuration: 120,
          maxDuration: 300,
          targetDuration: 180,
          exitConditions: [],
          successCriteria: ['Candidate comfortable', 'Structure understood'],
          questionCount: { min: 2, max: 5, target: 3 },
          difficulty: { min: 20, max: 30, target: 25 },
          dependsOnStages: [],
          blocksStages: [],
        },
        {
          id: 'stage-presentation',
          stage: InterviewStage.PRESENTATION,
          name: 'Self Presentation',
          description: 'Candidate presents their background',
          order: 1,
          primaryObjective: 'Understand candidate experience and journey',
          secondaryObjectives: ['Assess communication skills', 'Identify key achievements'],
          requiredCompetencies: [Competency.COMMUNICATION, Competency.OWNERSHIP],
          optionalCompetencies: [Competency.LEADERSHIP],
          minDuration: 300,
          maxDuration: 600,
          targetDuration: 420,
          exitConditions: [],
          successCriteria: ['Clear career narrative', 'Key achievements highlighted'],
          questionCount: { min: 3, max: 6, target: 4 },
          difficulty: { min: 30, max: 40, target: 35 },
          dependsOnStages: [InterviewStage.INTRODUCTION],
          blocksStages: [],
        },
        {
          id: 'stage-technical',
          stage: InterviewStage.ARCHITECTURE,
          name: 'Technical Deep Dive',
          description: 'In-depth technical discussion',
          order: 2,
          primaryObjective: 'Assess technical depth and architecture skills',
          secondaryObjectives: ['Evaluate problem-solving', 'Test system design'],
          requiredCompetencies: [Competency.TECHNICAL_DEPTH, Competency.ARCHITECTURE, Competency.PROBLEM_SOLVING],
          optionalCompetencies: [Competency.ALGORITHMS, Competency.DEBUGGING],
          minDuration: 900,
          maxDuration: 1500,
          targetDuration: 1200,
          exitConditions: [],
          successCriteria: ['Technical depth demonstrated', 'Architecture sound'],
          questionCount: { min: 5, max: 10, target: 7 },
          difficulty: { min: 60, max: 80, target: 70 },
          dependsOnStages: [InterviewStage.PRESENTATION],
          blocksStages: [],
        },
        {
          id: 'stage-behavioral',
          stage: InterviewStage.LEADERSHIP,
          name: 'Leadership & Behavioral',
          description: 'Leadership and behavioral questions',
          order: 3,
          primaryObjective: 'Assess leadership and soft skills',
          secondaryObjectives: ['Evaluate conflict resolution', 'Test decision-making'],
          requiredCompetencies: [Competency.LEADERSHIP, Competency.COMMUNICATION, Competency.DECISION_MAKING],
          optionalCompetencies: [Competency.CONFLICT, Competency.INFLUENCE],
          minDuration: 600,
          maxDuration: 900,
          targetDuration: 720,
          exitConditions: [],
          successCriteria: ['Leadership examples provided', 'Behavioral patterns clear'],
          questionCount: { min: 4, max: 7, target: 5 },
          difficulty: { min: 50, max: 70, target: 60 },
          dependsOnStages: [InterviewStage.ARCHITECTURE],
          blocksStages: [],
        },
        {
          id: 'stage-conclusion',
          stage: InterviewStage.CONCLUSION,
          name: 'Conclusion',
          description: 'Wrap up and candidate questions',
          order: 4,
          primaryObjective: 'Provide feedback and answer questions',
          secondaryObjectatives: ['Next steps', 'Cultural fit check'],
          requiredCompetencies: [Competency.COMMUNICATION],
          optionalCompetencies: [],
          minDuration: 180,
          maxDuration: 300,
          targetDuration: 240,
          exitConditions: [],
          successCriteria: ['Candidate satisfied', 'Next steps clear'],
          questionCount: { min: 2, max: 4, target: 3 },
          difficulty: { min: 20, max: 30, target: 25 },
          dependsOnStages: [InterviewStage.LEADERSHIP],
          blocksStages: [],
        },
      ],
      transitions: [],
      personaVariations: [
        { stage: InterviewStage.LEADERSHIP, persona: 'engineering_manager' },
        { stage: InterviewStage.CONCLUSION, persona: 'supportive' },
      ],
      difficultyProgression: [
        { stage: InterviewStage.INTRODUCTION, difficulty: 25 },
        { stage: InterviewStage.PRESENTATION, difficulty: 35 },
        { stage: InterviewStage.ARCHITECTURE, difficulty: 70 },
        { stage: InterviewStage.LEADERSHIP, difficulty: 60 },
        { stage: InterviewStage.CONCLUSION, difficulty: 25 },
      ],
    },
    customizations: [],
  },
];
