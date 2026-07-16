// @ts-nocheck
import { BaseDomainEvent } from "@/lib/core/events/domain/BaseDomainEvent";

export class UserUpdated extends BaseDomainEvent<{
  userId: string;
  field: string;
  oldValue: unknown;
  newValue: unknown;
}> {
  public readonly type = "auth.user.updated";

  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      userId: string;
      field: string;
      oldValue: unknown;
      newValue: unknown;
    }
  ) {
    super();
  }
}
