import { envServer } from "@/lib/env.server";
import Stripe from 'stripe';

export const stripe = new Stripe(envServer.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2025-02-24.acacia',
});

export const PRICE_IDS = {
  pro_monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID!,
  pro_yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID!,
  expert_monthly: process.env.STRIPE_EXPERT_MONTHLY_PRICE_ID!,
  expert_yearly: process.env.STRIPE_EXPERT_YEARLY_PRICE_ID!,
};

export async function createCheckoutSession(params: {
  userId: string;
  userEmail: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  return stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: params.userEmail,
    line_items: [{ price: params.priceId, quantity: 1 }],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    allow_promotion_codes: true,
    subscription_data: {
      trial_period_days: 7,
      metadata: { userId: params.userId },
    },
    metadata: { userId: params.userId },
  });
}
