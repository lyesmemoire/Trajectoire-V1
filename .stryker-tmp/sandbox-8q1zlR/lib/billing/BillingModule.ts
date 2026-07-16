// @ts-nocheck
import { DomainModule } from "@/lib/core/application/DomainModule";
import { Container } from "@/lib/core/runtime/container/Container";
import { UuidGenerator } from "@/lib/core/id/IdGenerator";
import { Clock } from "@/lib/core/clock/Clock";

// Repositories
import { SupabaseWalletRepository } from "./infrastructure/repositories/supabase-wallet.repository";
import { SupabaseCreditTransactionRepository } from "./infrastructure/repositories/supabase-credit-transaction.repository";
import { PrismaSubscriptionRepository } from "./infrastructure/repositories/prisma-subscription.repository";

// Gateways
import { StripePaymentAdapter } from "./infrastructure/adapters/stripe-payment.adapter";
import { StripeCheckoutAdapter } from "./infrastructure/adapters/stripe-checkout.adapter";
import { StripeBillingPortalAdapter } from "./infrastructure/adapters/stripe-billing-portal.adapter";

// Use Cases
import { CreateCheckoutSessionUseCase } from "./application/use-cases/create-checkout-session.use-case";
import { OpenBillingPortalUseCase } from "./application/use-cases/open-billing-portal.use-case";
import { ActivateSubscriptionUseCase } from "./application/use-cases/activate-subscription.use-case";
import { CancelSubscriptionUseCase } from "./application/use-cases/cancel-subscription.use-case";
import { RenewSubscriptionUseCase } from "./application/use-cases/renew-subscription.use-case";
import { ChangeSubscriptionUseCase } from "./application/use-cases/change-subscription.use-case";
import { ConsumeCreditsWalletUseCase } from "./application/use-cases/consume-credits-wallet.use-case";
import { RefundCreditsWalletUseCase } from "./application/use-cases/refund-credits-wallet.use-case";
import { PurchaseCreditsUseCase } from "./application/use-cases/purchase-credits.use-case";
import { HandleWebhookUseCase } from "./application/use-cases/handle-webhook.use-case";

// Queries
import { BillingQueryService } from "./application/queries/billing-query.service";
import { GetWalletQuery } from "./application/queries/get-wallet.query";
import { GetSubscriptionQuery } from "./application/queries/get-subscription.query";
import { GetTransactionsQuery } from "./application/queries/get-transactions.query";

// Presenters
import { BillingPresenter } from "./presentation/BillingPresenter";

export class BillingModule extends DomainModule {
  protected registerRepositories(container: Container): void {
    const clock = container.resolve("Clock") as Clock;
    const idGenerator = new UuidGenerator();

    // Wallet & Credit Transactions
    container.registerSingleton("WalletRepository", () => new SupabaseWalletRepository(clock, idGenerator));
    container.registerSingleton("CreditTransactionRepository", () => new SupabaseCreditTransactionRepository(clock));

    // Subscription
    container.registerSingleton("SubscriptionRepository", () => new PrismaSubscriptionRepository(clock));
  }

  protected registerGateways(container: Container): void {
    // Payment Provider
    container.registerSingleton("PaymentProvider", new StripePaymentAdapter());

    // Checkout & Portal (legacy adapters, will be consolidated)
    container.registerSingleton("CheckoutAdapter", new StripeCheckoutAdapter());
    container.registerSingleton("BillingPortalAdapter", new StripeBillingPortalAdapter());
  }

  protected registerUseCases(container: Container): void {
    const clock = container.resolve("Clock") as Clock;
    const idGenerator = new UuidGenerator();

    // Subscription Use Cases
    container.registerTransient(
      "ActivateSubscriptionUseCase",
      () => new ActivateSubscriptionUseCase(container.resolve("SubscriptionRepository"), clock, idGenerator)
    );
    container.registerTransient(
      "CancelSubscriptionUseCase",
      () => new CancelSubscriptionUseCase(container.resolve("SubscriptionRepository"))
    );
    container.registerTransient(
      "RenewSubscriptionUseCase",
      () => new RenewSubscriptionUseCase(container.resolve("SubscriptionRepository"), clock)
    );
    container.registerTransient(
      "ChangeSubscriptionUseCase",
      () => new ChangeSubscriptionUseCase(container.resolve("SubscriptionRepository"))
    );

    // Checkout & Portal Use Cases
    container.registerTransient(
      "CreateCheckoutSessionUseCase",
      () => new CreateCheckoutSessionUseCase(container.resolve("CheckoutAdapter"))
    );
    container.registerTransient(
      "OpenBillingPortalUseCase",
      () => new OpenBillingPortalUseCase(
        container.resolve("BillingPortalAdapter"),
        container.resolve("PaymentProvider")
      )
    );

    // Credit Use Cases (Wallet-based)
    container.registerTransient(
      "PurchaseCreditsUseCase",
      () => new PurchaseCreditsUseCase(container.resolve("WalletRepository"), clock, idGenerator)
    );
    container.registerTransient(
      "ConsumeCreditsWalletUseCase",
      () => new ConsumeCreditsWalletUseCase(container.resolve("WalletRepository"))
    );
    container.registerTransient(
      "RefundCreditsWalletUseCase",
      () => new RefundCreditsWalletUseCase(container.resolve("WalletRepository"))
    );


    // Webhook Use Case
    container.registerTransient(
      "HandleWebhookUseCase",
      () =>
        new HandleWebhookUseCase(
          container.resolve("PaymentProvider"),
          container.resolve("ActivateSubscriptionUseCase"),
          container.resolve("CancelSubscriptionUseCase"),
          container.resolve("PurchaseCreditsUseCase")
        )
    );
  }

  protected registerQueries(container: Container): void {
    // Query Service
    container.registerSingleton(
      "BillingQueryService",
      new BillingQueryService(
        container.resolve("WalletRepository"),
        container.resolve("SubscriptionRepository"),
        container.resolve("CreditTransactionRepository")
      )
    );

    // Query Handlers
    container.registerTransient(
      "GetWalletQuery",
      () => new GetWalletQuery(container.resolve("BillingQueryService"))
    );
    container.registerTransient(
      "GetSubscriptionQuery",
      () => new GetSubscriptionQuery(container.resolve("BillingQueryService"))
    );
    container.registerTransient(
      "GetTransactionsQuery",
      () => new GetTransactionsQuery(container.resolve("BillingQueryService"))
    );
  }

  protected registerPresenters(container: Container): void {
    container.registerSingleton("BillingPresenter", new BillingPresenter());
  }
}
