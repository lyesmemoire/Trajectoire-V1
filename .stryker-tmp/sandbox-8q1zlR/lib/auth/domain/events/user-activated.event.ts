// @ts-nocheck
import { BaseDomainEvent } from "@/lib/core/events/domain/BaseDomainEvent";

export class UserActivated extends BaseDomainEvent<{
  userId: string;
}> {
  public readonly type = "auth.user.activated";

  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      userId: string;
    }
  ) {
    super();
  }
}
