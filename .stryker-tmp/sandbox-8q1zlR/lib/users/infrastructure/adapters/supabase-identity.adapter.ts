// @ts-nocheck
import { getServerDb } from "@/lib/db/client";
import { Result, ok, fail, DomainError } from "@/lib/core/result";
import { InfrastructureError, NotFoundError } from "@/lib/core/result/errors";
import { IdentityProviderPort } from "../../ports/identity-provider.port";

export class SupabaseIdentityAdapter implements IdentityProviderPort {
  protected handleError(error: unknown): DomainError {
    if (error instanceof Error) {
      return new InfrastructureError(error.message);
    }
    return new InfrastructureError("Unknown identity provider error");
  }

  protected async safeExecute<T>(operation: () => Promise<T>): Promise<Result<T, DomainError>> {
    try {
      return ok(await operation());
    } catch (error) {
      return fail(this.handleError(error));
    }
  }

  async createUser(email: string, password?: string): Promise<Result<{ id: string }>> {
    return this.safeExecute(async () => {
      // Pour la création avec mdp, il faut utiliser l'API admin ou auth normale
      // L'adaptateur d'identité masque les détails d'implémentation.
      throw new Error("Create user not fully implemented yet in IdentityAdapter. Need admin client for complete setup.");
    });
  }

  async getCurrentUserId(): Promise<Result<string>> {
    return this.safeExecute(async () => {
      const supabase = await getServerDb();
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        throw new NotFoundError("Not authenticated");
      }

      return data.user.id;
    });
  }

  async deleteUser(userId: string): Promise<Result<void>> {
    return this.safeExecute(async () => {
      throw new Error("Delete user not implemented yet");
    });
  }
}
