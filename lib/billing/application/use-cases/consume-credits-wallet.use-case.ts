import { InfrastructureError } from "@/lib/core/result/errors";
import { UseCase } from "@/lib/core/application/UseCase";
import { Result, ok, fail } from "@/lib/core/result";
import { WalletRepositoryPort } from "../../ports/repositories/WalletRepositoryPort";
import { CreditAmount } from "../../domain/value-objects/credit-amount.vo";
import { NotFoundError } from "@/lib/core/result/errors";

export interface ConsumeCreditsWalletCommand {
  userId: string;
  amount: number;
  metadata?: Record<string, unknown>;
}

export class ConsumeCreditsWalletUseCase extends UseCase<ConsumeCreditsWalletCommand, string> {
  constructor(private readonly walletRepo: WalletRepositoryPort) {
    super();
  }

  protected async run(command: ConsumeCreditsWalletCommand): Promise<Result<string>> {
    const walletResult = await this.walletRepo.findByUserId(command.userId);
    if (walletResult.isFailure()) return fail(walletResult.unwrapError());

    const wallet = walletResult.unwrap();
    if (!wallet) {
      return fail(new NotFoundError("Wallet not found for user"));
    }

    let txId: any;
    try {
      const amount = CreditAmount.create(command.amount);
      txId = wallet.consume(amount, command.metadata);
    } catch (e: any) {
      return fail(new InfrastructureError(e.message));
    }

    const saveResult = await this.walletRepo.save(wallet);
    if (saveResult.isFailure()) return fail(saveResult.unwrapError());

    return ok(txId.value);
  }
}
