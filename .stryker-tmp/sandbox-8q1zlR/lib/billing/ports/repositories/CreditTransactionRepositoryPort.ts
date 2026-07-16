// @ts-nocheck
import { Result } from "@/lib/core/result";
import { CreditTransactionAggregate } from "../../domain/aggregates/credit-transaction.aggregate";

export interface CreditTransactionRepositoryPort {
  save(transaction: CreditTransactionAggregate): Promise<Result<void>>;
  findById(id: string): Promise<Result<CreditTransactionAggregate | null>>;
  findByIdempotencyKey(idempotencyKey: string): Promise<Result<CreditTransactionAggregate | null>>;
  findByUserId(userId: string): Promise<Result<CreditTransactionAggregate[]>>;
  deleteExpired(): Promise<Result<void>>;
}
