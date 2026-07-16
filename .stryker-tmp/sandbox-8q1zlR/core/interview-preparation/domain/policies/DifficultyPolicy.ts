/**
 * DifficultyPolicy
 *
 * Policy for enforcing difficulty rules.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY difficulty rule enforcement.
 */
// @ts-nocheck


import { QuestionDifficulty } from "../value-objects/QuestionDifficulty";

export class DifficultyPolicy {
  private readonly minDifficulty: QuestionDifficulty;
  private readonly maxDifficulty: QuestionDifficulty;
  private readonly allowJumps: boolean;

  constructor(
    minDifficulty: QuestionDifficulty = QuestionDifficulty.BEGINNER(),
    maxDifficulty: QuestionDifficulty = QuestionDifficulty.EXPERT(),
    allowJumps: boolean = false
  ) {
    this.minDifficulty = minDifficulty;
    this.maxDifficulty = maxDifficulty;
    this.allowJumps = allowJumps;
  }

  validateProgression(difficulties: QuestionDifficulty[]): boolean {
    for (let i = 1; i < difficulties.length; i++) {
      const current = difficulties[i];
      const previous = difficulties[i - 1];
      const currentNumeric = current.toNumeric();
      const previousNumeric = previous.toNumeric();

      if (currentNumeric < previousNumeric) {
        return false;
      }

      if (!this.allowJumps && currentNumeric - previousNumeric > 1) {
        return false;
      }
    }

    return true;
  }

  validateRange(difficulty: QuestionDifficulty): boolean {
    const numeric = difficulty.toNumeric();
    const minNumeric = this.minDifficulty.toNumeric();
    const maxNumeric = this.maxDifficulty.toNumeric();
    return numeric >= minNumeric && numeric <= maxNumeric;
  }

  getViolationMessage(difficulty: QuestionDifficulty): string {
    const numeric = difficulty.toNumeric();
    const minNumeric = this.minDifficulty.toNumeric();
    const maxNumeric = this.maxDifficulty.toNumeric();

    if (numeric < minNumeric) {
      return `Difficulty ${difficulty.getValue()} is below minimum ${this.minDifficulty.getValue()}`;
    }
    if (numeric > maxNumeric) {
      return `Difficulty ${difficulty.getValue()} exceeds maximum ${this.maxDifficulty.getValue()}`;
    }
    return `Difficulty ${difficulty.getValue()} is invalid`;
  }

  getMinDifficulty(): QuestionDifficulty {
    return this.minDifficulty;
  }

  getMaxDifficulty(): QuestionDifficulty {
    return this.maxDifficulty;
  }

  isJumpsAllowed(): boolean {
    return this.allowJumps;
  }
}
