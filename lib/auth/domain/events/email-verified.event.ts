import { BaseDomainEvent } from "@/lib/core/events/domain/BaseDomainEvent";

export class EmailVerified extends BaseDomainEvent<{
  userId: string;
  email: string;
}> {
  public readonly type = "auth.email.verified";

  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      userId: string;
      email: string;
    }
  ) {
    super();
  }
}
