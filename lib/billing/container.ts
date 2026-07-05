import { PrismaSubscriptionRepository } from "./infrastructure/repositories/prisma-subscription.repository";
import { StripeCheckoutAdapter } from "./infrastructure/adapters/stripe-checkout.adapter";
import { StripeBillingPortalAdapter } from "./infrastructure/adapters/stripe-billing-portal.adapter";
import { StripePaymentAdapter } from "./infrastructure/adapters/stripe-payment.adapter";

import { CreateCheckoutSessionUseCase } from "./application/use-cases/create-checkout-session.use-case";
import { OpenBillingPortalUseCase } from "./application/use-cases/open-billing-portal.use-case";
import { ActivateSubscriptionUseCase } from "./application/use-cases/activate-subscription.use-case";
import { CancelSubscriptionUseCase } from "./application/use-cases/cancel-subscription.use-case";
import { RenewSubscriptionUseCase } from "./application/use-cases/renew-subscription.use-case";

import { BillingPresenter } from "./presentation/BillingPresenter";
import { SystemClock } from "@/lib/core/clock/Clock";
import { UuidGenerator } from "@/lib/core/id/IdGenerator";

const clock = new SystemClock();
const idGenerator = new UuidGenerator();

const subscriptionRepo = new PrismaSubscriptionRepository(clock);
const checkoutAdapter = new StripeCheckoutAdapter();
const portalAdapter = new StripeBillingPortalAdapter();
const paymentAdapter = new StripePaymentAdapter();

const activateSubscriptionUseCase = new ActivateSubscriptionUseCase(subscriptionRepo, clock, idGenerator);
const cancelSubscriptionUseCase = new CancelSubscriptionUseCase(subscriptionRepo);
const renewSubscriptionUseCase = new RenewSubscriptionUseCase(subscriptionRepo, clock);
const createCheckoutSessionUseCase = new CreateCheckoutSessionUseCase(checkoutAdapter);
const openBillingPortalUseCase = new OpenBillingPortalUseCase(portalAdapter, paymentAdapter);

export const billingModule = {
  useCases: {
    activateSubscription: activateSubscriptionUseCase,
    cancelSubscription: cancelSubscriptionUseCase,
    renewSubscription: renewSubscriptionUseCase,
    createCheckoutSession: createCheckoutSessionUseCase,
    openBillingPortal: openBillingPortalUseCase,
  },
  presenters: {
    billing: new BillingPresenter(),
  }
};
