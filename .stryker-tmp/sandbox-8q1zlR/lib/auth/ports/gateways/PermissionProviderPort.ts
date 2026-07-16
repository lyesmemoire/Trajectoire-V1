// @ts-nocheck
import { Result } from "@/lib/core/result";
import { UserId } from "../../domain/value-objects/user-id.vo";
import { UserRole } from "../../domain/value-objects/user-role.vo";

export interface Permission {
  resource: string;
  action: string;
}

export interface PermissionProviderPort {
  hasPermission(userId: UserId, permission: Permission): Promise<Result<boolean>>;
  hasRole(userId: UserId, role: UserRole): Promise<Result<boolean>>;
  getRoles(userId: UserId): Promise<Result<UserRole[]>>;
  grantPermission(userId: UserId, permission: Permission): Promise<Result<void>>;
  revokePermission(userId: UserId, permission: Permission): Promise<Result<void>>;
}
