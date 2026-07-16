// @ts-nocheck
import { Result } from "@/lib/core/result";
import { SubscriptionAggregate } from "../../domain/aggregates/subscription.aggregate";

export interface SubscriptionRepositoryPort {
  save(subscription: SubscriptionAggregate): Promise<Result<void>>;
  findByUserId(userId: string): Promise<Result<SubscriptionAggregate | null>>;
  findByStripeSubId(stripeSubId: string): Promise<Result<SubscriptionAggregate | null>>;
}
