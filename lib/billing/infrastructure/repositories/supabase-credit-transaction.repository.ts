import { Result, ok, fail } from "@/lib/core/result";
import { InfrastructureError } from "@/lib/core/result/errors";
import { CreditTransactionRepositoryPort } from "../../ports/repositories/CreditTransactionRepositoryPort";
import { CreditTransactionAggregate } from "../../domain/aggregates/credit-transaction.aggregate";
import { CreditAmount } from "../../domain/value-objects/credit-amount.vo";
import { TransactionType } from "../../domain/value-objects/transaction-type.vo";
import { getServerDb } from "@/lib/db/client";
import { Clock } from "@/lib/core/clock/Clock";

export class SupabaseCreditTransactionRepository implements CreditTransactionRepositoryPort {
  constructor(private readonly clock: Clock) {}
  async save(transaction: CreditTransactionAggregate): Promise<Result<void>> {
    try {
      const supabase = await getServerDb();

      const { error } = await supabase.from("credit_transactions").upsert({
        id: transaction.id,
        user_id: transaction.userId,
        amount: transaction.amount.value,
        action: this.mapActionFromType(transaction.type),
        state: transaction.state,
        idempotency_key: transaction.idempotencyKey,
        created_at: transaction.createdAt,
        expires_at: transaction.expiresAt,
        metadata: transaction.metadata as any,
      });

      if (error) {
        return fail(new InfrastructureError(`Failed to save transaction: ${error.message}`));
      }

      return ok(undefined);
    } catch (error: any) {
      return fail(new InfrastructureError(`Failed to save transaction: ${error.message}`));
    }
  }

  async findById(id: string): Promise<Result<CreditTransactionAggregate | null>> {
    try {
      const supabase = await getServerDb();

      const { data: record, error } = await supabase
        .from("credit_transactions")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !record) {
        return ok(null);
      }

      const aggregate = CreditTransactionAggregate.create(record.id, {
        userId: record.user_id,
        amount: CreditAmount.create(record.amount),
        type: this.mapTypeFromAction(record.action),
        state: record.state as any,
        idempotencyKey: record.idempotency_key,
        createdAt: new Date(record.created_at),
        expiresAt: record.expires_at ? new Date(record.expires_at) : undefined,
        metadata: record.metadata as Record<string, unknown> | undefined,
      }, this.clock);

      return ok(aggregate);
    } catch (error: any) {
      return fail(new InfrastructureError(`Failed to find transaction by id: ${error.message}`));
    }
  }

  async findByIdempotencyKey(idempotencyKey: string): Promise<Result<CreditTransactionAggregate | null>> {
    try {
      const supabase = await getServerDb();

      const { data: record, error } = await supabase
        .from("credit_transactions")
        .select("*")
        .eq("idempotency_key", idempotencyKey)
        .single();

      if (error || !record) {
        return ok(null);
      }

      const aggregate = CreditTransactionAggregate.create(record.id, {
        userId: record.user_id,
        amount: CreditAmount.create(record.amount),
        type: this.mapTypeFromAction(record.action),
        state: record.state as any,
        idempotencyKey: record.idempotency_key,
        createdAt: new Date(record.created_at),
        expiresAt: record.expires_at ? new Date(record.expires_at) : undefined,
        metadata: record.metadata as Record<string, unknown> | undefined,
      }, this.clock);

      return ok(aggregate);
    } catch (error: any) {
      return fail(new InfrastructureError(`Failed to find transaction by idempotency key: ${error.message}`));
    }
  }

  async findByUserId(userId: string): Promise<Result<CreditTransactionAggregate[]>> {
    try {
      const supabase = await getServerDb();

      const { data: records, error } = await supabase
        .from("credit_transactions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        return fail(new InfrastructureError(`Failed to find transactions by user id: ${error.message}`));
      }

      const aggregates = (records || []).map((record: any) =>
        CreditTransactionAggregate.create(record.id, {
          userId: record.user_id,
          amount: CreditAmount.create(record.amount),
          type: this.mapTypeFromAction(record.action),
          state: record.state as any,
          idempotencyKey: record.idempotency_key,
          createdAt: new Date(record.created_at),
          expiresAt: record.expires_at ? new Date(record.expires_at) : undefined,
          metadata: record.metadata as Record<string, unknown> | undefined,
        }, this.clock)
      );

      return ok(aggregates);
    } catch (error: any) {
      return fail(new InfrastructureError(`Failed to find transactions by user id: ${error.message}`));
    }
  }

  async deleteExpired(): Promise<Result<void>> {
    try {
      const supabase = await getServerDb();
      const now = new Date();

      const { error } = await supabase
        .from("credit_transactions")
        .delete()
        .eq("state", "reserved")
        .lt("expires_at", now.toISOString());

      if (error) {
        return fail(new InfrastructureError(`Failed to delete expired transactions: ${error.message}`));
      }

      return ok(undefined);
    } catch (error: any) {
      return fail(new InfrastructureError(`Failed to delete expired transactions: ${error.message}`));
    }
  }

  private mapTypeFromAction(action: string): TransactionType {
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

  private mapActionFromType(type: TransactionType): string {
    if (type.isConsumption()) return "interview_generate"; // Default consumption action
    if (type.isPurchase()) return "purchase";
    if (type.isRefund()) return "refund";
    if (type.isBonus()) return "bonus";
    return "interview_generate";
  }
}
