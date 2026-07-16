// @ts-nocheck
import { InfrastructureError } from "@/lib/core/result/errors";
import { UseCase } from "@/lib/core/application/UseCase";
import { Result, ok, fail } from "@/lib/core/result";
import { SubscriptionRepositoryPort } from "../../ports/repositories/SubscriptionRepositoryPort";
import { Plan } from "../../domain/value-objects/plan.vo";
import { BillingPeriod } from "../../domain/value-objects/billing-period.vo";
import { NotFoundError } from "@/lib/core/result/errors";

export interface ChangeSubscriptionCommand {
  userId: string;
  newPlan: string;
  newPeriodEnd: Date;
}

export class ChangeSubscriptionUseCase extends UseCase<ChangeSubscriptionCommand, void> {
  constructor(private readonly subscriptionRepo: SubscriptionRepositoryPort) {
    super();
  }

  protected async run(command: ChangeSubscriptionCommand): Promise<Result<void>> {
    const subscriptionResult = await this.subscriptionRepo.findByUserId(command.userId);
    if (subscriptionResult.isFailure()) return fail(subscriptionResult.unwrapError());

    const subscription = subscriptionResult.unwrap();
    if (!subscription) {
      return fail(new NotFoundError("Subscription not found for user"));
    }

    try {
      const newPlan = Plan.create(command.newPlan);
      const newPeriod = BillingPeriod.create(subscription.period.start, command.newPeriodEnd);
      subscription.changePlan(newPlan, newPeriod);
    } catch (e: any) {
      return fail(new InfrastructureError(e.message));
    }

    const saveResult = await this.subscriptionRepo.save(subscription);
    if (saveResult.isFailure()) return fail(saveResult.unwrapError());

    return ok(undefined);
  }
}
