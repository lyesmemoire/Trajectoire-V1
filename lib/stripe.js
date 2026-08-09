import Stripe from "stripe";
export const stripe = new Stripe(envServer.STRIPE_SECRET_KEY || "dummy_key_to_avoid_build_crash", {
    typescript: true,
});
export const PRICE_IDS = {
    pro_monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
    pro_yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID,
    expert_monthly: process.env.STRIPE_EXPERT_MONTHLY_PRICE_ID,
    expert_yearly: process.env.STRIPE_EXPERT_YEARLY_PRICE_ID,
};
export async function createCheckoutSession(params) {
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
//# sourceMappingURL=stripe.js.map