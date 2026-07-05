import { InfrastructureError } from "@/lib/core/result/errors";
import { UseCase } from "@/lib/core/application/UseCase";
import { Result, ok, fail } from "@/lib/core/result";
import { WalletRepositoryPort } from "../../ports/repositories/WalletRepositoryPort";
import { TransactionId } from "../../domain/value-objects/transaction-id.vo";
import { NotFoundError } from "@/lib/core/result/errors";

export interface RefundCreditsWalletCommand {
  userId: string;
  transactionId: string;
}

export class RefundCreditsWalletUseCase extends UseCase<RefundCreditsWalletCommand, void> {
  constructor(private readonly walletRepo: WalletRepositoryPort) {
    super();
  }

  protected async run(command: RefundCreditsWalletCommand): Promise<Result<void>> {
    const walletResult = await this.walletRepo.findByUserId(command.userId);
    if (walletResult.isFailure()) return fail(walletResult.unwrapError());

    const wallet = walletResult.unwrap();
    if (!wallet) {
      return fail(new NotFoundError("Wallet not found for user"));
    }

    try {
      const txId = TransactionId.create(command.transactionId);
      wallet.refund(txId);
    } catch (e: any) {
      return fail(new InfrastructureError(e.message));
    }

    const saveResult = await this.walletRepo.save(wallet);
    if (saveResult.isFailure()) return fail(saveResult.unwrapError());

    return ok(undefined);
  }
}
