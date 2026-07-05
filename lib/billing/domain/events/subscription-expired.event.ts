import { BaseDomainEvent } from "@/lib/core/events/domain/BaseDomainEvent";

export class SubscriptionExpired extends BaseDomainEvent<{ userId: string; plan: string }> {
  public readonly type = "billing.subscription.expired";
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { userId: string; plan: string }
  ) {
    super();
  }
}
