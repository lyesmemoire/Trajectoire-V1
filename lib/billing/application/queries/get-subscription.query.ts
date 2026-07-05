import { QueryHandler } from "@/lib/core/application/base/QueryHandler";
import { Result, ok, fail } from "@/lib/core/result";
import { BillingQueryPort } from "../../ports/queries/BillingQueryPort";
import { NotFoundError } from "@/lib/core/result/errors";

export interface GetSubscriptionQueryParams {
  userId: string;
}

export interface SubscriptionDTO {
  userId: string;
  plan: string;
  status: string;
  currentPeriodEnd: Date;
  stripeCustomerId: string;
  stripeSubId: string;
}

export class GetSubscriptionQuery extends QueryHandler<GetSubscriptionQueryParams, SubscriptionDTO> {
  constructor(private readonly billingQuery: BillingQueryPort) {
    super();
  }

  async execute(params: GetSubscriptionQueryParams): Promise<Result<SubscriptionDTO>> {
    const subscriptionResult = await this.billingQuery.getSubscription(params.userId);
    if (subscriptionResult.isFailure()) return fail(subscriptionResult.unwrapError());

    const subscription = subscriptionResult.unwrap();
    if (!subscription) {
      return fail(new NotFoundError("Subscription not found"));
    }

    return ok({
      userId: subscription.userId,
      plan: subscription.plan.value,
      status: subscription.status.value,
      currentPeriodEnd: subscription.period.end,
      stripeCustomerId: subscription.stripeCustomerId,
      stripeSubId: subscription.stripeSubId,
    });
  }
}
