import { Result } from "@/lib/core/result";
import { Money } from "../../domain/value-objects/money.vo";
import { Plan } from "../../domain/value-objects/plan.vo";

export interface CheckoutSessionParams {
  userId: string;
  userEmail: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export interface CheckoutSessionResult {
  sessionId: string;
  url: string;
}

export interface PortalSessionResult {
  url: string;
}

export interface PaymentProviderPort {
  /**
   * Create a Stripe checkout session for subscription or one-time purchase
   */
  createCheckout(params: CheckoutSessionParams): Promise<Result<CheckoutSessionResult>>;

  /**
   * Create a Stripe customer portal session for managing subscriptions
   */
  createPortal(customerId: string, returnUrl: string): Promise<Result<PortalSessionResult>>;

  /**
   * Cancel a subscription
   */
  cancelSubscription(subscriptionId: string): Promise<Result<void>>;

  /**
   * Verify a Stripe webhook signature
   */
  verifyWebhook(payload: string, signature: string): Promise<Result<boolean>>;

  /**
   * Get customer ID from Stripe
   */
  getCustomerId(userId: string): Promise<Result<string | null>>;

  /**
   * Create or retrieve Stripe customer
   */
  getOrCreateCustomer(userId: string, email: string): Promise<Result<string>>;
}
