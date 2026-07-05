import { WalletAggregate } from "../../domain/aggregates/wallet.aggregate";
import { CreditTransactionAggregate } from "../../domain/aggregates/credit-transaction.aggregate";
import { SubscriptionAggregate } from "../../domain/aggregates/subscription.aggregate";
import { CreditAmount } from "../../domain/value-objects/credit-amount.vo";
import { TransactionId } from "../../domain/value-objects/transaction-id.vo";
import { TransactionType } from "../../domain/value-objects/transaction-type.vo";
import { Plan } from "../../domain/value-objects/plan.vo";
import { SubscriptionStatus } from "../../domain/value-objects/subscription-status.vo";
import { BillingPeriod } from "../../domain/value-objects/billing-period.vo";
import { Clock } from "@/lib/core/clock/Clock";
import { IdGenerator } from "@/lib/core/id/IdGenerator";

/**
 * BillingMapper - Converts between persistence layer and domain aggregates
 * This is the only place where database-specific knowledge should leak into the domain
 */
export class BillingMapper {
  /**
   * Convert Supabase profile data to WalletAggregate
   */
  static profileToWallet(profile: any, transactions: any[] = [], clock: Clock, idGenerator: IdGenerator): WalletAggregate {
    const walletTransactions = transactions.map((tx) => ({
      id: TransactionId.create(tx.id),
      amount: CreditAmount.create(tx.amount),
      type: BillingMapper.mapActionToTransactionType(tx.action),
      createdAt: new Date(tx.created_at),
      metadata: tx.metadata as Record<string, unknown> | undefined,
    }));

    return WalletAggregate.create(profile.id, {
      userId: profile.id,
      credits: CreditAmount.create(profile.credits || 0),
      transactions: walletTransactions,
    }, clock, idGenerator);
  }

  /**
   * Convert WalletAggregate to Supabase profile update data
   */
  static walletToProfileUpdate(wallet: WalletAggregate): { credits: number } {
    return {
      credits: wallet.balance,
    };
  }

  /**
   * Convert Supabase credit_transaction data to CreditTransactionAggregate
   */
  static creditTransactionToAggregate(tx: any, clock: Clock): CreditTransactionAggregate {
    return CreditTransactionAggregate.create(tx.id, {
      userId: tx.user_id,
      amount: CreditAmount.create(tx.amount),
      type: BillingMapper.mapActionToTransactionType(tx.action),
      state: tx.state,
      idempotencyKey: tx.idempotency_key,
      createdAt: new Date(tx.created_at),
      expiresAt: tx.expires_at ? new Date(tx.expires_at) : undefined,
      metadata: tx.metadata as Record<string, unknown> | undefined,
    }, clock);
  }

  /**
   * Convert CreditTransactionAggregate to Supabase credit_transaction data
   */
  static aggregateToCreditTransaction(aggregate: CreditTransactionAggregate): any {
    return {
      id: aggregate.id,
      user_id: aggregate.userId,
      amount: aggregate.amount.value,
      action: BillingMapper.mapTransactionTypeToAction(aggregate.type),
      state: aggregate.state,
      idempotency_key: aggregate.idempotencyKey,
      created_at: aggregate.createdAt,
      expires_at: aggregate.expiresAt,
      metadata: aggregate.metadata,
    };
  }

  /**
   * Convert Prisma Subscription data to SubscriptionAggregate
   */
  static subscriptionToAggregate(sub: any, clock: Clock): SubscriptionAggregate {
    return SubscriptionAggregate.create(sub.id, {
      userId: sub.userId,
      stripeCustomerId: sub.stripeCustomerId,
      stripeSubId: sub.stripeSubId,
      plan: Plan.create(sub.plan),
      status: SubscriptionStatus.create(sub.status),
      period: BillingPeriod.create(sub.createdAt, sub.currentPeriodEnd),
      createdAt: sub.createdAt,
      updatedAt: sub.updatedAt,
    }, clock);
  }

  /**
   * Convert SubscriptionAggregate to Prisma Subscription data
   */
  static aggregateToSubscription(aggregate: SubscriptionAggregate): any {
    return {
      id: aggregate.id,
      userId: aggregate.userId,
      stripeCustomerId: aggregate.stripeCustomerId,
      stripeSubId: aggregate.stripeSubId,
      plan: aggregate.plan.value,
      status: aggregate.status.value,
      currentPeriodEnd: aggregate.period.end,
      createdAt: aggregate.period.start,
      updatedAt: new Date(),
    };
  }

  /**
   * Map credit action to TransactionType
   */
  private static mapActionToTransactionType(action: string): TransactionType {
    switch (action) {
      case "cv_optimize":
      case "interview_generate":
      case "interview_feedback":
        return TransactionType.consumption();
      case "purchase":
        return TransactionType.purchase();
      case "refund":
        return TransactionType.refund();
      case "bonus":
        return TransactionType.bonus();
      default:
        return TransactionType.consumption();
    }
  }

  /**
   * Map TransactionType to credit action
   */
  private static mapTransactionTypeToAction(type: TransactionType): string {
    if (type.isConsumption()) return "interview_generate";
    if (type.isPurchase()) return "purchase";
    if (type.isRefund()) return "refund";
    if (type.isBonus()) return "bonus";
    return "interview_generate";
  }
}
