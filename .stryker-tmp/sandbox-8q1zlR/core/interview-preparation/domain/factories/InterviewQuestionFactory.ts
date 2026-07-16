/**
 * InterviewQuestionFactory
 *
 * Factory for creating InterviewQuestion entities.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY InterviewQuestion creation.
 */
// @ts-nocheck


import { InterviewQuestion } from "../entities/InterviewQuestion";
import { QuestionType } from "../value-objects/QuestionType";
import { QuestionDifficulty } from "../value-objects/QuestionDifficulty";
import { EvaluationCriteria } from "../value-objects/EvaluationCriteria";
import { CompetencyCoverage } from "../value-objects/CompetencyCoverage";
import { ExpectedAnswer } from "../value-objects/ExpectedAnswer";
import { InterviewTiming } from "../value-objects/InterviewTiming";
import { QuestionDependencies } from "../value-objects/QuestionDependencies";
import {
  QuestionTemplate,
  AIQuestionResponse,
  QuestionContext,
  CoverageLevel,
  AnswerStructure,
} from "../types";

export class InterviewQuestionFactory {
  createFromTemplate(template: QuestionTemplate): InterviewQuestion {
    const questionId = this.generateId();
    const sectionId = "";
    const type = QuestionType.fromString(template.type);
    const difficulty = QuestionDifficulty.fromString(template.difficulty);
    const text = template.text;
    const expectedAnswer = new ExpectedAnswer(template.expectedAnswer);
    const evaluationCriteria = new EvaluationCriteria(template.evaluationCriteria);
    const competencyCoverage = new CompetencyCoverage(
      template.competencyId,
      template.competencyId,
      CoverageLevel.MEDIUM,
      [questionId],
      CoverageLevel.MEDIUM
    );
    const timing = InterviewTiming.fromSeconds(300);
    const dependencies = QuestionDependencies.none();
    const order = 0;
    const isMandatory = true;
    const isAdaptive = false;
    const metadata = {};

    return new InterviewQuestion(
      questionId,
      sectionId,
      type,
      difficulty,
      text,
      expectedAnswer,
      evaluationCriteria,
      competencyCoverage,
      timing,
      dependencies,
      order,
      isMandatory,
      isAdaptive,
      metadata
    );
  }

  createFromAI(response: AIQuestionResponse, context: QuestionContext): InterviewQuestion {
    const questionId = this.generateId();
    const sectionId = "";
    const type = QuestionType.TECHNICAL();
    const difficulty = QuestionDifficulty.fromString(response.suggestedDifficulty);
    const text = response.questionText;
    const expectedAnswer = this.createExpectedAnswerFromAI(response);
    const evaluationCriteria = this.createEvaluationCriteriaFromAI(response);
    const competencyCoverage = this.createCompetencyCoverage(context);
    const timing = InterviewTiming.fromSeconds(300);
    const dependencies = QuestionDependencies.none();
    const order = 0;
    const isMandatory = true;
    const isAdaptive = true;
    const metadata = { confidence: response.confidence };

    return new InterviewQuestion(
      questionId,
      sectionId,
      type,
      difficulty,
      text,
      expectedAnswer,
      evaluationCriteria,
      competencyCoverage,
      timing,
      dependencies,
      order,
      isMandatory,
      isAdaptive,
      metadata
    );
  }

  createEmpty(): InterviewQuestion {
    const questionId = this.generateId();
    const sectionId = "";
    const type = QuestionType.TECHNICAL();
    const difficulty = QuestionDifficulty.BEGINNER();
    const text = "";
    const expectedAnswer = new ExpectedAnswer({
      structure: AnswerStructure.FREE_FORM,
      keyPoints: [],
      examples: [],
      antiPatterns: [],
      minimumLength: 0,
      maximumLength: 1000,
    });
    const evaluationCriteria = new EvaluationCriteria({
      rubric: [],
      maxScore: 100,
      weight: 1,
      requiredKeyPoints: [],
      acceptableAnswerPatterns: [],
    });
    const competencyCoverage = new CompetencyCoverage(
      "",
      "",
      CoverageLevel.NONE,
      [],
      CoverageLevel.NONE
    );
    const timing = InterviewTiming.fromSeconds(300);
    const dependencies = QuestionDependencies.none();
    const order = 0;
    const isMandatory = false;
    const isAdaptive = false;
    const metadata = {};

    return new InterviewQuestion(
      questionId,
      sectionId,
      type,
      difficulty,
      text,
      expectedAnswer,
      evaluationCriteria,
      competencyCoverage,
      timing,
      dependencies,
      order,
      isMandatory,
      isAdaptive,
      metadata
    );
  }

  private createExpectedAnswerFromAI(response: AIQuestionResponse): ExpectedAnswer {
    return new ExpectedAnswer({
      structure: AnswerStructure.FREE_FORM,
      keyPoints: response.suggestedKeyPoints,
      examples: [],
      antiPatterns: [],
      minimumLength: 50,
      maximumLength: 1000,
    });
  }

  private createEvaluationCriteriaFromAI(response: AIQuestionResponse): EvaluationCriteria {
    return new EvaluationCriteria({
      rubric: response.suggestedEvaluationCriteria.map((desc, index) => ({
        score: (index + 1) * 20,
        description: desc,
      })),
      maxScore: 100,
      weight: 1,
      requiredKeyPoints: response.suggestedKeyPoints,
      acceptableAnswerPatterns: [],
    });
  }

  private createCompetencyCoverage(context: QuestionContext): CompetencyCoverage {
    const competencyId = context.jobRequirements[0]?.competencyId ?? "unknown";
    return new CompetencyCoverage(
      competencyId,
      competencyId,
      CoverageLevel.MEDIUM,
      [],
      CoverageLevel.MEDIUM
    );
  }

  private generateId(): string {
    return `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
