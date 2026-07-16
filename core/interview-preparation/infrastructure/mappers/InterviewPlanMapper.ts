/**
 * InterviewPlanMapper
 *
 * Infrastructure mapper for interview plan persistence.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY data transformation between DTOs and domain objects.
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

export interface InterviewPlanDTO {
  id: string;
  candidateId: string;
  jobOfferId: string;
  matchingId: string;
  objective: {
    primaryGoal: string;
    secondaryGoals: string[];
  };
  constraints: {
    maxTotalDuration: number;
    maxQuestionsPerSection: number;
    maxTotalQuestions: number;
    minSoftSkillQuestions: number;
    minHardSkillQuestions: number;
    maxDifficulty: string;
    minDifficulty: string;
    mandatoryCompetencies: string[];
    forbiddenTopics: string[];
  };
  adaptiveRules: {
    enabled: boolean;
    difficultyAdjustment: boolean;
    timeBasedSkipping: boolean;
    competencyBasedSkipping: boolean;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
  sections: InterviewSectionDTO[];
  summary: {
    totalQuestions: number;
    softSkillQuestions: number;
    hardSkillQuestions: number;
    averageDifficulty: number;
    estimatedDifficulty: string;
  };
  metadata: {
    version: string;
    generatedBy: string;
    tags: string[];
  };
}

export interface InterviewSectionDTO {
  id: string;
  planId: string;
  name: string;
  description: string;
  objective: string;
  order: number;
  isMandatory: boolean;
  minQuestions: number;
  maxQuestions: number;
  questions: InterviewQuestionDTO[];
}

export interface InterviewQuestionDTO {
  id: string;
  sectionId: string;
  text: string;
  type: string;
  difficulty: string;
  expectedAnswer: {
    structure: string[];
    keyPoints: string[];
  };
  evaluationCriteria: {
    criteriaId: string;
    criteria: string[];
    weight: number;
  };
  competencyCoverage: {
    competencyId: string;
    coverageLevel: string;
    weight: number;
  };
  timing: {
    totalTime: number;
    minTime: number;
    maxTime: number;
  };
  dependencies: {
    requires: string[];
    conflicts: string[];
  };
  order: number;
  isMandatory: boolean;
  isAdaptive: boolean;
  metadata: Record<string, unknown>;
}

export class InterviewPlanMapper {
  toDTO(plan: InterviewPlan): InterviewPlanDTO {
    return {
      id: plan.getPlanId(),
      candidateId: plan.getCandidateId(),
      jobOfferId: plan.getJobOfferId(),
      matchingId: plan.getMatchingId(),
      objective: {
        primaryGoal: plan.getObjective().getPrimaryGoal(),
        secondaryGoals: plan.getObjective().getSecondaryGoals(),
      },
      constraints: {
        maxTotalDuration: plan.getConstraints().getMaxTotalDuration(),
        maxQuestionsPerSection: plan.getConstraints().getMaxQuestionsPerSection(),
        maxTotalQuestions: plan.getConstraints().getMaxTotalQuestions(),
        minSoftSkillQuestions: plan.getConstraints().getMinSoftSkillQuestions(),
        minHardSkillQuestions: plan.getConstraints().getMinHardSkillQuestions(),
        maxDifficulty: plan.getConstraints().getMaxDifficulty(),
        minDifficulty: plan.getConstraints().getMinDifficulty(),
        mandatoryCompetencies: plan.getConstraints().getMandatoryCompetencies(),
        forbiddenTopics: plan.getConstraints().getForbiddenTopics(),
      },
      adaptiveRules: {
        enabled: plan.getAdaptiveRules().isEnabled(),
        difficultyAdjustment: plan.getAdaptiveRules().isDifficultyAdjustmentEnabled(),
        timeBasedSkipping: plan.getAdaptiveRules().isTimeBasedSkippingEnabled(),
        competencyBasedSkipping: plan.getAdaptiveRules().isCompetencyBasedSkippingEnabled(),
      },
      status: plan.getStatus(),
      createdAt: plan.getCreatedAt().toISOString(),
      updatedAt: plan.getUpdatedAt().toISOString(),
      sections: plan.getSections().map((section) => this.sectionToDTO(section)),
      summary: {
        totalQuestions: plan.getSummary().getTotalQuestions(),
        softSkillQuestions: plan.getSummary().getSoftSkillQuestions(),
        hardSkillQuestions: plan.getSummary().getHardSkillQuestions(),
        averageDifficulty: plan.getSummary().getAverageDifficulty(),
        estimatedDifficulty: plan.getSummary().getEstimatedDifficulty(),
      },
      metadata: {
        version: plan.getMetadata().getVersion(),
        generatedBy: plan.getMetadata().getGeneratedBy(),
        tags: plan.getMetadata().getTags(),
      },
    };
  }

  fromDTO(dto: InterviewPlanDTO): InterviewPlan {
    const objective = new InterviewObjective({
      primaryGoal: dto.objective.primaryGoal,
      secondaryGoals: dto.objective.secondaryGoals,
    });

    const constraints = new InterviewConstraints({
      maxTotalDuration: dto.constraints.maxTotalDuration,
      maxQuestionsPerSection: dto.constraints.maxQuestionsPerSection,
      maxTotalQuestions: dto.constraints.maxTotalQuestions,
      minSoftSkillQuestions: dto.constraints.minSoftSkillQuestions,
      minHardSkillQuestions: dto.constraints.minHardSkillQuestions,
      maxDifficulty: dto.constraints.maxDifficulty as any,
      minDifficulty: dto.constraints.minDifficulty as any,
      mandatoryCompetencies: dto.constraints.mandatoryCompetencies,
      forbiddenTopics: dto.constraints.forbiddenTopics,
    });

    const adaptiveRules = new AdaptiveRules({
      enabled: dto.adaptiveRules.enabled,
      difficultyAdjustment: dto.adaptiveRules.difficultyAdjustment,
      timeBasedSkipping: dto.adaptiveRules.timeBasedSkipping,
      competencyBasedSkipping: dto.adaptiveRules.competencyBasedSkipping,
    });

    const sections = dto.sections.map((sectionDTO) => this.sectionFromDTO(sectionDTO));

    const summary = new InterviewSummary({
      totalQuestions: dto.summary.totalQuestions,
      softSkillQuestions: dto.summary.softSkillQuestions,
      hardSkillQuestions: dto.summary.hardSkillQuestions,
      averageDifficulty: dto.summary.averageDifficulty,
      estimatedDifficulty: dto.summary.estimatedDifficulty,
    });

    const metadata = new InterviewMetadata({
      version: dto.metadata.version,
      generatedBy: dto.metadata.generatedBy,
      tags: dto.metadata.tags,
    });

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

  private sectionToDTO(section: InterviewSection): InterviewSectionDTO {
    return {
      id: section.getSectionId(),
      planId: section.getPlanId(),
      name: section.getName(),
      description: section.getDescription(),
      objective: section.getObjective(),
      order: section.getOrder(),
      isMandatory: section.isSectionMandatory(),
      minQuestions: section.getMinQuestions(),
      maxQuestions: section.getMaxQuestions(),
      questions: section.getQuestions().map((question) => this.questionToDTO(question)),
    };
  }

  private sectionFromDTO(dto: InterviewSectionDTO): InterviewSection {
    const questions = dto.questions.map((questionDTO) => this.questionFromDTO(questionDTO));
    const timing = new InterviewTiming({
      totalTime: questions.reduce((sum, q) => sum + q.timing.totalTime, 0),
      minTime: 0,
      maxTime: 0,
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

  private questionToDTO(question: InterviewQuestion): InterviewQuestionDTO {
    return {
      id: question.getQuestionId(),
      sectionId: question.getSectionId(),
      text: question.getText(),
      type: question.getType().getValue(),
      difficulty: question.getDifficulty().getValue(),
      expectedAnswer: {
        structure: question.getExpectedAnswer().getStructure(),
        keyPoints: question.getExpectedAnswer().getKeyPoints(),
      },
      evaluationCriteria: {
        criteriaId: question.getEvaluationCriteria().getCriteriaId(),
        criteria: question.getEvaluationCriteria().getCriteria(),
        weight: question.getEvaluationCriteria().getWeight(),
      },
      competencyCoverage: {
        competencyId: question.getCompetencyCoverage().getCompetencyId(),
        coverageLevel: question.getCompetencyCoverage().getCoverageLevel(),
        weight: question.getCompetencyCoverage().getWeight(),
      },
      timing: {
        totalTime: question.getTiming().getTotalTime(),
        minTime: question.getTiming().getMinTime(),
        maxTime: question.getTiming().getMaxTime(),
      },
      dependencies: {
        requires: question.getDependencies().getRequires(),
        conflicts: question.getDependencies().getConflicts(),
      },
      order: question.getOrder(),
      isMandatory: question.isQuestionMandatory(),
      isAdaptive: question.isQuestionAdaptive(),
      metadata: question.getMetadata(),
    };
  }

  private questionFromDTO(dto: InterviewQuestionDTO): InterviewQuestion {
    const type = new QuestionType(dto.type as any);
    const difficulty = new QuestionDifficulty(dto.difficulty as any);
    const expectedAnswer = new ExpectedAnswer({
      structure: dto.expectedAnswer.structure,
      keyPoints: dto.expectedAnswer.keyPoints,
    });
    const evaluationCriteria = new EvaluationCriteria({
      criteriaId: dto.evaluationCriteria.criteriaId,
      criteria: dto.evaluationCriteria.criteria,
      weight: dto.evaluationCriteria.weight,
    });
    const competencyCoverage = new CompetencyCoverage({
      competencyId: dto.competencyCoverage.competencyId,
      coverageLevel: dto.competencyCoverage.coverageLevel as any,
      weight: dto.competencyCoverage.weight,
    });
    const timing = new InterviewTiming({
      totalTime: dto.timing.totalTime,
      minTime: dto.timing.minTime,
      maxTime: dto.timing.maxTime,
    });
    const dependencies = new QuestionDependencies({
      requires: dto.dependencies.requires,
      conflicts: dto.dependencies.conflicts,
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
