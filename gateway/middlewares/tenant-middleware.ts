import { Request, Response, NextFunction } from "express";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      tenantId?: string;
    }
  }
}

export function createTenantMiddleware(resolver: _TenantResolver) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.principal) {
        res.status(401).json({ error: "Unauthorized: Missing principal" });
        return;
      }

      const tenantId = await resolver.resolveTenantId(req.principal.tenantDid);
      req.tenantId = tenantId;
      
      next();
    } catch (err: unknown) {
      res.status(403).json({ error: "Tenant resolution failed", details: err.message });
    }
  };
}
