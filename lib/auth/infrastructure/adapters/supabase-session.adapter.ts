import { Result, ok, fail } from "@/lib/core/result";
import { InfrastructureError } from "@/lib/core/result/errors";
import { SessionProviderPort, SessionData } from "../../ports/gateways/SessionProviderPort";
import { createAdminClientSupabase } from "@/lib/supabase/admin";

export class SupabaseSessionAdapter implements SessionProviderPort {
  private supabase = createAdminClientSupabase();

  async createSession(sessionData: SessionData): Promise<Result<void>> {
    // Supabase manages sessions automatically through auth
    // This is a no-op for Supabase, but we keep the interface for consistency
    return ok(undefined);
  }

  async getSession(userId: string): Promise<Result<SessionData | null>> {
    try {
      // Supabase doesn't have a direct listUserSessions method in the admin API
      // We'll return null for now as a placeholder
      // In a real implementation, we would need to use the auth client or store sessions separately
      return ok(null);
    } catch (error: any) {
      return fail(new InfrastructureError(`Unexpected error getting session: ${error.message}`));
    }
  }

  async refreshSession(refreshToken: string): Promise<Result<SessionData>> {
    try {
      const { data, error } = await this.supabase.auth.refreshSession({
        refresh_token: refreshToken,
      });

      if (error) {
        return fail(new InfrastructureError(`Session refresh failed: ${error.message}`));
      }

      if (!data.session || !data.user) {
        return fail(new InfrastructureError("Session refresh failed: No session returned"));
      }

      return ok({
        userId: data.user.id,
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresAt: new Date(data.session.expires_at! * 1000),
      });
    } catch (error: any) {
      return fail(new InfrastructureError(`Unexpected error during session refresh: ${error.message}`));
    }
  }

  async revokeSession(userId: string): Promise<Result<void>> {
    try {
      const { error } = await this.supabase.auth.admin.signOut(userId);

      if (error) {
        return fail(new InfrastructureError(`Failed to revoke session: ${error.message}`));
      }

      return ok(undefined);
    } catch (error: any) {
      return fail(new InfrastructureError(`Unexpected error revoking session: ${error.message}`));
    }
  }

  async revokeAllSessions(userId: string): Promise<Result<void>> {
    try {
      const { error } = await this.supabase.auth.admin.signOut(userId);

      if (error) {
        return fail(new InfrastructureError(`Failed to revoke all sessions: ${error.message}`));
      }

      return ok(undefined);
    } catch (error: any) {
      return fail(new InfrastructureError(`Unexpected error revoking all sessions: ${error.message}`));
    }
  }

  async validateSession(accessToken: string): Promise<Result<boolean>> {
    try {
      const { data, error } = await this.supabase.auth.getUser(accessToken);

      if (error) {
        return ok(false);
      }

      return ok(data.user !== null);
    } catch (error: any) {
      return ok(false);
    }
  }
}
