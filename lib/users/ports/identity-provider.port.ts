import { Result } from "@/lib/core/result";

export interface IdentityProviderPort {
  createUser(email: string, password?: string): Promise<Result<{ id: string }>>;
  getCurrentUserId(): Promise<Result<string>>;
  deleteUser(userId: string): Promise<Result<void>>;
}
