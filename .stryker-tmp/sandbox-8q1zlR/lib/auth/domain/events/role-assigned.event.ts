// @ts-nocheck
import { BaseDomainEvent } from "@/lib/core/events/domain/BaseDomainEvent";

export class RoleAssigned extends BaseDomainEvent<{
  userId: string;
  role: string;
}> {
  public readonly type = "auth.role.assigned";

  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      userId: string;
      role: string;
    }
  ) {
    super();
  }
}
