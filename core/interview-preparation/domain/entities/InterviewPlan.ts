/**
 * InterviewPlan Entity
 *
 * Complete interview strategy and structure.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY plan entity definition and helper methods.
 */

import { PlanStatus } from "../types";
import { InterviewSection } from "./InterviewSection";
import { InterviewObjective } from "../value-objects/InterviewObjective";
import { InterviewConstraints } from "../value-objects/InterviewConstraints";
import { AdaptiveRules } from "../value-objects/AdaptiveRules";
import { InterviewSummary } from "../value-objects/InterviewSummary";
import { InterviewMetadata } from "../value-objects/InterviewMetadata";
import { CoverageMatrix } from "../value-objects/CoverageMatrix";
import { ValidationResult } from "../types";

export class InterviewPlan {
  private readonly planId: string;
  private readonly candidateId: string;
  private readonly jobOfferId: string;
  private readonly matchingId: string;
  private readonly objective: InterviewObjective;
  private sections: InterviewSection[];
  private readonly constraints: InterviewConstraints;
  private readonly adaptiveRules: AdaptiveRules;
  private readonly summary: InterviewSummary;
  private readonly metadata: InterviewMetadata;
  private status: PlanStatus;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(
    planId: string,
    candidateId: string,
    jobOfferId: string,
    matchingId: string,
    objective: InterviewObjective,
    sections: InterviewSection[],
    constraints: InterviewConstraints,
    adaptiveRules: AdaptiveRules,
    summary: InterviewSummary,
    metadata: InterviewMetadata,
    status: PlanStatus,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.planId = planId;
    this.candidateId = candidateId;
    this.jobOfferId = jobOfferId;
    this.matchingId = matchingId;
    this.objective = objective;
    this.sections = [...sections];
    this.constraints = constraints;
    this.adaptiveRules = adaptiveRules;
    this.summary = summary;
    this.metadata = metadata;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  getPlanId(): string {
    return this.planId;
  }

  getCandidateId(): string {
    return this.candidateId;
  }

  getJobOfferId(): string {
    return this.jobOfferId;
  }

  getMatchingId(): string {
    return this.matchingId;
  }

  getObjective(): InterviewObjective {
    return this.objective;
  }

  getSections(): InterviewSection[] {
    return [...this.sections];
  }

  getConstraints(): InterviewConstraints {
    return this.constraints;
  }

  getAdaptiveRules(): AdaptiveRules {
    return this.adaptiveRules;
  }

  getSummary(): InterviewSummary {
    return this.summary;
  }

  getMetadata(): InterviewMetadata {
    return this.metadata;
  }

  getStatus(): PlanStatus {
    return this.status;
  }

  getCreatedAt(): Date {
    return new Date(this.createdAt);
  }

  getUpdatedAt(): Date {
    return new Date(this.updatedAt);
  }

  addSection(section: InterviewSection): void {
    if (this.sections.some((s) => s.getSectionId() === section.getSectionId())) {
      throw new Error(`Section ${section.getSectionId()} already exists in plan`);
    }
    this.sections.push(section);
    this.updatedAt = new Date();
  }

  removeSection(sectionId: string): void {
    const section = this.sections.find((s) => s.getSectionId() === sectionId);
    if (!section) {
      throw new Error(`Section ${sectionId} not found in plan`);
    }
    if (section.isSectionMandatory()) {
      throw new Error(`Cannot remove mandatory section ${sectionId}`);
    }
    this.sections = this.sections.filter((s) => s.getSectionId() !== sectionId);
    this.updatedAt = new Date();
  }

  reorderSections(sectionIds: string[]): void {
    const sectionMap = new Map(this.sections.map((s) => [s.getSectionId(), s]));
    const reorderedSections: InterviewSection[] = [];
    for (const sectionId of sectionIds) {
      const section = sectionMap.get(sectionId);
      if (!section) {
        throw new Error(`Section ${sectionId} not found in plan`);
      }
      reorderedSections.push(section);
    }
    if (reorderedSections.length !== this.sections.length) {
      throw new Error("Reordered sections count does not match current sections count");
    }
    this.sections = reorderedSections;
    this.updatedAt = new Date();
  }

  validate(): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (this.sections.length === 0) {
      errors.push("Plan must have at least one section");
    }

    const totalQuestions = this.sections.reduce((total, section) => {
      return total + section.getQuestionCount();
    }, 0);

    if (!this.constraints.isQuestionCountValid(totalQuestions)) {
      errors.push(`Invalid question count: ${totalQuestions}`);
    }

    const totalDuration = this.calculateTotalDuration();
    if (!this.constraints.isDurationValid(totalDuration)) {
      errors.push(`Invalid total duration: ${totalDuration} minutes`);
    }

    for (const section of this.sections) {
      const sectionCount = section.getQuestionCount();
      if (!this.constraints.isSectionQuestionCountValid(sectionCount)) {
        errors.push(`Section ${section.getName()} has invalid question count: ${sectionCount}`);
      }
    }

    const isValid = errors.length === 0;
    const score = isValid ? 100 : Math.max(0, 100 - errors.length * 10);

    return {
      isValid,
      errors,
      warnings,
      score,
    };
  }

  calculateTotalDuration(): number {
    return this.sections.reduce((total, section) => {
      return total + section.calculateDuration();
    }, 0);
  }

  getCoverageMatrix(): CoverageMatrix {
    const competencies = new Map<string, number>();
    for (const section of this.sections) {
      for (const question of section.getQuestions()) {
        const coverage = question.getCompetencyCoverage();
        const competencyId = coverage.getCompetencyId();
        const currentCount = competencies.get(competencyId) ?? 0;
        competencies.set(competencyId, currentCount + 1);
      }
    }
    return CoverageMatrix.empty();
  }

  updateStatus(newStatus: PlanStatus): void {
    this.status = newStatus;
    this.updatedAt = new Date();
  }

  equals(other: InterviewPlan): boolean {
    return (
      this.planId === other.getPlanId() &&
	  this.candidateId === other.getCandidateId() &&
      this.jobOfferId === other.getJobOfferId() &&
      this.status === other.getStatus()
    );
  }
}
