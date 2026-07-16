/**
 * InterviewObjective Value Object
 *
 * Interview goal definition.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY objective definition and helper methods.
 */

import { InterviewObjectiveData, ObjectiveType } from "../types";

export class InterviewObjective {
  private readonly objectiveId: string;
  private readonly type: ObjectiveType;
  private readonly primaryGoal: string;
  private readonly secondaryGoals: string[];
  private readonly successCriteria: string[];

  constructor(data: InterviewObjectiveData) {
    this.objectiveId = data.objectiveId;
    this.type = data.type;
    this.primaryGoal = data.primaryGoal;
    this.secondaryGoals = [...data.secondaryGoals];
    this.successCriteria = [...data.successCriteria];
    Object.freeze(this);
  }

  getObjectiveId(): string {
    return this.objectiveId;
  }

  getType(): ObjectiveType {
    return this.type;
  }

  getPrimaryGoal(): string {
    return this.primaryGoal;
  }

  getSecondaryGoals(): string[] {
    return [...this.secondaryGoals];
  }

  getSuccessCriteria(): string[] {
    return [...this.successCriteria];
  }

  isSuccessMet(criteria: string[]): boolean {
    return this.successCriteria.every((criterion) =>
      criteria.includes(criterion)
    );
  }

  equals(other: InterviewObjective): boolean {
    return (
      this.objectiveId === other.getObjectiveId() &&
      this.type === other.getType() &&
      this.primaryGoal === other.getPrimaryGoal()
    );
  }

  static fromType(type: ObjectiveType): InterviewObjective {
    const primaryGoal = this.getDefaultPrimaryGoal(type);
    const secondaryGoals = this.getDefaultSecondaryGoals(type);
    const successCriteria = this.getDefaultSuccessCriteria(type);
    return new InterviewObjective({
      objectiveId: `objective_${Date.now()}`,
      type,
      primaryGoal,
      secondaryGoals,
      successCriteria,
    });
  }

  private static getDefaultPrimaryGoal(type: ObjectiveType): string {
    switch (type) {
      case ObjectiveType.SCREENING:
        return "Assess basic candidate fit";
      case ObjectiveType.TECHNICAL:
        return "Evaluate technical skills and knowledge";
      case ObjectiveType.BEHAVIORAL:
        return "Assess behavioral competencies";
      case ObjectiveType.CULTURAL:
        return "Evaluate cultural fit";
      case ObjectiveType.FINAL:
        return "Make final hiring decision";
      default:
        throw new Error(`Unknown ObjectiveType: ${type}`);
    }
  }

  private static getDefaultSecondaryGoals(type: ObjectiveType): string[] {
    switch (type) {
      case ObjectiveType.SCREENING:
        return ["Verify qualifications", "Assess communication"];
      case ObjectiveType.TECHNICAL:
        return ["Test problem-solving", "Evaluate depth of knowledge"];
      case ObjectiveType.BEHAVIORAL:
        return ["Assess teamwork", "Evaluate leadership potential"];
      case ObjectiveType.CULTURAL:
        return ["Assess values alignment", "Evaluate team fit"];
      case ObjectiveType.FINAL:
        return ["Confirm overall fit", "Discuss compensation"];
      default:
        throw new Error(`Unknown ObjectiveType: ${type}`);
    }
  }

  private static getDefaultSuccessCriteria(type: ObjectiveType): string[] {
    switch (type) {
      case ObjectiveType.SCREENING:
        return ["Minimum qualifications met", "Communication adequate"];
      case ObjectiveType.TECHNICAL:
        return ["Technical skills verified", "Problem-solving demonstrated"];
      case ObjectiveType.BEHAVIORAL:
        return ["Behavioral competencies assessed", "Team fit confirmed"];
      case ObjectiveType.CULTURAL:
        return ["Values aligned", "Team fit confirmed"];
      case ObjectiveType.FINAL:
        return ["Overall fit confirmed", "Offer decision ready"];
      default:
        throw new Error(`Unknown ObjectiveType: ${type}`);
    }
  }
}
