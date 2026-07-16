/**
 * InterviewPlanAggregate
 *
 * Aggregate root for interview planning.
 * Enforces consistency boundaries and invariants.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY aggregate consistency enforcement.
 */

import { InterviewPlan } from "../entities/InterviewPlan";
import { InterviewSection } from "../entities/InterviewSection";
import { InterviewQuestion } from "../entities/InterviewQuestion";
import { CoverageMatrix } from "../value-objects/CoverageMatrix";
import { ValidationResult } from "../types";

export class InterviewPlanAggregate {
  private readonly root: InterviewPlan;

  constructor(root: InterviewPlan) {
    this.root = root;
    this.enforceInvariants();
  }

  getRoot(): InterviewPlan {
    return this.root;
  }

  addSection(section: InterviewSection): void {
    this.root.addSection(section);
    this.enforceInvariants();
  }

  removeSection(sectionId: string): void {
    this.root.removeSection(sectionId);
    this.enforceInvariants();
  }

  reorderSections(sectionIds: string[]): void {
    this.root.reorderSections(sectionIds);
    this.enforceInvariants();
  }

  addQuestionToSection(sectionId: string, question: InterviewQuestion): void {
    const section = this.root.getSections().find((s) => s.getSectionId() === sectionId);
    if (!section) {
      throw new Error(`Section ${sectionId} not found in plan`);
    }
    section.addQuestion(question);
    this.enforceInvariants();
  }

  removeQuestionFromSection(sectionId: string, questionId: string): void {
    const section = this.root.getSections().find((s) => s.getSectionId() === sectionId);
    if (!section) {
      throw new Error(`Section ${sectionId} not found in plan`);
    }
    section.removeQuestion(questionId);
    this.enforceInvariants();
  }

  reorderQuestionsInSection(sectionId: string, questionIds: string[]): void {
    const section = this.root.getSections().find((s) => s.getSectionId() === sectionId);
    if (!section) {
      throw new Error(`Section ${sectionId} not found in plan`);
    }
    section.reorderQuestions(questionIds);
    this.enforceInvariants();
  }

  validate(): ValidationResult {
    return this.root.validate();
  }

  calculateTotalDuration(): number {
    return this.root.calculateTotalDuration();
  }

  getCoverageMatrix(): CoverageMatrix {
    return this.root.getCoverageMatrix();
  }

  private enforceInvariants(): void {
    this.enforceMinSections();
    this.enforceMaxDuration();
    this.enforceMandatoryCoverage();
  }

  private enforceMinSections(): void {
    const sections = this.root.getSections();
    if (sections.length === 0) {
      throw new Error("Plan must have at least one section");
    }
  }

  private enforceMaxDuration(): void {
    const duration = this.calculateTotalDuration();
    const constraints = this.root.getConstraints();
    if (!constraints.isDurationValid(duration)) {
      throw new Error(`Plan duration ${duration} exceeds maximum ${constraints.getMaxTotalDuration()}`);
    }
  }

  private enforceMandatoryCoverage(): void {
    const mandatoryCompetencies = this.root.getConstraints().getMandatoryCompetencies();
    if (mandatoryCompetencies.length === 0) {
      return;
    }

    const coverageMatrix = this.getCoverageMatrix();
    const gaps = coverageMatrix.getGaps();
    const missingMandatory = mandatoryCompetencies.filter((id) => gaps.includes(id));

    if (missingMandatory.length > 0) {
      throw new Error(`Plan does not cover mandatory competencies: ${missingMandatory.join(", ")}`);
    }
  }

  equals(other: InterviewPlanAggregate): boolean {
    return this.root.equals(other.getRoot());
  }
}
