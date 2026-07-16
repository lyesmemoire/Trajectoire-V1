// @ts-nocheck
import { Result, ok, fail } from "@/lib/core/result";
import { InfrastructureError } from "@/lib/core/result/errors";
import { PermissionProviderPort, Permission } from "../../ports/gateways/PermissionProviderPort";
import { UserId } from "../../domain/value-objects/user-id.vo";
import { UserRole } from "../../domain/value-objects/user-role.vo";
import { createAdminClientSupabase } from "@/lib/supabase/admin";

export class PermissionAdapter implements PermissionProviderPort {
  private supabase = createAdminClientSupabase();

  async hasPermission(userId: UserId, permission: Permission): Promise<Result<boolean>> {
    try {
      const { data, error } = await this.supabase
        .from("user_permissions")
        .select("*")
        .eq("user_id", userId.value)
        .eq("resource", permission.resource)
        .eq("action", permission.action)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return ok(false);
        }
        return fail(new InfrastructureError(`Failed to check permission: ${error.message}`));
      }

      return ok(data !== null);
    } catch (error: any) {
      return fail(new InfrastructureError(`Unexpected error checking permission: ${error.message}`));
    }
  }

  async hasRole(userId: UserId, role: UserRole): Promise<Result<boolean>> {
    try {
      const { data, error } = await this.supabase
        .from("users")
        .select("roles")
        .eq("id", userId.value)
        .single();

      if (error) {
        return fail(new InfrastructureError(`Failed to check role: ${error.message}`));
      }

      if (!data) {
        return ok(false);
      }

      const roles = data.roles as string[];
      return ok(roles.includes(role.value));
    } catch (error: any) {
      return fail(new InfrastructureError(`Unexpected error checking role: ${error.message}`));
    }
  }

  async getRoles(userId: UserId): Promise<Result<UserRole[]>> {
    try {
      const { data, error } = await this.supabase
        .from("users")
        .select("roles")
        .eq("id", userId.value)
        .single();

      if (error) {
        return fail(new InfrastructureError(`Failed to get roles: ${error.message}`));
      }

      if (!data) {
        return ok([]);
      }

      const roles = (data.roles as string[]).map(r => UserRole.create(r));
      return ok(roles);
    } catch (error: any) {
      return fail(new InfrastructureError(`Unexpected error getting roles: ${error.message}`));
    }
  }

  async grantPermission(userId: UserId, permission: Permission): Promise<Result<void>> {
    try {
      const { error } = await this.supabase
        .from("user_permissions")
        .insert({
          user_id: userId.value,
          resource: permission.resource,
          action: permission.action,
        });

      if (error) {
        return fail(new InfrastructureError(`Failed to grant permission: ${error.message}`));
      }

      return ok(undefined);
    } catch (error: any) {
      return fail(new InfrastructureError(`Unexpected error granting permission: ${error.message}`));
    }
  }

  async revokePermission(userId: UserId, permission: Permission): Promise<Result<void>> {
    try {
      const { error } = await this.supabase
        .from("user_permissions")
        .delete()
        .eq("user_id", userId.value)
        .eq("resource", permission.resource)
        .eq("action", permission.action);

      if (error) {
        return fail(new InfrastructureError(`Failed to revoke permission: ${error.message}`));
      }

      return ok(undefined);
    } catch (error: any) {
      return fail(new InfrastructureError(`Unexpected error revoking permission: ${error.message}`));
    }
  }
}
