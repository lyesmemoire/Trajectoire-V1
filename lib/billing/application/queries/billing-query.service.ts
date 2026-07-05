import { Result, ok, fail } from "@/lib/core/result";
import { InfrastructureError } from "@/lib/core/result/errors";
import { BillingQueryPort } from "../../ports/queries/BillingQueryPort";
import { WalletAggregate } from "../../domain/aggregates/wallet.aggregate";
import { SubscriptionAggregate } from "../../domain/aggregates/subscription.aggregate";
import { CreditTransactionAggregate } from "../../domain/aggregates/credit-transaction.aggregate";
import { WalletRepositoryPort } from "../../ports/repositories/WalletRepositoryPort";
import { SubscriptionRepositoryPort } from "../../ports/repositories/SubscriptionRepositoryPort";
import { CreditTransactionRepositoryPort } from "../../ports/repositories/CreditTransactionRepositoryPort";

export class BillingQueryService implements BillingQueryPort {
  constructor(
    private readonly walletRepo: WalletRepositoryPort,
    private readonly subscriptionRepo: SubscriptionRepositoryPort,
    private readonly transactionRepo: CreditTransactionRepositoryPort
  ) {}

  async hasEnoughCredits(userId: string, required: number): Promise<Result<boolean>> {
    const walletResult = await this.walletRepo.findByUserId(userId);
    if (walletResult.isFailure()) return fail(walletResult.unwrapError());

    const wallet = walletResult.unwrap();
    if (!wallet) {
      return ok(false);
    }

    return ok(wallet.hasEnoughCredits(required));
  }

  async getCurrentBalance(userId: string): Promise<Result<number>> {
    const walletResult = await this.walletRepo.findByUserId(userId);
    if (walletResult.isFailure()) return fail(walletResult.unwrapError());

    const wallet = walletResult.unwrap();
    if (!wallet) {
      return ok(0);
    }

    return ok(wallet.balance);
  }

  async getCurrentPlan(userId: string): Promise<Result<string | null>> {
    const subscriptionResult = await this.subscriptionRepo.findByUserId(userId);
    if (subscriptionResult.isFailure()) return fail(subscriptionResult.unwrapError());

    const subscription = subscriptionResult.unwrap();
    if (!subscription) {
      return ok(null);
    }

    return ok(subscription.plan.value);
  }

  async getWallet(userId: string): Promise<Result<WalletAggregate | null>> {
    return this.walletRepo.findByUserId(userId);
  }

  async getSubscription(userId: string): Promise<Result<SubscriptionAggregate | null>> {
    return this.subscriptionRepo.findByUserId(userId);
  }

  async getTransactions(userId: string, limit?: number): Promise<Result<CreditTransactionAggregate[]>> {
    const transactionsResult = await this.transactionRepo.findByUserId(userId);
    if (transactionsResult.isFailure()) return fail(transactionsResult.unwrapError());

    let transactions = transactionsResult.unwrap();
    if (limit) {
      transactions = transactions.slice(0, limit);
    }

    return ok(transactions);
  }
}
