// @ts-nocheck
import { QueryHandler } from "@/lib/core/application/base/QueryHandler";
import { Result, ok, fail } from "@/lib/core/result";
import { BillingQueryPort } from "../../ports/queries/BillingQueryPort";

export interface GetTransactionsQueryParams {
  userId: string;
  limit?: number;
}

export interface TransactionDTO {
  id: string;
  userId: string;
  amount: number;
  type: string;
  state: string;
  createdAt: Date;
  expiresAt?: Date;
}

export class GetTransactionsQuery extends QueryHandler<GetTransactionsQueryParams, TransactionDTO[]> {
  constructor(private readonly billingQuery: BillingQueryPort) {
    super();
  }

  async execute(params: GetTransactionsQueryParams): Promise<Result<TransactionDTO[]>> {
    const transactionsResult = await this.billingQuery.getTransactions(params.userId, params.limit);
    if (transactionsResult.isFailure()) return fail(transactionsResult.unwrapError());

    const transactions = transactionsResult.unwrap();

    return ok(
      transactions.map((tx) => ({
        id: tx.id,
        userId: tx.userId,
        amount: tx.amount.value,
        type: tx.type.value,
        state: tx.state,
        createdAt: tx.createdAt,
        expiresAt: tx.expiresAt,
      }))
    );
  }
}
