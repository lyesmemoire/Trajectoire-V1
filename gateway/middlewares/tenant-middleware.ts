import { Request, Response, NextFunction } from "express";
import { TenantResolver } from "../services/tenant-resolver";

declare global {
  namespace Express {
    interface Request {
      tenantId?: string;
    }
  }
}

export function createTenantMiddleware(resolver: TenantResolver) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.principal) {
        res.status(401).json({ error: "Unauthorized: Missing principal" });
        return;
      }

      const tenantId = await resolver.resolveTenantId(req.principal.tenantDid);
      req.tenantId = tenantId;
      
      next();
    } catch (err: any) {
      res.status(403).json({ error: "Tenant resolution failed", details: err.message });
    }
  };
}
