import { Result } from "@/lib/core/result";
import { WalletAggregate } from "../../domain/aggregates/wallet.aggregate";

export interface WalletRepositoryPort {
  save(wallet: WalletAggregate): Promise<Result<void>>;
  findByUserId(userId: string): Promise<Result<WalletAggregate | null>>;
  delete(userId: string): Promise<Result<void>>;
}
