import { Result } from "@/lib/core/result";

export interface ModerationResult {
  isFlagged: boolean;
  categories: Record<string, boolean>;
}

export interface ModerationProviderPort {
  checkSafety(text: string): Promise<Result<ModerationResult>>;
}
