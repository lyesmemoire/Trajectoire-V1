import { BaseDomainEvent } from "@/lib/core/events/domain/BaseDomainEvent";

export class PaymentFailed extends BaseDomainEvent<{ userId: string; amount: number; reason: string }> {
  public readonly type = "billing.payment.failed";
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { userId: string; amount: number; reason: string }
  ) {
    super();
  }
}
