// @ts-nocheck
import { BaseDomainEvent } from "@/lib/core/events/domain/BaseDomainEvent";

export class UserDeactivated extends BaseDomainEvent<{
  userId: string;
  reason?: string;
}> {
  public readonly type = "auth.user.deactivated";

  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      userId: string;
      reason?: string;
    }
  ) {
    super();
  }
}
