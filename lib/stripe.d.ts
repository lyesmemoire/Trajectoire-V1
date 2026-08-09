import Stripe from "stripe";
export declare const stripe: Stripe;
export declare const PRICE_IDS: {
    pro_monthly: string;
    pro_yearly: string;
    expert_monthly: string;
    expert_yearly: string;
};
export declare function createCheckoutSession(params: {
    userId: string;
    userEmail: string;
    priceId: string;
    successUrl: string;
    cancelUrl: string;
}): Promise<Stripe.Response<Stripe.Checkout.Session>>;
//# sourceMappingURL=stripe.d.ts.map