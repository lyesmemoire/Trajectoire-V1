/**
 * Difficulty Level Value Object
 * Defines different difficulty levels for interview questions
 */

import { z } from "zod";

// Difficulty Level Types
export enum DifficultyLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  SENIOR = "senior",
  MANAGER = "manager",
  DIRECTOR = "director",
  EXPERT = "expert",
}

// Difficulty Level Configuration
export const DifficultyLevelConfigSchema = z.object({
  level: z.nativeEnum(DifficultyLevel),
  name: z.string(),
  description: z.string(),
  questionComplexity: z.enum(["basic", "standard", "advanced", "expert"]),
  expectedDepth: z.enum(["surface", "moderate", "deep", "comprehensive"]),
  timePerQuestion: z.number().min(1).max(10), // minutes
  numberOfQuestions: z.number().min(5).max(20),
  competenciesToEvaluate: z.array(z.string()),
  systemPromptAdditions: z.array(z.string()).default([]),
});

export type DifficultyLevelConfig = z.infer<typeof DifficultyLevelConfigSchema>;

// Predefined difficulty levels
export const DIFFICULTY_LEVELS: Record<DifficultyLevel, DifficultyLevelConfig> = {
  [DifficultyLevel.BEGINNER]: {
    level: DifficultyLevel.BEGINNER,
    name: "Débutant",
    description: "Niveau junior, questions fondamentales",
    questionComplexity: "basic",
    expectedDepth: "surface",
    timePerQuestion: 2,
    numberOfQuestions: 10,
    competenciesToEvaluate: ["communication", "motivation", "adaptability"],
    systemPromptAdditions: [
      "You are interviewing a beginner/junior candidate.",
      "Focus on fundamental knowledge and basic skills.",
      "Ask simple, direct questions.",
      "Be encouraging and patient.",
      "Evaluate potential and willingness to learn.",
    ],
  },
  [DifficultyLevel.INTERMEDIATE]: {
    level: DifficultyLevel.INTERMEDIATE,
    name: "Intermédiaire",
    description: "Niveau intermédiaire, questions standards",
    questionComplexity: "standard",
    expectedDepth: "moderate",
    timePerQuestion: 3,
    numberOfQuestions: 12,
    competenciesToEvaluate: ["communication", "teamwork", "problem_solving", "adaptability"],
    systemPromptAdditions: [
      "You are interviewing an intermediate candidate.",
      "Focus on practical experience and standard skills.",
      "Ask questions that require some explanation.",
      "Balance between encouragement and challenge.",
      "Evaluate ability to apply knowledge in real situations.",
    ],
  },
  [DifficultyLevel.SENIOR]: {
    level: DifficultyLevel.SENIOR,
    name: "Senior",
    description: "Niveau senior, questions avancées",
    questionComplexity: "advanced",
    expectedDepth: "deep",
    timePerQuestion: 4,
    numberOfQuestions: 15,
    competenciesToEvaluate: [
      "communication",
      "leadership",
      "problem_solving",
      "teamwork",
      "autonomy",
      "motivation",
    ],
    systemPromptAdditions: [
      "You are interviewing a senior candidate.",
      "Focus on advanced skills and leadership potential.",
      "Ask challenging questions that require deep thinking.",
      "Expect detailed, well-structured responses.",
      "Evaluate ability to mentor others and drive projects.",
    ],
  },
  [DifficultyLevel.MANAGER]: {
    level: DifficultyLevel.MANAGER,
    name: "Manager",
    description: "Niveau management, questions stratégiques",
    questionComplexity: "advanced",
    expectedDepth: "deep",
    timePerQuestion: 5,
    numberOfQuestions: 15,
    competenciesToEvaluate: [
      "leadership",
      "organization",
      "time_management",
      "communication",
      "motivation",
      "company_culture",
    ],
    systemPromptAdditions: [
      "You are interviewing a management candidate.",
      "Focus on leadership, strategy, and people management.",
      "Ask about team management, conflict resolution, and decision-making.",
      "Evaluate strategic thinking and ability to drive results through others.",
      "Assess cultural fit and leadership style.",
    ],
  },
  [DifficultyLevel.DIRECTOR]: {
    level: DifficultyLevel.DIRECTOR,
    name: "Directeur",
    description: "Niveau directeur, questions exécutives",
    questionComplexity: "expert",
    expectedDepth: "comprehensive",
    timePerQuestion: 6,
    numberOfQuestions: 18,
    competenciesToEvaluate: [
      "leadership",
      "organization",
      "time_management",
      "communication",
      "motivation",
      "company_culture",
      "autonomy",
    ],
    systemPromptAdditions: [
      "You are interviewing a director-level candidate.",
      "Focus on executive leadership, strategy, and organizational impact.",
      "Ask about vision, scaling organizations, and executive decision-making.",
      "Evaluate ability to influence at the highest levels.",
      "Assess strategic alignment and executive presence.",
    ],
  },
  [DifficultyLevel.EXPERT]: {
    level: DifficultyLevel.EXPERT,
    name: "Expert",
    description: "Niveau expert, questions spécialisées",
    questionComplexity: "expert",
    expectedDepth: "comprehensive",
    timePerQuestion: 7,
    numberOfQuestions: 20,
    competenciesToEvaluate: [
      "communication",
      "leadership",
      "problem_solving",
      "autonomy",
      "motivation",
      "company_culture",
    ],
    systemPromptAdditions: [
      "You are interviewing an expert candidate.",
      "Focus on deep expertise and thought leadership.",
      "Ask questions that require comprehensive knowledge and innovative thinking.",
      "Expect exceptional depth and breadth of knowledge.",
      "Evaluate ability to push boundaries and innovate.",
    ],
  },
};

export class DifficultyLevelVO {
  private config: DifficultyLevelConfig;

  constructor(config: DifficultyLevelConfig) {
    this.config = DifficultyLevelConfigSchema.parse(config);
  }

  static fromType(type: DifficultyLevel): DifficultyLevelVO {
    return new DifficultyLevelVO(DIFFICULTY_LEVELS[type]);
  }

  get level(): DifficultyLevel {
    return this.config.level;
  }

  get name(): string {
    return this.config.name;
  }

  get description(): string {
    return this.config.description;
  }

  get questionComplexity(): string {
    return this.config.questionComplexity;
  }

  get expectedDepth(): string {
    return this.config.expectedDepth;
  }

  get timePerQuestion(): number {
    return this.config.timePerQuestion;
  }

  get numberOfQuestions(): number {
    return this.config.numberOfQuestions;
  }

  get competenciesToEvaluate(): string[] {
    return this.config.competenciesToEvaluate;
  }

  get systemPromptAdditions(): string[] {
    return this.config.systemPromptAdditions;
  }

  getFullSystemPrompt(): string {
    return [
      `You are interviewing a ${this.config.name} candidate.`,
      `Question complexity: ${this.config.questionComplexity}.`,
      `Expected depth: ${this.config.expectedDepth}.`,
      `Time per question: ${this.config.timePerQuestion} minutes.`,
      `Number of questions: ${this.config.numberOfQuestions}.`,
      `Competencies to evaluate: ${this.config.competenciesToEvaluate.join(", ")}.`,
      ...this.config.systemPromptAdditions,
    ].join("\n");
  }

  toPersistence(): DifficultyLevelConfig {
    return { ...this.config };
  }
}
