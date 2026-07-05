import { BaseDomainEvent } from "@/lib/core/events/domain/BaseDomainEvent";

export class SubscriptionChanged extends BaseDomainEvent<{ userId: string; fromPlan: string; toPlan: string }> {
  public readonly type = "billing.subscription.changed";
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { userId: string; fromPlan: string; toPlan: string }
  ) {
    super();
  }
}
