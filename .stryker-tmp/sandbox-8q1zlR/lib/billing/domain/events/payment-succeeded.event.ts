// @ts-nocheck
import { BaseDomainEvent } from "@/lib/core/events/domain/BaseDomainEvent";

export class PaymentSucceeded extends BaseDomainEvent<{ userId: string; amount: number; stripePaymentIntentId: string }> {
  public readonly type = "billing.payment.succeeded";
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { userId: string; amount: number; stripePaymentIntentId: string }
  ) {
    super();
  }
}
