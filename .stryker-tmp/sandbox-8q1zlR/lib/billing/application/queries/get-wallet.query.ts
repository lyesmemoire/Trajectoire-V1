// @ts-nocheck
import { QueryHandler } from "@/lib/core/application/base/QueryHandler";
import { Result, ok, fail } from "@/lib/core/result";
import { BillingQueryPort } from "../../ports/queries/BillingQueryPort";
import { NotFoundError } from "@/lib/core/result/errors";

export interface GetWalletQueryParams {
  userId: string;
}

export interface WalletDTO {
  userId: string;
  balance: number;
  transactions: Array<{
    id: string;
    amount: number;
    type: string;
    createdAt: Date;
  }>;
}

export class GetWalletQuery extends QueryHandler<GetWalletQueryParams, WalletDTO> {
  constructor(private readonly billingQuery: BillingQueryPort) {
    super();
  }

  async execute(params: GetWalletQueryParams): Promise<Result<WalletDTO>> {
    const walletResult = await this.billingQuery.getWallet(params.userId);
    if (walletResult.isFailure()) return fail(walletResult.unwrapError());

    const wallet = walletResult.unwrap();
    if (!wallet) {
      return fail(new NotFoundError("Wallet not found"));
    }

    return ok({
      userId: wallet.userId,
      balance: wallet.balance,
      transactions: wallet.transactions.map((tx) => ({
        id: tx.id.value,
        amount: tx.amount.value,
        type: tx.type.value,
        createdAt: tx.createdAt,
      })),
    });
  }
}
