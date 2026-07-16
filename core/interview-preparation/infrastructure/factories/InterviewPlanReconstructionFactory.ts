/**
 * InterviewPlanReconstructionFactory
 *
 * Infrastructure factory for reconstructing domain aggregates from DTOs.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY domain object reconstruction from persistence data.
 */

import { InterviewPlan } from "../../domain/entities/InterviewPlan";
import { InterviewSection } from "../../domain/entities/InterviewSection";
import { InterviewQuestion } from "../../domain/entities/InterviewQuestion";
import { InterviewObjective } from "../../domain/value-objects/InterviewObjective";
import { InterviewConstraints } from "../../domain/value-objects/InterviewConstraints";
import { InterviewSummary } from "../../domain/value-objects/InterviewSummary";
import { AdaptiveRules } from "../../domain/value-objects/AdaptiveRules";
import { InterviewMetadata } from "../../domain/value-objects/InterviewMetadata";
import { QuestionType } from "../../domain/value-objects/QuestionType";
import { QuestionDifficulty } from "../../domain/value-objects/QuestionDifficulty";
import { EvaluationCriteria } from "../../domain/value-objects/EvaluationCriteria";
import { CompetencyCoverage } from "../../domain/value-objects/CompetencyCoverage";
import { ExpectedAnswer } from "../../domain/value-objects/ExpectedAnswer";
import { InterviewTiming } from "../../domain/value-objects/InterviewTiming";
import { QuestionDependencies } from "../../domain/value-objects/QuestionDependencies";
import { PlanStatus } from "../../domain/types";
import { InterviewPlanDTO, InterviewSectionDTO, InterviewQuestionDTO } from "../mappers/InterviewPlanMapper";

export class InterviewPlanReconstructionFactory {
  reconstructFromDTO(dto: InterviewPlanDTO): InterviewPlan {
    const objective = this.reconstructObjective(dto.objective);
    const constraints = this.reconstructConstraints(dto.constraints);
    const adaptiveRules = this.reconstructAdaptiveRules(dto.adaptiveRules);
    const sections = dto.sections.map((sectionDTO) => this.reconstructSection(sectionDTO));
    const summary = this.reconstructSummary(dto.summary);
    const metadata = this.reconstructMetadata(dto.metadata);

    return new InterviewPlan(
      dto.id,
      dto.candidateId,
      dto.jobOfferId,
      dto.matchingId,
      objective,
      sections,
      constraints,
      adaptiveRules,
      summary,
      metadata,
      dto.status as PlanStatus,
      new Date(dto.createdAt),
      new Date(dto.updatedAt)
    );
  }

  private reconstructObjective(data: { primaryGoal: string; secondaryGoals: string[] }): InterviewObjective {
    return new InterviewObjective({
      objectiveId: "reconstructed",
      type: "TECHNICAL" as any,
      primaryGoal: data.primaryGoal,
      secondaryGoals: data.secondaryGoals,
      successCriteria: [],
    });
  }

  private reconstructConstraints(data: {
    maxTotalDuration: number;
    maxQuestionsPerSection: number;
    maxTotalQuestions: number;
    minSoftSkillQuestions: number;
    minHardSkillQuestions: number;
    maxDifficulty: string;
    minDifficulty: string;
    mandatoryCompetencies: string[];
    forbiddenTopics: string[];
  }): InterviewConstraints {
    return new InterviewConstraints({
      maxTotalDuration: data.maxTotalDuration,
      maxQuestionsPerSection: data.maxQuestionsPerSection,
      maxTotalQuestions: data.maxTotalQuestions,
      minSoftSkillQuestions: data.minSoftSkillQuestions,
      minHardSkillQuestions: data.minHardSkillQuestions,
      maxDifficulty: data.maxDifficulty as any,
      minDifficulty: data.minDifficulty as any,
      mandatoryCompetencies: data.mandatoryCompetencies,
      forbiddenTopics: data.forbiddenTopics,
    });
  }

  private reconstructAdaptiveRules(data: {
    enabled: boolean;
    difficultyAdjustment: boolean;
    timeBasedSkipping: boolean;
    competencyBasedSkipping: boolean;
  }): AdaptiveRules {
    return new AdaptiveRules({
      enableDifficultyAdaptation: data.difficultyAdjustment,
      enableTopicAdaptation: data.competencyBasedSkipping,
      enableTimingAdaptation: data.timeBasedSkipping,
      adaptationThreshold: 0.7,
      adaptationStrategy: "BALANCED" as any,
    });
  }

  private reconstructSummary(data: {
    totalQuestions: number;
    softSkillQuestions: number;
    hardSkillQuestions: number;
    averageDifficulty: number;
    estimatedDifficulty: string;
  }): InterviewSummary {
    return new InterviewSummary(
      data.totalQuestions,
      0,
      data.softSkillQuestions,
      data.hardSkillQuestions,
      data.averageDifficulty,
      [],
      [],
      data.estimatedDifficulty as any
    );
  }

  private reconstructMetadata(data: {
    version: string;
    generatedBy: string;
    tags: string[];
  }): InterviewMetadata {
    return new InterviewMetadata({
      version: data.version,
      generator: "AI" as const,
      generatedAt: new Date(),
      generatedBy: data.generatedBy,
      tags: data.tags,
      customFields: {},
    });
  }

  private reconstructSection(dto: InterviewSectionDTO): InterviewSection {
    const questions = dto.questions.map((q) => this.reconstructQuestion(q));
    const timing = new InterviewTiming({
      preparationTime: 0,
      answerTime: questions.reduce((sum, q) => sum + q.getTiming().getTotalTime(), 0),
      followUpTime: 0,
    });

    return new InterviewSection(
      dto.id,
      dto.planId,
      dto.name,
      dto.description,
      dto.objective,
      questions,
      timing,
      dto.order,
      dto.isMandatory,
      dto.minQuestions,
      dto.maxQuestions
    );
  }

  private reconstructQuestion(dto: InterviewQuestionDTO): InterviewQuestion {
    const type = new QuestionType(dto.type as any);
    const difficulty = new QuestionDifficulty(dto.difficulty as any);
    const expectedAnswer = new ExpectedAnswer({
      structure: dto.expectedAnswer.structure as any,
      keyPoints: dto.expectedAnswer.keyPoints,
      examples: [],
      antiPatterns: [],
      minimumLength: 0,
      maximumLength: 1000,
    });
    const evaluationCriteria = new EvaluationCriteria({
      rubric: [],
      maxScore: 100,
      weight: dto.evaluationCriteria.weight,
      requiredKeyPoints: dto.evaluationCriteria.criteria,
      acceptableAnswerPatterns: [],
    });
    const competencyCoverage = new CompetencyCoverage(
      dto.competencyCoverage.competencyId,
      dto.competencyCoverage.competencyId,
      dto.competencyCoverage.coverageLevel as any,
      [dto.id],
      dto.competencyCoverage.coverageLevel as any
    );
    const timing = new InterviewTiming({
      preparationTime: 0,
      answerTime: dto.timing.totalTime,
      followUpTime: 0,
    });
    const dependencies = new QuestionDependencies({
      requires: dto.dependencies.requires,
      excludes: [],
      requiresMinimumScore: new Map(),
    });

    return new InterviewQuestion(
      dto.id,
      dto.sectionId,
      type,
      difficulty,
      dto.text,
      expectedAnswer,
      evaluationCriteria,
      competencyCoverage,
      timing,
      dependencies,
      dto.order,
      dto.isMandatory,
      dto.isAdaptive,
      dto.metadata
    );
  }
}
