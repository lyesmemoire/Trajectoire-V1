// @ts-nocheck
import { Result } from "@/lib/core/result";
import { WalletAggregate } from "../../domain/aggregates/wallet.aggregate";
import { SubscriptionAggregate } from "../../domain/aggregates/subscription.aggregate";
import { CreditTransactionAggregate } from "../../domain/aggregates/credit-transaction.aggregate";

export interface BillingQueryPort {
  /**
   * Check if user has enough credits
   */
  hasEnoughCredits(userId: string, required: number): Promise<Result<boolean>>;

  /**
   * Get current credit balance
   */
  getCurrentBalance(userId: string): Promise<Result<number>>;

  /**
   * Get current subscription plan
   */
  getCurrentPlan(userId: string): Promise<Result<string | null>>;

  /**
   * Get wallet aggregate
   */
  getWallet(userId: string): Promise<Result<WalletAggregate | null>>;

  /**
   * Get subscription aggregate
   */
  getSubscription(userId: string): Promise<Result<SubscriptionAggregate | null>>;

  /**
   * Get transaction history
   */
  getTransactions(userId: string, limit?: number): Promise<Result<CreditTransactionAggregate[]>>;
}
