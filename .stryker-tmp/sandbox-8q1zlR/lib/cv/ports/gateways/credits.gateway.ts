// @ts-nocheck
import { Result } from "@/lib/core/result";

export interface CreditsGateway {
  /**
   * Check if the user has at least the specified amount of credits.
   */
  hasCredits(userId: string, amount: number): Promise<Result<boolean>>;

  /**
   * Consume the specified amount of credits from the user's balance.
   */
  consume(userId: string, amount: number, reason: string): Promise<Result<void>>;
}
