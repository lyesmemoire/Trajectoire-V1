// @ts-nocheck
import { Result, ok, fail } from "@/lib/core/result";
import { InfrastructureError } from "@/lib/core/result/errors";
import { AuthenticationProviderPort, RegisterParams, RegisterResult, LoginParams, LoginResult } from "../../ports/gateways/AuthenticationProviderPort";
import { Email } from "../../domain/value-objects/email.vo";
import { createAdminClientSupabase } from "@/lib/supabase/admin";

export class SupabaseAuthAdapter implements AuthenticationProviderPort {
  private supabase = createAdminClientSupabase();

  async register(params: RegisterParams): Promise<Result<RegisterResult>> {
    try {
      const { data, error } = await this.supabase.auth.admin.createUser({
        email: params.email.value,
        password: params.password,
        email_confirm: false,
        user_metadata: {
          display_name: params.displayName,
        },
      });

      if (error) {
        return fail(new InfrastructureError(`Registration failed: ${error.message}`));
      }

      if (!data.user) {
        return fail(new InfrastructureError("Registration failed: No user returned"));
      }

      return ok({
        userId: data.user.id,
        email: data.user.email ?? params.email.value,
        requiresEmailVerification: !data.user.email_confirmed_at,
      });
    } catch (error: any) {
      return fail(new InfrastructureError(`Unexpected error during registration: ${error.message}`));
    }
  }

  async login(params: LoginParams): Promise<Result<LoginResult>> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: params.email.value,
        password: params.password,
      });

      if (error) {
        return fail(new InfrastructureError(`Login failed: ${error.message}`));
      }

      if (!data.user || !data.session) {
        return fail(new InfrastructureError("Login failed: No session returned"));
      }

      return ok({
        userId: data.user.id,
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresIn: data.session.expires_in ?? 3600,
      });
    } catch (error: any) {
      return fail(new InfrastructureError(`Unexpected error during login: ${error.message}`));
    }
  }

  async logout(userId: string): Promise<Result<void>> {
    try {
      const { error } = await this.supabase.auth.admin.signOut(userId);

      if (error) {
        return fail(new InfrastructureError(`Logout failed: ${error.message}`));
      }

      return ok(undefined);
    } catch (error: any) {
      return fail(new InfrastructureError(`Unexpected error during logout: ${error.message}`));
    }
  }

  async verifyEmail(token: string): Promise<Result<void>> {
    try {
      // For Supabase, email verification is handled via the magic link
      // This method would typically be called with the token from the email
      // For now, we'll use the verifyOtp with email type
      const { error } = await this.supabase.auth.verifyOtp({
        token,
        type: "email",
        email: "", // Email is embedded in the token for Supabase
      });

      if (error) {
        return fail(new InfrastructureError(`Email verification failed: ${error.message}`));
      }

      return ok(undefined);
    } catch (error: any) {
      return fail(new InfrastructureError(`Unexpected error during email verification: ${error.message}`));
    }
  }

  async sendPasswordResetEmail(email: Email): Promise<Result<void>> {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email.value);

      if (error) {
        return fail(new InfrastructureError(`Failed to send password reset email: ${error.message}`));
      }

      return ok(undefined);
    } catch (error: any) {
      return fail(new InfrastructureError(`Unexpected error sending password reset email: ${error.message}`));
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<Result<void>> {
    try {
      const { error } = await this.supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return fail(new InfrastructureError(`Password reset failed: ${error.message}`));
      }

      return ok(undefined);
    } catch (error: any) {
      return fail(new InfrastructureError(`Unexpected error during password reset: ${error.message}`));
    }
  }
}
