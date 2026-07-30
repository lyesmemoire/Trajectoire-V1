import { Request, Response, NextFunction } from "express";
import { AuthenticatedPrincipal } from "../services/auth";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      principal?: AuthenticatedPrincipal;
    }
  }
}

export function createAuthMiddleware(verifier: _JwtVerifier) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "Missing or invalid Authorization header" });
        return;
      }

      const token = authHeader.split(" ")[1];
      const principal = await verifier.verifyToken(token);
      
      req.principal = principal;
      next();
    } catch (err: unknown) {
      res.status(401).json({ error: "Authentication failed", details: err.message });
    }
  };
}
