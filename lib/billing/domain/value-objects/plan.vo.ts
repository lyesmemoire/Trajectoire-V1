export type PlanValue = "FREE" | "PRO" | "EXPERT";

export class Plan {
  private constructor(public readonly value: PlanValue) {}

  static create(value: string): Plan {
    const validPlans: PlanValue[] = ["FREE", "PRO", "EXPERT"];
    if (!validPlans.includes(value as PlanValue)) {
      throw new Error(`Invalid Plan: ${value}`);
    }
    return new Plan(value as PlanValue);
  }

  isPremium(): boolean {
    return this.value === "PRO" || this.value === "EXPERT";
  }
}
