import { describe, it, expect } from "vitest";
import {
  createInitialBudget,
  consumeBudget,
  isBudgetExhausted,
} from "../../apps/web/src/domain/cognitive/InterviewBudget";

describe("InterviewBudget", () => {
  it("creates an initial budget with correct defaults", () => {
    const budget = createInitialBudget(30, 20, 10);
    expect(budget.maxDurationMinutes).toBe(30);
    expect(budget.remainingMinutes).toBe(30);
    expect(budget.maxQuestions).toBe(20);
    expect(budget.remainingQuestions).toBe(20);
    expect(budget.competenciesTotal).toBe(10);
    expect(budget.fatigueLevel).toBe(0);
    expect(budget.tokensConsumed).toBe(0);
  });

  it("decrements question budget immutably", () => {
    const initial = createInitialBudget(45, 35, 12);
    const after = consumeBudget(initial, "question", 2, 500);

    expect(initial.remainingQuestions).toBe(35);
    expect(after.remainingQuestions).toBe(34);
    expect(after.remainingMinutes).toBe(43);
    expect(after.tokensConsumed).toBe(500);
  });

  it("decrements challenge budget", () => {
    const initial = createInitialBudget();
    const after = consumeBudget(initial, "challenge");

    expect(initial.challengeBudget).toBe(4);
    expect(after.challengeBudget).toBe(3);
    expect(after.remainingQuestions).toBe(initial.remainingQuestions);
  });

  it("decrements follow_up budget", () => {
    const initial = createInitialBudget();
    const after = consumeBudget(initial, "follow_up");
    expect(after.followUpBudget).toBe(7);
  });

  it("decrements deep_dive budget", () => {
    const initial = createInitialBudget();
    const after = consumeBudget(initial, "deep_dive");
    expect(after.deepDiveBudget).toBe(2);
  });

  it("never goes below 0", () => {
    const initial = createInitialBudget(1, 1, 1);
    const after = consumeBudget(initial, "question", 100, 999999);

    expect(after.remainingMinutes).toBe(0);
    expect(after.remainingQuestions).toBe(0);
  });

  describe("isBudgetExhausted", () => {
    it("returns false for a fresh budget", () => {
      expect(isBudgetExhausted(createInitialBudget())).toBe(false);
    });

    it("returns true when time runs out", () => {
      const budget = { ...createInitialBudget(), remainingMinutes: 0 };
      expect(isBudgetExhausted(budget)).toBe(true);
    });

    it("returns true when questions run out", () => {
      const budget = { ...createInitialBudget(), remainingQuestions: 0 };
      expect(isBudgetExhausted(budget)).toBe(true);
    });

    it("returns true when token budget is exceeded", () => {
      const budget = { ...createInitialBudget(), tokensConsumed: 50001 };
      expect(isBudgetExhausted(budget)).toBe(true);
    });
  });
});
