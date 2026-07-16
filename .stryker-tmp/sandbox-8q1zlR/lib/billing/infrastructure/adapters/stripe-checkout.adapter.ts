// @ts-nocheck
import { Result, ok, fail } from "@/lib/core/result";
import { InfrastructureError } from "@/lib/core/result/errors";
import { CheckoutGatewayPort, CheckoutSessionUrl } from "../../ports/gateways/CheckoutGatewayPort";
import { stripe } from "@/lib/stripe";

export class StripeCheckoutAdapter implements CheckoutGatewayPort {
  async createSession(userId: string, email: string, priceId: string, successUrl: string, cancelUrl: string): Promise<Result<CheckoutSessionUrl>> {
    try {
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer_email: email,
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: successUrl,
        cancel_url: cancelUrl,
        allow_promotion_codes: true,
        subscription_data: {
          trial_period_days: 7,
          metadata: { userId },
        },
        metadata: { userId },
      });

      if (!session.url) {
        return fail(new InfrastructureError("Stripe returned a session without a URL"));
      }

      return ok({ url: session.url });
    } catch (error: any) {
      return fail(new InfrastructureError(`Failed to create Stripe checkout session: ${error.message}`));
    }
  }
}
