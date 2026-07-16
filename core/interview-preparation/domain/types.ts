/**
 * Domain Types
 *
 * Shared types for the Interview Preparation Engine domain layer.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY type definitions.
 */

/**
 * Question type enumeration
 */
export enum QuestionType {
  TECHNICAL = "TECHNICAL",
  BEHAVIORAL = "BEHAVIORAL",
  SITUATIONAL = "SITUATIONAL",
  CULTURE_FIT = "CULTURE_FIT",
  PROBLEM_SOLVING = "PROBLEM_SOLVING",
  LEADERSHIP = "LEADERSHIP",
}

/**
 * Question difficulty enumeration
 */
export enum QuestionDifficulty {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
  EXPERT = "EXPERT",
}

/**
 * Coverage level enumeration
 */
export enum CoverageLevel {
  NONE = "NONE",
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  COMPLETE = "COMPLETE",
}

/**
 * Plan status enumeration
 */
export enum PlanStatus {
  DRAFT = "DRAFT",
  GENERATED = "GENERATED",
  VALIDATED = "VALIDATED",
  APPROVED = "APPROVED",
  EXECUTED = "EXECUTED",
  ARCHIVED = "ARCHIVED",
}

/**
 * Objective type enumeration
 */
export enum ObjectiveType {
  SCREENING = "SCREENING",
  TECHNICAL = "TECHNICAL",
  BEHAVIORAL = "BEHAVIORAL",
  CULTURAL = "CULTURAL",
  FINAL = "FINAL",
}

/**
 * Adaptation strategy enumeration
 */
export enum AdaptationStrategy {
  CONSERVATIVE = "CONSERVATIVE",
  BALANCED = "BALANCED",
  AGGRESSIVE = "AGGRESSIVE",
}

/**
 * Ordering strategy enumeration
 */
export enum OrderingStrategy {
  DIFFICULTY_ASCENDING = "DIFFICULTY_ASCENDING",
  DIFFICULTY_DESCENDING = "DIFFICULTY_DESCENDING",
  COMPETENCY_GROUPED = "COMPETENCY_GROUPED",
  CUSTOM = "CUSTOM",
}

/**
 * Answer structure enumeration
 */
export enum AnswerStructure {
  STAR = "STAR",
  SITUATION_ACTION_RESULT = "SITUATION_ACTION_RESULT",
  TECHNICAL_EXPLANATION = "TECHNICAL_EXPLANATION",
  FREE_FORM = "FREE_FORM",
}

/**
 * Skill level enumeration
 */
export enum SkillLevel {
  JUNIOR = "JUNIOR",
  MID_LEVEL = "MID_LEVEL",
  SENIOR = "SENIOR",
  PRINCIPAL = "PRINCIPAL",
}

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  score: number;
}

/**
 * Requirement interface
 */
export interface Requirement {
  requirementId: string;
  competencyId: string;
  requiredLevel: SkillLevel;
  isMandatory: boolean;
}

/**
 * Skill interface
 */
export interface Skill {
  skillId: string;
  skillName: string;
  level: SkillLevel;
}

/**
 * Competency interface
 */
export interface Competency {
  competencyId: string;
  competencyName: string;
  category: "HARD" | "SOFT";
}

/**
 * Rubric item interface
 */
export interface RubricItem {
  score: number;
  description: string;
}

/**
 * Suggestion interface
 */
export interface Suggestion {
  type: "ADD_QUESTION" | "ADJUST_DIFFICULTY" | "REORDER";
  description: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  action: unknown;
}

/**
 * Suggestion action interface
 */
export interface SuggestionAction {
  questionId?: string;
  competencyId?: string;
  difficulty?: QuestionDifficulty;
  order?: number;
}

/**
 * Question data interface
 */
export interface QuestionData {
  sectionId: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  text: string;
  competencyIds: string[];
}

/**
 * Section data interface
 */
export interface SectionData {
  name: string;
  description: string;
  objective: string;
}

/**
 * Plan request interface
 */
export interface InterviewPlanRequest {
  candidateId: string;
  jobOfferId: string;
  matchingId: string;
  constraints?: InterviewConstraintsData;
  customRequirements?: string[];
  requestedBy: string;
}

/**
 * Interview constraints data interface (for creation)
 */
export interface InterviewConstraintsData {
  maxTotalDuration?: number;
  maxQuestionsPerSection?: number;
  maxTotalQuestions?: number;
  minSoftSkillQuestions?: number;
  minHardSkillQuestions?: number;
  maxDifficulty?: QuestionDifficulty;
  minDifficulty?: QuestionDifficulty;
  mandatoryCompetencies?: string[];
  forbiddenTopics?: string[];
}

/**
 * Question context interface
 */
export interface QuestionContext {
  candidateLevel: SkillLevel;
  jobRequirements: Requirement[];
  previousQuestions: InterviewQuestionData[];
}

/**
 * Interview question data interface (for AI/template)
 */
export interface InterviewQuestionData {
  questionId: string;
  sectionId: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  text: string;
  competencyIds: string[];
}

/**
 * AI question response interface
 */
export interface AIQuestionResponse {
  questionText: string;
  suggestedEvaluationCriteria: string[];
  suggestedKeyPoints: string[];
  suggestedDifficulty: QuestionDifficulty;
  confidence: number;
}

/**
 * Question template interface
 */
export interface QuestionTemplate {
  templateId: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  competencyId: string;
  text: string;
  evaluationCriteria: EvaluationCriteriaData;
  expectedAnswer: ExpectedAnswerData;
}

/**
 * Evaluation criteria data interface (for creation)
 */
export interface EvaluationCriteriaData {
  rubric: RubricItem[];
  maxScore: number;
  weight: number;
  requiredKeyPoints: string[];
  acceptableAnswerPatterns: string[];
}

/**
 * Expected answer data interface (for creation)
 */
export interface ExpectedAnswerData {
  structure: AnswerStructure;
  keyPoints: string[];
  examples: string[];
  antiPatterns: string[];
  minimumLength: number;
  maximumLength: number;
}

/**
 * Interview timing data interface (for creation)
 */
export interface InterviewTimingData {
  preparationTime: number;
  answerTime: number;
  followUpTime: number;
}

/**
 * Adaptive rules data interface (for creation)
 */
export interface AdaptiveRulesData {
  enableDifficultyAdaptation: boolean;
  enableTopicAdaptation: boolean;
  enableTimingAdaptation: boolean;
  adaptationThreshold: number;
  adaptationStrategy: AdaptationStrategy;
}

/**
 * Question dependencies data interface (for creation)
 */
export interface QuestionDependenciesData {
  requires: string[];
  excludes: string[];
  requiresMinimumScore: Map<string, number>;
}

/**
 * Interview objective data interface (for creation)
 */
export interface InterviewObjectiveData {
  objectiveId: string;
  type: ObjectiveType;
  primaryGoal: string;
  secondaryGoals: string[];
  successCriteria: string[];
}

/**
 * Interview metadata data interface (for creation)
 */
export interface InterviewMetadataData {
  version: string;
  generator: "AI" | "TEMPLATE" | "HYBRID";
  generatedAt: Date;
  generatedBy: string;
  tags: string[];
  customFields: Record<string, unknown>;
}

/**
 * Plan adjustments interface
 */
export interface PlanAdjustments {
  addQuestions?: QuestionData[];
  removeQuestions?: string[];
  reorderQuestions?: string[];
  adjustDifficulty?: Map<string, QuestionDifficulty>;
}

/**
 * Question criteria interface
 */
export interface QuestionCriteria {
  competencyIds: string[];
  difficulty: QuestionDifficulty;
  type: QuestionType;
  count: number;
  context: {
    candidateLevel: SkillLevel;
    jobRequirements: Requirement[];
    previousQuestions: InterviewQuestionData[];
  };
}

/**
 * Template criteria interface
 */
export interface TemplateCriteria {
  type?: QuestionType;
  competencyId?: string;
  difficulty?: QuestionDifficulty;
}
