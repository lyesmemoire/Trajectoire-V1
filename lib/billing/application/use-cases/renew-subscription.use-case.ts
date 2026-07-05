import { InfrastructureError } from "@/lib/core/result/errors";
import { UseCase } from "@/lib/core/application/UseCase";
import { Result, ok, fail } from "@/lib/core/result";
import { SubscriptionRepositoryPort } from "../../ports/repositories/SubscriptionRepositoryPort";
import { BillingPeriod } from "../../domain/value-objects/billing-period.vo";
import { NotFoundError } from "@/lib/core/result/errors";
import { Clock } from "@/lib/core/clock/Clock";

export interface RenewSubscriptionCommand {
  stripeSubId: string;
  periodEnd: Date;
}

export class RenewSubscriptionUseCase extends UseCase<RenewSubscriptionCommand, void> {
  constructor(
    private readonly subscriptionRepo: SubscriptionRepositoryPort,
    private readonly clock: Clock
  ) {
    super();
  }

  protected async run(command: RenewSubscriptionCommand): Promise<Result<void>> {
    const subResult = await this.subscriptionRepo.findByStripeSubId(command.stripeSubId);
    if (subResult.isFailure()) return fail(subResult.unwrapError());

    const subscription = subResult.unwrap();
    if (!subscription) {
      return fail(new NotFoundError("Subscription not found"));
    }

    try {
      const newPeriod = BillingPeriod.create(this.clock.now(), command.periodEnd);
      subscription.changePlan(subscription.plan, newPeriod);
    } catch (e: any) {
      return fail(new InfrastructureError(e.message));
    }

    const saveResult = await this.subscriptionRepo.save(subscription);
    if (saveResult.isFailure()) return fail(saveResult.unwrapError());

    return ok(undefined);
  }
}


