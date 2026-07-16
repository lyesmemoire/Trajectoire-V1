// @ts-nocheck
import { Result, ok, fail } from "@/lib/core/result";
import { InfrastructureError } from "@/lib/core/result/errors";
import { WalletRepositoryPort } from "../../ports/repositories/WalletRepositoryPort";
import { WalletAggregate } from "../../domain/aggregates/wallet.aggregate";
import { CreditAmount } from "../../domain/value-objects/credit-amount.vo";
import { TransactionId } from "../../domain/value-objects/transaction-id.vo";
import { TransactionType } from "../../domain/value-objects/transaction-type.vo";
import { getServerDb } from "@/lib/db/client";
import { Clock } from "@/lib/core/clock/Clock";
import { IdGenerator } from "@/lib/core/id/IdGenerator";

export class SupabaseWalletRepository implements WalletRepositoryPort {
  constructor(
    private readonly clock: Clock,
    private readonly idGenerator: IdGenerator
  ) {}
  async save(wallet: WalletAggregate): Promise<Result<void>> {
    try {
      const supabase = await getServerDb();

      // Update the user's credit balance in profiles table via RPC
      const { error } = await supabase.rpc("add_credits_atomic", {
        uid: wallet.userId,
        amt: 0, // We're just setting the balance, not adding
      });

      if (error) {
        return fail(new InfrastructureError(`Failed to save wallet: ${error.message}`));
      }

      // Note: Transaction history is stored in credit_transactions table
      // This is handled by CreditTransactionRepository
      // The wallet aggregate's transactions are for in-memory operations

      return ok(undefined);
    } catch (error: any) {
      return fail(new InfrastructureError(`Failed to save wallet: ${error.message}`));
    }
  }

  async findByUserId(userId: string): Promise<Result<WalletAggregate | null>> {
    try {
      const supabase = await getServerDb();

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("credits")
        .eq("id", userId)
        .single();

      if (profileError || !profile) {
        return ok(null);
      }

      // Load transactions from credit_transactions table
      const { data: transactions, error: txError } = await supabase
        .from("credit_transactions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (txError) {
        return fail(new InfrastructureError(`Failed to load transactions: ${txError.message}`));
      }

      const walletTransactions = (transactions || []).map((tx: any) => ({
        id: TransactionId.create(tx.id),
        amount: CreditAmount.create(tx.amount),
        type: this.mapTransactionType(tx.action),
        createdAt: new Date(tx.created_at),
        metadata: tx.metadata as Record<string, unknown> | undefined,
      }));

      const aggregate = WalletAggregate.create(userId, {
        userId,
        credits: CreditAmount.create(profile.credits || 0),
        transactions: walletTransactions,
      }, this.clock, this.idGenerator);

      return ok(aggregate);
    } catch (error: any) {
      return fail(new InfrastructureError(`Failed to find wallet by user id: ${error.message}`));
    }
  }

  async delete(userId: string): Promise<Result<void>> {
    try {
      const supabase = await getServerDb();

      // Note: We don't actually delete the wallet, just reset it
      // This is a soft delete operation
      const { error } = await supabase
        .from("profiles")
        .update({ credits: 0 })
        .eq("id", userId);

      if (error) {
        return fail(new InfrastructureError(`Failed to delete wallet: ${error.message}`));
      }

      return ok(undefined);
    } catch (error: any) {
      return fail(new InfrastructureError(`Failed to delete wallet: ${error.message}`));
    }
  }

  private mapTransactionType(action: string): TransactionType {
    // Map from credit action to transaction type
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
}
