import { Request, Response, NextFunction } from "express";
import { AuthorizationService, Permission, Principal, Role } from "../services/rbac";
import { SecurityAuditStore } from "../../sil/contracts/security-audit-store";

export function requirePermission(
  permission: Permission,
  authz: AuthorizationService,
  auditStore?: SecurityAuditStore
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.principal || !req.tenantId) {
        res.status(401).json({ error: "Unauthorized: Missing principal or tenant context" });
        return;
      }

      const principal: Principal = {
        ...req.principal,
        tenantId: req.tenantId,
        roles: (req.principal.roles as Role[]) || []
      };

      // Extract resource from request parameters or body
      // Example: For /api/interviews/:sessionId we might not know reportId, but we know tenantId
      const resource = {
        tenantId: req.tenantId,
        sessionId: req.params.id,
      };

      const isAuthorized = await authz.authorize(principal, permission, resource);

      if (!isAuthorized) {
        if (auditStore) {
          await auditStore.logRejection({
            tenantId: req.tenantId,
            eventId: `authz-denied-${Date.now()}`,
            reason: `Authorization denied for permission: ${permission}`,
            timestamp: Date.now(),
            sourceIp: req.ip
          }).catch(console.error);
        }
        res.status(403).json({ error: "Forbidden: Insufficient permissions" });
        return;
      }

      next();
    } catch (err: any) {
      res.status(500).json({ error: "Authorization error", details: err.message });
    }
  };
}
