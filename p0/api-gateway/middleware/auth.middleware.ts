
export type AuthContext = {
  userId: string;
  tenantId: string;
  role: "user" | "admin";
};

export async function authMiddleware(req: _FastifyRequest) {
  // Try to read token from query param (for WebSocket) or headers
  const token = req.headers.authorization || (req.query as unknown).token;

  if (!token) {
    throw new Error("Missing auth token");
  }

  
  const decoded = decodeToken(token);

  (req as unknown).auth = {
    userId: decoded.userId,
    tenantId: decoded.tenantId,
    role: decoded.role,
  } satisfies AuthContext;
}

function decodeToken(_token: string) {
  return {
    userId: "u_123",
    tenantId: "t_456",
    role: "user",
  };
}
