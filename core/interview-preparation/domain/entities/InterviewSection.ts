/**
 * InterviewSection Entity
 *
 * Logical grouping of interview questions.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY section entity definition and helper methods.
 */

import { InterviewQuestion } from "./InterviewQuestion";
import { InterviewTiming } from "../value-objects/InterviewTiming";

export class InterviewSection {
  private readonly sectionId: string;
  private readonly planId: string;
  private readonly name: string;
  private readonly description: string;
  private readonly objective: string;
  private questions: InterviewQuestion[];
  private readonly timing: InterviewTiming;
  private order: number;
  private readonly isMandatory: boolean;
  private readonly minQuestions: number;
  private readonly maxQuestions: number;

  constructor(
    sectionId: string,
    planId: string,
    name: string,
    description: string,
    objective: string,
    questions: InterviewQuestion[],
    timing: InterviewTiming,
    order: number,
    isMandatory: boolean,
    minQuestions: number,
    maxQuestions: number
  ) {
    this.sectionId = sectionId;
    this.planId = planId;
    this.name = name;
    this.description = description;
    this.objective = objective;
    this.questions = [...questions];
    this.timing = timing;
    this.order = order;
    this.isMandatory = isMandatory;
    this.minQuestions = minQuestions;
    this.maxQuestions = maxQuestions;
  }

  getSectionId(): string {
    return this.sectionId;
  }

  getPlanId(): string {
    return this.planId;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getObjective(): string {
    return this.objective;
  }

  getQuestions(): InterviewQuestion[] {
    return [...this.questions];
  }

  getTiming(): InterviewTiming {
    return this.timing;
  }

  getOrder(): number {
    return this.order;
  }

  isSectionMandatory(): boolean {
    return this.isMandatory;
  }

  getMinQuestions(): number {
    return this.minQuestions;
  }

  getMaxQuestions(): number {
    return this.maxQuestions;
  }

  addQuestion(question: InterviewQuestion): void {
    if (this.questions.length >= this.maxQuestions) {
      throw new Error(`Section ${this.sectionId} has reached maximum question count`);
    }
    if (this.questions.some((q) => q.getQuestionId() === question.getQuestionId())) {
      throw new Error(`Question ${question.getQuestionId()} already exists in section`);
    }
    this.questions.push(question);
  }

  removeQuestion(questionId: string): void {
    if (this.questions.length <= this.minQuestions) {
      throw new Error(`Section ${this.sectionId} has reached minimum question count`);
    }
    this.questions = this.questions.filter((q) => q.getQuestionId() !== questionId);
  }

  reorderQuestions(questionIds: string[]): void {
    const questionMap = new Map(this.questions.map((q) => [q.getQuestionId(), q]));
    const reorderedQuestions: InterviewQuestion[] = [];
    for (const questionId of questionIds) {
      const question = questionMap.get(questionId);
      if (!question) {
        throw new Error(`Question ${questionId} not found in section`);
      }
      reorderedQuestions.push(question);
    }
    if (reorderedQuestions.length !== this.questions.length) {
      throw new Error("Reordered questions count does not match current questions count");
    }
    this.questions = reorderedQuestions;
  }

  calculateDuration(): number {
    return this.questions.reduce((total, question) => {
      return total + question.getTiming().getTotalTime();
    }, 0);
  }

  getQuestionCount(): number {
    return this.questions.length;
  }

  equals(other: InterviewSection): boolean {
    return (
      this.sectionId === other.getSectionId() &&
      this.planId === other.getPlanId() &&
      this.order === other.getOrder()
    );
  }
}
