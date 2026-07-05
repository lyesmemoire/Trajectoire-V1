import { BaseDomainEvent } from "@/lib/core/events/domain/BaseDomainEvent";

export class UserCreated extends BaseDomainEvent<{
  userId: string;
  email: string;
  displayName: string;
}> {
  public readonly type = "auth.user.created";

  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      userId: string;
      email: string;
      displayName: string;
    }
  ) {
    super();
  }
}
