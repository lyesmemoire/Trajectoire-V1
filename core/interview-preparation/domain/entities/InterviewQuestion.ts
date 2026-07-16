/**
 * InterviewQuestion Entity
 *
 * Individual interview question with evaluation criteria.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY question entity definition and helper methods.
 */

import { SkillLevel } from "../types";
import { QuestionType } from "../value-objects/QuestionType";
import { QuestionDifficulty } from "../value-objects/QuestionDifficulty";
import { EvaluationCriteria } from "../value-objects/EvaluationCriteria";
import { CompetencyCoverage } from "../value-objects/CompetencyCoverage";
import { ExpectedAnswer } from "../value-objects/ExpectedAnswer";
import { InterviewTiming } from "../value-objects/InterviewTiming";
import { QuestionDependencies } from "../value-objects/QuestionDependencies";

export class InterviewQuestion {
  private readonly questionId: string;
  private readonly sectionId: string;
  private readonly type: QuestionType;
  private difficulty: QuestionDifficulty;
  private readonly text: string;
  private readonly expectedAnswer: ExpectedAnswer;
  private readonly evaluationCriteria: EvaluationCriteria;
  private readonly competencyCoverage: CompetencyCoverage;
  private readonly timing: InterviewTiming;
  private dependencies: QuestionDependencies;
  private order: number;
  private readonly isMandatory: boolean;
  private readonly isAdaptive: boolean;
  private readonly metadata: Record<string, unknown>;

  constructor(
    questionId: string,
    sectionId: string,
    type: QuestionType,
    difficulty: QuestionDifficulty,
    text: string,
    expectedAnswer: ExpectedAnswer,
    evaluationCriteria: EvaluationCriteria,
    competencyCoverage: CompetencyCoverage,
    timing: InterviewTiming,
    dependencies: QuestionDependencies,
    order: number,
    isMandatory: boolean,
    isAdaptive: boolean,
    metadata: Record<string, unknown>
  ) {
    this.questionId = questionId;
    this.sectionId = sectionId;
    this.type = type;
    this.difficulty = difficulty;
    this.text = text;
    this.expectedAnswer = expectedAnswer;
    this.evaluationCriteria = evaluationCriteria;
    this.competencyCoverage = competencyCoverage;
    this.timing = timing;
    this.dependencies = dependencies;
    this.order = order;
    this.isMandatory = isMandatory;
    this.isAdaptive = isAdaptive;
    this.metadata = { ...metadata };
  }

  getQuestionId(): string {
    return this.questionId;
  }

  getSectionId(): string {
    return this.sectionId;
  }

  getType(): QuestionType {
    return this.type;
  }

  getDifficulty(): QuestionDifficulty {
    return this.difficulty;
  }

  getText(): string {
    return this.text;
  }

  getExpectedAnswer(): ExpectedAnswer {
    return this.expectedAnswer;
  }

  getEvaluationCriteria(): EvaluationCriteria {
    return this.evaluationCriteria;
  }

  getCompetencyCoverage(): CompetencyCoverage {
    return this.competencyCoverage;
  }

  getTiming(): InterviewTiming {
    return this.timing;
  }

  getDependencies(): QuestionDependencies {
    return this.dependencies;
  }

  getOrder(): number {
    return this.order;
  }

  isQuestionMandatory(): boolean {
    return this.isMandatory;
  }

  isQuestionAdaptive(): boolean {
    return this.isAdaptive;
  }

  getMetadata(): Record<string, unknown> {
    return { ...this.metadata };
  }

  adjustDifficulty(newDifficulty: QuestionDifficulty): void {
    this.difficulty = newDifficulty;
  }

  updateOrder(newOrder: number): void {
    this.order = newOrder;
  }

  addDependency(dependency: QuestionDependencies): void {
    this.dependencies = dependency;
  }

  removeDependency(dependencyId: string): void {
    if (this.dependencies.getRequires().includes(dependencyId)) {
      this.dependencies = QuestionDependencies.none();
    }
  }

  matchesCandidateLevel(candidateLevel: SkillLevel): boolean {
    return this.difficulty.canBeAttemptedBy(candidateLevel);
  }

  matchesJobRequirement(requirement: string): boolean {
    return this.competencyCoverage.getCompetencyId() === requirement;
  }

  equals(other: InterviewQuestion): boolean {
    return (
      this.questionId === other.getQuestionId() &&
      this.sectionId === other.getSectionId() &&
      this.order === other.getOrder()
    );
  }
}
