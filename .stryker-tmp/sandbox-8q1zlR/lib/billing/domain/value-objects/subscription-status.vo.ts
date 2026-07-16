// @ts-nocheck
export type SubscriptionStatusValue = "active" | "past_due" | "canceled" | "unpaid" | "trialing" | "incomplete" | "incomplete_expired";

export class SubscriptionStatus {
  private constructor(public readonly value: SubscriptionStatusValue) {}

  static create(value: string): SubscriptionStatus {
    const validStatuses: SubscriptionStatusValue[] = [
      "active", "past_due", "canceled", "unpaid", "trialing", "incomplete", "incomplete_expired"
    ];
    if (!validStatuses.includes(value as SubscriptionStatusValue)) {
      throw new Error(`Invalid SubscriptionStatus: ${value}`);
    }
    return new SubscriptionStatus(value as SubscriptionStatusValue);
  }

  get isActive(): boolean {
    return this.value === "active" || this.value === "trialing";
  }
}
