// @ts-nocheck
import { InfrastructureError } from "@/lib/core/result/errors";
import { UseCase } from "@/lib/core/application/UseCase";
import { Result, ok, fail } from "@/lib/core/result";
import { PaymentProviderPort } from "../../ports/gateways/PaymentProviderPort";
import { ActivateSubscriptionUseCase } from "./activate-subscription.use-case";
import { CancelSubscriptionUseCase } from "./cancel-subscription.use-case";
import { PurchaseCreditsUseCase } from "./purchase-credits.use-case";

export interface HandleWebhookCommand {
  payload: string;
  signature: string;
  eventType: string;
  eventData: any;
}

export class HandleWebhookUseCase extends UseCase<HandleWebhookCommand, void> {
  constructor(
    private readonly paymentProvider: PaymentProviderPort,
    private readonly activateSubscription: ActivateSubscriptionUseCase,
    private readonly cancelSubscription: CancelSubscriptionUseCase,
    private readonly purchaseCredits: PurchaseCreditsUseCase
  ) {
    super();
  }

  protected async run(command: HandleWebhookCommand): Promise<Result<void>> {
    // Verify webhook signature
    const verifyResult = await this.paymentProvider.verifyWebhook(command.payload, command.signature);
    if (verifyResult.isFailure()) return fail(verifyResult.unwrapError());

    // Route based on event type
    switch (command.eventType) {
      case "checkout.session.completed":
        return this.handleCheckoutCompleted(command.eventData);
      case "customer.subscription.deleted":
        return this.handleSubscriptionDeleted(command.eventData);
      case "invoice.payment_succeeded":
        return this.handlePaymentSucceeded(command.eventData);
      case "invoice.payment_failed":
        return this.handlePaymentFailed(command.eventData);
      default:
        // Unknown event type, but still acknowledge
        return ok(undefined);
    }
  }

  private async handleCheckoutCompleted(data: any): Promise<Result<void>> {
    try {
      const userId = data.metadata?.userId;
      if (!userId) {
        return fail(new InfrastructureError("No userId in checkout session metadata"));
      }

      // Activate subscription
      const activateResult = await this.activateSubscription.execute({
        userId,
        stripeCustomerId: data.customer,
        stripeSubId: data.subscription,
        planStr: data.metadata?.plan || "PRO",
        periodEnd: new Date(data.subscription_details?.current_period_end * 1000),
      });

      if (activateResult.isFailure()) return fail(activateResult.unwrapError());

      return ok(undefined);
    } catch (e: any) {
      return fail(new InfrastructureError(`Failed to handle checkout.completed: ${e.message}`));
    }
  }

  private async handleSubscriptionDeleted(data: any): Promise<Result<void>> {
    try {
      const stripeSubId = data.id;
      const subscriptionResult = await this.cancelSubscription.execute({
        stripeSubId,
      });

      if (subscriptionResult.isFailure()) return fail(subscriptionResult.unwrapError());

      return ok(undefined);
    } catch (e: any) {
      return fail(new InfrastructureError(`Failed to handle subscription.deleted: ${e.message}`));
    }
  }

  private async handlePaymentSucceeded(data: any): Promise<Result<void>> {
    try {
      // Could add credits or handle renewal here
      // For now, just acknowledge
      return ok(undefined);
    } catch (e: any) {
      return fail(new InfrastructureError(`Failed to handle payment.succeeded: ${e.message}`));
    }
  }

  private async handlePaymentFailed(data: any): Promise<Result<void>> {
    try {
      // Could send notification or handle failed payment here
      // For now, just acknowledge
      return ok(undefined);
    } catch (e: any) {
      return fail(new InfrastructureError(`Failed to handle payment.failed: ${e.message}`));
    }
  }
}
