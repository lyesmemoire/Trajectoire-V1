import { BaseDomainEvent } from "@/lib/core/events/domain/BaseDomainEvent";

export class CreditsAdded extends BaseDomainEvent<{ userId: string; amount: number; transactionId: string }> {
  public readonly type = "billing.credits.added";
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { userId: string; amount: number; transactionId: string }
  ) {
    super();
  }
}
