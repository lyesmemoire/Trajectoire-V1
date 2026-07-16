/**
 * QuestionDependencies Value Object
 *
 * Dependencies between interview questions.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY dependency definition and helper methods.
 */

import { QuestionDependenciesData } from "../types";

export class QuestionDependencies {
  private readonly requires: string[];
  private readonly excludes: string[];
  private readonly requiresMinimumScore: Map<string, number>;

  constructor(data: QuestionDependenciesData) {
    this.requires = [...data.requires];
    this.excludes = [...data.excludes];
    this.requiresMinimumScore = new Map(data.requiresMinimumScore);
    Object.freeze(this);
  }

  getRequires(): string[] {
    return [...this.requires];
  }

  getExcludes(): string[] {
    return [...this.excludes];
  }

  getRequiresMinimumScore(): Map<string, number> {
    return new Map(this.requiresMinimumScore);
  }

  canBeAsked(
    answeredQuestions: string[],
    scores: Map<string, number>
  ): boolean {
    if (!this.satisfiesRequirements(answeredQuestions, scores)) {
      return false;
    }
    if (!this.satisfiesExclusions(answeredQuestions)) {
      return false;
    }
    return true;
  }

  private satisfiesRequirements(
    answeredQuestions: string[],
    scores: Map<string, number>
  ): boolean {
    for (const requiredQuestionId of this.requires) {
      if (!answeredQuestions.includes(requiredQuestionId)) {
        return false;
      }
      const minimumScore = this.requiresMinimumScore.get(requiredQuestionId);
      if (minimumScore !== undefined) {
        const actualScore = scores.get(requiredQuestionId) ?? 0;
        if (actualScore < minimumScore) {
          return false;
        }
      }
    }
    return true;
  }

  private satisfiesExclusions(answeredQuestions: string[]): boolean {
    return !this.excludes.some((excludedId) =>
      answeredQuestions.includes(excludedId)
    );
  }

  getBlockingQuestions(): string[] {
    return [...this.requires];
  }

  hasCircularDependency(
    questionId: string,
    allDependencies: Map<string, QuestionDependencies>
  ): boolean {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const hasCycle = (currentId: string): boolean => {
      if (recursionStack.has(currentId)) {
        return true;
      }
      if (visited.has(currentId)) {
        return false;
      }

      visited.add(currentId);
      recursionStack.add(currentId);

      const dependencies = allDependencies.get(currentId);
      if (dependencies) {
        for (const requiredId of dependencies.getRequires()) {
          if (hasCycle(requiredId)) {
            return true;
          }
        }
      }

      recursionStack.delete(currentId);
      return false;
    };

    return hasCycle(questionId);
  }

  equals(other: QuestionDependencies): boolean {
    return (
      this.requires.length === other.getRequires().length &&
      this.excludes.length === other.getExcludes().length &&
      this.requires.every((id, index) => id === other.getRequires()[index]) &&
      this.excludes.every((id, index) => id === other.getExcludes()[index])
    );
  }

  static none(): QuestionDependencies {
    return new QuestionDependencies({
      requires: [],
      excludes: [],
      requiresMinimumScore: new Map(),
    });
  }
}
