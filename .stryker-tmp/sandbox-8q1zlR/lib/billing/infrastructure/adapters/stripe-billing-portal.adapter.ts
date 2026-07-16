// @ts-nocheck
import { Result, ok, fail } from "@/lib/core/result";
import { InfrastructureError } from "@/lib/core/result/errors";
import { BillingPortalGatewayPort, BillingPortalUrl } from "../../ports/gateways/BillingPortalGatewayPort";
import { stripe } from "@/lib/stripe";

export class StripeBillingPortalAdapter implements BillingPortalGatewayPort {
  async createPortalSession(stripeCustomerId: string, returnUrl: string): Promise<Result<BillingPortalUrl>> {
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: returnUrl,
      });

      if (!session.url) {
        return fail(new InfrastructureError("Stripe returned a portal session without a URL"));
      }

      return ok({ url: session.url });
    } catch (error: any) {
      return fail(new InfrastructureError(`Failed to create Stripe billing portal session: ${error.message}`));
    }
  }
}
