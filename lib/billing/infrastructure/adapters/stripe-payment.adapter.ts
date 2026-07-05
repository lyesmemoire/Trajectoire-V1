import { Result, ok, fail } from "@/lib/core/result";
import { InfrastructureError } from "@/lib/core/result/errors";
import { PaymentProviderPort, CheckoutSessionParams, CheckoutSessionResult, PortalSessionResult } from "../../ports/gateways/PaymentProviderPort";
import { stripe } from "@/lib/stripe";
import { envServer } from "@/lib/env.server";

export class StripePaymentAdapter implements PaymentProviderPort {
  async createCheckout(params: CheckoutSessionParams): Promise<Result<CheckoutSessionResult>> {
    try {
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer_email: params.userEmail,
        line_items: [{ price: params.priceId, quantity: 1 }],
        success_url: params.successUrl,
        cancel_url: params.cancelUrl,
        allow_promotion_codes: true,
        subscription_data: {
          trial_period_days: 7,
          metadata: { userId: params.userId, ...params.metadata },
        },
        metadata: { userId: params.userId, ...params.metadata },
      });

      if (!session.url) {
        return fail(new InfrastructureError("Failed to create checkout session: no URL returned"));
      }

      return ok({
        sessionId: session.id,
        url: session.url,
      });
    } catch (error: any) {
      return fail(new InfrastructureError(`Failed to create checkout session: ${error.message}`));
    }
  }

  async createPortal(customerId: string, returnUrl: string): Promise<Result<PortalSessionResult>> {
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });

      if (!session.url) {
        return fail(new InfrastructureError("Failed to create portal session: no URL returned"));
      }

      return ok({
        url: session.url,
      });
    } catch (error: any) {
      return fail(new InfrastructureError(`Failed to create portal session: ${error.message}`));
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<Result<void>> {
    try {
      await stripe.subscriptions.cancel(subscriptionId);
      return ok(undefined);
    } catch (error: any) {
      return fail(new InfrastructureError(`Failed to cancel subscription: ${error.message}`));
    }
  }

  async verifyWebhook(payload: string, signature: string): Promise<Result<boolean>> {
    try {
      const webhookSecret = envServer.STRIPE_WEBHOOK_SECRET;
      if (!webhookSecret) {
        return fail(new InfrastructureError("STRIPE_WEBHOOK_SECRET not configured"));
      }

      stripe.webhooks.constructEvent(payload, signature, webhookSecret);
      return ok(true);
    } catch (error: any) {
      return fail(new InfrastructureError(`Webhook verification failed: ${error.message}`));
    }
  }

  async getCustomerId(userId: string): Promise<Result<string | null>> {
    try {
      // Look up customer by userId in metadata
      const customers = await stripe.customers.list({
        limit: 100,
      });

      const customer = customers.data.find((c) => c.metadata?.userId === userId);
      return ok(customer?.id || null);
    } catch (error: any) {
      return fail(new InfrastructureError(`Failed to get customer ID: ${error.message}`));
    }
  }

  async getOrCreateCustomer(userId: string, email: string): Promise<Result<string>> {
    try {
      // First try to find existing customer
      const existingResult = await this.getCustomerId(userId);
      if (existingResult.isSuccess() && existingResult.unwrap()) {
        return ok(existingResult.unwrap()!);
      }

      // Create new customer
      const customer = await stripe.customers.create({
        email,
        metadata: { userId },
      });

      return ok(customer.id);
    } catch (error: any) {
      return fail(new InfrastructureError(`Failed to get or create customer: ${error.message}`));
    }
  }
}
