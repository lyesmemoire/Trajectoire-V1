/**
 * HIIOS v4 Enterprise — Middleware d'authentification
 */

import type { Context, Next } from "hono";
import { createMiddleware }   from "hono/factory";

export interface AuthUser {
  id:             string;
  organizationId: string;
  email:          string;
  name:           string;
  role:           string;
  permissions:    string[];
}

// JWT verification simplifiée (en production : utiliser jose ou jsonwebtoken)
export const requireAuth = createMiddleware(async (c: Context, next: Next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized — missing token" }, 401);
  }

  const token = authHeader.slice(7);

  try {
    // En production : vérifier la signature JWT
    const payload = decodeJWT(token);

    if (!payload || isExpired(payload)) {
      return c.json({ error: "Unauthorized — invalid or expired token" }, 401);
    }

    c.set("user", {
      id:             payload.sub,
      organizationId: payload.org,
      email:          payload.email,
      name:           payload.name,
      role:           payload.role,
      permissions:    payload.permissions ?? [],
    } as AuthUser);

    await next();

  } catch (error) {
    return c.json({ error: "Unauthorized" }, 401);
  }
});

function decodeJWT(token: _string): unknown | null {
  try {
    const parts   = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (error) {
    return null;
  }
}

function isExpired(payload: unknown): boolean {
  return payload.exp && payload.exp < Math.floor(Date.now() / 1000);
}
