import { InfrastructureError } from "@/lib/core/result/errors";
import { UseCase } from "@/lib/core/application/UseCase";
import { Result, ok, fail } from "@/lib/core/result";
import { WalletRepositoryPort } from "../../ports/repositories/WalletRepositoryPort";
import { WalletAggregate } from "../../domain/aggregates/wallet.aggregate";
import { CreditAmount } from "../../domain/value-objects/credit-amount.vo";
import { TransactionType } from "../../domain/value-objects/transaction-type.vo";
import { Clock } from "@/lib/core/clock/Clock";
import { IdGenerator } from "@/lib/core/id/IdGenerator";

export interface PurchaseCreditsCommand {
  userId: string;
  amount: number;
  metadata?: Record<string, unknown>;
}

export class PurchaseCreditsUseCase extends UseCase<PurchaseCreditsCommand, string> {
  constructor(
    private readonly walletRepo: WalletRepositoryPort,
    private readonly clock: Clock,
    private readonly idGenerator: IdGenerator
  ) {
    super();
  }

  protected async run(command: PurchaseCreditsCommand): Promise<Result<string>> {
    const walletResult = await this.walletRepo.findByUserId(command.userId);
    if (walletResult.isFailure()) return fail(walletResult.unwrapError());

    let wallet = walletResult.unwrap();
    if (!wallet) {
      // Create empty wallet if it doesn't exist
      wallet = WalletAggregate.createEmpty(command.userId, this.clock, this.idGenerator);
    }

    let txId: any;
    try {
      const amount = CreditAmount.create(command.amount);
      txId = wallet.addCredits(amount, TransactionType.purchase(), command.metadata);
    } catch (e: any) {
      return fail(new InfrastructureError(e.message));
    }

    const saveResult = await this.walletRepo.save(wallet);
    if (saveResult.isFailure()) return fail(saveResult.unwrapError());

    return ok(txId.value);
  }
}
