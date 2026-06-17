import { AuthenticatedPrincipal } from "./auth";

export type Role =
  | "tenant_admin"
  | "recruiter"
  | "interviewer"
  | "candidate"
  | "auditor";

export type Permission =
  | "session:create"
  | "session:start"
  | "session:event:write"
  | "report:read"
  | "report:delete"
  | "tenant:manage";

export interface Principal extends AuthenticatedPrincipal {
  tenantId: string;
  roles: Role[];
}

export interface ResourceRef {
  tenantId: string;
  reportId?: string;
  sessionId?: string;
}

export interface AuthorizationService {
  authorize(principal: Principal, permission: Permission, resource: ResourceRef): Promise<boolean>;
}

export class MockAuthorizationService implements AuthorizationService {
  private rolePermissions: Record<Role, Permission[]> = {
    tenant_admin: [
      "session:create", "session:start", "session:event:write",
      "report:read", "report:delete", "tenant:manage"
    ],
    recruiter: [
      "session:create", "session:start", "report:read"
    ],
    interviewer: [
      "session:start", "session:event:write", "report:read"
    ],
    candidate: [
      "session:event:write"
    ],
    auditor: [
      "report:read"
    ]
  };

  async authorize(principal: Principal, permission: Permission, resource: ResourceRef): Promise<boolean> {
    // 1. Tenant Isolation
    // Principal can only access resources belonging to their resolved tenant
    if (principal.tenantId !== resource.tenantId) {
      return false;
    }

    // 2. Role-Based Permissions
    for (const role of principal.roles) {
      const allowedPerms = this.rolePermissions[role] || [];
      if (allowedPerms.includes(permission)) {
        return true;
      }
    }

    return false; // Deny by default
  }
}
