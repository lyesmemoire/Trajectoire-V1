// @ts-nocheck
import { FastifyRequest } from "fastify";

export type AuthContext = {
  userId: string;
  tenantId: string;
  role: "user" | "admin";
};

export async function authMiddleware(req: FastifyRequest) {
  // Try to read token from query param (for WebSocket) or headers
  const token = req.headers.authorization || (req.query as any).token;

  if (!token) {
    throw new Error("Missing auth token");
  }

  // MOCK verify (replace with JWT provider)
  const decoded = decodeToken(token);

  (req as any).auth = {
    userId: decoded.userId,
    tenantId: decoded.tenantId,
    role: decoded.role,
  } satisfies AuthContext;
}

function decodeToken(token: string) {
  return {
    userId: "u_123",
    tenantId: "t_456",
    role: "user",
  };
}
