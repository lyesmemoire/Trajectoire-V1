import { BaseDomainEvent } from "@/lib/core/events/domain/BaseDomainEvent";

export class SubscriptionChanged extends BaseDomainEvent<{
  userId: string;
  oldSubscription: string;
  newSubscription: string;
}> {
  public readonly type = "auth.subscription.changed";

  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      userId: string;
      oldSubscription: string;
      newSubscription: string;
    }
  ) {
    super();
  }
}
