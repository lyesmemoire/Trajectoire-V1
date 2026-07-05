import { InfrastructureError } from "@/lib/core/result/errors";
import { UseCase } from "@/lib/core/application/UseCase";
import { Result, ok, fail } from "@/lib/core/result";
import { SubscriptionRepositoryPort } from "../../ports/repositories/SubscriptionRepositoryPort";
import { NotFoundError } from "@/lib/core/result/errors";

export interface CancelSubscriptionCommand {
  stripeSubId: string;
}

export class CancelSubscriptionUseCase extends UseCase<CancelSubscriptionCommand, void> {
  constructor(private readonly subscriptionRepo: SubscriptionRepositoryPort) {
    super();}

  protected async run(command: CancelSubscriptionCommand): Promise<Result<void>> {
    const subResult = await this.subscriptionRepo.findByStripeSubId(command.stripeSubId);
    if (subResult.isFailure()) return fail(subResult.unwrapError());
    
    const subscription = subResult.unwrap();
    if (!subscription) {
      return fail(new NotFoundError("Subscription not found"));
    }

    try {
      subscription.cancel();
    } catch (e: any) {
      return fail(new InfrastructureError(e.message));
    }

    const saveResult = await this.subscriptionRepo.save(subscription);
    if (saveResult.isFailure()) return fail(saveResult.unwrapError());

    // LocalEventBus will be used here or elsewhere to publish subscription.pullEvents()
    // For now, returning ok.
    return ok(undefined);
  }
}


