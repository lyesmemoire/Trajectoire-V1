// @ts-nocheck
import { Result, fail } from "@/lib/core/result";
import { InfrastructureError } from "@/lib/core/result/errors";
import { StripeWebhookHandler } from "./StripeWebhookHandler";
import { WebhookEventPayload } from "../../ports/gateways/WebhookGatewayPort";
import { ActivateSubscriptionUseCase } from "../../application/use-cases/activate-subscription.use-case";
import Stripe from "stripe";

export class CheckoutCompletedHandler implements StripeWebhookHandler {
  constructor(private readonly activateUseCase: ActivateSubscriptionUseCase) {}

  async handle(payload: WebhookEventPayload): Promise<Result<void>> {
    const session = payload.data.object as Stripe.Checkout.Session;
    
    if (!session.metadata?.userId || !session.subscription || !session.customer) {
      return fail(new InfrastructureError("Missing metadata, subscription, or customer on checkout session"));
    }

    const userId = session.metadata.userId;
    const stripeSubId = typeof session.subscription === "string" ? session.subscription : session.subscription.id;
    const stripeCustomerId = typeof session.customer === "string" ? session.customer : session.customer.id;

    // By default, assuming PRO for this skeleton, normally you'd map price_id to Plan
    const result = await this.activateUseCase.execute({
      userId,
      stripeCustomerId,
      stripeSubId,
      planStr: "PRO", 
      periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Dummy logic
    });

    return result;
  }
}
