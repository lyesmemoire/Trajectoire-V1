import { UseCase } from "@/lib/core/application/UseCase";
import { Result, ok, fail } from "@/lib/core/result";
import { SubscriptionRepositoryPort } from "../../ports/repositories/SubscriptionRepositoryPort";
import { SubscriptionAggregate } from "../../domain/aggregates/subscription.aggregate";
import { Plan } from "../../domain/value-objects/plan.vo";
import { SubscriptionStatus } from "../../domain/value-objects/subscription-status.vo";
import { BillingPeriod } from "../../domain/value-objects/billing-period.vo";
import { Clock } from "@/lib/core/clock/Clock";
import { IdGenerator } from "@/lib/core/id/IdGenerator";

export interface ActivateSubscriptionCommand {
  userId: string;
  stripeCustomerId: string;
  stripeSubId: string;
  planStr: string;
  periodEnd: Date;
}

export class ActivateSubscriptionUseCase extends UseCase<ActivateSubscriptionCommand, void> {
  constructor(
    private readonly subscriptionRepo: SubscriptionRepositoryPort,
    private readonly clock: Clock,
    private readonly idGenerator: IdGenerator
  ) {
    super();
  }

  protected async run(command: ActivateSubscriptionCommand): Promise<Result<void>> {
    const plan = Plan.create(command.planStr);
    const status = SubscriptionStatus.create("active");
    const period = BillingPeriod.create(this.clock.now(), command.periodEnd);

    const subscription = SubscriptionAggregate.create(this.idGenerator.generate(), {
      userId: command.userId,
      stripeCustomerId: command.stripeCustomerId,
      stripeSubId: command.stripeSubId,
      plan,
      status,
      period,
      createdAt: this.clock.now(),
      updatedAt: this.clock.now()
    }, this.clock);

    const result = await this.subscriptionRepo.save(subscription);
    if (result.isFailure()) return fail(result.unwrapError());

    return ok(undefined);
  }
}


